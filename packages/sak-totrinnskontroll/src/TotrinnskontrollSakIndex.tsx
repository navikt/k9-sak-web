import React, { useCallback, useMemo } from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';
import { Location } from 'history';

import BehandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import { skjermlenkeCodes } from '@k9-sak-web/konstanter';
import BehandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import vurderPaNyttArsakType from '@fpsak-frontend/kodeverk/src/vurderPaNyttArsakType';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktCodesTilbakekreving from '@fpsak-frontend/kodeverk/src/aksjonspunktCodesTilbakekreving';
import { BehandlingAppKontekst, KlageVurdering, TotrinnskontrollSkjermlenkeContext } from '@k9-sak-web/types';
import { useKodeverkContext } from '@k9-sak-web/gui/kodeverk/index.js';
import { KodeverkType } from '@k9-sak-web/lib/types/KodeverkType.js';
import KodeverkV2, { KodeverkObject } from '@k9-sak-web/lib/types/KodeverkV2.js';

import TotrinnskontrollBeslutterForm, { FormValues } from './components/TotrinnskontrollBeslutterForm';
import { AksjonspunktGodkjenningData } from './components/AksjonspunktGodkjenningFieldArray';
import TotrinnskontrollSaksbehandlerPanel from './components/TotrinnskontrollSaksbehandlerPanel';
import messages from '../i18n/nb_NO.json';

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
  createLocationForSkjermlenke,
}: OwnProps) => {
  const { hentKodeverkForKode } = useKodeverkContext();
  const erTilbakekreving =
    BehandlingType.TILBAKEKREVING === behandling.type || BehandlingType.TILBAKEKREVING_REVURDERING === behandling.type;

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

  const erStatusFatterVedtak = behandling.status === BehandlingStatus.FATTER_VEDTAK;
  const skjemalenkeTyper = hentKodeverkForKode(KodeverkType.SKJERMLENKE_TYPE);
  const arbeidsforholdHandlingTyper = hentKodeverkForKode(KodeverkType.ARBEIDSFORHOLD_HANDLING_TYPE);
  const vurderArsaker = hentKodeverkForKode(KodeverkType.VURDER_AARSAK);

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
          arbeidsforholdHandlingTyper={arbeidsforholdHandlingTyper as KodeverkV2[]}
          skjemalenkeTyper={skjemalenkeTyper as KodeverkV2[]}
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
          arbeidsforholdHandlingTyper={arbeidsforholdHandlingTyper as KodeverkObject[]}
          skjemalenkeTyper={skjemalenkeTyper as KodeverkObject[]}
          lagLenke={lagLenke}
          vurderArsaker={vurderArsaker as KodeverkObject[]}
        />
      )}
    </RawIntlProvider>
  );
};

export default TotrinnskontrollSakIndex;
