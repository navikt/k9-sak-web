import React, { SetStateAction, useState, useEffect } from 'react';
import moment from 'moment';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';
import classNames from 'classnames/bind';

import { Aksjonspunkt, DokumentStatus, Behandling, SubmitCallback, Vilkar } from '@k9-sak-web/types';
import { dateFormat } from '@fpsak-frontend/utils';
import { SideMenu } from '@navikt/k9-react-components';
import advarselIcon from '@fpsak-frontend/assets/images/advarsel.svg';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';

import SoknadsfristVilkarForm from './components/SoknadsfristVilkarForm';
import SoknadsfristVilkarHeader from './components/SoknadsfristVilkarHeader';
import { utledInnsendtSoknadsfrist } from './utils';

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

const lovReferanse = '§ 22-13';

interface SoknadsfristVilkarProsessIndexProps {
  behandling: Behandling;
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
  const perioder = activeVilkår.perioder.filter(periode => visAllePerioder || periode.vurdersIBehandlingen);

  const activePeriode = activeVilkår.perioder[activeTab];

  useEffect(() => {
    if (!visAllePerioder && activeTab >= perioder.length) {
      setActiveTab(0);
    }
  }, [activeTab, visAllePerioder]);

  const harÅpentAksjonspunkt = aksjonspunkter.some(
    ap =>
      ap.definisjon.kode === aksjonspunktCodes.KONTROLLER_OPPLYSNINGER_OM_SØKNADSFRIST &&
      !(ap.status.kode === aksjonspunktStatus.OPPRETTET && !ap.kanLoses),
  );

  const skalBrukeSidemeny = activeVilkår.perioder.length > 1 || harÅpentAksjonspunkt;

  const dokumenterSomSkalVurderes = Array.isArray(soknadsfristStatus?.dokumentStatus)
    ? soknadsfristStatus.dokumentStatus.filter(dok =>
        dok.status.some(
          status =>
            status.status.kode !== vilkarUtfallType.OPPFYLT &&
            perioder.some(vilkårPeriode => {
              const vilkårPeriodeFom = moment(vilkårPeriode.periode.fom);
              const vilkårPeriodeTom = moment(vilkårPeriode.periode.tom);
              const statusPeriodeFom = moment(status.periode.fom);
              const statusPeriodeTom = moment(status.periode.tom);
              return (
                utledInnsendtSoknadsfrist(dok.innsendingstidspunkt, false) > vilkårPeriodeFom &&
                ((vilkårPeriodeFom >= statusPeriodeFom && vilkårPeriodeFom <= statusPeriodeTom) ||
                  (vilkårPeriodeTom >= statusPeriodeFom && vilkårPeriodeTom <= statusPeriodeTom))
              );
            }),
        ),
      )
    : [];

  const dokumenterIAktivPeriode = dokumenterSomSkalVurderes.filter(dok =>
    dok.status.some(status => {
      const activePeriodeFom = moment(activePeriode.periode.fom);
      const activePeriodeTom = moment(activePeriode.periode.tom);
      const statusPeriodeFom = moment(status.periode.fom);
      const statusPeriodeTom = moment(status.periode.tom);
      return (
        utledInnsendtSoknadsfrist(dok.innsendingstidspunkt, false) > activePeriodeFom &&
        ((activePeriodeFom >= statusPeriodeFom && activePeriodeFom <= statusPeriodeTom) ||
          (activePeriodeTom >= statusPeriodeFom && activePeriodeTom <= statusPeriodeTom))
      );
    }),
  );

  const mainContainerClassnames = cx('mainContainer', { 'mainContainer--withSideMenu': skalBrukeSidemeny });

  return (
    <RawIntlProvider value={intl}>
      <div className={mainContainerClassnames}>
        {skalBrukeSidemeny && (
          <div className={styles.sideMenuContainer}>
            <SideMenu
              links={perioder.map(({ periode, vilkarStatus }, index) => ({
                active: activeTab === index,
                label: `${dateFormat(periode.fom)} - ${dateFormat(periode.tom)}`,
                iconSrc:
                  (erOverstyrt || harÅpentAksjonspunkt) && vilkarStatus.kode !== vilkarUtfallType.OPPFYLT
                    ? advarselIcon
                    : null,
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
            behandlingId={behandling.id}
            behandlingVersjon={behandling.versjon}
            aksjonspunkter={aksjonspunkter}
            harÅpentAksjonspunkt={harÅpentAksjonspunkt}
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

export default SoknadsfristVilkarProsessIndex;
