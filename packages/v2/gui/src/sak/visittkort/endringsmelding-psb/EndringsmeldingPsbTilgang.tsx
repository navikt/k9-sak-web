import { EndringsmeldingPsbTilgangStatus } from '@k9-sak-web/backend/k9sak/kontrakt/endringsmeldingpsb/EndringsmeldingPsbTilgangStatus.js';
import { HStack, Loader } from '@navikt/ds-react';
import { useQuery } from '@tanstack/react-query';
import { CheckmarkCircleFillIcon, XMarkOctagonFillIcon } from '@navikt/aksel-icons';
import { useEndringsmeldingPsbTilgangApi } from './api/EndringsmeldingPsbTilgangApiContext.js';
import { endringsmeldingPsbTilgangQueryOptions } from './api/endringsmeldingPsbTilgangQueryOptions.js';

interface Props {
  saksnummer: string;
}

const EndringsmeldingPsbTilgang = ({ saksnummer }: Props) => {
  const api = useEndringsmeldingPsbTilgangApi();
  const { data, isPending, isError } = useQuery(endringsmeldingPsbTilgangQueryOptions(api, saksnummer));

  if (isPending) {
    return <Loader size="xsmall" title="Henter tilgang til endringsmelding" />;
  }
  if (isError || !data) {
    return <>Uvisst, kunne ikke hente svar</>;
  }
  switch (data.status) {
    case EndringsmeldingPsbTilgangStatus.KAN_BRUKE:
      return (
        <HStack gap="space-4" wrap={false} align="start">
          <span>
            <CheckmarkCircleFillIcon color="var(--ax-bg-success-strong)" fontSize="1.25rem" aria-hidden="true" />
          </span>
          {data.tekst}
        </HStack>
      );
    case EndringsmeldingPsbTilgangStatus.KAN_IKKE_BRUKE:
      return (
        <HStack gap="space-4" wrap={false} align="start">
          <span>
            <XMarkOctagonFillIcon color="var(--ax-bg-danger-strong)" fontSize="1.25rem" aria-hidden="true" />
          </span>
          {data.tekst}
        </HStack>
      );
    case EndringsmeldingPsbTilgangStatus.MANGLER_TILGANG_TIL_PERSON:
      return <>{data.tekst}</>;
  }
};

export default EndringsmeldingPsbTilgang;
