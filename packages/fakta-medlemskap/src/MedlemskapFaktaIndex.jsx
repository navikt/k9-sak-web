import PropTypes from 'prop-types';
import React from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';
import messages from '../i18n/nb_NO.json';
import MedlemskapInfoPanel from './components/MedlemskapInfoPanel';
import medlemskapAksjonspunkterPropType from './propTypes/medlemskapAksjonspunkterPropType';
import medlemskapBehandlingPropType from './propTypes/medlemskapBehandlingPropType';
import medlemskapMedlemskapPropType from './propTypes/medlemskapMedlemskapPropType';
import medlemskapSoknadPropType from './propTypes/medlemskapSoknadPropType';

const cache = createIntlCache();

const intl = createIntl(
  {
    locale: 'nb-NO',
    messages,
  },
  cache,
);

const MedlemskapFaktaIndex = ({
  behandling,
  soknad,
  medlemskap,
  aksjonspunkter,
  harApneAksjonspunkter,
  submittable,
  fagsakPerson,
  alleMerknaderFraBeslutter,
  alleKodeverk,
  submitCallback,
  readOnly,
}) => (
  <RawIntlProvider value={intl}>
    <MedlemskapInfoPanel
      behandlingId={behandling.id}
      behandlingVersjon={behandling.versjon}
      behandlingType={behandling.type}
      behandlingStatus={behandling.status}
      behandlingPaaVent={behandling.behandlingPaaVent}
      soknad={soknad}
      medlemskap={medlemskap}
      fagsakPerson={fagsakPerson}
      aksjonspunkter={aksjonspunkter}
      hasOpenAksjonspunkter={harApneAksjonspunkter}
      submittable={submittable}
      alleMerknaderFraBeslutter={alleMerknaderFraBeslutter}
      alleKodeverk={alleKodeverk}
      submitCallback={submitCallback}
      readOnly={readOnly}
    />
  </RawIntlProvider>
);

MedlemskapFaktaIndex.propTypes = {
  behandling: medlemskapBehandlingPropType.isRequired,
  medlemskap: medlemskapMedlemskapPropType.isRequired,
  soknad: medlemskapSoknadPropType,
  aksjonspunkter: PropTypes.arrayOf(medlemskapAksjonspunkterPropType).isRequired,
  fagsakPerson: PropTypes.shape().isRequired,
  alleMerknaderFraBeslutter: PropTypes.shape({
    notAccepted: PropTypes.bool,
  }).isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
  submitCallback: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
  harApneAksjonspunkter: PropTypes.bool.isRequired,
  submittable: PropTypes.bool.isRequired,
};

export default MedlemskapFaktaIndex;
