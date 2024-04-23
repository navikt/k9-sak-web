import { FaktaOpplaeringContext } from '@k9-sak-web/behandling-opplaeringspenger/src/FaktaOpplaeringContext';
import { WarningIcon } from '@navikt/ft-plattform-komponenter';
import classnames from 'classnames';
import TabsPure from 'nav-frontend-tabs';
import React, { useContext, useState } from 'react';
import { Aksjonspunkt } from '@k9-sak-web/types';
import { NestedIntlProvider } from '@fpsak-frontend/shared-components';
import Tabs from './Tabs';
import GjennomgaaOpplaeringOversikt from './gjennomgaaOpplaering/GjennomgaaOpplaeringOversikt';
import messages from './i18n/nb_NO.json';
import NoedvendighetOversikt from './noedvendighet/NoedvendighetOversikt';
import styles from './opplaeringContainer.module.css';
import ReisetidOversikt from './reisetid/ReisetidOversikt';

interface TabItemProps {
  label: string;
  showWarningIcon: boolean;
}

const findInitialTabIndex = (aktivtAksjonspunkt: Aksjonspunkt) => {
  const initialTab = Object.values(Tabs).find(tab => tab.aksjonspunkt === aktivtAksjonspunkt?.definisjon);
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

  const aktivtAksjonspunkt = aksjonspunkter
    .sort((a, b) => a.definisjon.localeCompare(b.definisjon))
    .find(aksjonspunkt => aksjonspunkt.status === 'OPPR');
  const [activeTab, setActiveTab] = useState(findInitialTabIndex(aktivtAksjonspunkt));
  return (
    <NestedIntlProvider messages={messages}>
      <TabsPure
        kompakt
        tabs={Object.values(Tabs).map((tab, index) => ({
          label: <TabItem label={tab.label} showWarningIcon={tab.aksjonspunkt === aktivtAksjonspunkt?.definisjon} />,
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
