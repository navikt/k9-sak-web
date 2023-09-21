import React, { useMemo } from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import {
  Kodeverk,
  KodeverkMedNavn,
  Personopplysninger,
  ArbeidsgiverOpplysningerPerId,
  Brevmaler,
  Mottaker,
} from '@k9-sak-web/types';

import { Fritekstbrev } from '@k9-sak-web/types/src/formidlingTsType';
import messages from '../i18n/nb_NO.json';
import MessagesMedMedisinskeTypeBrevmal, { FormValues } from './components/MessagesMedMedisinskeTypeBrevmal';
import MessagesTilbakekreving from './components/MessagesTilbakekreving';

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
  templates: Brevmaler;
  sprakKode: Kodeverk;
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
      <MessagesMedMedisinskeTypeBrevmal
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
    )}
  </RawIntlProvider>
);

export default MeldingerSakIndex;
