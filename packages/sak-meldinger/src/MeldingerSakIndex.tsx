import React from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import {
  ArbeidsgiverOpplysningerPerId,
  Brevmaler,
  FeatureToggles,
  Kodeverk,
  KodeverkMedNavn,
  Personopplysninger,
} from '@k9-sak-web/types';

import { Fritekstbrev } from '@k9-sak-web/types/src/formidlingTsType';
import V2Messages, { type BackendApi as V2MessagesBackendApi } from '@k9-sak-web/gui/sak/meldinger/Messages.js';
import { Fagsak } from '@k9-sak-web/gui/sak/Fagsak.js';
import { BehandlingInfo } from '@k9-sak-web/gui/sak/BehandlingInfo.js';
import type { MottakerDto } from '@navikt/k9-sak-typescript-client';
import MessagesTilbakekreving from './components/MessagesTilbakekreving';
import Messages, { type BackendApi as MessagesBackendApi, type FormValues } from './components/Messages';
import messages from '../i18n/nb_NO.json';

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
  submitCallback: (values: FormValues) => void;
  templates: Brevmaler;
  sprakKode: Kodeverk; // TODO Erstatt med behandling
  previewCallback: (
    mottaker: string | MottakerDto,
    brevmalkode: string,
    fritekst: string,
    fritekstbrev?: Fritekstbrev,
  ) => void;
  behandlingId: number; // TODO Erstatt med behandling
  behandlingVersjon: number;
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

const MeldingerSakIndex = ({
  submitCallback,
  templates,
  sprakKode,
  previewCallback,
  behandlingId,
  behandlingVersjon,
  isKontrollerRevurderingApOpen = false,
  revurderingVarslingArsak,
  personopplysninger,
  arbeidsgiverOpplysningerPerId,
  erTilbakekreving,
  featureToggles,
  fagsak,
  behandling,
  backendApi,
}: OwnProps) => {
  if (!erTilbakekreving && featureToggles.BRUK_V2_MELDINGER) {
    return (
      <V2Messages
        fagsak={fagsak}
        behandling={behandling}
        personopplysninger={personopplysninger}
        arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
        maler={Object.values(templates)}
        api={backendApi}
      />
    );
  }

  return (
    <RawIntlProvider value={intl}>
      {erTilbakekreving ? (
        <MessagesTilbakekreving
          submitCallback={submitCallback}
          templates={templates}
          sprakKode={sprakKode}
          previewCallback={previewCallback}
          behandlingId={behandlingId}
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
          sprakKode={sprakKode}
          previewCallback={previewCallback}
          behandlingId={behandlingId}
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
