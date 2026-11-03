import React from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

// import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';

import messages from '../i18n/nb_NO.json';
import BehandleUnntak from './components/BehandleUnntakForm';

const cache = createIntlCache();

const intl = createIntl(
  {
    locale: 'nb-NO',
    messages,
  },
  cache,
);

const UnntakProsessIndex = ({
  behandling,
  alleKodeverk,
  submitCallback,
  isReadOnly,
  previewCallback,
  readOnlySubmitButton,
  aksjonspunkter,
  vilkar,
  erOverstyrer,
}) => {
  const { behandlingsresultat } = behandling;
  const vilkårsresultat = behandlingsresultat?.vilkårResultat?.K9_VILKÅRET;
  return (
    <RawIntlProvider value={intl}>
      <BehandleUnntak
        behandlingsresultat={behandlingsresultat}
        behandlingId={behandling.id}
        behandlingVersjon={behandling.versjon}
        språkkode={behandling.språkkode}
        aksjonspunkter={aksjonspunkter}
        submitCallback={submitCallback}
        readOnly={isReadOnly}
        previewCallback={previewCallback}
        readOnlySubmitButton={readOnlySubmitButton}
        alleKodeverk={alleKodeverk}
        vilkårsresultat={vilkårsresultat}
        vilkar={vilkar}
        erOverstyrer={erOverstyrer}
      />
    </RawIntlProvider>
  );
};

export default UnntakProsessIndex;
