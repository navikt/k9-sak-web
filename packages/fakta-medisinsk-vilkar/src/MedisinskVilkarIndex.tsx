import * as React from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';
import messages from '../i18n/nb_NO.json';
import MedisinskVilkarPanel from './components/MedisinskVilkarPanel';

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
  aksjonspunkter: any[]; // TODO: Foreløpig ikke i bruk her, men må få riktig type
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
  toggleInfoPanelCallback: () => void;
  behandling: Behandling;
  submitCallback: (props: SubmitCallbackProps[]) => void;
}

const MedisinskVilkarIndex = (props: MedisinskVilkarIndexProps) => (
  <RawIntlProvider value={intlConfig}>
    <MedisinskVilkarPanel {...props} />
  </RawIntlProvider>
);

export default MedisinskVilkarIndex;
