import React from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import {
  ArbeidsgiverOpplysningerPerId,
  Brevmaler,
  FeatureToggles,
  KodeverkMedNavn,
  Personopplysninger,
} from '@k9-sak-web/types';

import { Fritekstbrev } from '@k9-sak-web/types/src/formidlingTsType';
import V2Messages, {
  type BackendApi as V2MessagesBackendApi,
  MessagesProps as V2MessagesProps,
} from '@k9-sak-web/gui/sak/meldinger/Messages.js';
import { Fagsak } from '@k9-sak-web/gui/sak/Fagsak.js';
import { BehandlingInfo } from '@k9-sak-web/gui/sak/BehandlingInfo.js';
import type { MottakerDto } from '@navikt/k9-sak-typescript-client';
import { erTilbakekrevingType } from '@fpsak-frontend/kodeverk/src/behandlingType.js';
import { K9sakApiKeys, restApiHooks } from '@k9-sak-web/sak-app/src/data/k9sakApi.js';
import useVisForhandsvisningAvMelding from '@k9-sak-web/sak-app/src/data/useVisForhandsvisningAvMelding.js';
import MessagesTilbakekreving from './components/MessagesTilbakekreving';
import Messages, { type BackendApi as MessagesBackendApi, type FormValues } from './components/Messages';
import messages from '../i18n/nb_NO.json';
import { StickyStateReducer } from '@k9-sak-web/gui/utils/StickyStateReducer.js';

const cache = createIntlCache();

const intl = createIntl(
  {
    locale: 'nb-NO',
    messages,
  },
  cache,
);

export interface BackendApi extends MessagesBackendApi, V2MessagesBackendApi {}

interface OwnProps {
  onMessageSent: () => void;
  templates: Brevmaler;
  behandlingVersjon: number; // Er vel berre for å detektere endring, kanskje fjernast etterkvart?
  isKontrollerRevurderingApOpen?: boolean;
  revurderingVarslingArsak: KodeverkMedNavn[];
  personopplysninger?: Personopplysninger;
  arbeidsgiverOpplysningerPerId?: ArbeidsgiverOpplysningerPerId;
  erTilbakekreving: boolean;
  readonly featureToggles: FeatureToggles;
  readonly fagsak: Fagsak;
  readonly behandling: BehandlingInfo;
  readonly backendApi: BackendApi;
}

// Held på state oppretta inni reducers i Messages og FritekstInput komponenter.
// Dette slik at bruker ikkje mister state når disse blir unmounta og remounta
// ved visning av anna panel midlertidig (på samme sak/behandling).
// NB: Pga denne må ein ikkje initialisere meir enn ein instans av MeldingerSakIndex komponent på samme tid,
// dette blir ein globalt delt state.
// XXX Burde kanskje løftast som context høgare oppe i hierariet istadenfor å vere
// statisk global her. Er ein liten minnelekkasje slik det er no.
const stickyState: V2MessagesProps['stickyState'] = {
  messages: new StickyStateReducer(),
  fritekst: {
    tittel: new StickyStateReducer(),
    tekst: new StickyStateReducer(),
  },
};

const MeldingerSakIndex = ({
  onMessageSent,
  templates,
  behandlingVersjon,
  isKontrollerRevurderingApOpen = false,
  revurderingVarslingArsak,
  personopplysninger,
  arbeidsgiverOpplysningerPerId,
  featureToggles,
  fagsak,
  behandling,
  backendApi,
}: OwnProps) => {
  const { startRequest: submitMessage } = restApiHooks.useRestApiRunner(K9sakApiKeys.SUBMIT_MESSAGE);
  const fetchPreview = useVisForhandsvisningAvMelding(behandling, fagsak);
  const erTilbakekreving = erTilbakekrevingType({ kode: behandling.type.kode });
  // Vis ny komponent for meldingssending viss dette ikkje er tilbakekreving, og featureflag er satt
  if (!erTilbakekreving && featureToggles.BRUK_V2_MELDINGER) {
    return (
      <V2Messages
        fagsak={fagsak}
        behandling={behandling}
        personopplysninger={personopplysninger}
        arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
        maler={Object.values(templates)}
        api={backendApi}
        onMessageSent={onMessageSent}
        stickyState={stickyState}
      />
    );
  }
  // Ellers, vis gamle komponenter:
  const submitCallback = async (values: FormValues) => {
    const data = erTilbakekreving
      ? {
          behandlingUuid: behandling.uuid,
          fritekst: values.fritekst,
          brevmalkode: values.brevmalkode,
        }
      : {
          behandlingId: behandling.id,
          overstyrtMottaker: values.overstyrtMottaker,
          brevmalkode: values.brevmalkode,
          fritekst: values.fritekst,
          fritekstbrev: values.fritekstbrev,
        };
    await submitMessage(data);
    onMessageSent(); // NB: Utfører full reload av sida.
  };

  const previewCallback = (
    overstyrtMottaker: MottakerDto,
    dokumentMal: string,
    fritekst: string,
    fritekstbrev?: Fritekstbrev,
  ) => {
    const data = erTilbakekrevingType({ kode: behandling.type.kode })
      ? {
          fritekst: fritekst || ' ',
          brevmalkode: dokumentMal,
        }
      : {
          overstyrtMottaker,
          dokumentMal,
          dokumentdata: {
            fritekst: fritekst || ' ',
            fritekstbrev: fritekstbrev
              ? { brødtekst: fritekstbrev.brødtekst ?? '', overskrift: fritekstbrev.overskrift ?? '' }
              : null,
          },
        };
    fetchPreview(false, data);
  };

  return (
    <RawIntlProvider value={intl}>
      {erTilbakekreving ? (
        <MessagesTilbakekreving
          submitCallback={submitCallback}
          templates={templates}
          sprakKode={behandling.sprakkode}
          previewCallback={previewCallback}
          behandlingId={behandling.id}
          behandlingVersjon={behandlingVersjon}
          isKontrollerRevurderingApOpen={isKontrollerRevurderingApOpen}
          revurderingVarslingArsak={revurderingVarslingArsak}
          personopplysninger={personopplysninger}
          arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
        />
      ) : (
        <Messages
          submitCallback={submitCallback}
          templates={templates}
          sprakKode={behandling.sprakkode}
          previewCallback={previewCallback}
          behandlingId={behandling.id}
          behandlingVersjon={behandlingVersjon}
          isKontrollerRevurderingApOpen={isKontrollerRevurderingApOpen}
          revurderingVarslingArsak={revurderingVarslingArsak}
          personopplysninger={personopplysninger}
          arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
          backendApi={backendApi}
        />
      )}
    </RawIntlProvider>
  );
};

export default MeldingerSakIndex;
