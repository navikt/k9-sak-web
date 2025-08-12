import React, { type FC } from 'react';
import { tilNOK } from '@k9-sak-web/gui/utils/formatters.js';
import { BodyShort, Box, Tag, VStack } from '@navikt/ds-react';
import {
  kodeverk_uttak_UttakArbeidType as InntektsforholdDtoType,
  type sak_kontrakt_arbeidsforhold_ArbeidsgiverOversiktDto as ArbeidsgiverOversiktDto,
  type sak_kontrakt_uttak_inntektgradering_InntektgraderingPeriodeDto as InntektgraderingPeriodeDto,
} from '@k9-sak-web/backend/k9sak/generated';
import UttakDetaljerEkspanderbar from './UttakDetaljerEkspanderbar';

import styles from './uttakDetaljer.module.css';

interface ownProps {
  alleArbeidsforhold: ArbeidsgiverOversiktDto['arbeidsgivere'];
  inntektsgradering: InntektgraderingPeriodeDto;
}

const GraderingMotInntektDetaljer: FC<ownProps> = ({ alleArbeidsforhold, inntektsgradering }) => {
  const { graderingsProsent, reduksjonsProsent, inntektsforhold } = inntektsgradering; // graderingsProsent
  const beregningsgrunnlag = inntektsgradering.beregningsgrunnlag
    ? tilNOK.format(inntektsgradering.beregningsgrunnlag)
    : '-';
  const løpendeInntekt = inntektsgradering.løpendeInntekt ? tilNOK.format(inntektsgradering.løpendeInntekt) : '-';
  const bortfaltInntekt = inntektsgradering.bortfaltInntekt ? tilNOK.format(inntektsgradering.bortfaltInntekt) : '-';

  return (
    <VStack className={`${styles.uttakDetaljerDetailItem} mt-2`}>
      <UttakDetaljerEkspanderbar title={`Beregningsgrunnlag: ${beregningsgrunnlag}`}>
        {inntektsforhold.map(inntForhold => {
          const { løpendeInntekt, bruttoInntekt, arbeidsgiverIdentifikator } = inntForhold;
          const arbeidsforholdData = arbeidsgiverIdentifikator
            ? alleArbeidsforhold?.[arbeidsgiverIdentifikator]
            : undefined;
          return (
            <Box
              key={`${arbeidsgiverIdentifikator}_avkorting_inntekt_grunnlag`}
              className={styles.uttakDetaljerBeregningFirma}
            >
              <BodyShort size="small" weight="semibold" className="leading-6">
                {arbeidsforholdData?.navn || 'Mangler navn'} (
                {arbeidsforholdData?.identifikator || arbeidsgiverIdentifikator}){' '}
                {inntForhold.erNytt && (
                  <Tag size="small" variant="info">
                    Ny
                  </Tag>
                )}
              </BodyShort>
              <BodyShort size="small">
                Inntekt: {bruttoInntekt && løpendeInntekt ? tilNOK.format(bruttoInntekt - løpendeInntekt) : '-'}
              </BodyShort>
            </Box>
          );
        })}
      </UttakDetaljerEkspanderbar>
      <UttakDetaljerEkspanderbar title={`Utbetalt lønn: ${løpendeInntekt}`}>
        {inntektsforhold.map(inntForhold => {
          const { arbeidsgiverIdentifikator } = inntForhold;
          const arbeidsforholdData = arbeidsgiverIdentifikator
            ? alleArbeidsforhold?.[arbeidsgiverIdentifikator]
            : undefined;
          return (
            <React.Fragment key={`${arbeidsgiverIdentifikator}_avkorting_inntekt_utbetalt`}>
              <Box className={styles.uttakDetaljerBeregningFirma}>
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
                  Inntekt: {inntForhold.bruttoInntekt ? tilNOK.format(inntForhold.bruttoInntekt) : '-'}
                </BodyShort>
                <BodyShort className="leading-6" size="small">
                  Jobber: {inntForhold.arbeidstidprosent} %
                </BodyShort>
                <BodyShort className="leading-6" size="small">
                  = {inntForhold.løpendeInntekt ? tilNOK.format(inntForhold.løpendeInntekt) : '-'} i utbetalt lønn
                </BodyShort>
              </Box>
            </React.Fragment>
          );
        })}
      </UttakDetaljerEkspanderbar>
      <UttakDetaljerEkspanderbar title={`Tapt inntekt: ${bortfaltInntekt}`}>
        <Box className={styles.uttakDetaljerTaptInntektBeregning}>
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
        </Box>
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

      <Box>
        <BodyShort as="div" size="small" className={`${styles.uttakDetaljerDetailSum} leading-6`}>
          = {graderingsProsent} % totalt inntektstap
        </BodyShort>
      </Box>
    </VStack>
  );
};

export default GraderingMotInntektDetaljer;
