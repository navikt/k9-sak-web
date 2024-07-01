import React from 'react';
import PropTypes from 'prop-types';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';
import { useKodeverkContext } from '@k9-sak-web/gui/kodeverk/index.js';
import saksopplysningAksjonspunkterPropType from './propTypes/saksopplysningAksjonspunkterPropType';
import saksopplysningBehandlingPropType from './propTypes/saksopplysningBehandlingPropType';
import saksopplysningMedlemskapPropType from './propTypes/saksopplysningMedlemskapPropType';
import saksopplysningPersonsopplysningerPropType from './propTypes/saksopplysningPersonsopplysningerPropType';
import CheckPersonStatusForm from './components/CheckPersonStatusForm';
import messages from '../i18n/nb_NO.json';

const cache = createIntlCache();

const intl = createIntl(
  {
    locale: 'nb-NO',
    messages,
  },
  cache,
);

const CheckPersonStatusIndex = ({
  behandling,
  medlemskap,
  personopplysninger,
  aksjonspunkter,
  alleKodeverk,
  submitCallback,
  isReadOnly,
  readOnlySubmitButton,
}) => {
  const { getKodeverkNavnFraKodeFn } = useKodeverkContext();
  return (
    <RawIntlProvider value={intl}>
      <CheckPersonStatusForm
        behandlingId={behandling.id}
        behandlingVersjon={behandling.versjon}
        behandlingHenlagt={behandling.behandlingHenlagt}
        gjeldeneFom={medlemskap.fom}
        personopplysninger={personopplysninger}
        alleKodeverk={alleKodeverk}
        aksjonspunkter={aksjonspunkter}
        submitCallback={submitCallback}
        readOnly={isReadOnly}
        readOnlySubmitButton={readOnlySubmitButton}
        kodeverkNavnFraKode={getKodeverkNavnFraKodeFn()}
      />
    </RawIntlProvider>
  );
};

CheckPersonStatusIndex.propTypes = {
  behandling: saksopplysningBehandlingPropType.isRequired,
  medlemskap: saksopplysningMedlemskapPropType.isRequired,
  personopplysninger: saksopplysningPersonsopplysningerPropType.isRequired,
  aksjonspunkter: PropTypes.arrayOf(saksopplysningAksjonspunkterPropType).isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
  submitCallback: PropTypes.func.isRequired,
  isReadOnly: PropTypes.bool.isRequired,
  readOnlySubmitButton: PropTypes.bool.isRequired,
};

export default CheckPersonStatusIndex;
