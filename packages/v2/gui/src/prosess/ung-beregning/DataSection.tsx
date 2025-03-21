import {
  CalendarIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  InformationSquareIcon,
  SackKronerIcon,
} from '@navikt/aksel-icons';
import { Bleed, BodyShort, Box, Button, HelpText, HGrid, HStack, Label, ProgressBar, VStack } from '@navikt/ds-react';
import { useState } from 'react';
import styles from './dataSection.module.css';

const DataBox = ({ children, maxHeight }: { children: React.ReactNode; maxHeight?: string }) => (
  <div className={styles.dataBox} style={{ maxHeight }}>
    <VStack gap="4">{children}</VStack>
  </div>
);

const BeregningDetails = ({
  beregnetYtelse = 0,
  dager = 0,
  barnetillegg = 0,
  barnetilleggDager = 0,
  rapportertInntekt = 0,
  reduksjonProsent = 0,
  reduksjonBeløp = 0,
  tilUtbetaling = 0,
}) => (
  <VStack gap="4">
    <HStack justify="space-between">
      <BodyShort size="small">
        Beregnet ytelse ({beregnetYtelse} kr x {dager} dager)
      </BodyShort>
      <BodyShort size="small" weight="semibold">
        {beregnetYtelse * dager} kr
      </BodyShort>
    </HStack>
    <HStack justify="space-between">
      <BodyShort size="small">
        Barnetillegg ({barnetillegg} kr x {barnetilleggDager} dager)
      </BodyShort>
      <BodyShort size="small" weight="semibold">
        {barnetillegg * barnetilleggDager} kr
      </BodyShort>
    </HStack>
    <Box borderColor="border-subtle" borderWidth="0 0 1 0" />
    <HStack justify="space-between">
      <BodyShort size="small">Rapportert inntekt</BodyShort>
      <BodyShort size="small" weight="semibold">
        {rapportertInntekt} kr
      </BodyShort>
    </HStack>
    <HStack justify="space-between">
      <BodyShort size="small">
        Reduksjon pga inntekt ({reduksjonBeløp} kr x {reduksjonProsent} %)
      </BodyShort>
      <BodyShort size="small" weight="semibold">
        {reduksjonBeløp} kr
      </BodyShort>
    </HStack>
    <Box borderColor="border-subtle" borderWidth="0 0 1 0" />
    <HStack justify="space-between">
      <BodyShort weight="semibold" size="small" className={styles.utbetalingText} as="p">
        Til utbetaling
      </BodyShort>
      <BodyShort size="small" className={styles.utbetalingText} weight="semibold">
        {tilUtbetaling} kr
      </BodyShort>
    </HStack>
  </VStack>
);

export const DataSection = () => {
  const [isUtregningExpanded, setIsUtregningExpanded] = useState(false);
  return (
    <HGrid gap="5" columns={3}>
      <DataBox maxHeight="190px">
        <HStack gap="2" marginInline="05 0">
          <InformationSquareIcon color="#417DA0" fontSize="1.5rem" />
          <Label as="p">Nøkkelinformasjon</Label>
        </HStack>
        <HStack gap="4">
          <BodyShort size="small">
            <b>Startdato:</b> xxx
          </BodyShort>
          <BodyShort size="small">
            <b>Sluttdato:</b> xxx
          </BodyShort>
        </HStack>
      </DataBox>
      <DataBox maxHeight="190px">
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
                0 av 260
              </BodyShort>
              <BodyShort size="small">260 dager igjen</BodyShort>
            </HStack>
          </Box>
          <ProgressBar value={0} valueMax={260} size="medium" aria-labelledby="progress-bar-label-medium" />
        </div>
      </DataBox>
      <DataBox>
        <HStack gap="2" marginInline="05 0">
          <SackKronerIcon color="#417DA0" fontSize="1.5rem" />
          <Label as="p">Siste utbetaling</Label>
        </HStack>
        <BodyShort size="small">0 kr</BodyShort>
        <BodyShort size="small">
          {new Date().toLocaleDateString('nb-NO', { day: 'numeric', month: 'long' })} til kontonummer xxx
        </BodyShort>
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
              <BeregningDetails
                beregnetYtelse={0}
                dager={0}
                barnetillegg={0}
                barnetilleggDager={0}
                rapportertInntekt={0}
                reduksjonProsent={0}
                reduksjonBeløp={0}
                tilUtbetaling={0}
              />
            </Box>
          </>
        )}
      </DataBox>
    </HGrid>
  );
};
