import type { FC } from 'react';
import classNames from 'classnames/bind';
import { BodyShort, Box, Detail, HelpText, HStack, Tag, VStack } from '@navikt/ds-react';
import {
  UttakArbeidsforholdType,
  type ArbeidsgiverOversiktDto,
  type Utbetalingsgrader,
  type UttaksperiodeInfo,
} from '@k9-sak-web/backend/k9sak/generated';
import { beregnDagerTimer } from '@k9-sak-web/gui/utils/dateUtils.js';

import styles from './uttakDetaljer.module.css';
import { arbeidstypeTilVisning } from '../constants/Arbeidstype';

const cx = classNames.bind(styles);

interface ownProps {
  alleArbeidsforhold: ArbeidsgiverOversiktDto['arbeidsgivere'];
  utbetalingsgrader: Utbetalingsgrader[];
  søkersTapteArbeidstid: UttaksperiodeInfo['søkersTapteArbeidstid'];
}

const beregnFravær = (normalArbeidstid: number, faktiskArbeidstid: number) => {
  const fravær = Math.max(normalArbeidstid - faktiskArbeidstid, 0);
  if (fravær === 0) {
    return 0;
  }

  return ((fravær / normalArbeidstid) * 100).toFixed(2);
};

const GraderingMotArbeidstidDetaljer: FC<ownProps> = ({
  alleArbeidsforhold,
  utbetalingsgrader,
  søkersTapteArbeidstid,
}) => {
  const harNyInntekt = utbetalingsgrader.some(utbetalingsgrad => utbetalingsgrad.tilkommet);
  return (
    <VStack>
      <VStack gap="8" className={`${styles['uttakDetaljer__detailItem']} mt-2`}>
        {utbetalingsgrader.map(utbetalingsgradItem => {
          const arbeidsgiverIdentifikator =
            utbetalingsgradItem?.arbeidsforhold?.aktørId || utbetalingsgradItem?.arbeidsforhold?.organisasjonsnummer;
          const arbeidsforholdData = arbeidsgiverIdentifikator
            ? alleArbeidsforhold?.[arbeidsgiverIdentifikator]
            : undefined;
          const { normalArbeidstid, faktiskArbeidstid, arbeidsforhold } = utbetalingsgradItem;
          const beregnetNormalArbeidstid = normalArbeidstid ? beregnDagerTimer(normalArbeidstid) : '-';
          const beregnetFaktiskArbeidstid = faktiskArbeidstid ? beregnDagerTimer(faktiskArbeidstid) : '-';
          const fraværsprosent =
            beregnetNormalArbeidstid === '-' || beregnetFaktiskArbeidstid === '-'
              ? '-'
              : beregnFravær(beregnetNormalArbeidstid, beregnetFaktiskArbeidstid);

          const faktiskOverstigerNormal = beregnetNormalArbeidstid < beregnetFaktiskArbeidstid;
          const arbeidstype = arbeidsforhold?.type
            ? arbeidstypeTilVisning[arbeidsforhold?.type as UttakArbeidsforholdType]
            : undefined;
          const erNyInntekt = utbetalingsgradItem?.tilkommet;

          return (
            <Box key={`${arbeidsgiverIdentifikator}_avkorting_arbeidstid`}>
              <BodyShort size="small" className="text-text-subtle font-semibold leading-6">
                {arbeidstype}{' '}
                {erNyInntekt && (
                  <Tag size="small" variant="info">
                    Ny
                  </Tag>
                )}
              </BodyShort>
              {arbeidsforhold?.type !== UttakArbeidsforholdType.FRILANSER && (
                <BodyShort size="small" weight="semibold" className="leading-6">
                  {arbeidsforholdData?.navn || 'Mangler navn'} (
                  {arbeidsforholdData?.identifikator || arbeidsgiverIdentifikator})
                </BodyShort>
              )}
              <BodyShort size="small" className="leading-6">
                Normal arbeidstid: {beregnetNormalArbeidstid} timer
              </BodyShort>
              <BodyShort
                as="div"
                size="small"
                className={cx({ uttakDetaljer__beregningStrek: true, 'leading-6': true })}
              >
                <HStack gap="1" className="leading-6">
                  Faktisk arbeidstid:
                  <span className={cx({ uttakDetaljer__utnullet: faktiskOverstigerNormal })}>
                    {beregnetFaktiskArbeidstid}
                  </span>
                  {faktiskOverstigerNormal && <span> {beregnetNormalArbeidstid}</span>} timer
                  {faktiskOverstigerNormal && (
                    <HelpText className={styles['uttakDetaljer__data__questionMark']} placement="right">
                      Overstigende timer tas ikke hensyn til, faktisk arbeidstid settes lik normal arbeidstid
                    </HelpText>
                  )}
                </HStack>
              </BodyShort>
              <BodyShort className="mt-1 leading-6" size="small">
                = {fraværsprosent} % fravær{' '}
              </BodyShort>
            </Box>
          );
        })}
      </VStack>
      <Box>
        <BodyShort size="small" className={styles['uttakDetaljer__detailSum']}>
          = {søkersTapteArbeidstid}% tapt arbeidstid {harNyInntekt ? '*' : ''}
        </BodyShort>
        {harNyInntekt && (
          <Detail className={styles['uttakDetaljer__detailtext']}>
            * Tapt arbeidstid vurderes kun ut ifra aktiviteter på skjæringstidspunktet. Arbeidstid for nye aktiviteter
            blir ikke tatt med i utregningen av tapt arbeidstid.
          </Detail>
        )}
      </Box>
    </VStack>
  );
};

export default GraderingMotArbeidstidDetaljer;
