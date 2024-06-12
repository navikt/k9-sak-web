import React from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import { Soknad } from '@k9-sak-web/types';
import { StandardProsessFormProps } from '@k9-sak-web/prosess-felles';
import { KodeverkType } from '@k9-sak-web/lib/types/KodeverkType.js';
import { KodeverkObject } from '@k9-sak-web/lib/types/KodeverkV2.js';
import { useKodeverkContext } from '@k9-sak-web/gui/kodeverk/index.js';

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

const SokersOpplysningspliktVilkarProsessIndex = ({
  behandling,
  soknad,
  aksjonspunkter,
  status,
  submitCallback,
  isReadOnly,
  readOnlySubmitButton,
}: OwnProps & StandardProsessFormProps) => {
  const { hentKodeverkForKode } = useKodeverkContext();
  return (
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
        dokumentTypeIds={hentKodeverkForKode(KodeverkType.DOKUMENT_TYPE_ID) as KodeverkObject[]}
      />
    </RawIntlProvider>
  );
};

export default SokersOpplysningspliktVilkarProsessIndex;
