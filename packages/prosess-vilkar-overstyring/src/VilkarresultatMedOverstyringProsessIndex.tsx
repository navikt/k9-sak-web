import { dateFormat } from '@fpsak-frontend/utils';
import { Aksjonspunkt, Behandling, Kodeverk, SubmitCallback, Vilkar } from '@k9-sak-web/types';
import { TabsPure } from 'nav-frontend-tabs';
import React, { SetStateAction } from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';
import messages from '../i18n/nb_NO.json';
import VilkarresultatMedOverstyringForm from './components/VilkarresultatMedOverstyringForm';
import VilkarresultatMedOverstyringHeader from './components/VilkarresultatMedOverstyringHeader';
import styles from './vilkarresultatMedOverstyringProsessIndex.less';

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
  medlemskap: {
    fom: string;
  };
  aksjonspunkter: Aksjonspunkt[];
  submitCallback: (props: SubmitCallback[]) => void;
  overrideReadOnly: boolean;
  kanOverstyreAccess: {
    isEnabled: boolean;
  };
  toggleOverstyring: (overstyrtPanel: SetStateAction<string[]>) => void;
  avslagsarsaker: Kodeverk[];
  lovReferanse: string;
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
  const [activeTab, setActiveTab] = React.useState(0);
  const activeVilkår = vilkar[0];
  const activePeriode = activeVilkår.perioder[activeTab];

  return (
    <RawIntlProvider value={intl}>
      {activeVilkår.perioder.length > 1 && (
        <TabsPure
          tabs={vilkar[0].perioder.map((currentPeriode, currentPeriodeIndex) => ({
            aktiv: activeTab === currentPeriodeIndex,
            label: `Perioden ${dateFormat(activeVilkår.perioder[currentPeriodeIndex].periode.fom)} - ${dateFormat(
              activeVilkår.perioder[currentPeriodeIndex].periode.tom,
            )}`,
          }))}
          onChange={(e, clickedIndex) => {
            setActiveTab(clickedIndex);
            toggleOverstyring(oldArray => oldArray.filter(code => code !== overstyringApKode));
          }}
        />
      )}
      <div className={styles.tabContainer}>
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
          key={`${activePeriode.periode.fom}-${activePeriode.periode.tom}`}
          behandlingId={behandling.id}
          behandlingVersjon={behandling.versjon}
          behandlingType={behandling.type}
          behandlingsresultat={behandling.behandlingsresultat}
          medlemskapFom={medlemskap.fom}
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
          periodeFom={activePeriode.periode.fom}
          periodeTom={activePeriode.periode.tom}
          avslagKode={activePeriode.avslagKode}
        />
      </div>
    </RawIntlProvider>
  );
};

VilkarresultatMedOverstyringProsessIndex.defaultProps = {
  lovReferanse: '',
  medlemskap: {},
};

export default VilkarresultatMedOverstyringProsessIndex;
