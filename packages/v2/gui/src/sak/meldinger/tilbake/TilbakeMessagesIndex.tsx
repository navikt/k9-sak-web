import { useSuspenseQuery } from '@tanstack/react-query';
import { TilbakeMessages, type TilbakeMessagesProps } from './TilbakeMessages.js';

// Velg dei properties frå TilbakeMessages som må sendast inn til TilbakeMessagesIndex
// behandling må vere potensielt undefined inn her pr no, bør gjerne skrive om slik at den alltid er satt frå BehandlingSupportIndex.
export type TilbakeMessagesIndexProps = Pick<TilbakeMessagesProps, 'api'> &
  Readonly<{
    behandling: TilbakeMessagesProps['behandling'] | undefined;
  }>;

// Burde ikkje vere nødvendig, men i følge gammal kode (MeldingIndex.tsx) må ein oppdatere behandling etter at melding er sendt,
// og ein har ikkje betre måte å gjere det på pr no.
const reload = () => window.location.reload();

export const TilbakeMessagesIndex = ({ behandling, api }: TilbakeMessagesIndexProps) => {
  if (behandling == null) {
    throw new Error(`behandling er null. Kan ikke vise meldingspanel`);
  }
  const { data: maler } = useSuspenseQuery({
    queryKey: ['meldinger', 'brevmaler', 'tilbake', api.backend, behandling.uuid],
    queryFn: () => api.hentMaler(behandling.uuid),
    staleTime: 20_000,
  });

  return <TilbakeMessages maler={maler} behandling={behandling} api={api} onMessageSent={reload} />;
};
