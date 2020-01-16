import { getSupportPanelLocationCreator, trackRouteParam } from '@fpsak-frontend/fp-felles';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import BehandlingsupportDataResolver from './BehandlingsupportDataResolver';
import styles from './behandlingSupportIndex.less';
import { getAccessibleSupportPanels, getEnabledSupportPanels } from './behandlingsupportSelectors';
import LinkRow from './components/LinkRow';
import SupportPanelLink from './components/SupportPanelLink';
import DocumentIndex from './documents/DocumentIndex';
import { getSelectedSupportPanel, setSelectedSupportPanel } from './duck';
import HistoryIndex from './history/HistoryIndex';
import MessagesIndex from './messages/MessagesIndex';
import supportPanels from './supportPanels';
import Totrinnskontroll from './totrinnskontroll/Totrinnskontroll';
import TotrinnskontrollTilbakemelding from './totrinnskontroll/TotrinnskontrollTilbakemelding';

const renderSupportPanel = supportPanel => {
  switch (supportPanel) {
    case supportPanels.RETURNED:
      return <TotrinnskontrollTilbakemelding />;
    case supportPanels.APPROVAL:
      return <Totrinnskontroll />;
    case supportPanels.HISTORY:
      return <HistoryIndex />;
    case supportPanels.MESSAGES:
      return <MessagesIndex />;
    case supportPanels.DOCUMENTS:
      return <DocumentIndex />;
    default:
      return null;
  }
};

/**
 * BehandlingSupportIndex
 *
 * Containerkomponent for behandlingsstøttepanelet.
 * Har ansvar for å lage navigasjonsrad med korrekte navigasjonsvalg, og route til rett
 * støttepanelkomponent ihht. gitt parameter i URL-en.
 */
export const BehandlingSupportIndex = ({
  activeSupportPanel,
  acccessibleSupportPanels,
  enabledSupportPanels,
  getSupportPanelLocation,
}) => (
  <BehandlingsupportDataResolver>
    <div
      className={
        activeSupportPanel === supportPanels.APPROVAL ? styles.statusAksjonspunkt : styles.behandlingsupportIndex
      }
    >
      <div className={styles.marginBottom}>
        <LinkRow>
          {acccessibleSupportPanels.map(supportPanel => (
            <SupportPanelLink
              key={supportPanel}
              supportPanel={supportPanel}
              isEnabled={enabledSupportPanels.includes(supportPanel)}
              isActive={supportPanel === activeSupportPanel}
              supportPanelLocation={getSupportPanelLocation(supportPanel)}
            />
          ))}
        </LinkRow>
      </div>
      {renderSupportPanel(activeSupportPanel)}
    </div>
  </BehandlingsupportDataResolver>
);

BehandlingSupportIndex.propTypes = {
  acccessibleSupportPanels: PropTypes.arrayOf(PropTypes.string).isRequired,
  enabledSupportPanels: PropTypes.arrayOf(PropTypes.string).isRequired,
  activeSupportPanel: PropTypes.string.isRequired,
  getSupportPanelLocation: PropTypes.func.isRequired,
};

const getDefaultSupportPanel = enabledSupportPanels => enabledSupportPanels.find(() => true) || supportPanels.HISTORY;

const mapStateToProps = state => {
  const acccessibleSupportPanels = getAccessibleSupportPanels(state);
  const enabledSupportPanels = getEnabledSupportPanels(state);
  const selectedSupportPanel = getSelectedSupportPanel(state);

  const defaultSupportPanel = getDefaultSupportPanel(enabledSupportPanels);
  const activeSupportPanel = enabledSupportPanels.includes(selectedSupportPanel)
    ? selectedSupportPanel
    : defaultSupportPanel;
  return {
    acccessibleSupportPanels,
    enabledSupportPanels,
    activeSupportPanel,
  };
};

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...ownProps,
  ...dispatchProps,
  ...stateProps,
  getSupportPanelLocation: getSupportPanelLocationCreator(ownProps.location), // gets prop 'location' from trackRouteParam
});

export default trackRouteParam({
  paramName: 'stotte',
  paramPropType: PropTypes.string,
  storeParam: setSelectedSupportPanel,
  getParamFromStore: getSelectedSupportPanel,
  isQueryParam: true,
})(connect(mapStateToProps, null, mergeProps)(BehandlingSupportIndex));
