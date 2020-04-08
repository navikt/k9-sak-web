import React from 'react';
import PropTypes from 'prop-types';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import { TabsPure } from 'nav-frontend-tabs';
import opptjeningVilkarAksjonspunkterPropType from './propTypes/opptjeningVilkarAksjonspunkterPropType';
import opptjeningVilkarBehandlingPropType from './propTypes/opptjeningVilkarBehandlingPropType';
import opptjeningVilkarOpptjeningPropType from './propTypes/opptjeningVilkarOpptjeningPropType';
import OpptjeningVilkarForm from './components/OpptjeningVilkarForm';
import messages from '../i18n/nb_NO.json';

const cache = createIntlCache();

const intl = createIntl(
  {
    locale: 'nb-NO',
    messages,
  },
  cache,
);

const opptjeningsperioder = [
  { label: 'Opptjeningsperiode 1' },
  { label: 'Opptjeningsperiode 2' },
  { label: 'Opptjeningsperiode 3' },
];

const OpptjeningVilkarProsessIndex = ({
  behandling,
  opptjening,
  aksjonspunkter,
  status,
  lovReferanse,
  submitCallback,
  isReadOnly,
  isAksjonspunktOpen,
  readOnlySubmitButton,
}) => {
  const [activeTab, setActiveTab] = React.useState(0);
  return (
    <RawIntlProvider value={intl}>
      <TabsPure
        tabs={opptjeningsperioder.map((currentPeriode, currentPeriodeIndex) => ({
          ...currentPeriode,
          aktiv: activeTab === currentPeriodeIndex,
        }))}
        onChange={(e, clickedIndex) => setActiveTab(clickedIndex)}
      />
      <OpptjeningVilkarForm
        behandlingId={behandling.id}
        behandlingVersjon={behandling.versjon}
        behandlingsresultat={behandling.behandlingsresultat}
        fastsattOpptjening={opptjening.fastsattOpptjening}
        status={status}
        lovReferanse={lovReferanse}
        aksjonspunkter={aksjonspunkter}
        submitCallback={submitCallback}
        readOnly={isReadOnly}
        isAksjonspunktOpen={isAksjonspunktOpen}
        readOnlySubmitButton={readOnlySubmitButton}
      />
    </RawIntlProvider>
  );
};

OpptjeningVilkarProsessIndex.propTypes = {
  behandling: opptjeningVilkarBehandlingPropType.isRequired,
  opptjening: opptjeningVilkarOpptjeningPropType.isRequired,
  aksjonspunkter: PropTypes.arrayOf(opptjeningVilkarAksjonspunkterPropType).isRequired,
  status: PropTypes.string.isRequired,
  lovReferanse: PropTypes.string,
  submitCallback: PropTypes.func.isRequired,
  isReadOnly: PropTypes.bool.isRequired,
  isAksjonspunktOpen: PropTypes.bool.isRequired,
  readOnlySubmitButton: PropTypes.bool.isRequired,
};

OpptjeningVilkarProsessIndex.defaultProps = {
  lovReferanse: undefined,
};

export default OpptjeningVilkarProsessIndex;
