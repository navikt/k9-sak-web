import type { PersonopplysningPleietrengendeDto } from '@k9-sak-web/backend/k9sak/kontrakt/person/PersonopplysningPleietrengendeDto.js';
import { prettifyDateString } from '@k9-sak-web/lib/dateUtils/dateUtils.js';
import { BodyShort, HStack, Tag } from '@navikt/ds-react';

interface OmBarnetInformasjonProps {
  pleietrengende: PersonopplysningPleietrengendeDto;
}

export const OmBarnetInformasjon = ({ pleietrengende }: OmBarnetInformasjonProps) => {
  const { navn, fnr, diagnosekoder, dodsdato } = pleietrengende;
  const diagnoser = diagnosekoder?.join(', ');

  return (
    <HStack gap="space-24" align="center">
      {navn && (
        <BodyShort>
          Navn: <b>{navn}</b>
        </BodyShort>
      )}
      {fnr && (
        <BodyShort>
          Fødselsnummer: <b>{fnr}</b>
        </BodyShort>
      )}
      {diagnoser && (
        <BodyShort>
          Diagnose: <b>{diagnoser}</b>
        </BodyShort>
      )}
      {dodsdato && (
        <Tag data-color="neutral" variant="strong" size="small">
          Død {prettifyDateString(dodsdato)}
        </Tag>
      )}
    </HStack>
  );
};
