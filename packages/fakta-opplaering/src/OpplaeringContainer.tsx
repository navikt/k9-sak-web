import React, { useContext, useState } from 'react';
import classnames from 'classnames';
import TabsPure from 'nav-frontend-tabs';
import { WarningIcon } from '@navikt/ft-plattform-komponenter';
import { FaktaOpplaeringContext } from '@k9-sak-web/behandling-opplaeringspenger/src/panelDefinisjoner/faktaPaneler/OpplaeringFaktaPanelDef';
import { NestedIntlProvider } from '@fpsak-frontend/shared-components';
import Tabs from './Tabs';
import GjennomgaaOpplaeringOversikt from './gjennomgaaOpplaering/GjennomgaaOpplaeringOversikt';
import NoedvendighetOversikt from './noedvendighet/NoedvendighetOversikt';
import messages from './i18n/nb_NO.json';
import ReisetidOversikt from './reisetid/ReisetidOversikt';
import styles from './opplaeringContainer.modules.css';

interface TabItemProps {
  label: string;
  showWarningIcon: boolean;
}

const findInitialTabIndex = aktivtAksjonspunkt => {
  const initialTab = Object.values(Tabs).find(tab => tab.aksjonspunkt === aktivtAksjonspunkt?.definisjon?.kode);
  const index = Object.values(Tabs).findIndex(tab => initialTab === tab);
  return index < 0 ? 0 : index;
};

const TabItem = ({ label, showWarningIcon }: TabItemProps) => {
  const cls = classnames(styles.medisinskVilkårTabItem, {
    [styles.medisinskVilkårTabItemExtended]: showWarningIcon,
  });
  return (
    <div className={cls}>
      {label}
      {showWarningIcon && (
        <div className={styles.medisinskVilkårTabItem__warningIcon}>
          <WarningIcon />
        </div>
      )}
    </div>
  );
};

const OpplaeringContainer = () => {
  const { aksjonspunkter } = useContext(FaktaOpplaeringContext);
  const aktivtAksjonspunkt = aksjonspunkter.find(aksjonspunkt => aksjonspunkt.status.kode === 'OPPR');
  const [activeTab, setActiveTab] = useState(findInitialTabIndex(aktivtAksjonspunkt));
  return (
    <NestedIntlProvider messages={messages}>
      <TabsPure
        kompakt
        tabs={Object.values(Tabs).map((tab, index) => ({
          label: (
            <TabItem label={tab.label} showWarningIcon={tab.aksjonspunkt === aktivtAksjonspunkt?.definisjon?.kode} />
          ),
          aktiv: activeTab === index,
        }))}
        onChange={(e, clickedIndex) => setActiveTab(clickedIndex)}
      />
      {activeTab === 0 && <GjennomgaaOpplaeringOversikt />}
      {activeTab === 1 && <ReisetidOversikt />}
      {activeTab === 2 && <NoedvendighetOversikt />}
    </NestedIntlProvider>
  );
};

export default OpplaeringContainer;
