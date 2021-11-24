import React, { useState, useEffect } from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';
import { Fagsak, Aksjonspunkt, Vilkar, OpptjeningBehandling, Opptjening, SubmitCallback } from '@k9-sak-web/types';
import { SideMenu } from '@navikt/k9-react-components';
import { dateFormat } from '@fpsak-frontend/utils';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import advarselIcon from '@fpsak-frontend/assets/images/advarsel.svg';
import classNames from 'classnames/bind';

import OpptjeningVilkarForm from './components/OpptjeningVilkarForm';

import messages from '../i18n/nb_NO.json';

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
  fagsak: Fagsak;
  behandling: OpptjeningBehandling;
  opptjening: { opptjeninger: Opptjening[] };
  aksjonspunkter: Aksjonspunkt[];
  vilkar: Vilkar[];
  status: string;
  lovReferanse?: string;
  submitCallback: (props: SubmitCallback[]) => void;
  isReadOnly: boolean;
  isAksjonspunktOpen: boolean;
  readOnlySubmitButton: boolean;
  visAllePerioder: boolean;
}

const OpptjeningVilkarProsessIndex = ({
  fagsak,
  behandling,
  opptjening,
  aksjonspunkter,
  vilkar,
  status,
  lovReferanse,
  submitCallback,
  isReadOnly,
  isAksjonspunktOpen,
  readOnlySubmitButton,
  visAllePerioder,
}: OpptjeningVilkarProsessIndexProps) => {
  const [activeTab, setActiveTab] = useState(0);

  const [activeVilkår] = vilkar;
  const skalBrukeSidemeny = activeVilkår.perioder.length > 1;
  const perioder = activeVilkår.perioder.filter(periode => visAllePerioder && !periode.vurdersIBehandlingen
    || !visAllePerioder && periode.vurdersIBehandlingen);
  const mainContainerClassnames = cx('mainContainer', { 'mainContainer--withSideMenu': skalBrukeSidemeny });

  useEffect(() => {
    if (!visAllePerioder && activeTab >= perioder.length) {
      setActiveTab(0);
    }
  }, [activeTab, visAllePerioder]);

  return (
    <RawIntlProvider value={intl}>
      <div className={mainContainerClassnames}>
        {skalBrukeSidemeny && (
          <div className={styles.sideMenuContainer}>
            <SideMenu
              links={perioder.map(({ periode, vilkarStatus }, index) => ({
                active: activeTab === index,
                label: `${dateFormat(periode.fom)} - ${dateFormat(periode.tom)}`,
                iconSrc:
                  isAksjonspunktOpen && vilkarStatus.kode === vilkarUtfallType.IKKE_VURDERT ? advarselIcon : null,
              }))}
              onClick={setActiveTab}
              theme="arrow"
              heading={intl.formatMessage({ id: 'Sidemeny.Perioder' })}
            />
          </div>
        )}
        <div className={styles.contentContainer}>
          <OpptjeningVilkarForm
            behandlingId={behandling.id}
            behandlingVersjon={behandling.versjon}
            status={status}
            lovReferanse={lovReferanse}
            fagsakType={fagsak.sakstype.kode}
            aksjonspunkter={aksjonspunkter}
            submitCallback={submitCallback}
            readOnly={isReadOnly}
            isAksjonspunktOpen={isAksjonspunktOpen}
            readOnlySubmitButton={readOnlySubmitButton}
            vilkårPerioder={activeVilkår.perioder}
            periodeIndex={activeTab}
            opptjeninger={opptjening?.opptjeninger}
          />
        </div>
      </div>
    </RawIntlProvider>
  );
};

export default OpptjeningVilkarProsessIndex;
