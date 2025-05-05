import type { KontrollerInntektPeriodeDto, RapportertInntektDto } from '@k9-sak-web/backend/ungsak/generated';
import { getPathToAinntekt } from '@k9-sak-web/lib/paths/paths.js';
import { ExternalLinkIcon } from '@navikt/aksel-icons';
import { Bleed, BodyShort, Box, Button, Heading, HGrid, HStack, VStack } from '@navikt/ds-react';
import { useLocation } from 'react-router';
import { formatCurrencyWithKr } from '../../utils/formatters';
import styles from './detaljerOmInntekt.module.css';

const Inntekt = ({
  title,
  details,
  sumLabel,
  sumValue,
}: {
  title: string;
  details?: { label?: string; value?: string }[];
  sumLabel: string;
  sumValue?: string;
}) => {
  return (
    <VStack gap="3">
      <Heading size="xsmall" level="3">
        {title}
      </Heading>
      {details?.map(detail => (
        <HStack justify="space-between" key={detail.label}>
          <BodyShort size="small">{detail.label}</BodyShort>
          <BodyShort size="small" weight="semibold">
            {detail.value}
          </BodyShort>
        </HStack>
      ))}
      <Box borderColor="border-default" borderWidth="0 0 1 0" />
      <HStack justify="space-between" align="center">
        <BodyShort size="small" className={styles.sumLabel} weight="semibold">
          {sumLabel}
        </BodyShort>
        {sumValue != undefined && (
          <BodyShort className={styles.sum} size="small">
            {sumValue}
          </BodyShort>
        )}
      </HStack>
    </VStack>
  );
};

const summerInntekt = (inntekt: RapportertInntektDto) => {
  if (inntekt?.arbeidsinntekt === undefined && inntekt?.ytelse === undefined) {
    return undefined;
  }
  const arbeidsinntekt = inntekt?.arbeidsinntekt ?? 0;
  const ytelse = inntekt?.ytelse ?? 0;
  return formatCurrencyWithKr(arbeidsinntekt + ytelse);
};

const formaterInntekt = (inntekt: number | undefined) => {
  if (inntekt === undefined) {
    return '-';
  }
  return formatCurrencyWithKr(inntekt);
};

interface DetaljerOmInntektProps {
  inntektKontrollPeriode: KontrollerInntektPeriodeDto | undefined;
}

export const DetaljerOmInntekt = ({ inntektKontrollPeriode }: DetaljerOmInntektProps) => {
  const location = useLocation();
  const { rapporterteInntekter } = inntektKontrollPeriode || {};
  return (
    <VStack gap="8">
      <Bleed marginBlock="0 2" asChild>
        <HStack justify="space-between" align="baseline">
          <Heading size="small" level="2">
            Detaljer om rapportert inntekt
          </Heading>
          <Button
            as="a"
            variant="secondary"
            size="small"
            icon={<ExternalLinkIcon fontSize="1.5rem" />}
            iconPosition="right"
            href={getPathToAinntekt(location.pathname)}
            target="_blank"
          >
            Åpne A-inntekt
          </Button>
        </HStack>
      </Bleed>
      <HGrid gap="9" columns={2}>
        <Inntekt
          title="Inntekt rapport av deltager"
          details={[
            {
              label: 'Samlet arbeidsinntekt',
              value: formaterInntekt(rapporterteInntekter?.bruker?.arbeidsinntekt),
            },
            {
              label: 'Ytelse',
              value: formaterInntekt(rapporterteInntekter?.bruker?.ytelse),
            },
          ]}
          sumLabel="Sum inntekt fra deltager"
          sumValue={summerInntekt(rapporterteInntekter?.bruker ?? {})}
        />
        <Inntekt
          title="Inntekt rapportert i A-inntekt"
          details={rapporterteInntekter?.register?.inntekter?.map(inntekt => ({
            label: inntekt.arbeidsgiverIdentifikator,
            value: formaterInntekt(inntekt.inntekt),
          }))}
          sumLabel="Sum inntekt fra A-inntekt"
          sumValue={summerInntekt(rapporterteInntekter?.register?.oppsummertRegister ?? {})}
        />
      </HGrid>
    </VStack>
  );
};
