import type {
  AksjonspunktDto,
  BehandlingDto,
  VilkårMedPerioderDto,
  VilkårPeriodeDto,
} from '@k9-sak-web/backend/k9sak/generated';
import { vilkårStatus } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/VilkårStatus.js';
import { dateStringSorter, formatDate } from '@k9-sak-web/lib/dateUtils/dateUtils.js';
import type { FeatureToggles } from '@k9-sak-web/lib/kodeverk/types/FeatureTogglesType.js';
import { SideMenu } from '@navikt/ft-plattform-komponenter';
import classNames from 'classnames/bind';
import { useEffect, useState, type SetStateAction } from 'react';
import { RawIntlProvider, createIntl, createIntlCache } from 'react-intl';
import VilkarresultatMedOverstyringFormPeriodisert from './components-periodisert/VilkarresultatMedOverstyringFormPeriodisert';
import VilkarresultatMedOverstyringForm from './components/VilkarresultatMedOverstyringForm';
import VilkarresultatMedOverstyringHeader from './components/VilkarresultatMedOverstyringHeader';
import styles from './vilkarresultatMedOverstyringProsessIndex.module.css';

const cx = classNames.bind(styles);

const cache = createIntlCache();

const intl = createIntl(
  {
    locale: 'nb-NO',
  },
  cache,
);

const hentAktivePerioderFraVilkar = (vilkar: VilkårMedPerioderDto[], visAllePerioder: boolean): VilkårPeriodeDto[] => {
  const [activeVilkår] = vilkar;

  if (!activeVilkår?.perioder) {
    return [];
  }

  return activeVilkår.perioder
    .filter(
      periode =>
        (visAllePerioder && !periode.vurderesIBehandlingen) || (periode.vurderesIBehandlingen && !visAllePerioder),
    )
    .sort((a, b) => (a.periode.fom && b.periode.fom ? dateStringSorter(a.periode.fom, b.periode.fom) : 0))
    .reverse();
};

interface VilkarresultatMedOverstyringProsessIndexProps {
  behandling: BehandlingDto;
  medlemskap?: {
    fom: string;
  };
  aksjonspunkter: AksjonspunktDto[];
  submitCallback: (props: any[]) => void;
  overrideReadOnly: boolean;
  kanOverstyreAccess: {
    isEnabled: boolean;
  };
  toggleOverstyring: (overstyrtPanel: SetStateAction<string[]>) => void;
  // avslagsarsaker: KodeverkMedNavn[];
  lovReferanse?: string;
  erOverstyrt: boolean;
  panelTittelKode: string;
  overstyringApKode: string;
  erMedlemskapsPanel: boolean;
  visPeriodisering: boolean;
  vilkar: VilkårMedPerioderDto[];
  visAllePerioder: boolean;
  featureToggles: FeatureToggles;
}

const VilkarresultatMedOverstyringProsessIndex = ({
  behandling,
  medlemskap = { fom: '' },
  aksjonspunkter,
  submitCallback,
  overrideReadOnly,
  kanOverstyreAccess,
  toggleOverstyring,
  // avslagsarsaker,
  erOverstyrt,
  panelTittelKode,
  overstyringApKode,
  lovReferanse = '',
  erMedlemskapsPanel,
  visPeriodisering,
  vilkar,
  visAllePerioder,
  featureToggles,
}: VilkarresultatMedOverstyringProsessIndexProps) => {
  const [activeTab, setActiveTab] = useState(0);

  const [activeVilkår] = vilkar;
  const perioder = hentAktivePerioderFraVilkar(vilkar, visAllePerioder);

  useEffect(() => {
    if (!visAllePerioder && activeTab >= perioder.length) {
      setActiveTab(0);
    }
  }, [activeTab, visAllePerioder]);

  useEffect(() => {
    if (perioder.length > 1) {
      const førsteIkkeVurdertPeriodeIndex = perioder.findIndex(
        periode => periode.vurderesIBehandlingen && periode.vilkarStatus === vilkårStatus.IKKE_VURDERT,
      );
      if (førsteIkkeVurdertPeriodeIndex > 0) {
        setActiveTab(førsteIkkeVurdertPeriodeIndex);
      }
    }
  }, []);

  const activePeriode = perioder.length === 1 ? perioder[0] : perioder[activeTab];

  if (!activePeriode) {
    return null;
  }

  return (
    <RawIntlProvider value={intl}>
      <div className={cx('mainContainer--withSideMenu')}>
        <div className={styles.sideMenuContainer}>
          <SideMenu
            links={perioder.map((periode, index) => ({
              active: activeTab === index,
              label: `${periode.periode.fom && formatDate(periode.periode.fom)} - ${periode.periode.tom && formatDate(periode.periode.tom)}`,
            }))}
            onClick={setActiveTab}
            theme="arrow"
            heading={intl.formatMessage({ id: 'Sidemeny.Perioder' })}
          />
        </div>
        <div className={styles.contentContainer}>
          <VilkarresultatMedOverstyringHeader
            aksjonspunkter={aksjonspunkter}
            erOverstyrt={erOverstyrt}
            kanOverstyreAccess={kanOverstyreAccess}
            lovReferanse={activeVilkår?.lovReferanse ?? lovReferanse}
            overrideReadOnly={overrideReadOnly}
            overstyringApKode={overstyringApKode}
            panelTittelKode={panelTittelKode}
            periode={activePeriode}
            toggleOverstyring={toggleOverstyring}
          />
          {featureToggles?.['OMSORGEN_FOR_PERIODISERT'] && (
            <VilkarresultatMedOverstyringFormPeriodisert
              key={`${activePeriode?.periode?.fom}-${activePeriode?.periode?.tom}`}
              behandlingType={behandling.type}
              medlemskapFom={medlemskap?.fom}
              aksjonspunkter={aksjonspunkter}
              submitCallback={submitCallback}
              overrideReadOnly={overrideReadOnly}
              toggleOverstyring={toggleOverstyring}
              status={activePeriode?.vilkarStatus ?? ''}
              erOverstyrt={erOverstyrt}
              overstyringApKode={overstyringApKode}
              erMedlemskapsPanel={erMedlemskapsPanel}
              visPeriodisering={visPeriodisering}
              avslagKode={activePeriode?.avslagKode ?? ''}
              periode={activePeriode}
            />
          )}

          {!featureToggles?.['OMSORGEN_FOR_PERIODISERT'] && (
            <VilkarresultatMedOverstyringForm
              key={`${activePeriode?.periode?.fom}-${activePeriode?.periode?.tom}`}
              behandlingType={behandling.type}
              medlemskapFom={medlemskap?.fom}
              aksjonspunkter={aksjonspunkter}
              submitCallback={submitCallback}
              overrideReadOnly={overrideReadOnly}
              toggleOverstyring={toggleOverstyring}
              status={activePeriode.vilkarStatus}
              erOverstyrt={erOverstyrt}
              overstyringApKode={overstyringApKode}
              erMedlemskapsPanel={erMedlemskapsPanel}
              avslagKode={activePeriode.avslagKode ?? ''}
              periode={activePeriode}
            />
          )}
        </div>
      </div>
    </RawIntlProvider>
  );
};

export default VilkarresultatMedOverstyringProsessIndex;
