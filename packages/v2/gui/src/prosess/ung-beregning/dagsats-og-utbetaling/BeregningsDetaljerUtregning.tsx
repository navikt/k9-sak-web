import type { UngdomsytelseSatsPeriodeDto } from '@k9-sak-web/backend/ungsak/generated';
import { formatCurrencyWithKr } from '@k9-sak-web/gui/utils/formatters.js';
import { BodyShort, Box, HStack, VStack } from '@navikt/ds-react';
import React from 'react';
import styles from './dagsatsOgUtbetaling.module.css';
interface BeregningsDetaljerUtregningProps {
  rapportertInntekt?: number;
  reduksjon?: number;
  utbetaling?: number;
  satsperioder?: Array<UngdomsytelseSatsPeriodeDto>;
}

export const BeregningsDetaljerUtregning = ({
  rapportertInntekt,
  reduksjon,
  utbetaling,
  satsperioder,
}: BeregningsDetaljerUtregningProps) => (
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
          <HStack justify="space-between">
            <BodyShort size="small">
              Reduksjon på grunn av inntekt (66 % av {formatCurrencyWithKr(rapportertInntekt)})
            </BodyShort>
            <BodyShort size="small" weight="semibold">
              - {formatCurrencyWithKr(reduksjon)}
            </BodyShort>
          </HStack>
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
