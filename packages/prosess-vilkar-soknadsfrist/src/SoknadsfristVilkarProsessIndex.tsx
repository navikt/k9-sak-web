import React, { SetStateAction, useEffect, useState } from 'react';
import { RawIntlProvider, createIntl, createIntlCache } from 'react-intl';
import moment from 'moment';
import classNames from 'classnames/bind';

import advarselIcon from '@fpsak-frontend/assets/images/advarsel.svg';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { Image } from '@fpsak-frontend/shared-components';
import { dateFormat } from '@fpsak-frontend/utils';
import { Aksjonspunkt, Behandling, DokumentStatus, SubmitCallback, Vilkar } from '@k9-sak-web/types';
import { SideMenu } from '@navikt/ft-plattform-komponenter';

import hentAktivePerioderFraVilkar from '@fpsak-frontend/utils/src/hentAktivePerioderFraVilkar';
import SoknadsfristVilkarForm from './components/SoknadsfristVilkarForm';
import SoknadsfristVilkarHeader from './components/SoknadsfristVilkarHeader';
import { utledInnsendtSoknadsfrist } from './utils';

import messages from '../i18n/nb_NO.json';

import styles from './SoknadsfristVilkarProsessIndex.module.css';

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
        periode => periode.vurderesIBehandlingen && periode.vilkarStatus === vilkarUtfallType.IKKE_VURDERT,
      );
      if (førsteIkkeVurdertPeriodeIndex > 0) {
        setActiveTab(førsteIkkeVurdertPeriodeIndex);
      }
    }
  }, []);

  const activePeriode = perioder.length === 1 ? perioder[0] : perioder[activeTab];

  const harÅpentAksjonspunkt = aksjonspunkter.some(
    ap =>
      ap.definisjon === aksjonspunktCodes.KONTROLLER_OPPLYSNINGER_OM_SØKNADSFRIST &&
      ap.status === aksjonspunktStatus.OPPRETTET &&
      ap.kanLoses,
  );

  const dokumenterSomSkalVurderes = Array.isArray(soknadsfristStatus?.dokumentStatus)
    ? soknadsfristStatus.dokumentStatus.filter(dok =>
        dok.status.some(status => {
          const erOppfyllt = status.status === vilkarUtfallType.OPPFYLT;
          const avklartEllerOverstyrt = dok.overstyrteOpplysninger || dok.avklarteOpplysninger;

          if (erOppfyllt && !avklartEllerOverstyrt) {
            return false;
          }

          const statusPeriodeFom = moment(status.periode.fom);
          const statusPeriodeTom = moment(status.periode.tom);

          return perioder.some(vilkårPeriode => {
            const vilkårPeriodeFom = moment(vilkårPeriode.periode.fom);
            const vilkårPeriodeTom = moment(vilkårPeriode.periode.tom);

            return (
              utledInnsendtSoknadsfrist(dok.innsendingstidspunkt, false) > vilkårPeriodeFom &&
              ((vilkårPeriodeFom >= statusPeriodeFom && vilkårPeriodeFom <= statusPeriodeTom) ||
                (vilkårPeriodeTom >= statusPeriodeFom && vilkårPeriodeTom <= statusPeriodeTom))
            );
          });
        }),
      )
    : [];

  const activePeriodeFom = moment(activePeriode.periode.fom);
  const activePeriodeTom = moment(activePeriode.periode.tom);

  const dokumenterIAktivPeriode = dokumenterSomSkalVurderes.filter(dok =>
    dok.status.some(status => {
      const statusPeriodeFom = moment(status.periode.fom);
      const statusPeriodeTom = moment(status.periode.tom);

      return (
        utledInnsendtSoknadsfrist(dok.innsendingstidspunkt, false) > activePeriodeFom &&
        ((activePeriodeFom >= statusPeriodeFom && activePeriodeFom <= statusPeriodeTom) ||
          (activePeriodeTom >= statusPeriodeFom && activePeriodeTom <= statusPeriodeTom))
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
              label: `${dateFormat(periode.fom)} - ${dateFormat(periode.tom)}`,
              icon:
                (erOverstyrt || harÅpentAksjonspunkt) && vilkarStatus !== vilkarUtfallType.OPPFYLT ? (
                  <Image
                    src={advarselIcon}
                    className={styles.warningIcon}
                    alt={intl.formatMessage({ id: 'HelpText.Aksjonspunkt' })}
                  />
                ) : null,
            }))}
            onClick={setActiveTab}
            theme="arrow"
            heading={intl.formatMessage({ id: 'Sidemeny.Perioder' })}
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
            status={activePeriode.vilkarStatus}
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
            // kanOverstyreAccess={kanOverstyreAccess} // TODO: Tror denne kan fjernes
            toggleOverstyring={toggleOverstyring}
            status={activePeriode.vilkarStatus}
            // panelTittelKode={panelTittelKode} // TODO: tror denen kan fjernes
            // lovReferanse={activeVilkår.lovReferanse ?? lovReferanse} // TODO: tror denen kan fjernes
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
