import React from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';
import { Aksjonspunkt } from '@k9-frontend/types';
import messages from '../i18n/nb_NO.json';
import MedisinskVilkarForm from './components/MedisinskVilkarForm';

export interface Soknad {
  soknadType: Status;
}

export interface Status {
  kode: string;
  navn: string;
}

export interface Vilkar {
  vilkarType: Status;
  avslagKode: string;
  lovReferanse: string;
}

export interface Behandling {
  id: number;
  versjon: number;
  aksjonspunkter: Aksjonspunkt[];
  type: Status;
  status: Status;
  fagsakId: number;
  opprettet: string;
  soknad: Soknad;
  vilkar: Vilkar[];
  behandlingPaaVent: boolean;
}

const cache = createIntlCache();

const intlConfig = createIntl(
  {
    locale: 'nb-NO',
    messages,
  },
  cache,
);

export interface SubmitCallbackProps {
  kode: string;
  begrunnelse: string;
}

interface MedisinskVilkarIndexProps {
  readOnly: boolean;
  behandling: Behandling;
  submitCallback: (props: SubmitCallbackProps[]) => void;
  shouldOpenDefaultInfoPanels: boolean;
  hasOpenAksjonspunkter: boolean;
  submittable: boolean;
}

const MedisinskVilkarIndex = (props: MedisinskVilkarIndexProps) => {
  const {
    // readOnly,
    behandling: { id: behandlingId, versjon: behandlingVersjon },
    submitCallback,
    hasOpenAksjonspunkter,
    submittable,
  } = props;
  return (
    <RawIntlProvider value={intlConfig}>
      <MedisinskVilkarForm
        readOnly={false} // TODO Hallvard: Denne skal ikke være hardkodet
        behandlingId={behandlingId}
        behandlingVersjon={behandlingVersjon}
        submitCallback={submitCallback}
        hasOpenAksjonspunkter={hasOpenAksjonspunkter}
        submittable={submittable}
      />
    </RawIntlProvider>
  );
};
export default MedisinskVilkarIndex;
