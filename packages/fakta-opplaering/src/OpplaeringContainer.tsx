import React, { useContext, useState } from 'react';
import classnames from 'classnames';
import TabsPure from 'nav-frontend-tabs';
import { WarningIcon } from '@navikt/ft-plattform-komponenter';
import { FaktaOpplaeringContext } from '@k9-sak-web/behandling-opplaeringspenger/src/panelDefinisjoner/faktaPaneler/OpplaeringFaktaPanelDef';
import Tabs from './Tabs';
import styles from './opplaeringContainer.modules.css';
import GjennomgaaOpplaeringIndex from './gjennomgaaOpplaering/GjennomgaaOpplaeringIndex';

interface TabItemProps {
  label: string;
  showWarningIcon: boolean;
}

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
  const [activeTab, setActiveTab] = useState(0);
  return (
    <>
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
      {activeTab === 0 && <GjennomgaaOpplaeringIndex />}
    </>
  );
};

export default OpplaeringContainer;
