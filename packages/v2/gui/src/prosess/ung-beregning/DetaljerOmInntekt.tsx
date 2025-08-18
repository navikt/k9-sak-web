import type {
  ung_sak_kontrakt_kontroll_KontrollerInntektPeriodeDto as KontrollerInntektPeriodeDto,
  ung_sak_kontrakt_kontroll_RapportertInntektDto as RapportertInntektDto,
} from '@k9-sak-web/backend/ungsak/generated';
import { useKodeverkContext } from '@k9-sak-web/gui/kodeverk/index.js';
import { KodeverkType } from '@k9-sak-web/lib/kodeverk/types.js';
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
    <VStack gap="space-12">
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
      <Box.New borderWidth="0 0 1 0" />
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
  const { kodeverkNavnFraKode } = useKodeverkContext();
  const location = useLocation();
  const { rapporterteInntekter } = inntektKontrollPeriode || {};
  return (
    <VStack gap="space-32">
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
      <HGrid gap="space-36" columns={2}>
        <Inntekt
          title="Inntekt rapportert av deltaker"
          details={[
            {
              label: 'Samlet arbeidsinntekt',
              value: formaterInntekt(rapporterteInntekter?.bruker?.arbeidsinntekt),
            },
          ]}
          sumLabel="Sum inntekt fra deltaker"
          sumValue={formaterInntekt(rapporterteInntekter?.bruker?.arbeidsinntekt)}
        />
        <Inntekt
          title="Inntekt rapportert i A-ordningen"
          details={rapporterteInntekter?.register?.inntekter?.map(inntekt => ({
            label: inntekt.ytelseType
              ? kodeverkNavnFraKode(inntekt.ytelseType, KodeverkType.FAGSAK_YTELSE)
              : inntekt.arbeidsgiverIdentifikator,
            value: formaterInntekt(inntekt.inntekt),
          }))}
          sumLabel="Sum inntekt fra A-ordningen"
          sumValue={summerInntekt(rapporterteInntekter?.register?.oppsummertRegister ?? {})}
        />
      </HGrid>
    </VStack>
  );
};
