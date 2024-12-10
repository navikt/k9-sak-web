import { FC } from 'react';
import { BodyShort, Box, Detail, HelpText, HStack, Tag, VStack } from '@navikt/ds-react';
import { beregnDagerTimer } from '../../../util/dateUtils';
import { Arbeidstype, arbeidstypeTilVisning } from '../../../constants';
import { Utbetalingsgrad } from '../../../types';
import classNames from 'classnames/bind';

import styles from './nyUttakDetaljer.module.css';

const cx = classNames.bind(styles);

interface ownProps {
  alleArbeidsforhold;
  utbetalingsgrader: Utbetalingsgrad[];
  søkersTapteArbeidstid: number;
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
      <VStack gap="8" className={`${styles.uttakDetaljer__detailItem} mt-2`}>
        {utbetalingsgrader.map(utbetalingsgradItem => {
          const arbeidsgiverIdentifikator =
            utbetalingsgradItem.arbeidsforhold.aktørId ||
            utbetalingsgradItem.arbeidsforhold.orgnr ||
            utbetalingsgradItem.arbeidsforhold.organisasjonsnummer;
          const arbeidsforholdData = alleArbeidsforhold[arbeidsgiverIdentifikator];
          const { normalArbeidstid, faktiskArbeidstid, arbeidsforhold } = utbetalingsgradItem;
          const beregnetNormalArbeidstid = beregnDagerTimer(normalArbeidstid);
          const beregnetFaktiskArbeidstid = beregnDagerTimer(faktiskArbeidstid);
          const fraværsprosent = beregnFravær(beregnetNormalArbeidstid, beregnetFaktiskArbeidstid);
          const faktiskOverstigerNormal = beregnetNormalArbeidstid < beregnetFaktiskArbeidstid;
          const arbeidstype = arbeidstypeTilVisning[arbeidsforhold?.type];
          const erNyInntekt = utbetalingsgradItem?.tilkommet;

          return (
            <Box key={`${arbeidsgiverIdentifikator}_avkorting_arbeidstid`}>
              <BodyShort size="small">
                {arbeidstype}{' '}
                {erNyInntekt && (
                  <Tag size="small" variant="info">
                    Ny
                  </Tag>
                )}
              </BodyShort>
              {arbeidsforhold.type !== Arbeidstype.FRILANSER && (
                <BodyShort size="small" weight="semibold">
                  {arbeidsforholdData?.navn || 'Mangler navn'} (
                  {arbeidsforholdData?.identifikator || arbeidsgiverIdentifikator})
                </BodyShort>
              )}
              <BodyShort size="small">Normal arbeidstid: {beregnetNormalArbeidstid} timer</BodyShort>
              <BodyShort as="div" size="small" className={cx({ uttakDetaljer__beregningStrek: true })}>
                <HStack gap="1">
                  Faktisk arbeidstid:
                  <span className={cx({ uttakDetaljer__utnullet: faktiskOverstigerNormal })}>
                    {beregnetFaktiskArbeidstid}
                  </span>
                  {faktiskOverstigerNormal && <span> {beregnetNormalArbeidstid}</span>} timer
                  {faktiskOverstigerNormal && (
                    <HelpText className={styles.uttakDetaljer__data__questionMark} placement="right">
                      Overstigende timer tas ikke hensyn til, faktisk arbeidstid settes lik normal arbeidstid
                    </HelpText>
                  )}
                </HStack>
              </BodyShort>
              <BodyShort className="mt-1" size="small">
                = {fraværsprosent} % fravær{' '}
              </BodyShort>
            </Box>
          );
        })}
      </VStack>
      <Box>
        <BodyShort size="small" className={styles.uttakDetaljer__detailSum}>
          = {søkersTapteArbeidstid}% tapt arbeidstid {harNyInntekt ? '*' : ''}
        </BodyShort>
        {harNyInntekt && (
          <Detail className={styles.uttakDetaljer__detailtext}>
            * Tapt arbeidstid vurderes kun ut ifra aktiviteter på skjæringstidspunktet. Arbeidstid for nye aktiviteter
            blir ikke tatt med i utregningen av tapt arbeidstid.
          </Detail>
        )}
      </Box>
    </VStack>
  );
};

export default GraderingMotArbeidstidDetaljer;
