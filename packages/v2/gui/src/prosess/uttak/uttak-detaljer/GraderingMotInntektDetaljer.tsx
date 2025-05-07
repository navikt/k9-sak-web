import React, { type FC } from 'react';
import classNames from 'classnames/bind';
import { tilNOK } from '@k9-sak-web/gui/utils/formatters.js';
import { BodyShort, Box, Tag, VStack } from '@navikt/ds-react';
import {
  InntektsforholdDtoType,
  type ArbeidsgiverOpplysningerDto,
  type InntektgraderingPeriodeDto,
} from '@k9-sak-web/backend/k9sak/generated';
import UttakDetaljerEkspanderbar from './UttakDetaljerEkspanderbar';

import styles from './uttakDetaljer.module.css';

const cx = classNames.bind(styles);

interface ownProps {
  alleArbeidsforhold: Record<string, ArbeidsgiverOpplysningerDto>;
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
    <VStack className={`${styles['uttakDetaljer__detailItem']} mt-2`}>
      <UttakDetaljerEkspanderbar title={`Beregningsgrunnlag: ${beregningsgrunnlag}`}>
        {inntektsforhold.map(inntForhold => {
          const { løpendeInntekt, bruttoInntekt, arbeidsgiverIdentifikator } = inntForhold;
          const arbeidsforholdData = arbeidsgiverIdentifikator
            ? alleArbeidsforhold[arbeidsgiverIdentifikator]
            : undefined;
          return (
            <Box
              key={`${arbeidsgiverIdentifikator}_avkorting_inntekt_grunnlag`}
              className={styles['uttakDetaljer__beregningFirma']}
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
            ? alleArbeidsforhold[arbeidsgiverIdentifikator]
            : undefined;
          return (
            <React.Fragment key={`${arbeidsgiverIdentifikator}_avkorting_inntekt_utbetalt`}>
              <Box className={`${styles['uttakDetaljer__beregningFirma']}`}>
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
        <Box className={styles['uttakDetaljer__taptInntektBeregning']}>
          <BodyShort as="div" size="small">
            <span className={styles['uttakDetaljer__taptInntektAnnotasjon']}></span>
            {beregningsgrunnlag} (beregningsgrunnlag)
          </BodyShort>
          <BodyShort as="div" size="small" className={styles['uttakDetaljer__beregningStrek']}>
            <span className={styles['uttakDetaljer__taptInntektAnnotasjon']}>-</span>
            {løpendeInntekt} (utbetalt lønn)
          </BodyShort>
          <BodyShort as="div" size="small" className={styles['uttakDetaljer__beregningSum']}>
            <span className={styles['uttakDetaljer__taptInntektAnnotasjon']}>=</span>
            {bortfaltInntekt} i tapt inntekt
          </BodyShort>
        </Box>
      </UttakDetaljerEkspanderbar>

      <VStack className={styles['uttakDetaljer__nyGradering']}>
        <BodyShort as="div" size="small" weight="semibold" className="leading-6">
          Ny gradering
        </BodyShort>
        <BodyShort as="div" size="small" className="leading-6">
          {løpendeInntekt} (utbetalt lønn) /
        </BodyShort>
        <BodyShort as="div" size="small" className={cx({ uttakDetaljer__beregningStrek: true, 'leading-6': true })}>
          {beregningsgrunnlag} (beregningsgrunnlag)
        </BodyShort>
        <BodyShort as="div" size="small" className={cx({ uttakDetaljer__beregningSum: true, 'leading-6': true })}>
          = {reduksjonsProsent} % reduksjon pga. utbetalt lønn
        </BodyShort>
      </VStack>

      <Box>
        <BodyShort as="div" size="small" className={cx({ uttakDetaljer__detailSum: true, 'leading-6': true })}>
          = {graderingsProsent} % totalt inntektstap
        </BodyShort>
      </Box>
    </VStack>
  );
};

export default GraderingMotInntektDetaljer;
