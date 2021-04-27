import { dateFormat } from '@fpsak-frontend/utils';
import { Aksjonspunkt, Behandling, KodeverkMedNavn, SubmitCallback, Vilkar } from '@k9-sak-web/types';
import SideMenu from '@navikt/nap-side-menu';
import classNames from 'classnames/bind';
import React, { SetStateAction } from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';
import messages from '../i18n/nb_NO.json';
import VilkarresultatMedOverstyringForm from './components/VilkarresultatMedOverstyringForm';
import VilkarresultatMedOverstyringHeader from './components/VilkarresultatMedOverstyringHeader';
import styles from './vilkarresultatMedOverstyringProsessIndex.less';

const cx = classNames.bind(styles);

const cache = createIntlCache();

const intl = createIntl(
  {
    locale: 'nb-NO',
    messages,
  },
  cache,
);

interface VilkarresultatMedOverstyringProsessIndexProps {
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
  overstyringApKode: string;
  erMedlemskapsPanel: boolean;
  vilkar: Vilkar[];
}

const VilkarresultatMedOverstyringProsessIndex = ({
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
  overstyringApKode,
  lovReferanse,
  erMedlemskapsPanel,
  vilkar,
}: VilkarresultatMedOverstyringProsessIndexProps) => {
  const [activeVilkår] = vilkar;

  const skalBrukeSidemeny = activeVilkår.perioder.length > 1;
  const perioderSomSkalVurderes = activeVilkår.perioder.filter(periode => periode.vurdersIBehandlingen);
  const perioderSomIkkeSkalVurderes = activeVilkår.perioder.filter(periode => !periode.vurdersIBehandlingen);
  const harPerioderSomErVurdert =
    skalBrukeSidemeny && activeVilkår.perioder.some(periode => !periode.vurdersIBehandlingen);

  const [activeTab, setActiveTab] = React.useState(
    harPerioderSomErVurdert
      ? Math.max(
          activeVilkår.perioder.findIndex(periode => periode.vurdersIBehandlingen),
          0,
        )
      : 0,
  );
  const activePeriode = activeVilkår.perioder[activeTab];
  const mainContainerClassnames = cx('mainContainer', { 'mainContainer--withSideMenu': skalBrukeSidemeny });

  return (
    <RawIntlProvider value={intl}>
      <div className={mainContainerClassnames}>
        {skalBrukeSidemeny && (
          <div className={styles.sideMenuContainer}>
            <SideMenu
              links={perioderSomSkalVurderes.map((periode, index) => ({
                active: activeTab === index,
                label: `${dateFormat(periode.periode.fom)} - ${dateFormat(periode.periode.tom)}`,
              }))}
              onClick={setActiveTab}
              theme="arrow"
              heading={intl.formatMessage({ id: 'Sidemeny.Perioder' })}
            />
            {perioderSomIkkeSkalVurderes.length > 0 && (
              <SideMenu
                links={perioderSomIkkeSkalVurderes.map((periode, index) => ({
                  active: activeTab === index + perioderSomSkalVurderes.length,
                  label: `${dateFormat(periode.periode.fom)} - ${dateFormat(periode.periode.tom)}`,
                }))}
                onClick={index => {
                  setActiveTab(index + perioderSomSkalVurderes.length);
                }}
                theme="arrow"
                heading={intl.formatMessage({ id: 'Sidemeny.PerioderVurdert' })}
              />
            )}
          </div>
        )}
        <div className={styles.contentContainer}>
          <VilkarresultatMedOverstyringHeader
            aksjonspunkter={aksjonspunkter}
            erOverstyrt={erOverstyrt}
            kanOverstyreAccess={kanOverstyreAccess}
            lovReferanse={activeVilkår.lovReferanse ?? lovReferanse}
            overrideReadOnly={overrideReadOnly}
            overstyringApKode={overstyringApKode}
            panelTittelKode={panelTittelKode}
            status={activePeriode.vilkarStatus.kode}
            toggleOverstyring={toggleOverstyring}
          />
          <VilkarresultatMedOverstyringForm
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
            overstyringApKode={overstyringApKode}
            lovReferanse={activeVilkår.lovReferanse ?? lovReferanse}
            erMedlemskapsPanel={erMedlemskapsPanel}
            avslagKode={activePeriode.avslagKode}
            periode={activePeriode}
          />
        </div>
      </div>
    </RawIntlProvider>
  );
};

VilkarresultatMedOverstyringProsessIndex.defaultProps = {
  lovReferanse: '',
  medlemskap: {},
};

export default VilkarresultatMedOverstyringProsessIndex;
