import type { UngdomsprogramInformasjonDto, UngdomsytelseUtbetaltMånedDto } from '@k9-sak-web/backend/ungsak/generated';
import { formatCurrencyWithKr } from '@k9-sak-web/gui/utils/formatters.js';
import { formatDate } from '@k9-sak-web/lib/dateUtils/dateUtils.js';
import {
  CalendarIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  InformationSquareIcon,
  SackKronerIcon,
} from '@navikt/aksel-icons';
import { Bleed, BodyShort, Box, Button, HelpText, HGrid, HStack, Label, ProgressBar, VStack } from '@navikt/ds-react';
import { useState } from 'react';
import { BeregningsDetaljerUtregning } from './BeregningsDetaljerUtregning';
import { formatMonthYear } from './dagsatsUtils';
import styles from './dataSection.module.css';

const DataBox = ({ children, maxHeight }: { children: React.ReactNode; maxHeight?: string }) => (
  <div className={styles.dataBox} style={{ maxHeight }}>
    <VStack gap="4">{children}</VStack>
  </div>
);

interface DataSectionProps {
  ungdomsprogramInformasjon: UngdomsprogramInformasjonDto | undefined;
  sisteUtbetaling: UngdomsytelseUtbetaltMånedDto | undefined;
}

export const DataSection = ({ ungdomsprogramInformasjon, sisteUtbetaling }: DataSectionProps) => {
  const [isUtregningExpanded, setIsUtregningExpanded] = useState(false);
  const dagerIgjen =
    ungdomsprogramInformasjon?.antallDagerTidligereUtbetalt != null
      ? 260 - ungdomsprogramInformasjon?.antallDagerTidligereUtbetalt
      : null;

  return (
    <HGrid gap="5" columns={3}>
      <DataBox maxHeight="185px">
        <HStack gap="2" marginInline="05 0">
          <InformationSquareIcon color="#417DA0" fontSize="1.5rem" />
          <Label as="p">Nøkkelinformasjon</Label>
        </HStack>
        <VStack gap="4">
          <BodyShort size="small">
            <b>Startdato:</b>{' '}
            {ungdomsprogramInformasjon?.startdato ? formatDate(ungdomsprogramInformasjon?.startdato) : ''}
          </BodyShort>
          {ungdomsprogramInformasjon?.maksdatoForDeltakelse && (
            <BodyShort size="small">
              <b>Maksdato:</b> {formatDate(ungdomsprogramInformasjon?.maksdatoForDeltakelse)}
            </BodyShort>
          )}
          {ungdomsprogramInformasjon?.opphørsdato && (
            <BodyShort size="small">
              <b>Sluttdato:</b> {formatDate(ungdomsprogramInformasjon?.opphørsdato)}
            </BodyShort>
          )}
        </VStack>
      </DataBox>
      <DataBox maxHeight="185px">
        <HStack gap="2" marginInline="05 0">
          <CalendarIcon color="#417DA0" fontSize="1.5rem" />
          <Label as="p">Dager i ungdomsprogram</Label>
        </HStack>
        <HStack gap="2" align="center">
          <BodyShort size="small">Dager utbetalt</BodyShort>
          <HelpText title="Forklaringstekst">Forklaring om dager utbetalt her</HelpText>
        </HStack>
        <div>
          <Box marginBlock="0 2">
            <HStack justify="space-between">
              <BodyShort size="small" id="progress-bar-label-medium">
                {ungdomsprogramInformasjon?.antallDagerTidligereUtbetalt ?? 0} av 260
              </BodyShort>
              {dagerIgjen != null && <BodyShort size="small">{dagerIgjen} dager igjen</BodyShort>}
            </HStack>
          </Box>
          <ProgressBar
            value={ungdomsprogramInformasjon?.antallDagerTidligereUtbetalt ?? 0}
            valueMax={260}
            size="medium"
            aria-labelledby="progress-bar-label-medium"
          />
        </div>
      </DataBox>
      <DataBox>
        {sisteUtbetaling && (
          <>
            <HStack gap="2" marginInline="05 0">
              <SackKronerIcon color="#417DA0" fontSize="1.5rem" />
              <Label as="p">Siste utbetaling</Label>
            </HStack>
            <BodyShort size="small">
              {sisteUtbetaling.utbetaling != undefined && formatCurrencyWithKr(sisteUtbetaling.utbetaling)}
            </BodyShort>
            {/* @ts-expect-error Typen til måned er definert feil i backend */}
            <BodyShort size="small">{formatMonthYear(sisteUtbetaling.måned)} til kontonummer xxx</BodyShort>
            <Bleed marginInline="4" asChild>
              <Box borderColor="border-subtle" borderWidth="0 0 1 0" />
            </Bleed>
            <Bleed marginInline="3" marginBlock="2 1" asChild>
              <Button
                size="small"
                variant="tertiary"
                icon={isUtregningExpanded ? <ChevronUpIcon fontSize="1.5rem" /> : <ChevronDownIcon fontSize="1.5rem" />}
                iconPosition="right"
                onClick={() => setIsUtregningExpanded(!isUtregningExpanded)}
                className={styles.expandButton}
              >
                {isUtregningExpanded ? 'Skjul utregning' : 'Vis utregning'}
              </Button>
            </Bleed>
            {isUtregningExpanded && (
              <>
                <Bleed marginBlock="2 0" asChild>
                  <Box borderColor="border-subtle" borderWidth="0 0 1 0" />
                </Bleed>
                <Box>
                  <BeregningsDetaljerUtregning
                    utbetaling={sisteUtbetaling.utbetaling}
                    rapportertInntekt={sisteUtbetaling.rapportertInntekt}
                    reduksjon={sisteUtbetaling.reduksjon}
                    satsperioder={sisteUtbetaling.satsperioder}
                  />
                </Box>
              </>
            )}
          </>
        )}
      </DataBox>
    </HGrid>
  );
};
