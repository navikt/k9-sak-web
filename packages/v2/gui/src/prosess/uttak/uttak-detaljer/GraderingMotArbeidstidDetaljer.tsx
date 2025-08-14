import type { FC } from 'react';
import { BodyShort, Box, Detail, HelpText, HStack, Tag, VStack } from '@navikt/ds-react';
import {
  k9_kodeverk_uttak_UttakArbeidType as UttakArbeidsforholdType,
  type k9_sak_kontrakt_arbeidsforhold_ArbeidsgiverOversiktDto as ArbeidsgiverOversiktDto,
  type pleiepengerbarn_uttak_kontrakter_Utbetalingsgrader as Utbetalingsgrader,
  type pleiepengerbarn_uttak_kontrakter_UttaksperiodeInfo as UttaksperiodeInfo,
} from '@k9-sak-web/backend/k9sak/generated';
import { beregnDagerTimer } from '@k9-sak-web/gui/utils/formatters.js';

import styles from './uttakDetaljer.module.css';
import { arbeidstypeTilVisning } from '../constants/Arbeidstype';

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
      <VStack gap="8" className={`${styles.uttakDetaljerDetailItem} mt-2`}>
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
              <BodyShort as="div" size="small" className={`${styles.uttakDetaljerBeregningStrek} leading-6`}>
                <HStack gap="1" className="leading-6">
                  Faktisk arbeidstid:
                  <span className={faktiskOverstigerNormal ? styles.uttakDetaljerUtnullet : ''}>
                    {beregnetFaktiskArbeidstid}
                  </span>
                  {faktiskOverstigerNormal && <span> {beregnetNormalArbeidstid}</span>} timer
                  {faktiskOverstigerNormal && (
                    <HelpText className={styles.uttakDetaljerDataQuestionMark} placement="right">
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
        <BodyShort size="small" className={styles.uttakDetaljerDetailSum}>
          = {søkersTapteArbeidstid}% tapt arbeidstid {harNyInntekt ? '*' : ''}
        </BodyShort>
        {harNyInntekt && (
          <Detail className={styles.uttakDetaljerDetailtext}>
            * Tapt arbeidstid vurderes kun ut ifra aktiviteter på skjæringstidspunktet. Arbeidstid for nye aktiviteter
            blir ikke tatt med i utregningen av tapt arbeidstid.
          </Detail>
        )}
      </Box>
    </VStack>
  );
};

export default GraderingMotArbeidstidDetaljer;
