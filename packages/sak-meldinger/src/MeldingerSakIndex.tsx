import React, { FunctionComponent } from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import { Kodeverk, KodeverkMedNavn, ArbeidsgiverOpplysningerPerId } from '@k9-sak-web/types';

import Messages, { FormValues, Template } from './components/Messages';
import messages from '../i18n/nb_NO.json';

const cache = createIntlCache();

const intl = createIntl(
  {
    locale: 'nb-NO',
    messages,
  },
  cache,
);

interface OwnProps {
  submitCallback: (values: FormValues) => void;
  templates?: Template[];
  sprakKode: Kodeverk;
  previewCallback: (mottaker: string, brevmalkode: string, fritekst: string, arsakskode?: string) => void;
  behandlingId: number;
  behandlingVersjon: number;
  isKontrollerRevurderingApOpen?: boolean;
  revurderingVarslingArsak: KodeverkMedNavn[];
  arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId;
}

const MeldingerSakIndex: FunctionComponent<OwnProps> = ({
  submitCallback,
  templates = [],
  sprakKode,
  previewCallback,
  behandlingId,
  behandlingVersjon,
  isKontrollerRevurderingApOpen = false,
  revurderingVarslingArsak,
  arbeidsgiverOpplysningerPerId,
}) => (
  <RawIntlProvider value={intl}>
    <Messages
      submitCallback={submitCallback}
      templates={templates}
      sprakKode={sprakKode}
      previewCallback={previewCallback}
      behandlingId={behandlingId}
      behandlingVersjon={behandlingVersjon}
      isKontrollerRevurderingApOpen={isKontrollerRevurderingApOpen}
      revurderingVarslingArsak={revurderingVarslingArsak}
      arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
    />
  </RawIntlProvider>
);

export default MeldingerSakIndex;
