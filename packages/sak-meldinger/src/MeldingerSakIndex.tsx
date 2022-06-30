import React, { useMemo } from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import {
  Kodeverk,
  KodeverkMedNavn,
  Personopplysninger,
  ArbeidsgiverOpplysningerPerId,
  Brevmaler,
  Brevmal,
  Mottaker, FeatureToggles,
} from '@k9-sak-web/types';

import { Fritekstbrev } from '@k9-sak-web/types/src/formidlingTsType';
import { restApiHooks } from '@k9-sak-web/sak-app/src/data/k9sakApi';
import Messages, { FormValues } from './components/Messages';
import messages from '../i18n/nb_NO.json';
import MessagesMedMedisinskeTypeBrevmal from './components/MessagesMedMedisinskeTypeBrevmal';
import { MessagesApiKeys } from './data/messagesApi';

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
  templates: Brevmaler | Brevmal[];
  sprakKode: string;
  previewCallback: (mottaker: string | Mottaker, brevmalkode: string, fritekst: string, fritekstbrev?: Fritekstbrev) => void;
  behandlingId: number;
  behandlingVersjon: number;
  isKontrollerRevurderingApOpen?: boolean;
  revurderingVarslingArsak: KodeverkMedNavn[];
  personopplysninger?: Personopplysninger;
  arbeidsgiverOpplysningerPerId?: ArbeidsgiverOpplysningerPerId;
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
}: OwnProps) => {

  const featureTogglesData = restApiHooks.useGlobalStateRestApiData<{ key: string; value: string }[]>(
    MessagesApiKeys.FEATURE_TOGGLE,
  );
  const featureToggles = useMemo<FeatureToggles>(
    () =>
      featureTogglesData?.reduce((acc, curr) => {
        acc[curr.key] = `${curr.value}`.toLowerCase() === 'true';
        return acc;
      }, {}),
    [featureTogglesData]);

  return (<RawIntlProvider value={intl}>
    {featureToggles?.TYPE_MEDISINSKE_OPPLYSNINGER_BREV
      ? <MessagesMedMedisinskeTypeBrevmal
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
      : <Messages
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
    }

  </RawIntlProvider>);
};

export default MeldingerSakIndex;
