import { Vilkar, Aksjonspunkt, OpptjeningBehandling, Opptjening, SubmitCallback } from '@k9-sak-web/types';
import SideMenu from '@navikt/nap-side-menu';
import classNames from 'classnames/bind';
import React from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';
import messages from '../i18n/nb_NO.json';
import OpptjeningVilkarForm from './components/OpptjeningVilkarForm';
import styles from './opptjeningVilkarProsessIndex.less';

const cx = classNames.bind(styles);

const cache = createIntlCache();

const intl = createIntl(
  {
    locale: 'nb-NO',
    messages,
  },
  cache,
);

interface OpptjeningVilkarProsessIndexProps {
  vilkar: Vilkar[];
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
  vilkar,
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
  const [activeVilkår] = vilkar;
  const skalBrukeSidemeny = activeVilkår.perioder.length > 1;

  const { behandlingsresultat } = behandling;
  const vilkårsresultat = behandlingsresultat?.vilkårResultat?.OPPTJENINGSVILKÅRET;

  const [activeTab, setActiveTab] = React.useState(0);

  const mainContainerClassnames = cx('mainContainer', { 'mainContainer--withSideMenu': skalBrukeSidemeny });

  return (
    <RawIntlProvider value={intl}>
      <div className={mainContainerClassnames}>
        {skalBrukeSidemeny && (
          <div className={styles.sideMenuContainer}>
            <SideMenu
              links={activeVilkår.perioder.map((periode, index) => ({
                active: activeTab === index,
                label: `${intl.formatMessage({ id: 'Sidemeny.Opptjeningsperiode' })} ${index + 1}`,
              }))}
              onClick={setActiveTab}
              theme="arrow"
            />
          </div>
        )}
        <div className={styles.contentContainer}>
          <OpptjeningVilkarForm
            behandlingId={behandling.id}
            behandlingVersjon={behandling.versjon}
            vilkårsresultat={vilkårsresultat ? vilkårsresultat[activeTab] : null}
            status={status}
            lovReferanse={lovReferanse}
            aksjonspunkter={aksjonspunkter}
            submitCallback={submitCallback}
            readOnly={isReadOnly}
            isAksjonspunktOpen={isAksjonspunktOpen}
            readOnlySubmitButton={readOnlySubmitButton}
            vilkårPerioder={activeVilkår.perioder}
            periodeIndex={activeTab}
            opptjeninger={opptjening.opptjeninger}
          />
        </div>
      </div>
    </RawIntlProvider>
  );
};

export default OpptjeningVilkarProsessIndex;
