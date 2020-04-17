import { Aksjonspunkt, Opptjening, OpptjeningBehandling, SubmitCallback } from '@k9-sak-web/types';
import { TabsPure } from 'nav-frontend-tabs';
import React from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';
import messages from '../i18n/nb_NO.json';
import OpptjeningVilkarForm from './components/OpptjeningVilkarForm';
import styles from './opptjeningVilkarProsessIndex.less';

const cache = createIntlCache();

const intl = createIntl(
  {
    locale: 'nb-NO',
    messages,
  },
  cache,
);

interface OpptjeningVilkarProsessIndexProps {
  behandling: OpptjeningBehandling;
  opptjening: { opptjeninger: Opptjening[] };
  aksjonspunkter: Aksjonspunkt[];
  status: string;
  lovReferanse?: string;
  submitCallback: (props: SubmitCallback[]) => void;
  isReadOnly: boolean;
  isAksjonspunktOpen: boolean;
  readOnlySubmitButton: boolean;
}

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
}: OpptjeningVilkarProsessIndexProps) => {
  const [activeTab, setActiveTab] = React.useState(0);
  const activeOpptjeningObject = opptjening.opptjeninger[activeTab];
  const { behandlingsresultat } = behandling;
  const vilkarsresultat = behandlingsresultat?.vilkårResultat?.OPPTJENINGSVILKÅRET;
  return (
    <RawIntlProvider value={intl}>
      <TabsPure
        tabs={opptjening.opptjeninger.map((currentPeriode, currentPeriodeIndex) => ({
          aktiv: activeTab === currentPeriodeIndex,
          label: `Opptjeningsperiode ${currentPeriodeIndex + 1}`,
        }))}
        onChange={(e, clickedIndex) => setActiveTab(clickedIndex)}
      />
      <div className={styles.tabContainer}>
        <OpptjeningVilkarForm
          behandlingId={behandling.id}
          behandlingVersjon={behandling.versjon}
          vilkarsresultat={vilkarsresultat ? vilkarsresultat[activeTab] : null}
          fastsattOpptjening={activeOpptjeningObject.fastsattOpptjening}
          status={status}
          lovReferanse={lovReferanse}
          aksjonspunkter={aksjonspunkter}
          submitCallback={submitCallback}
          readOnly={isReadOnly}
          isAksjonspunktOpen={isAksjonspunktOpen}
          readOnlySubmitButton={readOnlySubmitButton}
          tabIndex={activeTab}
        />
      </div>
    </RawIntlProvider>
  );
};

export default OpptjeningVilkarProsessIndex;
