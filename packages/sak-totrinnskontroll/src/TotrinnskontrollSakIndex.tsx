import { Location } from 'history';
import { useCallback, useMemo } from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktCodesTilbakekreving from '@fpsak-frontend/kodeverk/src/aksjonspunktCodesTilbakekreving';
import BehandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import BehandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import vurderPaNyttArsakType from '@fpsak-frontend/kodeverk/src/vurderPaNyttArsakType';
import { skjermlenkeCodes } from '@k9-sak-web/konstanter';
import {
  BehandlingAppKontekst,
  KlageVurdering,
  KodeverkMedNavn,
  TotrinnskontrollSkjermlenkeContext,
} from '@k9-sak-web/types';

import { AksjonspunktGodkjenningData } from './components/AksjonspunktGodkjenningFieldArray';
import { FormState } from './components/FormState';
import TotrinnskontrollBeslutterForm from './components/TotrinnskontrollBeslutterForm';
import TotrinnskontrollSaksbehandlerPanel from './components/TotrinnskontrollSaksbehandlerPanel';

const cache = createIntlCache();

const intl = createIntl(
  {
    locale: 'nb-NO',
  },
  cache,
);

const sorterteSkjermlenkeCodesForTilbakekreving = [
  skjermlenkeCodes.FAKTA_OM_FEILUTBETALING,
  skjermlenkeCodes.FORELDELSE,
  skjermlenkeCodes.TILBAKEKREVING,
  skjermlenkeCodes.VEDTAK,
];

const getArsaker = (apData: AksjonspunktGodkjenningData): string[] => {
  const arsaker = [];
  if (apData.feilFakta) {
    arsaker.push(vurderPaNyttArsakType.FEIL_FAKTA);
  }
  if (apData.feilLov) {
    arsaker.push(vurderPaNyttArsakType.FEIL_LOV);
  }
  if (apData.feilRegel) {
    arsaker.push(vurderPaNyttArsakType.FEIL_REGEL);
  }
  if (apData.annet) {
    arsaker.push(vurderPaNyttArsakType.ANNET);
  }
  return arsaker;
};

interface OwnProps {
  behandling: BehandlingAppKontekst;
  totrinnskontrollSkjermlenkeContext: TotrinnskontrollSkjermlenkeContext[];
  location: Location;
  behandlingKlageVurdering?: KlageVurdering;
  alleKodeverk: { [key: string]: KodeverkMedNavn[] };
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
  alleKodeverk,
  createLocationForSkjermlenke,
  toTrinnFormState,
  setToTrinnFormState,
}: OwnProps) => {
  const erTilbakekreving =
    BehandlingType.TILBAKEKREVING === behandling.type.kode ||
    BehandlingType.TILBAKEKREVING_REVURDERING === behandling.type.kode;

  const submitHandler = useCallback(
    (values: FormState) => {
      const aksjonspunktGodkjenningDtos = values.aksjonspunktGodkjenning.map(apData => ({
        aksjonspunktKode: apData.aksjonspunktKode,
        godkjent: apData.totrinnskontrollGodkjent,
        begrunnelse: apData.besluttersBegrunnelse,
        arsaker: getArsaker(apData),
      }));

      const fatterVedtakAksjonspunktDto = {
        '@type': erTilbakekreving ? aksjonspunktCodesTilbakekreving.FATTER_VEDTAK : aksjonspunktCodes.FATTER_VEDTAK,
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
    [erTilbakekreving],
  );

  const sorterteTotrinnskontrollSkjermlenkeContext = useMemo(
    () =>
      erTilbakekreving
        ? sorterteSkjermlenkeCodesForTilbakekreving
            .map(s => totrinnskontrollSkjermlenkeContext.find(el => el.skjermlenkeType === s.kode))
            .filter(s => s)
        : totrinnskontrollSkjermlenkeContext,
    [erTilbakekreving, totrinnskontrollSkjermlenkeContext],
  );

  const lagLenke = useCallback(
    (skjermlenkeCode: string): Location => createLocationForSkjermlenke(location, skjermlenkeCode),
    [location],
  );

  const erStatusFatterVedtak = behandling.status.kode === BehandlingStatus.FATTER_VEDTAK;
  const skjermlenkeTyper = alleKodeverk[kodeverkTyper.SKJERMLENKE_TYPE];
  const arbeidsforholdHandlingTyper = alleKodeverk[kodeverkTyper.ARBEIDSFORHOLD_HANDLING_TYPE];
  const vurderArsaker = alleKodeverk[kodeverkTyper.VURDER_AARSAK];

  return (
    <RawIntlProvider value={intl}>
      {erStatusFatterVedtak && (
        <TotrinnskontrollBeslutterForm
          behandling={behandling}
          totrinnskontrollSkjermlenkeContext={sorterteTotrinnskontrollSkjermlenkeContext}
          readOnly={readOnly}
          handleSubmit={submitHandler}
          behandlingKlageVurdering={behandlingKlageVurdering}
          arbeidsforholdHandlingTyper={arbeidsforholdHandlingTyper}
          skjermlenkeTyper={skjermlenkeTyper}
          erTilbakekreving={erTilbakekreving}
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
          arbeidsforholdHandlingTyper={arbeidsforholdHandlingTyper}
          skjermlenkeTyper={skjermlenkeTyper}
          lagLenke={lagLenke}
          vurderArsaker={vurderArsaker}
        />
      )}
    </RawIntlProvider>
  );
};

export default TotrinnskontrollSakIndex;
