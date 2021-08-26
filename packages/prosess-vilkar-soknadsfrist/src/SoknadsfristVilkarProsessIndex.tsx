import React, { SetStateAction, useState, useEffect } from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';
import classNames from 'classnames/bind';

import { Aksjonspunkt, DokumentStatus, Behandling, SubmitCallback, Vilkar } from '@k9-sak-web/types';
import { dateFormat } from '@fpsak-frontend/utils';
import { SideMenu } from '@navikt/k9-react-components';
import advarselIcon from '@fpsak-frontend/assets/images/advarsel.svg';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';

import SoknadsfristVilkarForm from './components/SoknadsfristVilkarForm';
import SoknadsfristVilkarHeader from './components/SoknadsfristVilkarHeader';

import messages from '../i18n/nb_NO.json';

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
  aksjonspunkter: Aksjonspunkt[];
  submitCallback: (props: SubmitCallback[]) => void;
  overrideReadOnly: boolean;
  kanOverstyreAccess: {
    isEnabled: boolean;
  };
  toggleOverstyring: (overstyrtPanel: SetStateAction<string[]>) => void;
  lovReferanse?: string;
  erOverstyrt: boolean;
  panelTittelKode: string;
  vilkar: Vilkar[];
  visAllePerioder: boolean;
  soknadsfristStatus: { dokumentStatus: DokumentStatus[] };
}

const SoknadsfristVilkarProsessIndex = ({
  behandling,
  aksjonspunkter,
  submitCallback,
  overrideReadOnly,
  kanOverstyreAccess,
  toggleOverstyring,
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

  const perioderSomVurderesMedAvslagFn = p =>
    p.vurdersIBehandlingen && p.vilkarStatus.kode === vilkarUtfallType.IKKE_OPPFYLT;

  useEffect(() => {
    if (!visAllePerioder && activeTab >= perioder.length) {
      setActiveTab(0);
    }
  }, [activeTab, visAllePerioder]);

  const perioderMedAvslag = perioder.filter(perioderSomVurderesMedAvslagFn);

  const dokumenterSomSkalVurderes = soknadsfristStatus.dokumentStatus.filter(dok =>
    dok.status.some(status =>
      perioderMedAvslag.some(
        p =>
          (p.periode.fom >= status.periode.fom && p.periode.fom <= status.periode.tom) ||
          (p.periode.tom >= status.periode.fom && p.periode.tom <= status.periode.tom),
      ),
    ),
  );

  const dokumenterIAktivPeriode = soknadsfristStatus.dokumentStatus.filter(dok =>
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
              links={perioder.map(({ periode, vilkarStatus }, index) => ({
                active: activeTab === index,
                label: `${dateFormat(periode.fom)} - ${dateFormat(periode.tom)}`,
                iconSrc: /* erOverstyrt && */ vilkarStatus.kode === vilkarUtfallType.IKKE_OPPFYLT ? advarselIcon : null,
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
            kanOverstyreAccess={
              activePeriode.vilkarStatus.kode !== vilkarUtfallType.OPPFYLT ? kanOverstyreAccess : { isEnabled: false }
            }
            lovReferanse={activeVilkår.lovReferanse ?? lovReferanse}
            overrideReadOnly={overrideReadOnly}
            overstyringApKode={aksjonspunktCodes.OVERSTYR_SOKNADSFRISTVILKAR}
            panelTittelKode={panelTittelKode}
            status={activePeriode.vilkarStatus.kode}
            toggleOverstyring={toggleOverstyring}
          />
          <SoknadsfristVilkarForm
            behandlingId={behandling.id}
            behandlingVersjon={behandling.versjon}
            aksjonspunkter={aksjonspunkter}
            erOverstyrt={erOverstyrt}
            submitCallback={submitCallback}
            overrideReadOnly={overrideReadOnly}
            kanOverstyreAccess={kanOverstyreAccess}
            toggleOverstyring={toggleOverstyring}
            status={activePeriode.vilkarStatus.kode}
            panelTittelKode={panelTittelKode}
            lovReferanse={activeVilkår.lovReferanse ?? lovReferanse}
            alleDokumenter={dokumenterSomSkalVurderes}
            dokumenter={dokumenterIAktivPeriode}
            periode={activePeriode}
          />
        </div>
      </div>
    </RawIntlProvider>
  );
};

SoknadsfristVilkarProsessIndex.defaultProps = {
  lovReferanse: '',
};

export default SoknadsfristVilkarProsessIndex;
