import {
  k9_kodeverk_uttak_UttakArbeidType as InntektsforholdDtoType,
  type k9_sak_kontrakt_arbeidsforhold_ArbeidsgiverOversiktDto as ArbeidsgiverOversiktDto,
  type k9_sak_kontrakt_uttak_inntektgradering_InntektgraderingPeriodeDto as InntektgraderingPeriodeDto,
} from '@k9-sak-web/backend/k9sak/generated/types.js';
import { tilNOK } from '@k9-sak-web/gui/utils/formatters.js';
import { BodyShort, Box, HStack, Loader, Tag, VStack } from '@navikt/ds-react';
import React, { type FC } from 'react';
import UttakDetaljerEkspanderbar from './UttakDetaljerEkspanderbar';

import styles from './uttakDetaljer.module.css';
import { useUttakContext } from '../context/UttakContext';

interface ownProps {
  inntektsgradering: InntektgraderingPeriodeDto;
}

const GraderingMotInntektDetaljer: FC<ownProps> = ({ inntektsgradering }) => {
  const { arbeidsgivere, lasterArbeidsgivere } = useUttakContext();

  const { graderingsProsent, reduksjonsProsent, inntektsforhold } = inntektsgradering; // graderingsProsent

  const formatNOK = (value: number | null | undefined): string => {
    if (value === null || value === undefined) {
      return '-';
    }
    return tilNOK.format(value);
  };

  const beregningsgrunnlag = formatNOK(inntektsgradering.beregningsgrunnlag);
  const løpendeInntekt = formatNOK(inntektsgradering.løpendeInntekt);
  const bortfaltInntekt = formatNOK(inntektsgradering.bortfaltInntekt);

  if (lasterArbeidsgivere) {
    return (
      <HStack justify="center">
        <Loader title="Henter data..." size="2xlarge" />
      </HStack>
    );
  }

  return (
    <VStack className={`${styles.uttakDetaljerDetailItem} mt-2`}>
      <UttakDetaljerEkspanderbar title={`Beregningsgrunnlag: ${beregningsgrunnlag}`}>
        {inntektsforhold
          // Ikke vise tilkommende inntekstforhold i beregningsgrunnlag
          .filter(inntForhold => !inntForhold.erNytt)
          .map(inntForhold => {
            const { arbeidsgiverIdentifikator } = inntForhold;
            const arbeidsforholdData =
              arbeidsgiverIdentifikator && arbeidsgivere && !Array.isArray(arbeidsgivere)
                ? arbeidsgivere[arbeidsgiverIdentifikator]
                : undefined;
            return (
              <Box.New
                key={`${arbeidsgiverIdentifikator}_avkorting_inntekt_grunnlag`}
                className={styles.uttakDetaljerBeregningFirma}
              >
                <BodyShort size="small" weight="semibold" className="leading-6">
                  {inntForhold.type !== InntektsforholdDtoType.FRILANSER
                    ? `${arbeidsforholdData?.navn || 'Mangler navn'} (${arbeidsforholdData?.identifikator || arbeidsgiverIdentifikator})`
                    : 'Frilanser'}{' '}
                  {inntForhold.erNytt && (
                    <Tag size="small" variant="info">
                      Ny
                    </Tag>
                  )}
                </BodyShort>
                <BodyShort size="small">Inntekt: {formatNOK(inntForhold.bruttoInntekt)}</BodyShort>
              </Box.New>
            );
          })}
      </UttakDetaljerEkspanderbar>
      <UttakDetaljerEkspanderbar title={`Utbetalt lønn: ${løpendeInntekt}`}>
        {inntektsforhold.map(inntForhold => {
          const { arbeidsgiverIdentifikator } = inntForhold;
          const arbeidsforholdData =
            arbeidsgiverIdentifikator && arbeidsgivere && !Array.isArray(arbeidsgivere)
              ? arbeidsgivere[arbeidsgiverIdentifikator]
              : undefined;
          return (
            <React.Fragment key={`${arbeidsgiverIdentifikator}_avkorting_inntekt_utbetalt`}>
              <Box.New className={styles.uttakDetaljerBeregningFirma}>
                <BodyShort size="small" weight="semibold">
                  {inntForhold.type !== InntektsforholdDtoType.FRILANSER
                    ? `${arbeidsforholdData?.navn || 'Mangler navn'} (${arbeidsforholdData?.identifikator || arbeidsgiverIdentifikator})`
                    : 'Frilanser'}{' '}
                  {inntForhold.erNytt && (
                    <Tag size="small" variant="info">
                      Ny
                    </Tag>
                  )}
                </BodyShort>
                <BodyShort className="leading-6" size="small">
                  Inntekt: {formatNOK(inntForhold.bruttoInntekt)}
                </BodyShort>
                <BodyShort className="leading-6" size="small">
                  Jobber: {inntForhold.arbeidstidprosent} %
                </BodyShort>
                <BodyShort className="leading-6" size="small">
                  = {formatNOK(inntForhold.løpendeInntekt)} i utbetalt lønn
                </BodyShort>
              </Box.New>
            </React.Fragment>
          );
        })}
      </UttakDetaljerEkspanderbar>
      <UttakDetaljerEkspanderbar title={`Tapt inntekt: ${bortfaltInntekt}`}>
        <Box.New className={styles.uttakDetaljerTaptInntektBeregning}>
          <BodyShort as="div" size="small">
            <span className={styles.uttakDetaljerTaptInntektAnnotasjon}></span>
            {beregningsgrunnlag} (beregningsgrunnlag)
          </BodyShort>
          <BodyShort as="div" size="small" className={styles.uttakDetaljerBeregningStrek}>
            <span className={styles.uttakDetaljerTaptInntektAnnotasjon}>-</span>
            {løpendeInntekt} (utbetalt lønn)
          </BodyShort>
          <BodyShort as="div" size="small" className={styles.uttakDetaljerBeregningSum}>
            <span className={styles.uttakDetaljerTaptInntektAnnotasjon}>=</span>
            {bortfaltInntekt} i tapt inntekt
          </BodyShort>
        </Box.New>
      </UttakDetaljerEkspanderbar>

      <VStack className={styles.uttakDetaljerNyGradering}>
        <BodyShort as="div" size="small" weight="semibold" className="leading-6">
          Ny gradering
        </BodyShort>
        <BodyShort as="div" size="small" className="leading-6">
          {løpendeInntekt} (utbetalt lønn) /
        </BodyShort>
        <BodyShort as="div" size="small" className={`${styles.uttakDetaljerBeregningStrek} leading-6`}>
          {beregningsgrunnlag} (beregningsgrunnlag)
        </BodyShort>
        <BodyShort as="div" size="small" className={`${styles.uttakDetaljerBeregningSum} leading-6`}>
          = {reduksjonsProsent} % reduksjon pga. utbetalt lønn
        </BodyShort>
      </VStack>

      <Box.New>
        <BodyShort as="div" size="small" className={`${styles.uttakDetaljerDetailSum} leading-6`}>
          = {graderingsProsent} % totalt inntektstap
        </BodyShort>
      </Box.New>
    </VStack>
  );
};

export default GraderingMotInntektDetaljer;
