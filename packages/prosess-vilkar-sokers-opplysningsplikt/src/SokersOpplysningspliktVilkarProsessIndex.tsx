import React, { FunctionComponent } from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import { Soknad } from '@k9-sak-web/types';
import { StandardProsessFormProps } from '@k9-sak-web/prosess-felles';

import SokersOpplysningspliktForm from './components/SokersOpplysningspliktForm';
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
  soknad: Soknad;
}

const SokersOpplysningspliktVilkarProsessIndex: FunctionComponent<OwnProps & StandardProsessFormProps> = ({
  behandling,
  soknad,
  aksjonspunkter,
  status,
  submitCallback,
  isReadOnly,
  readOnlySubmitButton,
  alleKodeverk,
}) => (
  <RawIntlProvider value={intl}>
    <SokersOpplysningspliktForm
      behandlingId={behandling.id}
      behandlingVersjon={behandling.versjon}
      behandlingsresultat={behandling.behandlingsresultat}
      soknad={soknad}
      aksjonspunkter={aksjonspunkter}
      status={status}
      submitCallback={submitCallback}
      readOnly={isReadOnly}
      readOnlySubmitButton={readOnlySubmitButton}
      alleKodeverk={alleKodeverk}
    />
  </RawIntlProvider>
);

export default SokersOpplysningspliktVilkarProsessIndex;
