import { Fragment, type FC } from 'react';
import { BodyShort, Box, Tag, VStack } from '@navikt/ds-react';
import type { InntektgraderingPeriodeDto } from '@k9-sak-web/backend/k9sak/kontrakt/uttak/InntektgraderingPeriodeDto.js';
import { tilNOK } from '@k9-sak-web/gui/utils/formatters.js';
import UttakDetaljerEkspanderbar from './UttakDetaljerEkspanderbar';
import { useUttakContext } from '../context/UttakContext';
import { utledAktivitetVisningsnavn, utledArbeidsgiverNavn, utledArbeidstypeVisningsnavn } from '../utils/aktivitetVisning';
import styles from './uttakDetaljer.module.css';

interface ownProps {
  inntektsgradering: InntektgraderingPeriodeDto;
}

const GraderingMotInntektDetaljer: FC<ownProps> = ({ inntektsgradering }) => {
  const { arbeidsgivere } = useUttakContext();

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

  const renderAktivitetHeader = (
    type: string | null | undefined,
    arbeidsgiverIdentifikator: string | null | undefined,
    erNytt: boolean,
  ) => {
    const aktivitetVisningsnavn = utledAktivitetVisningsnavn(type, arbeidsgiverIdentifikator, arbeidsgivere);
    const arbeidsgiverNavn = utledArbeidsgiverNavn(arbeidsgiverIdentifikator, arbeidsgivere);
    const arbeidstype = utledArbeidstypeVisningsnavn(type);
    const visArbeidstypeOverArbeidsgiver = !!arbeidsgiverNavn && !!arbeidstype && type !== 'AT';

    if (visArbeidstypeOverArbeidsgiver) {
      return (
        <>
          <BodyShort size="small" className="text-ax-text-neutral-subtle font-semibold leading-6">
            {arbeidstype}{' '}
            {erNytt && (
              <Tag data-color="info" size="small" variant="outline">
                Ny
              </Tag>
            )}
          </BodyShort>
          <BodyShort size="small" weight="semibold" className="leading-6">
            {arbeidsgiverNavn}
          </BodyShort>
        </>
      );
    }

    return (
      <BodyShort size="small" weight="semibold" className="leading-6">
        {aktivitetVisningsnavn}{' '}
        {erNytt && (
          <Tag data-color="info" size="small" variant="outline">
            Ny
          </Tag>
        )}
      </BodyShort>
    );
  };

  return (
    <VStack className={`${styles.uttakDetaljerDetailItem} mt-2`}>
      <UttakDetaljerEkspanderbar title={`Beregningsgrunnlag: ${beregningsgrunnlag}`}>
        {inntektsforhold
          // Ikke vise tilkommende inntekstforhold i beregningsgrunnlag
          .filter(inntForhold => !inntForhold.erNytt)
          .map(inntForhold => {
            const { arbeidsgiverIdentifikator, type } = inntForhold;
            return (
              <Box
                key={`${type ?? 'ukjent'}_${arbeidsgiverIdentifikator ?? 'uten-id'}_avkorting_inntekt_grunnlag`}
                className={styles.uttakDetaljerBeregningFirma}
              >
                {renderAktivitetHeader(type, arbeidsgiverIdentifikator, inntForhold.erNytt)}
                <BodyShort size="small">Inntekt: {formatNOK(inntForhold.bruttoInntekt)}</BodyShort>
              </Box>
            );
          })}
      </UttakDetaljerEkspanderbar>
      <UttakDetaljerEkspanderbar title={`Utbetalt lønn: ${løpendeInntekt}`}>
        {inntektsforhold.map(inntForhold => {
          const { arbeidsgiverIdentifikator, type } = inntForhold;
          return (
            <Fragment key={`${type ?? 'ukjent'}_${arbeidsgiverIdentifikator ?? 'uten-id'}_avkorting_inntekt_utbetalt`}>
              <Box className={styles.uttakDetaljerBeregningFirma}>
                {renderAktivitetHeader(type, arbeidsgiverIdentifikator, inntForhold.erNytt)}
                <BodyShort className="leading-6" size="small">
                  Inntekt: {formatNOK(inntForhold.bruttoInntekt)}
                </BodyShort>
                <BodyShort className="leading-6" size="small">
                  Jobber: {inntForhold.arbeidstidprosent} %
                </BodyShort>
                <BodyShort className="leading-6" size="small">
                  = {formatNOK(inntForhold.løpendeInntekt)} i utbetalt lønn
                </BodyShort>
              </Box>
            </Fragment>
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
