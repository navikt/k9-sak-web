import type { UttalelseDto } from '@k9-sak-web/backend/ungsak/kontrakt/vilkår/VilkårsavklaringerDto.js';
import { formatDate, timeFormat } from '@k9-sak-web/gui/utils/formatters.js';
import { PersonFillIcon } from '@navikt/aksel-icons';
import { BodyLong, BodyShort, Box, HStack, Tag, VStack } from '@navikt/ds-react';

interface Props {
  uttalelse?: UttalelseDto;
}

export const OpphørUttalelse = ({ uttalelse }: Props) => {
  if (!uttalelse?.harUttalelse) {
    return null;
  }
  return (
    <Box borderRadius="8" padding="space-16" background="info-softA">
      <VStack gap="space-20">
        <VStack gap="space-8">
          <HStack justify="space-between">
            <BodyShort size="small" weight="semibold">
              Har du en tilbakemelding?
            </BodyShort>
            <Tag variant="outline" data-color="info" size="small">
              Svar på forhåndsvarsel
            </Tag>
          </HStack>
          <BodyShort size="small">Ja</BodyShort>
        </VStack>
        <HStack gap="space-4">
          <PersonFillIcon title="Bruker" fontSize="1.5rem" />
          <VStack gap="space-6" marginBlock="space-2 space-0">
            <BodyShort size="small" weight="semibold">
              Tilbakemelding fra bruker om opphør
              {uttalelse.mottattTidspunkt &&
                ` ${formatDate(uttalelse.mottattTidspunkt)} kl. ${timeFormat(uttalelse.mottattTidspunkt)}`}
            </BodyShort>
            <BodyLong size="small">{uttalelse.uttalelseTekst}</BodyLong>
          </VStack>
        </HStack>
      </VStack>
    </Box>
  );
};
