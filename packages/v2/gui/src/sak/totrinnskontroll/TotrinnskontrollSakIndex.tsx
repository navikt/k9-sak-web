import { BehandlingDtoType, type KlagebehandlingDto } from '@k9-sak-web/backend/k9klage/generated/types.js';
import { behandlingType } from '@k9-sak-web/backend/k9klage/kodeverk/behandling/BehandlingType.js';
import { useKodeverkContext } from '@k9-sak-web/gui/kodeverk/index.js';
import skjermlenkeCodes from '@k9-sak-web/gui/shared/constants/skjermlenkeCodes.js';
import { konverterKodeverkTilKode } from '@k9-sak-web/lib/kodeverk/konverterKodeverkTilKode.js';
import { type KodeverkObject, KodeverkType, type KodeverkV2 } from '@k9-sak-web/lib/kodeverk/types.js';
import {
  AksjonspunktDtoDefinisjon,
  AksjonspunktDtoVurderPaNyttArsaker,
  BehandlingAksjonspunktDtoBehandlingStatus,
} from '@navikt/k9-sak-typescript-client';
import { type Location } from 'history';
import { useCallback, useMemo } from 'react';
import aksjonspunktCodesTilbakekreving from './aksjonspunktCodesTilbakekreving';
import { type AksjonspunktGodkjenningData } from './components/AksjonspunktGodkjenningFieldArray';
import { type FormState } from './components/FormState';
import TotrinnskontrollBeslutterForm from './components/TotrinnskontrollBeslutterForm';
import TotrinnskontrollSaksbehandlerPanel from './components/TotrinnskontrollSaksbehandlerPanel';
import { type Behandling } from './types/Behandling';
import { type TotrinnskontrollSkjermlenkeContext } from './types/TotrinnskontrollSkjermlenkeContext';

const sorterteSkjermlenkeCodesForTilbakekreving = [
  skjermlenkeCodes.FAKTA_OM_FEILUTBETALING,
  skjermlenkeCodes.FORELDELSE,
  skjermlenkeCodes.TILBAKEKREVING,
  skjermlenkeCodes.VEDTAK,
];

const getArsaker = (apData: AksjonspunktGodkjenningData): string[] => {
  const arsaker: string[] = [];
  if (apData.feilFakta) {
    arsaker.push(AksjonspunktDtoVurderPaNyttArsaker.FEIL_FAKTA);
  }
  if (apData.feilLov) {
    arsaker.push(AksjonspunktDtoVurderPaNyttArsaker.FEIL_LOV);
  }
  if (apData.feilRegel) {
    arsaker.push(AksjonspunktDtoVurderPaNyttArsaker.FEIL_REGEL);
  }
  if (apData.annet) {
    arsaker.push(AksjonspunktDtoVurderPaNyttArsaker.ANNET);
  }
  return arsaker;
};

const getBehandlingTypeForKodeverk = (behandling: Behandling, erTilbakekreving: boolean) => {
  if (erTilbakekreving) {
    return 'kodeverkTilbake';
  }
  if (behandling.type === BehandlingDtoType.KLAGE) {
    return 'kodeverkKlage';
  }
  return 'kodeverk';
};

interface TotrinnskontrollSakIndexProps {
  behandling: Behandling;
  totrinnskontrollSkjermlenkeContext: TotrinnskontrollSkjermlenkeContext[];
  location: Location;
  behandlingKlageVurdering?: KlagebehandlingDto;
  readOnly: boolean;
  onSubmit: (...args: any[]) => any;
  createLocationForSkjermlenke: (behandlingLocation: Location, skjermlenkeCode: string) => Location;
  toTrinnFormState?: FormState;
  setToTrinnFormState?: React.Dispatch<FormState>;
}

const TotrinnskontrollSakIndex = ({
  behandling,
  totrinnskontrollSkjermlenkeContext,
  location,
  readOnly,
  onSubmit,
  behandlingKlageVurdering,
  createLocationForSkjermlenke,
  toTrinnFormState,
  setToTrinnFormState,
}: TotrinnskontrollSakIndexProps) => {
  const { hentKodeverkForKode } = useKodeverkContext();
  const erTilbakekreving =
    behandlingType.TILBAKEKREVING === behandling.type || behandlingType.REVURDERING_TILBAKEKREVING === behandling.type;

  const submitHandler = useCallback(
    (values: FormState) => {
      const aksjonspunktGodkjenningDtos = values.aksjonspunktGodkjenning.map(apData => ({
        aksjonspunktKode: apData.aksjonspunktKode,
        godkjent: apData.totrinnskontrollGodkjent,
        begrunnelse: apData.besluttersBegrunnelse,
        arsaker: getArsaker(apData),
      }));

      const fatterVedtakAksjonspunktDto = {
        '@type': erTilbakekreving
          ? aksjonspunktCodesTilbakekreving.FATTER_VEDTAK
          : AksjonspunktDtoDefinisjon.FATTER_VEDTAK,
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

  const sorterteTotrinnskontrollSkjermlenkeContext = useMemo(
    () =>
      erTilbakekreving
        ? sorterteSkjermlenkeCodesForTilbakekreving
            .map(s => totrinnskontrollSkjermlenkeContext.find(el => el.skjermlenkeType === s.kode))
            .filter(s => s != undefined)
        : totrinnskontrollSkjermlenkeContext,
    [erTilbakekreving, totrinnskontrollSkjermlenkeContext],
  );

  const lagLenke = useCallback(
    (skjermlenkeCode: string): Location => createLocationForSkjermlenke(location, skjermlenkeCode),
    [location, createLocationForSkjermlenke],
  );

  const erStatusFatterVedtak = behandling.status === BehandlingAksjonspunktDtoBehandlingStatus.FATTER_VEDTAK;
  const skjermlenkeTyper = hentKodeverkForKode(
    KodeverkType.SKJERMLENKE_TYPE,
    getBehandlingTypeForKodeverk(behandling, erTilbakekreving),
  );
  const arbeidsforholdHandlingTyper = hentKodeverkForKode(
    KodeverkType.ARBEIDSFORHOLD_HANDLING_TYPE,
    getBehandlingTypeForKodeverk(behandling, erTilbakekreving),
  );
  const vurderArsaker = hentKodeverkForKode(
    KodeverkType.VURDER_AARSAK,
    getBehandlingTypeForKodeverk(behandling, erTilbakekreving),
  );

  return (
    <>
      {erStatusFatterVedtak && (
        <TotrinnskontrollBeslutterForm
          behandling={behandling}
          totrinnskontrollSkjermlenkeContext={sorterteTotrinnskontrollSkjermlenkeContext}
          readOnly={readOnly}
          handleSubmit={submitHandler}
          behandlingKlageVurdering={behandlingKlageVurdering}
          arbeidsforholdHandlingTyper={arbeidsforholdHandlingTyper as KodeverkV2[]}
          skjermlenkeTyper={skjermlenkeTyper as KodeverkV2[]}
          lagLenke={lagLenke}
          toTrinnFormState={toTrinnFormState}
          setToTrinnFormState={setToTrinnFormState}
        />
      )}
      {!erStatusFatterVedtak && (
        <TotrinnskontrollSaksbehandlerPanel
          totrinnskontrollSkjermlenkeContext={sorterteTotrinnskontrollSkjermlenkeContext}
          behandlingKlageVurdering={behandlingKlageVurdering}
          behandlingStatus={behandling.status}
          erTilbakekreving={erTilbakekreving}
          arbeidsforholdHandlingTyper={arbeidsforholdHandlingTyper as KodeverkObject[]}
          skjermlenkeTyper={skjermlenkeTyper as KodeverkObject[]}
          lagLenke={lagLenke}
          vurderArsaker={vurderArsaker as KodeverkObject[]}
        />
      )}
    </>
  );
};

// TODO: Dette kan fjernes når overgang til kodeverk som strings er ferdig
const TotrinnskontrollSakIndexPropsTransformer = (
  props: TotrinnskontrollSakIndexProps & { behandlingType?: BehandlingDtoType },
) => {
  const v2Props = JSON.parse(JSON.stringify(props));
  konverterKodeverkTilKode(v2Props, props.behandlingType === BehandlingDtoType.TILBAKEKREVING);
  return <TotrinnskontrollSakIndex {...props} {...v2Props} />;
};

export default TotrinnskontrollSakIndexPropsTransformer;
