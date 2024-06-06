import { FaktaOpplaeringContext } from '@k9-sak-web/behandling-opplaeringspenger/src/FaktaOpplaeringContext';
import { Tabs as DSTabs } from '@navikt/ds-react';
import { WarningIcon } from '@navikt/ft-plattform-komponenter';
import classnames from 'classnames';
import React, { useContext } from 'react';
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

const findInitialTab = (aktivtAksjonspunkt: Aksjonspunkt) => {
  const initialTab = Object.values(Tabs).find(tab => tab.aksjonspunkt === aktivtAksjonspunkt?.definisjon);
  return initialTab ? initialTab.label : Tabs.GJENNOMGÅ_OPPLÆRING.label;
};

const TabItem = ({ label, showWarningIcon }: TabItemProps) => {
  const cls = classnames(styles.medisinskVilkårTabItem, {
    [styles.medisinskVilkårTabItemExtended]: showWarningIcon,
  });
  return (
    <div className={cls}>
      {label}
      {showWarningIcon && <WarningIcon />}
    </div>
  );
};

const OpplaeringContainer = () => {
  const { aksjonspunkter } = useContext(FaktaOpplaeringContext);

  const aktivtAksjonspunkt = aksjonspunkter
    .sort((a, b) => a.definisjon.localeCompare(b.definisjon))
    .find(aksjonspunkt => aksjonspunkt.status === 'OPPR');
  return (
    <NestedIntlProvider messages={messages}>
      <DSTabs defaultValue={findInitialTab(aktivtAksjonspunkt)}>
        <DSTabs.List>
          {Object.values(Tabs).map(tab => (
            <DSTabs.Tab
              key={tab.label}
              value={tab.label}
              label={
                <TabItem label={tab.label} showWarningIcon={tab.aksjonspunkt === aktivtAksjonspunkt?.definisjon} />
              }
            />
          ))}
        </DSTabs.List>
        <DSTabs.Panel value={Tabs.GJENNOMGÅ_OPPLÆRING.label}>
          <GjennomgaaOpplaeringOversikt />
        </DSTabs.Panel>
        <DSTabs.Panel value={Tabs.REISETID.label}>
          <ReisetidOversikt />
        </DSTabs.Panel>
        <DSTabs.Panel value={Tabs.NØDVENDIGHET.label}>
          <NoedvendighetOversikt />
        </DSTabs.Panel>
      </DSTabs>
    </NestedIntlProvider>
  );
};

export default OpplaeringContainer;
