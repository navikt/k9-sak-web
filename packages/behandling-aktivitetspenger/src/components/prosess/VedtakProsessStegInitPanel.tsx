import {
  ung_sak_kontrakt_aksjonspunkt_AksjonspunktDto,
  ung_sak_kontrakt_behandling_BehandlingDto,
} from '@k9-sak-web/backend/ungsak/generated/types.js';
import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { ProsessPanelContext } from '@k9-sak-web/gui/behandling/prosess/ProsessPanelContext.js';
import { ProsessStegIkkeVurdert } from '@k9-sak-web/gui/behandling/prosess/ProsessStegIkkeVurdert.js';
import { UngVedtakIndex } from '@k9-sak-web/gui/prosess/ung-vedtak/UngVedtakIndex.js';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import { useSuspenseQueries } from '@tanstack/react-query';
import { useContext, useMemo } from 'react';
import { UngSakApi } from '../../data/UngSakApi';
import { aksjonspunkterQueryOptions, vilkårQueryOptions } from '../../data/ungSakQueryOptions';

const vedtakAksjonspunktKoder = [
  AksjonspunktDefinisjon.FORESLÅ_VEDTAK,
  AksjonspunktDefinisjon.FATTER_VEDTAK,
  AksjonspunktDefinisjon.FORESLÅ_VEDTAK_MANUELT,
  AksjonspunktDefinisjon.VEDTAK_UTEN_TOTRINNSKONTROLL,
  AksjonspunktDefinisjon.KONTROLLER_REVURDERINGSBEHANDLING_VARSEL_VED_UGUNST,
  AksjonspunktDefinisjon.KONTROLL_AV_MANUELT_OPPRETTET_REVURDERINGSBEHANDLING,
  AksjonspunktDefinisjon.SJEKK_TILBAKEKREVING,
];

const PANEL_ID = prosessStegCodes.VEDTAK;

const vedtakPanelTekster = {
  innvilget: 'Aktivitetspenger er innvilget',
  avslått: 'Aktivitetspenger er avslått',
};

interface Props {
  api: UngSakApi;
  behandling: ung_sak_kontrakt_behandling_BehandlingDto;
  hentFritekstbrevHtmlCallback: (parameters: any) => Promise<any>;
  isReadOnly: boolean;
  submitCallback: (data: any, aksjonspunkt?: ung_sak_kontrakt_aksjonspunkt_AksjonspunktDto[]) => Promise<any>;
}

export function VedtakProsessStegInitPanel({ api, behandling, isReadOnly, submitCallback }: Props) {
  const prosessPanelContext = useContext(ProsessPanelContext);
  const [{ data: aksjonspunkter = [] }, { data: vilkår }] = useSuspenseQueries({
    queries: [aksjonspunkterQueryOptions(api, behandling), vilkårQueryOptions(api, behandling)],
  });
  const vedtakAksjonspunkter = useMemo(() => {
    return (
      aksjonspunkter?.filter(ap => ap.definisjon && vedtakAksjonspunktKoder.some(kode => kode === ap.definisjon)) || []
    );
  }, [aksjonspunkter]);

  const erValgt = prosessPanelContext?.erValgt(PANEL_ID);
  const erStegVurdert = prosessPanelContext?.erVurdert(PANEL_ID);

  if (!erValgt || !behandling) {
    return null;
  }
  if (!erStegVurdert) {
    return <ProsessStegIkkeVurdert />;
  }

  return (
    <UngVedtakIndex
      behandling={behandling}
      aksjonspunkter={vedtakAksjonspunkter}
      vilkar={vilkår}
      isReadOnly={isReadOnly}
      submitCallback={submitCallback}
      tekster={vedtakPanelTekster}
    />
  );
}
