import { EndringsmeldingPsbTilgangStatus } from '@k9-sak-web/backend/k9sak/kontrakt/endringsmeldingpsb/EndringsmeldingPsbTilgangStatus.js';
import { HStack, Loader } from '@navikt/ds-react';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { CheckmarkCircleFillIcon, XMarkOctagonFillIcon } from '@navikt/aksel-icons';
import { useEndringsmeldingPsbTilgangApi } from './api/EndringsmeldingPsbTilgangApiContext.js';
import { endringsmeldingPsbTilgangQueryOptions } from './api/endringsmeldingPsbTilgangQueryOptions.js';

interface Props {
  saksnummer: string;
}

// PersonCard monterer popup-innholdet før popupen åpnes og skjuler det med display: none.
// Vi venter derfor med kallet til elementet blir synlig første gang.
// Alternativet var å endre PersonCard til å ikke montere innholdet før popupen åpnes, men
// velger å holde endringen lokale her.
const useBlirSynlig = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [erSynlig, setErSynlig] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || erSynlig) {
      return undefined;
    }
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        setErSynlig(true);
      }
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [erSynlig]);

  return { ref, erSynlig };
};

const EndringsmeldingPsbTilgang = ({ saksnummer }: Props) => {
  const { ref, erSynlig } = useBlirSynlig();
  return (
    <div ref={ref}>
      <EndringsmeldingPsbTilgangInnhold saksnummer={saksnummer} enabled={erSynlig} />
    </div>
  );
};

const EndringsmeldingPsbTilgangInnhold = ({ saksnummer, enabled }: Props & { enabled: boolean }) => {
  const api = useEndringsmeldingPsbTilgangApi();
  const { data, isPending, isError } = useQuery(endringsmeldingPsbTilgangQueryOptions(api, saksnummer, enabled));

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
