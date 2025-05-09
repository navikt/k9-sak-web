import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import hentAktivePerioderFraVilkar from '@fpsak-frontend/utils/src/hentAktivePerioderFraVilkar';
import { formatDate } from '@k9-sak-web/lib/dateUtils/dateUtils.js';
import { Aksjonspunkt, Behandling, KodeverkMedNavn, SubmitCallback, Vilkar } from '@k9-sak-web/types';
import { SideMenu } from '@navikt/ft-plattform-komponenter';
import classNames from 'classnames/bind';
import { SetStateAction, useEffect, useState } from 'react';
import { RawIntlProvider, createIntl, createIntlCache } from 'react-intl';
import messages from '../i18n/nb_NO.json';
import VilkarresultatMedOverstyringFormPeriodisert from './components-periodisert/VilkarresultatMedOverstyringFormPeriodisert';
import VilkarresultatMedOverstyringHeader from './components-periodisert/VilkarresultatMedOverstyringHeader';
import styles from './vilkarresultatMedOverstyringProsessIndex.module.css';
import { aksjonspunktStatus } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktStatus.js';
import { CheckmarkCircleFillIcon, XMarkOctagonFillIcon } from '@navikt/aksel-icons';
import AksjonspunktIkon from '@k9-sak-web/gui/shared/aksjonspunkt-ikon/AksjonspunktIkon.js';

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
  visPeriodisering: boolean;
  vilkar: Vilkar[];
  visAllePerioder: boolean;
}

const VilkarresultatMedOverstyringProsessIndex = ({
  behandling,
  medlemskap = { fom: '' },
  aksjonspunkter,
  submitCallback,
  overrideReadOnly,
  kanOverstyreAccess,
  toggleOverstyring,
  avslagsarsaker,
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

  const [activeVilkår] = vilkar;
  const perioder = hentAktivePerioderFraVilkar(vilkar, visAllePerioder);

  useEffect(() => {
    if (!visAllePerioder && activeTab >= perioder.length) {
      setActiveTab(0);
    }
  }, [activeTab, visAllePerioder]);

  const harAktivtAksjonspunkt = aksjonspunkter.some(
    aksjonspunkt => aksjonspunkt.status.kode === aksjonspunktStatus.OPPRETTET,
  );

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

  if (perioder.length === 0) {
    return null;
  }
  const activePeriode = perioder.length === 1 ? perioder[0] : perioder[activeTab];

  return (
    <RawIntlProvider value={intl}>
      <div className={cx('mainContainer--withSideMenu')}>
        <div className={styles.sideMenuContainer}>
          <SideMenu
            links={perioder.map((periode, index) => ({
              active: activeTab === index,
              label: `${formatDate(periode.periode.fom)} - ${formatDate(periode.periode.tom)}`,
              icon: (function () {
                if (periode.vilkarStatus.kode === vilkarUtfallType.OPPFYLT) {
                  return <CheckmarkCircleFillIcon style={{ color: 'var(--a-surface-success)' }} />;
                }
                if (periode.vilkarStatus.kode === vilkarUtfallType.IKKE_OPPFYLT) {
                  return <XMarkOctagonFillIcon style={{ color: 'var(--a-surface-danger)' }} />;
                }
                if (periode.vilkarStatus.kode === vilkarUtfallType.IKKE_VURDERT && harAktivtAksjonspunkt) {
                  return <AksjonspunktIkon size="small" />;
                }
                return null;
              })(),
            }))}
            onClick={setActiveTab}
            heading={intl.formatMessage({ id: 'Sidemeny.Perioder' })}
          />
        </div>
        <div className={styles.contentContainer}>
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
            key={`${activePeriode.periode?.fom}-${activePeriode.periode?.tom}`}
            behandlingId={behandling.id}
            behandlingVersjon={behandling.versjon}
            behandlingType={behandling.type}
            behandlingsresultat={behandling.behandlingsresultat}
            medlemskapFom={medlemskap?.fom}
            aksjonspunkter={aksjonspunkter}
            submitCallback={submitCallback}
            overrideReadOnly={overrideReadOnly}
            toggleOverstyring={toggleOverstyring}
            avslagsarsaker={avslagsarsaker}
            relevanteInnvilgetMerknader={activeVilkår.relevanteInnvilgetMerknader}
            innvilgelseMerknadKode={
              activePeriode.vilkarStatus.kode === vilkarUtfallType.OPPFYLT && !!activePeriode.merknad
                ? activePeriode.merknad.kode
                : undefined
            }
            status={activePeriode.vilkarStatus.kode}
            erOverstyrt={erOverstyrt}
            overstyringApKode={overstyringApKode}
            lovReferanse={activeVilkår.lovReferanse ?? lovReferanse}
            erMedlemskapsPanel={erMedlemskapsPanel}
            visPeriodisering={visPeriodisering}
            avslagKode={activePeriode.avslagKode}
            periode={activePeriode}
          />
        </div>
      </div>
    </RawIntlProvider>
  );
};

export default VilkarresultatMedOverstyringProsessIndex;
