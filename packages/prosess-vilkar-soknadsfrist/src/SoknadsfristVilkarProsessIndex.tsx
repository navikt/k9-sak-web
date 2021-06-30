import React, { SetStateAction, useState, useEffect } from 'react';
import { dateFormat } from '@fpsak-frontend/utils';
import { Aksjonspunkt, Behandling, KodeverkMedNavn, SubmitCallback, Vilkar } from '@k9-sak-web/types';
import { SideMenu } from '@navikt/k9-react-components';
import classNames from 'classnames/bind';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import messages from '../i18n/nb_NO.json';
import SoknadsfristVilkarForm from './components/SoknadsfristVilkarForm';
import SoknadsfristVilkarHeader from './components/SoknadsfristVilkarHeader';
import styles from './SoknadsfristVilkarProsessIndex.less';

const cx = classNames.bind(styles);

const cache = createIntlCache();

const intl = createIntl(
  {
    locale: 'nb-NO',
    messages,
  },
  cache,
);

interface SoknadsfristVilkarProsessIndexProps {
  behandling: Behandling;
  medlemskap?: {
    fom: string;
  };
  aksjonspunkter: Aksjonspunkt[];
  submitCallback: (props: SubmitCallback[]) => void;
  overrideReadOnly: boolean;
  kanOverstyreAccess: {
    isEnabled: boolean;
  };
  toggleOverstyring: (overstyrtPanel: SetStateAction<string[]>) => void;
  avslagsarsaker: KodeverkMedNavn[];
  lovReferanse?: string;
  erOverstyrt: boolean;
  panelTittelKode: string;
  vilkar: Vilkar[];
  visAllePerioder: boolean;
  soknadsfristStatus: any;
}

const SoknadsfristVilkarProsessIndex = ({
  behandling,
  medlemskap,
  aksjonspunkter,
  submitCallback,
  overrideReadOnly,
  kanOverstyreAccess,
  toggleOverstyring,
  avslagsarsaker,
  erOverstyrt,
  panelTittelKode,
  lovReferanse,
  vilkar,
  visAllePerioder,
  soknadsfristStatus,
}: SoknadsfristVilkarProsessIndexProps) => {
  const [activeTab, setActiveTab] = useState(0);

  const [activeVilkår] = vilkar;
  const skalBrukeSidemeny = activeVilkår.perioder.length > 1;
  const perioder = activeVilkår.perioder.filter(periode => visAllePerioder || periode.vurdersIBehandlingen);

  const activePeriode = activeVilkår.perioder[activeTab];
  const mainContainerClassnames = cx('mainContainer', { 'mainContainer--withSideMenu': skalBrukeSidemeny });

  useEffect(() => {
    if (!visAllePerioder && activeTab >= perioder.length) {
      setActiveTab(0);
    }
  }, [activeTab, visAllePerioder]);

  const dokument = soknadsfristStatus.dokumentStatus.filter(dok =>
    dok.status.some(
      status =>
        (activePeriode.periode.fom >= status.periode.fom && activePeriode.periode.fom <= status.periode.tom) ||
        (activePeriode.periode.tom >= status.periode.fom && activePeriode.periode.tom <= status.periode.tom),
    ),
  );

  return (
    <RawIntlProvider value={intl}>
      <div className={mainContainerClassnames}>
        {skalBrukeSidemeny && (
          <div className={styles.sideMenuContainer}>
            <SideMenu
              links={perioder.map((periode, index) => ({
                active: activeTab === index,
                label: `${dateFormat(periode.periode.fom)} - ${dateFormat(periode.periode.tom)}`,
              }))}
              onClick={setActiveTab}
              theme="arrow"
              heading={intl.formatMessage({ id: 'Sidemeny.Perioder' })}
            />
          </div>
        )}
        <div className={styles.contentContainer}>
          <SoknadsfristVilkarHeader
            aksjonspunkter={aksjonspunkter}
            erOverstyrt={erOverstyrt}
            kanOverstyreAccess={kanOverstyreAccess}
            lovReferanse={activeVilkår.lovReferanse ?? lovReferanse}
            overrideReadOnly={overrideReadOnly}
            overstyringApKode={aksjonspunktCodes.OVERSTYR_SOKNADSFRISTVILKAR}
            panelTittelKode={panelTittelKode}
            status={activePeriode.vilkarStatus.kode}
            toggleOverstyring={toggleOverstyring}
          />
          <SoknadsfristVilkarForm
            key={`${activePeriode.periode?.fom}-${activePeriode.periode?.tom}`}
            behandlingId={behandling.id}
            behandlingVersjon={behandling.versjon}
            behandlingType={behandling.type}
            behandlingsresultat={behandling.behandlingsresultat}
            medlemskapFom={medlemskap?.fom}
            aksjonspunkter={aksjonspunkter}
            submitCallback={submitCallback}
            overrideReadOnly={overrideReadOnly}
            kanOverstyreAccess={kanOverstyreAccess}
            toggleOverstyring={toggleOverstyring}
            avslagsarsaker={avslagsarsaker}
            status={activePeriode.vilkarStatus.kode}
            erOverstyrt={erOverstyrt}
            panelTittelKode={panelTittelKode}
            lovReferanse={activeVilkår.lovReferanse ?? lovReferanse}
            avslagKode={activePeriode.avslagKode}
            dokument={dokument}
            periode={activePeriode}
          />
        </div>
      </div>
    </RawIntlProvider>
  );
};

SoknadsfristVilkarProsessIndex.defaultProps = {
  lovReferanse: '',
  medlemskap: {},
};

export default SoknadsfristVilkarProsessIndex;
