import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { initializeDate } from '@fpsak-frontend/utils';
import { Aksjonspunkt, DokumentStatus, SubmitCallback, Vilkar } from '@k9-sak-web/types';
import { ExclamationmarkTriangleFillIcon } from '@navikt/aksel-icons';
import { SideMenu } from '@navikt/ft-plattform-komponenter';
import { BehandlingDto } from '@navikt/k9-sak-typescript-client';
import classNames from 'classnames/bind';
import { Dayjs } from 'dayjs';
import { SetStateAction, useEffect, useState } from 'react';
import { RawIntlProvider, createIntl, createIntlCache } from 'react-intl';

import SoknadsfristVilkarForm from './components/SoknadsfristVilkarForm';
import SoknadsfristVilkarHeader from './components/SoknadsfristVilkarHeader';
import styles from './SoknadsfristVilkarProsessIndex.module.css';
import { formatDate, hentAktivePerioderFraVilkar, utledInnsendtSoknadsfrist } from './utils';

const cx = classNames.bind(styles);

const cache = createIntlCache();

const intl = createIntl(
  {
    locale: 'nb-NO',
  },
  cache,
);

const lovReferanse = '§ 22-13';

interface SoknadsfristVilkarProsessIndexProps {
  behandling: BehandlingDto;
  aksjonspunkter: Aksjonspunkt[];
  submitCallback: (props: SubmitCallback[]) => void;
  overrideReadOnly: boolean;
  kanOverstyreAccess: {
    isEnabled: boolean;
  };
  toggleOverstyring: (overstyrtPanel: SetStateAction<string[]>) => void;
  erOverstyrt: boolean;
  panelTittelKode: string;
  vilkar: Vilkar[];
  visAllePerioder: boolean;
  soknadsfristStatus: { dokumentStatus: DokumentStatus[] };
}

// Finner ut om Statusperiode gjelder for vilkårsperiode
const erRelevantForPeriode = (
  vilkårPeriodeFom: Dayjs,
  vilkårPeriodeTom: Dayjs,
  statusPeriodeFom: Dayjs,
  statusPeriodeTom: Dayjs,
  innsendtDato: string,
) => {
  // er starten av vilkårsperioden før opprinnelig søkndasfrist
  const erAktuellForPerioden = utledInnsendtSoknadsfrist(innsendtDato, false) > vilkårPeriodeFom;
  // overlapper vilkårsperioden med statusperioden fra dokumentet
  const overlapperPerioder = vilkårPeriodeFom <= statusPeriodeTom && vilkårPeriodeTom >= statusPeriodeFom;
  return erAktuellForPerioden && overlapperPerioder;
};

const SoknadsfristVilkarProsessIndex = ({
  behandling,
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
}: SoknadsfristVilkarProsessIndexProps) => {
  const [activeTab, setActiveTab] = useState(0);
  const [activeVilkår] = vilkar;
  const perioder = hentAktivePerioderFraVilkar(vilkar, visAllePerioder);
  useEffect(() => {
    if (!visAllePerioder && activeTab >= perioder.length) {
      setActiveTab(0);
    }
  }, [activeTab, visAllePerioder]);

  if (perioder.length === 0) {
    return null;
  }

  useEffect(() => {
    if (perioder.length > 1) {
      const førsteIkkeVurdertPeriodeIndex = perioder.findIndex(
        periode => periode.vurderesIBehandlingen && periode.vilkarStatus.kode === vilkarUtfallType.IKKE_VURDERT,
      );
      if (førsteIkkeVurdertPeriodeIndex > 0) {
        setActiveTab(førsteIkkeVurdertPeriodeIndex);
      }
    }
  }, []);

  const activePeriode = perioder.length === 1 ? perioder[0] : perioder[activeTab];

  const harÅpentAksjonspunkt = aksjonspunkter.some(
    ap =>
      ap.definisjon.kode === aksjonspunktCodes.KONTROLLER_OPPLYSNINGER_OM_SØKNADSFRIST &&
      ap.status.kode === aksjonspunktStatus.OPPRETTET &&
      ap.kanLoses,
  );

  const dokumenterSomSkalVurderes = Array.isArray(soknadsfristStatus?.dokumentStatus)
    ? soknadsfristStatus.dokumentStatus.filter(dok =>
        dok.status.some(status => {
          const erOppfyllt = status.status.kode === vilkarUtfallType.OPPFYLT;
          const avklartEllerOverstyrt = dok.overstyrteOpplysninger || dok.avklarteOpplysninger;

          if (erOppfyllt && !avklartEllerOverstyrt) {
            return false;
          }

          const statusPeriodeFom = initializeDate(status.periode.fom);
          const statusPeriodeTom = initializeDate(status.periode.tom);

          return perioder.some(vilkårPeriode => {
            const vilkårPeriodeFom = initializeDate(vilkårPeriode.periode.fom);
            const vilkårPeriodeTom = initializeDate(vilkårPeriode.periode.tom);
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

  const activePeriodeFom = initializeDate(activePeriode.periode.fom);
  const activePeriodeTom = initializeDate(activePeriode.periode.tom);

  const dokumenterIAktivPeriode = dokumenterSomSkalVurderes.filter(dok =>
    dok.status.some(status => {
      const statusPeriodeFom = initializeDate(status.periode.fom);
      const statusPeriodeTom = initializeDate(status.periode.tom);
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
    <RawIntlProvider value={intl}>
      <div className={cx('mainContainer--withSideMenu')}>
        <div className={styles.sideMenuContainer}>
          <SideMenu
            links={perioder.map(({ periode, vilkarStatus }, index) => ({
              active: activeTab === index,
              label: `${formatDate(periode.fom)} - ${formatDate(periode.tom)}`,
              icon:
                (erOverstyrt || harÅpentAksjonspunkt) && vilkarStatus.kode !== vilkarUtfallType.OPPFYLT ? (
                  <ExclamationmarkTriangleFillIcon
                    title="Aksjonspunkt"
                    fontSize="1.5rem"
                    className="text-[var(--ac-alert-icon-warning-color,var(--a-icon-warning))] text-2xl ml-2"
                  />
                ) : null,
            }))}
            onClick={setActiveTab}
            theme="arrow"
            heading="Perioder"
          />
        </div>
        <div className={styles.contentContainer}>
          <SoknadsfristVilkarHeader
            aksjonspunkter={aksjonspunkter}
            erOverstyrt={erOverstyrt}
            kanOverstyreAccess={kanOverstyreAccess}
            lovReferanse={activeVilkår.lovReferanse ?? lovReferanse}
            overrideReadOnly={overrideReadOnly || dokumenterSomSkalVurderes.length === 0}
            overstyringApKode={aksjonspunktCodes.OVERSTYR_SOKNADSFRISTVILKAR}
            panelTittelKode={panelTittelKode}
            status={activePeriode.vilkarStatus.kode}
            toggleOverstyring={toggleOverstyring}
          />
          <SoknadsfristVilkarForm
            behandlingId={behandling.id}
            behandlingVersjon={behandling.versjon}
            aksjonspunkter={aksjonspunkter}
            harÅpentAksjonspunkt={harÅpentAksjonspunkt}
            erOverstyrt={erOverstyrt}
            submitCallback={submitCallback}
            overrideReadOnly={overrideReadOnly}
            toggleOverstyring={toggleOverstyring}
            status={activePeriode.vilkarStatus.kode}
            alleDokumenter={dokumenterSomSkalVurderes}
            dokumenterIAktivPeriode={dokumenterIAktivPeriode}
            periode={activePeriode}
          />
        </div>
      </div>
    </RawIntlProvider>
  );
};

export default SoknadsfristVilkarProsessIndex;
