import * as React from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';
import messages from '../i18n/nb_NO';
import MedisinskVilkarPanel from './components/MedisinskVilkarPanel';

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
  behandling: any;
  submitCallback: (props: SubmitCallbackProps[]) => void;
}

const MedisinskVilkarIndex = (props: MedisinskVilkarIndexProps) => (
  <RawIntlProvider value={intlConfig}>
    <MedisinskVilkarPanel {...props} />
  </RawIntlProvider>
);

export default MedisinskVilkarIndex;
