import React from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import {
  ArbeidsgiverOpplysningerPerId,
  Brevmaler,
  KodeverkMedNavn,
  Mottaker,
  Personopplysninger,
} from '@k9-sak-web/types';

import { Fritekstbrev } from '@k9-sak-web/types/src/formidlingTsType';
import messages from '../i18n/nb_NO.json';
import Messages, { type BackendApi as MessagesBackendApi, type FormValues } from './components/Messages';
import MessagesTilbakekreving from './components/MessagesTilbakekreving';

const cache = createIntlCache();

const intl = createIntl(
  {
    locale: 'nb-NO',
    messages,
  },
  cache,
);

export interface BackendApi extends MessagesBackendApi {}

interface OwnProps {
  submitCallback: (values: FormValues) => void;
  templates?: Brevmaler;
  sprakKode: string;
  previewCallback: (
    mottaker: string | Mottaker,
    brevmalkode: string,
    fritekst: string,
    fritekstbrev?: Fritekstbrev,
  ) => void;
  behandlingId: number;
  behandlingVersjon: number;
  isKontrollerRevurderingApOpen?: boolean;
  revurderingVarslingArsak: KodeverkMedNavn[];
  personopplysninger?: Personopplysninger;
  arbeidsgiverOpplysningerPerId?: ArbeidsgiverOpplysningerPerId;
  erTilbakekreving: boolean;
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
  backendApi,
}: OwnProps) => (
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

export default MeldingerSakIndex;
