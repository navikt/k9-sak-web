import Messages, { type MessagesProps } from '@k9-sak-web/gui/sak/meldinger/Messages.js';
import { StickyStateReducer } from '../../utils/StickyStateReducer.js';
import { useSuspenseQuery } from '@tanstack/react-query';
import { bestemAvsenderApp } from '../../utils/formidling.js';

export type MessagesIndexProps = Pick<
  MessagesProps,
  'fagsak' | 'api' | 'arbeidsgiverOpplysningerPerId' | 'personopplysninger'
> &
  Readonly<{
    behandling: MessagesProps['behandling'] | undefined;
  }>;

// Held på state oppretta inni reducers i Messages og FritekstInput komponenter.
// Dette slik at bruker ikkje mister state når disse blir unmounta og remounta
// ved visning av anna panel midlertidig (på samme sak/behandling).
// NB: Pga denne må ein ikkje initialisere meir enn ein instans av MeldingerSakIndex komponent på samme tid,
// dette blir ein globalt delt state.
// XXX Burde kanskje løftast som context høgare oppe i hierariet istadenfor å vere
// statisk global her. Er ein liten minnelekkasje slik det er no.
const stickyState: MessagesProps['stickyState'] = {
  messages: new StickyStateReducer(),
  fritekst: {
    tittel: new StickyStateReducer(),
    tekst: new StickyStateReducer(),
  },
};

// Burde ikkje vere nødvendig, men i følge gammal kode (MeldingIndex.tsx) må ein oppdatere behandling etter at melding er sendt,
// og ein har ikkje betre måte å gjere det på pr no.
const reload = () => window.location.reload();

export const MessagesIndex = ({
  fagsak,
  behandling,
  api,
  arbeidsgiverOpplysningerPerId,
  personopplysninger,
}: MessagesIndexProps) => {
  if (behandling == null) {
    throw new Error(`behandling er null. Kan ikke vise meldingspanel`);
  }
  const { data: maler } = useSuspenseQuery({
    queryKey: [
      'meldinger',
      'brevmaler',
      api.backend,
      fagsak.saksnummer,
      fagsak.sakstype,
      behandling.uuid,
      behandling.type.kode,
    ],
    queryFn: () => api.hentMaler(fagsak.sakstype, behandling.uuid, bestemAvsenderApp(behandling.type.kode)),
    staleTime: 20_000,
  });
  return (
    <Messages
      maler={maler}
      fagsak={fagsak}
      behandling={behandling}
      personopplysninger={personopplysninger}
      arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
      api={api}
      onMessageSent={reload}
      stickyState={stickyState}
    />
  );
};
