import { TilbakeMessages, type TilbakeMessagesProps } from './TilbakeMessages.js';
import { useSuspenseQuery } from '@tanstack/react-query';
import { StickyStateReducer } from '../../../utils/StickyStateReducer.js';

// Velg dei properties frå TilbakeMessages som må sendast inn til TilbakeMessagesIndex
// behandling må vere potensielt undefined inn her pr no, bør gjerne skrive om slik at den alltid er satt frå BehandlingSupportIndex.
export type TilbakeMessagesIndexProps = Pick<TilbakeMessagesProps, 'fagsak' | 'api'> &
  Readonly<{
    behandling: TilbakeMessagesProps['behandling'] | undefined;
  }>;

// For at valgt mal og inntasta fritekst ikkje skal bli nullstilt når ein skifter til anna tab og tilbake igjen.
// Burde løyasast på anna måte (kanskje ikkje unmounte ved skifte til anna tab?)
// Pga denne globale state må ein ikkje ha meir enn ein instans av TilbakeMessagesIndex i appen samtidig.
const stickyState: TilbakeMessagesProps['stickyState'] = {
  valgtMalkode: new StickyStateReducer(),
  fritekst: {
    tittel: new StickyStateReducer(),
    tekst: new StickyStateReducer(),
  },
};

// Burde ikkje vere nødvendig, men i følge gammal kode (MeldingIndex.tsx) må ein oppdatere behandling etter at melding er sendt,
// og ein har ikkje betre måte å gjere det på pr no.
const reload = () => window.location.reload();

export const TilbakeMessagesIndex = ({ fagsak, behandling, api }: TilbakeMessagesIndexProps) => {
  if (behandling == null) {
    throw new Error(`behandling er null. Kan ikke vise meldingspanel`);
  }
  const { data: maler } = useSuspenseQuery({
    queryKey: ['meldinger', 'brevmaler', 'tilbake', api.backend, fagsak.saksnummer, behandling.uuid],
    queryFn: () => api.hentMaler(behandling.uuid),
    staleTime: 20_000,
  });

  return (
    <TilbakeMessages
      maler={maler}
      fagsak={fagsak}
      behandling={behandling}
      api={api}
      onMessageSent={reload}
      stickyState={stickyState}
    />
  );
};
