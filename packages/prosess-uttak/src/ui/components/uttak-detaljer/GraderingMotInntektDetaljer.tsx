import React, { FC } from 'react';
import { tilNOK } from '@k9-sak-web/gui/utils/formatters.js';
import { BodyShort, Box, Tag, VStack } from '@navikt/ds-react';
import UttakDetaljerEkspanderbar from './UttakDetaljerEkspanderbar';
import { ArbeidsgiverOpplysninger, Inntektsgradering } from '../../../types';

import styles from './nyUttakDetaljer.module.css';
import { Arbeidstype } from '../../../constants';

interface ownProps {
  alleArbeidsforhold: Record<string, ArbeidsgiverOpplysninger>;
  inntektsgradering: Inntektsgradering;
}

const GraderingMotInntektDetaljer: FC<ownProps> = ({ alleArbeidsforhold, inntektsgradering }) => {
  const { graderingsProsent, reduksjonsProsent, inntektsforhold } = inntektsgradering; // graderingsProsent
  const beregningsgrunnlag = tilNOK.format(inntektsgradering.beregningsgrunnlag);
  const løpendeInntekt = tilNOK.format(inntektsgradering.løpendeInntekt);
  const bortfaltInntekt = tilNOK.format(inntektsgradering.bortfaltInntekt);

  return (
    <VStack>
      <UttakDetaljerEkspanderbar title={`Beregningsgrunnlag: ${beregningsgrunnlag}`}>
        {inntektsforhold.map(inntForhold => {
          const { løpendeInntekt, bruttoInntekt, arbeidsgiverIdentifikator } = inntForhold;
          const arbeidsforholdData = alleArbeidsforhold[arbeidsgiverIdentifikator];
          return (
            <Box
              key={`${arbeidsgiverIdentifikator}_avkorting_inntekt_grunnlag`}
              className={styles.uttakDetaljer__beregningFirma}
            >
              <BodyShort size="small" weight="semibold">
                {arbeidsforholdData?.navn || 'Mangler navn'} (
                {arbeidsforholdData?.identifikator || arbeidsgiverIdentifikator}){' '}
                {inntForhold.erNytt && (
                  <Tag size="small" variant="info">
                    Ny
                  </Tag>
                )}
              </BodyShort>
              <BodyShort size="small">Inntekt: {tilNOK.format(bruttoInntekt - løpendeInntekt)}</BodyShort>
            </Box>
          );
        })}
      </UttakDetaljerEkspanderbar>
      <UttakDetaljerEkspanderbar title={`Utbetalt lønn: ${løpendeInntekt}`}>
        {inntektsforhold.map(inntForhold => {
          const { arbeidsgiverIdentifikator } = inntForhold;
          const arbeidsforholdData = alleArbeidsforhold[arbeidsgiverIdentifikator];
          return (
            <React.Fragment key={`${arbeidsgiverIdentifikator}_avkorting_inntekt_utbetalt`}>
              <Box className={`${styles.uttakDetaljer__beregningFirma} p-1`}>
                <BodyShort size="small" weight="semibold">
                  {inntForhold.type !== Arbeidstype.FRILANSER
                    ? `${arbeidsforholdData?.navn || 'Mangler navn'} (${arbeidsforholdData?.identifikator || arbeidsgiverIdentifikator})`
                    : 'Frilanser'}{' '}
                  {inntForhold.erNytt && (
                    <Tag size="small" variant="info">
                      Ny
                    </Tag>
                  )}
                </BodyShort>
                <BodyShort size="small">Inntekt: {tilNOK.format(inntForhold.bruttoInntekt)}</BodyShort>
                <BodyShort size="small">Jobber: {inntForhold.arbeidstidprosent} %</BodyShort>
                <BodyShort size="small">= {tilNOK.format(inntForhold.løpendeInntekt)} i utbetalt lønn</BodyShort>
              </Box>
            </React.Fragment>
          );
        })}
      </UttakDetaljerEkspanderbar>
      <UttakDetaljerEkspanderbar title={`Tapt inntekt: ${bortfaltInntekt}`}>
        <Box className={styles.uttakDetaljer__taptInntektBeregning}>
          <BodyShort as="div" size="small">
            <span className={styles.uttakDetaljer__taptInntektAnnotasjon}></span>
            {beregningsgrunnlag} (beregningsgrunnlag)
          </BodyShort>
          <BodyShort as="div" size="small" className={styles.uttakDetaljer__beregningStrek}>
            <span className={styles.uttakDetaljer__taptInntektAnnotasjon}>-</span>
            {løpendeInntekt} (utbetalt lønn)
          </BodyShort>
          <BodyShort as="div" size="small" className={styles.uttakDetaljer__beregningSum}>
            <span className={styles.uttakDetaljer__taptInntektAnnotasjon}>=</span>
            {bortfaltInntekt} i tapt inntekt
          </BodyShort>
        </Box>
      </UttakDetaljerEkspanderbar>

      <VStack className={styles.uttakDetaljer__nyGradering}>
        <BodyShort as="div" size="small" weight="semibold">
          Ny gradering
        </BodyShort>
        <BodyShort as="div" size="small">
          {løpendeInntekt} (utbetalt lønn) /
        </BodyShort>
        <BodyShort as="div" size="small" className={styles.uttakDetaljer__beregningStrek}>
          {beregningsgrunnlag} (beregningsgrunnlag)
        </BodyShort>
        <BodyShort as="div" size="small" className={styles.uttakDetaljer__beregningSum}>
          = {reduksjonsProsent} % reduksjon pga. utbetalt lønn
        </BodyShort>
      </VStack>

      <Box>
        <BodyShort as="div" className={styles.uttakDetaljer__detailSum} size="small">
          = {graderingsProsent} % totalt inntektstap
        </BodyShort>
      </Box>
    </VStack>
  );
};

export default GraderingMotInntektDetaljer;
