import { Location } from 'history';
import React, { useCallback, useMemo } from 'react';
import { RawIntlProvider, createIntl, createIntlCache } from 'react-intl';

import aksjonspunktCodes from '@k9-sak-web/kodeverk/src/aksjonspunktCodes';
import aksjonspunktCodesTilbakekreving from '@k9-sak-web/kodeverk/src/aksjonspunktCodesTilbakekreving';
import BehandlingStatus from '@k9-sak-web/kodeverk/src/behandlingStatus';
import BehandlingType from '@k9-sak-web/kodeverk/src/behandlingType';
import kodeverkTyper from '@k9-sak-web/kodeverk/src/kodeverkTyper';
import vurderPaNyttArsakType from '@k9-sak-web/kodeverk/src/vurderPaNyttArsakType';
import { skjermlenkeCodes } from '@k9-sak-web/konstanter';
import {
  BehandlingAppKontekst,
  KlageVurdering,
  KodeverkMedNavn,
  TotrinnskontrollSkjermlenkeContext,
} from '@k9-sak-web/types';

import messages from '../i18n/nb_NO.json';
import { AksjonspunktGodkjenningData } from './components/AksjonspunktGodkjenningFieldArray';
import TotrinnskontrollBeslutterForm, { FormValues } from './components/TotrinnskontrollBeslutterForm';
import TotrinnskontrollSaksbehandlerPanel from './components/TotrinnskontrollSaksbehandlerPanel';

const cache = createIntlCache();

const intl = createIntl(
  {
    locale: 'nb-NO',
    messages,
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
}: OwnProps) => {
  const erTilbakekreving =
    BehandlingType.TILBAKEKREVING === behandling.type.kode ||
    BehandlingType.TILBAKEKREVING_REVURDERING === behandling.type.kode;

  const submitHandler = useCallback(
    (values: FormValues) => {
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
  const skjemalenkeTyper = alleKodeverk[kodeverkTyper.SKJERMLENKE_TYPE];
  const arbeidsforholdHandlingTyper = alleKodeverk[kodeverkTyper.ARBEIDSFORHOLD_HANDLING_TYPE];
  const vurderArsaker = alleKodeverk[kodeverkTyper.VURDER_AARSAK];

  return (
    <RawIntlProvider value={intl}>
      {erStatusFatterVedtak && (
        <TotrinnskontrollBeslutterForm
          behandling={behandling}
          behandlingId={behandling.id}
          behandlingVersjon={behandling.versjon}
          totrinnskontrollSkjermlenkeContext={sorterteTotrinnskontrollSkjermlenkeContext}
          readOnly={readOnly}
          onSubmit={submitHandler}
          behandlingKlageVurdering={behandlingKlageVurdering}
          arbeidsforholdHandlingTyper={arbeidsforholdHandlingTyper}
          skjemalenkeTyper={skjemalenkeTyper}
          erTilbakekreving={erTilbakekreving}
          lagLenke={lagLenke}
        />
      )}
      {!erStatusFatterVedtak && (
        <TotrinnskontrollSaksbehandlerPanel
          totrinnskontrollSkjermlenkeContext={sorterteTotrinnskontrollSkjermlenkeContext}
          behandlingKlageVurdering={behandlingKlageVurdering}
          behandlingStatus={behandling.status}
          erTilbakekreving={erTilbakekreving}
          arbeidsforholdHandlingTyper={arbeidsforholdHandlingTyper}
          skjemalenkeTyper={skjemalenkeTyper}
          lagLenke={lagLenke}
          vurderArsaker={vurderArsaker}
        />
      )}
    </RawIntlProvider>
  );
};

export default TotrinnskontrollSakIndex;
