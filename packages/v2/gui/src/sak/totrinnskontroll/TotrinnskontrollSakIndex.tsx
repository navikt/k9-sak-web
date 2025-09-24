import { type k9_klage_kontrakt_klage_KlagebehandlingDto as KlagebehandlingDto } from '@k9-sak-web/backend/k9klage/generated/types.js';
import { BehandlingType } from '@k9-sak-web/backend/combined/kodeverk/behandling/BehandlingType.js';
import {
  k9_kodeverk_behandling_aksjonspunkt_VurderÅrsak as Årsak,
  k9_kodeverk_behandling_aksjonspunkt_AksjonspunktDefinisjon as AksjonspunktDefinisjon,
  k9_kodeverk_behandling_BehandlingStatus as BehandlingStatus,
} from '@k9-sak-web/backend/k9sak/generated/types.js';
import { useCallback } from 'react';
import { foreldrepenger_tilbakekreving_behandlingslager_behandling_aksjonspunkt_AksjonspunktDefinisjon as aksjonspunktCodesTilbakekreving } from '@k9-sak-web/backend/k9tilbake/generated/types.js';
import { type AksjonspunktGodkjenningData } from './components/AksjonspunktGodkjenningFieldArray.js';
import { type FormState } from './components/FormState.js';
import { TotrinnskontrollBeslutterForm } from './components/TotrinnskontrollBeslutterForm.js';
import TotrinnskontrollSaksbehandlerPanel from './components/TotrinnskontrollSaksbehandlerPanel.js';
import { type TotrinnskontrollBehandling } from './types/TotrinnskontrollBehandling.js';
import type { TotrinnskontrollData } from '../../behandling/support/totrinnskontroll/TotrinnskontrollApi.js';

const getArsaker = (apData: AksjonspunktGodkjenningData): string[] => {
  const arsaker: string[] = [];
  if (apData.feilFakta) {
    arsaker.push(Årsak.FEIL_FAKTA);
  }
  if (apData.feilLov) {
    arsaker.push(Årsak.FEIL_LOV);
  }
  if (apData.feilRegel) {
    arsaker.push(Årsak.FEIL_REGEL);
  }
  if (apData.annet) {
    arsaker.push(Årsak.ANNET);
  }
  return arsaker;
};

interface TotrinnskontrollSakIndexProps {
  behandling: TotrinnskontrollBehandling;
  totrinnskontrollData: TotrinnskontrollData;
  behandlingKlageVurdering?: KlagebehandlingDto;
  readOnly: boolean;
  onSubmit: (...args: any[]) => any;
  toTrinnFormState?: FormState;
  setToTrinnFormState?: React.Dispatch<FormState>;
}

const TotrinnskontrollSakIndex = ({
  behandling,
  totrinnskontrollData,
  readOnly,
  onSubmit,
  behandlingKlageVurdering,
  toTrinnFormState,
  setToTrinnFormState,
}: TotrinnskontrollSakIndexProps) => {
  const erTilbakekreving =
    BehandlingType.TILBAKEKREVING === behandling.type || BehandlingType.REVURDERING_TILBAKEKREVING === behandling.type;

  const submitHandler = useCallback(
    (values: FormState) => {
      const aksjonspunktGodkjenningDtos = values.aksjonspunktGodkjenning.map(apData => ({
        aksjonspunktKode: apData.aksjonspunktKode,
        godkjent: apData.totrinnskontrollGodkjent,
        begrunnelse: apData.totrinnskontrollGodkjent === false ? apData.besluttersBegrunnelse : undefined,
        arsaker: apData.totrinnskontrollGodkjent === false ? getArsaker(apData) : [],
      }));

      const fatterVedtakAksjonspunktDto = {
        '@type': erTilbakekreving ? aksjonspunktCodesTilbakekreving.FATTE_VEDTAK : AksjonspunktDefinisjon.FATTER_VEDTAK,
        begrunnelse: null,
        aksjonspunktGodkjenningDtos,
      };

      return onSubmit({
        fatterVedtakAksjonspunktDto,
        erAlleAksjonspunktGodkjent: values.aksjonspunktGodkjenning.every(
          ap => ap.totrinnskontrollGodkjent && ap.totrinnskontrollGodkjent === true,
        ),
      });
    },
    [erTilbakekreving, onSubmit],
  );

  const erStatusFatterVedtak = behandling.status === BehandlingStatus.FATTER_VEDTAK;

  return (
    <>
      {erStatusFatterVedtak && (
        <TotrinnskontrollBeslutterForm
          behandling={behandling}
          totrinnskontrollData={totrinnskontrollData}
          readOnly={readOnly}
          handleSubmit={submitHandler}
          behandlingKlageVurdering={behandlingKlageVurdering}
          toTrinnFormState={toTrinnFormState}
          setToTrinnFormState={setToTrinnFormState}
        />
      )}
      {!erStatusFatterVedtak && (
        <TotrinnskontrollSaksbehandlerPanel
          totrinnskontrollData={totrinnskontrollData}
          behandlingKlageVurdering={behandlingKlageVurdering}
          behandlingStatus={behandling.status}
        />
      )}
    </>
  );
};

export default TotrinnskontrollSakIndex;
