import { aksjonspunktkodeDefinisjonType } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktkodeDefinisjon.js';
import { aksjonspunktStatus } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktStatus.js';
import { vilkårStatus } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/VilkårStatus.js';
import { initializeDate } from '@k9-sak-web/lib/dateUtils/initializeDate.js';
import { CheckmarkCircleFillIcon, XMarkOctagonFillIcon } from '@navikt/aksel-icons';
import { SideMenu } from '@navikt/ft-plattform-komponenter';
import { Dayjs } from 'dayjs';
import { useEffect, useState, type SetStateAction } from 'react';
import { hentAktivePerioderFraVilkar } from '../../utils/hentAktivePerioderFraVilkar';
import SoknadsfristVilkarForm from './components/SoknadsfristVilkarForm';
import SoknadsfristVilkarHeader from './components/SoknadsfristVilkarHeader';
import styles from './SoknadsfristVilkarProsessIndex.module.css';
import type { SoknadsfristAksjonspunktType } from './types/SoknadsfristAksjonspunktType';
import type { SoknadsfristVilkarType } from './types/SoknadsfristVilkarType';
import type { SubmitData } from './types/submitCallback';
import type { SøknadsfristTilstand } from './types/SøknadsfristTilstand';
import { formatDate, utledInnsendtSoknadsfrist } from './utils';
import AksjonspunktIkon from '../../shared/aksjonspunkt-ikon/AksjonspunktIkon';

const lovReferanse = '§ 22-13';

interface SoknadsfristVilkarProsessIndexProps {
  aksjonspunkter: SoknadsfristAksjonspunktType[];
  submitCallback: (props: SubmitData[]) => void;
  overrideReadOnly: boolean;
  kanOverstyreAccess: {
    employeeHasAccess: boolean;
    isEnabled: boolean;
  };
  toggleOverstyring: (overstyrtPanel: SetStateAction<string[]>) => void;
  erOverstyrt: boolean;
  panelTittelKode: string;
  vilkar: SoknadsfristVilkarType[];
  visAllePerioder: boolean;
  soknadsfristStatus: SøknadsfristTilstand;
  kanEndrePåSøknadsopplysninger: boolean;
}

// Finner ut om Statusperiode gjelder for vilkårsperiode
const erRelevantForPeriode = (
  vilkårPeriodeFom: Dayjs | null,
  vilkårPeriodeTom: Dayjs | null,
  statusPeriodeFom: Dayjs | null,
  statusPeriodeTom: Dayjs | null,
  innsendtDato?: string | null,
) => {
  if (!vilkårPeriodeFom || !vilkårPeriodeTom || !statusPeriodeFom || !statusPeriodeTom || !innsendtDato) {
    return false;
  }
  // er starten av vilkårsperioden før opprinnelig søkndasfrist
  const erAktuellForPerioden = utledInnsendtSoknadsfrist(innsendtDato, false) > vilkårPeriodeFom;
  // overlapper vilkårsperioden med statusperioden fra dokumentet
  const overlapperPerioder = vilkårPeriodeFom <= statusPeriodeTom && vilkårPeriodeTom >= statusPeriodeFom;
  return erAktuellForPerioden && overlapperPerioder;
};

const SoknadsfristVilkarProsessIndex = ({
  aksjonspunkter,
  submitCallback,
  overrideReadOnly,
  kanOverstyreAccess,
  toggleOverstyring,
  erOverstyrt,
  panelTittelKode,
  vilkar,
  visAllePerioder,
  soknadsfristStatus,
  kanEndrePåSøknadsopplysninger,
}: SoknadsfristVilkarProsessIndexProps) => {
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

  if (perioder.length === 0) {
    return null;
  }
  const activePeriode = perioder.length === 1 ? perioder[0] : perioder[activeTab];

  const harÅpentUløstAksjonspunkt = aksjonspunkter.some(
    ap =>
      ap.definisjon === aksjonspunktkodeDefinisjonType.KONTROLLER_OPPLYSNINGER_OM_SØKNADSFRIST &&
      ap.status === aksjonspunktStatus.OPPRETTET &&
      ap.kanLoses,
  );

  const dokumenterSomSkalVurderes = Array.isArray(soknadsfristStatus?.dokumentStatus)
    ? soknadsfristStatus.dokumentStatus.filter(dok =>
        dok.status?.some(status => {
          const erOppfyllt = status.status === vilkårStatus.OPPFYLT;
          const avklartEllerOverstyrt = dok.overstyrteOpplysninger || dok.avklarteOpplysninger;

          if (erOppfyllt && !avklartEllerOverstyrt) {
            return false;
          }

          const statusPeriodeFom = status.periode.fom ? initializeDate(status.periode.fom) : null;
          const statusPeriodeTom = status.periode.tom ? initializeDate(status.periode.tom) : null;

          return perioder.some(vilkårPeriode => {
            const vilkårPeriodeFom = vilkårPeriode.periode.fom ? initializeDate(vilkårPeriode.periode.fom) : null;
            const vilkårPeriodeTom = vilkårPeriode.periode.tom ? initializeDate(vilkårPeriode.periode.tom) : null;
            return erRelevantForPeriode(
              vilkårPeriodeFom,
              vilkårPeriodeTom,
              statusPeriodeFom,
              statusPeriodeTom,
              dok.innsendingstidspunkt,
            );
          });
        }),
      )
    : [];

  const activePeriodeFom = activePeriode?.periode.fom ? initializeDate(activePeriode.periode.fom) : null;
  const activePeriodeTom = activePeriode?.periode.tom ? initializeDate(activePeriode.periode.tom) : null;

  const dokumenterIAktivPeriode = dokumenterSomSkalVurderes.filter(dok =>
    dok.status?.some(status => {
      const statusPeriodeFom = status.periode.fom ? initializeDate(status.periode.fom) : null;
      const statusPeriodeTom = status.periode.tom ? initializeDate(status.periode.tom) : null;
      return erRelevantForPeriode(
        activePeriodeFom,
        activePeriodeTom,
        statusPeriodeFom,
        statusPeriodeTom,
        dok.innsendingstidspunkt,
      );
    }),
  );

  return (
    <div className={styles.mainContainerWithSideMenu}>
      <div className={styles.sideMenuContainer}>
        <SideMenu
          links={perioder.map(({ periode, vilkarStatus }, index) => ({
            active: activeTab === index,
            label:
              periode.fom && periode.tom
                ? `${formatDate(periode.fom)} - ${formatDate(periode.tom)}`
                : `Periode ${index + 1}`,
            icon: (function () {
              if (erOverstyrt || harÅpentUløstAksjonspunkt) {
                return <AksjonspunktIkon size="small" />;
              }
              if (vilkarStatus === vilkårStatus.OPPFYLT) {
                return <CheckmarkCircleFillIcon style={{ color: 'var(--a-surface-success)' }} />;
              }
              if (vilkarStatus === vilkårStatus.IKKE_OPPFYLT) {
                return <XMarkOctagonFillIcon style={{ color: 'var(--a-surface-danger)' }} />;
              }
              return null;
            })(),
          }))}
          onClick={setActiveTab}
          heading="Perioder"
        />
      </div>
      {activePeriode && (
        <div className={styles.contentContainer}>
          <SoknadsfristVilkarHeader
            aksjonspunkter={aksjonspunkter}
            erOverstyrt={erOverstyrt}
            kanOverstyreAccess={kanOverstyreAccess}
            lovReferanse={activeVilkår?.lovReferanse ?? lovReferanse}
            overrideReadOnly={overrideReadOnly || dokumenterSomSkalVurderes.length === 0}
            overstyringApKode={aksjonspunktkodeDefinisjonType.OVERSTYR_SOKNADSFRISTVILKAR}
            panelTittelKode={panelTittelKode}
            status={activePeriode.vilkarStatus}
            toggleOverstyring={toggleOverstyring}
          />
          <SoknadsfristVilkarForm
            aksjonspunkter={aksjonspunkter}
            harÅpentAksjonspunkt={harÅpentUløstAksjonspunkt}
            erOverstyrt={erOverstyrt}
            submitCallback={submitCallback}
            overrideReadOnly={overrideReadOnly}
            toggleOverstyring={toggleOverstyring}
            status={activePeriode.vilkarStatus}
            alleDokumenter={dokumenterSomSkalVurderes}
            dokumenterIAktivPeriode={dokumenterIAktivPeriode}
            periode={activePeriode}
            kanEndrePåSøknadsopplysninger={kanEndrePåSøknadsopplysninger}
          />
        </div>
      )}
    </div>
  );
};

export default SoknadsfristVilkarProsessIndex;
