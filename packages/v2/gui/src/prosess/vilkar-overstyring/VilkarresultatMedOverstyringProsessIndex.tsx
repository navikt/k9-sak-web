import type {
  AksjonspunktDto,
  BehandlingDto,
  VilkårMedPerioderDto,
  VilkårPeriodeDto,
} from '@k9-sak-web/backend/k9sak/generated';
import { vilkårStatus } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/VilkårStatus.js';
import { dateStringSorter, formatDate } from '@k9-sak-web/lib/dateUtils/dateUtils.js';
import { SideMenu } from '@navikt/ft-plattform-komponenter';
import { useEffect, useState, type SetStateAction } from 'react';
import VilkarresultatMedOverstyringFormPeriodisert from './components-periodisert/VilkarresultatMedOverstyringFormPeriodisert';
import VilkarresultatMedOverstyringHeader from './components-periodisert/VilkarresultatMedOverstyringHeader';
import styles from './vilkarresultatMedOverstyringProsessIndex.module.css';
import { CheckmarkCircleFillIcon, XMarkOctagonFillIcon } from '@navikt/aksel-icons';
import AksjonspunktIkon from '../../shared/aksjonspunkt-ikon/AksjonspunktIkon';
import { aksjonspunktStatus } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktStatus.js';

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

const getIconForVilkarStatus = (vilkarStatus: string, harAktivtAksjonspunkt: boolean) => {
  if (vilkarStatus === vilkårStatus.OPPFYLT) {
    return <CheckmarkCircleFillIcon style={{ color: 'var(--a-surface-success)' }} />;
  }
  if (vilkarStatus === vilkårStatus.IKKE_OPPFYLT) {
    return <XMarkOctagonFillIcon style={{ color: 'var(--a-surface-danger)' }} />;
  }
  if (vilkarStatus === vilkårStatus.IKKE_VURDERT && harAktivtAksjonspunkt) {
    return <AksjonspunktIkon size="small" />;
  }
  return null;
};

export interface VilkarresultatMedOverstyringProsessIndexProps {
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
  lovReferanse?: string;
  erOverstyrt: boolean;
  /** Skal være den faktiske teksten og ikke en id til react-intl */
  panelTittelKode: string;
  overstyringApKode: string;
  erMedlemskapsPanel: boolean;
  visPeriodisering: boolean;
  vilkar: VilkårMedPerioderDto[];
  visAllePerioder: boolean;
}

export const VilkarresultatMedOverstyringProsessIndex = ({
  behandling,
  medlemskap = { fom: '' },
  aksjonspunkter,
  submitCallback,
  overrideReadOnly,
  kanOverstyreAccess,
  toggleOverstyring,
  erOverstyrt,
  panelTittelKode,
  overstyringApKode,
  lovReferanse = '',
  erMedlemskapsPanel,
  visPeriodisering,
  vilkar,
  visAllePerioder,
}: VilkarresultatMedOverstyringProsessIndexProps) => {
  const [activeTab, setActiveTab] = useState(0);

  const harAktivtAksjonspunkt = aksjonspunkter.some(
    aksjonspunkt => aksjonspunkt.status === aksjonspunktStatus.OPPRETTET,
  );
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

  if (!activePeriode || !activeVilkår) {
    return null;
  }

  return (
    <div className={styles.mainContainerWithSideMenu}>
      <div className={styles.sideMenuContainer}>
        <SideMenu
          links={perioder.map((periode, index) => ({
            active: activeTab === index,
            label: `${periode.periode.fom && formatDate(periode.periode.fom)} - ${periode.periode.tom && formatDate(periode.periode.tom)}`,
            icon: getIconForVilkarStatus(periode.vilkarStatus, harAktivtAksjonspunkt),
          }))}
          onClick={setActiveTab}
          heading="Perioder"
        />
      </div>
      <div>
        <VilkarresultatMedOverstyringHeader
          aksjonspunkter={aksjonspunkter}
          erOverstyrt={erOverstyrt}
          kanOverstyreAccess={kanOverstyreAccess}
          lovReferanse={activeVilkår.lovReferanse ?? lovReferanse}
          overrideReadOnly={overrideReadOnly}
          overstyringApKode={overstyringApKode}
          panelTittelKode={panelTittelKode}
          periode={activePeriode}
          toggleOverstyring={toggleOverstyring}
        />
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
          innvilgelseMerknadKode={
            activePeriode.vilkarStatus === vilkårStatus.OPPFYLT ? activePeriode?.merknad : undefined
          }
          periode={activePeriode}
          vilkarType={activeVilkår.vilkarType}
          relevanteInnvilgetMerknader={activeVilkår.relevanteInnvilgetMerknader}
        />
      </div>
    </div>
  );
};

export default VilkarresultatMedOverstyringProsessIndex;
