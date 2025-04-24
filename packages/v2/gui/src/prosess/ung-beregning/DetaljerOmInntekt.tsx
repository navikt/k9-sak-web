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
  details: { label: string; value: string }[];
  sumLabel: string;
  sumValue: string;
}) => {
  return (
    <VStack gap="3">
      <Heading size="xsmall" level="3">
        {title}
      </Heading>
      {details.map((detail, index) => (
        <HStack justify="space-between" key={index}>
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
        <div className={styles.sum}>
          <BodyShort size="small">{sumValue}</BodyShort>
        </div>
      </HStack>
    </VStack>
  );
};

export const DetaljerOmInntekt = () => {
  const location = useLocation();

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
            { label: 'Samlet arbeidsinntekt', value: formatCurrencyWithKr(9999) },
            { label: 'Ytelse', value: formatCurrencyWithKr(9999) },
          ]}
          sumLabel="Sum inntekt fra deltager"
          sumValue={formatCurrencyWithKr(9999)}
        />
        <Inntekt
          title="Inntekt rapportert i A-inntekt"
          details={[
            { label: 'Bedrift 1', value: formatCurrencyWithKr(9999) },
            { label: 'Bedrift 2', value: formatCurrencyWithKr(9999) },
            { label: 'Ytelse 123', value: formatCurrencyWithKr(9999) },
          ]}
          sumLabel="Sum inntekt fra A-inntekt"
          sumValue={formatCurrencyWithKr(9999)}
        />
      </HGrid>
    </VStack>
  );
};
