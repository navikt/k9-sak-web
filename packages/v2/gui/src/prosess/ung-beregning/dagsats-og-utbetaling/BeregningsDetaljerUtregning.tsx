import type { ung_sak_kontrakt_ungdomsytelse_beregning_UngdomsytelseSatsPeriodeDto as UngdomsytelseSatsPeriodeDto } from '@k9-sak-web/backend/ungsak/generated/types.js';
import { formatCurrencyWithKr } from '@k9-sak-web/gui/utils/formatters.js';
import { BodyShort, Box, HStack, VStack } from '@navikt/ds-react';
import React from 'react';
import styles from './dagsatsOgUtbetaling.module.css';

interface BeregningsDetaljerUtregningProps {
  rapportertInntekt?: number;
  reduksjon?: number;
  utbetaling?: number;
  satsperioder?: Array<UngdomsytelseSatsPeriodeDto>;
  reduksjonsgrunnlag?: number;
  gjelderDelerAvMåned?: boolean;
}

export const BeregningsDetaljerUtregning = ({
  rapportertInntekt,
  reduksjon,
  utbetaling,
  satsperioder,
  reduksjonsgrunnlag,
  gjelderDelerAvMåned,
}: BeregningsDetaljerUtregningProps) => {
  const skalViseTekstOmSisteMåned = gjelderDelerAvMåned && (reduksjonsgrunnlag ?? 0) > 0;

  return (
    <>
      <VStack gap="space-16">
        {satsperioder?.map(({ dagsats, antallDager, fom, tom, dagsatsBarnetillegg, antallBarn }) => (
          <React.Fragment key={`${fom}-${tom}`}>
            <HStack justify="space-between">
              <BodyShort size="small">
                Beregnet ytelse ({formatCurrencyWithKr(dagsats)} x {antallDager} dager)
              </BodyShort>
              <BodyShort size="small" weight="semibold">
                {formatCurrencyWithKr(dagsats * antallDager)}
              </BodyShort>
            </HStack>
            {antallBarn != undefined && antallBarn > 0 && (
              <HStack justify="space-between">
                <BodyShort size="small">
                  Barnetillegg ({formatCurrencyWithKr(dagsatsBarnetillegg)} x {antallDager} dager)
                </BodyShort>
                <BodyShort size="small" weight="semibold">
                  {formatCurrencyWithKr(dagsatsBarnetillegg * antallDager)}
                </BodyShort>
              </HStack>
            )}
          </React.Fragment>
        ))}

        <Box.New borderWidth="0 0 1 0" />

        {reduksjon && rapportertInntekt ? (
          <>
            <VStack gap="space-8">
              <HStack justify="space-between">
                <BodyShort size="small">
                  Reduksjon på grunn av inntekt (66 % av {formatCurrencyWithKr(reduksjonsgrunnlag || rapportertInntekt)}
                  )
                </BodyShort>
                <BodyShort size="small" weight="semibold">
                  - {formatCurrencyWithKr(reduksjon)}
                </BodyShort>
              </HStack>
              {skalViseTekstOmSisteMåned && (
                <BodyShort size="small">Inntekten er periodisert siden det er siste måned</BodyShort>
              )}
            </VStack>
            <Box.New borderWidth="0 0 1 0" />
          </>
        ) : null}

        {utbetaling != undefined && (
          <HStack justify="space-between" align="center">
            <BodyShort weight="semibold" size="small" className={styles.utbetalingText} as="p">
              Til utbetaling før skatt
            </BodyShort>
            <BodyShort size="small" className={styles.sum} weight="semibold">
              {formatCurrencyWithKr(utbetaling)}
            </BodyShort>
          </HStack>
        )}
      </VStack>
    </>
  );
};
