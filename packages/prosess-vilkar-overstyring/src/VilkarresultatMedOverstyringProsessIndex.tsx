import React, { SetStateAction, useState, useEffect } from 'react';
import { dateFormat } from '@fpsak-frontend/utils';
import { Aksjonspunkt, Behandling, KodeverkMedNavn, SubmitCallback, Vilkar } from '@k9-sak-web/types';
import { SideMenu } from '@navikt/k9-react-components';
import classNames from 'classnames/bind';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';
import hentAktivePerioderFraVilkar from "@fpsak-frontend/utils/src/hentAktivePerioderFraVilkar";
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
  visAllePerioder: boolean;
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
              label: `${dateFormat(periode.periode.fom)} - ${dateFormat(periode.periode.tom)}`,
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
            lovReferanse={activeVilkår.lovReferanse ?? lovReferanse}
            overrideReadOnly={overrideReadOnly}
            overstyringApKode={overstyringApKode}
            panelTittelKode={panelTittelKode}
            status={activePeriode.vilkarStatus}
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
            status={activePeriode.vilkarStatus}
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
