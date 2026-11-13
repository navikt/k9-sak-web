import { ExtendedApiError } from '@k9-sak-web/backend/shared/errorhandling/ExtendedApiError.js';
import { EndringsmeldingPsbTilgangStatus } from '@k9-sak-web/backend/k9sak/kontrakt/endringsmeldingpsb/EndringsmeldingPsbTilgangDto.js';
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
  const { data, isPending, isError, error } = useQuery(endringsmeldingPsbTilgangQueryOptions(api, saksnummer));

  if (isPending) {
    return <Loader size="xsmall" title="Henter tilgang til endringsmelding" />;
  }
  // 403: innsyn-api nektet tilgang til søkeren eller pleietrengende. Årsaken vises ikke.
  if (isError && ExtendedApiError.findInError(error)?.isForbidden) {
    return <>Uvisst, du har ikke tilgang til å se svaret</>;
  }
  // Feil og tomt svar (204) skal aldri vises som ja eller nei
  if (isError || data === null) {
    return <>Uvisst, kunne ikke hente svar</>;
  }
  if (data.status === EndringsmeldingPsbTilgangStatus.MANGLER_TILGANG_TIL_PERSON) {
    return <>{data.tekst}</>;
  }
  if (data.status === EndringsmeldingPsbTilgangStatus.KAN_BRUKE) {
    return (
      <HStack gap="space-4" wrap={false} align="start">
        <span>
          <CheckmarkCircleFillIcon color="var(--ax-bg-success-strong)" fontSize="1.25rem" aria-hidden="true" />
        </span>
        {data.tekst}
      </HStack>
    );
  }
  return (
    <HStack gap="space-4" wrap={false} align="start">
      <span>
        <XMarkOctagonFillIcon color="var(--ax-bg-danger-strong)" fontSize="1.25rem" aria-hidden="true" />
      </span>
      {data.tekst}
    </HStack>
  );
};

export default EndringsmeldingPsbTilgang;
