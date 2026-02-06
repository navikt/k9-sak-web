import advarselIcon from '@fpsak-frontend/assets/images/advarsel.svg';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { Image } from '@fpsak-frontend/shared-components';
import hentAktivePerioderFraVilkar from '@fpsak-frontend/utils/src/hentAktivePerioderFraVilkar';
import { formatDate } from '@k9-sak-web/lib/dateUtils/dateUtils.js';
import { Aksjonspunkt, Behandling, Fagsak, Opptjening, SubmitCallback } from '@k9-sak-web/types';
import { SideMenu } from '@navikt/ft-plattform-komponenter';
import { k9_sak_kontrakt_vilkår_VilkårMedPerioderDto } from '@navikt/k9-sak-typescript-client/types';
import classNames from 'classnames/bind';
import isEqual from 'lodash/isEqual';
import { useEffect, useState } from 'react';
import { RawIntlProvider, createIntl, createIntlCache } from 'react-intl';
import messages from '../i18n/nb_NO.json';
import OpptjeningVilkarForm from './components/OpptjeningVilkarForm';
import styles from './opptjeningVilkarProsessIndex.module.css';

const cx = classNames.bind(styles);

const cache = createIntlCache();

const intl = createIntl(
  {
    locale: 'nb-NO',
    messages,
  },
  cache,
);

interface OpptjeningVilkarProsessIndexProps {
  fagsak: Pick<Fagsak, 'sakstype'>;
  behandling: Pick<Behandling, 'id' | 'versjon' | 'behandlingsresultat'>;
  opptjening: { opptjeninger: Opptjening[] };
  aksjonspunkter: Aksjonspunkt[];
  vilkar: k9_sak_kontrakt_vilkår_VilkårMedPerioderDto[];
  lovReferanse?: string;
  submitCallback: (props: SubmitCallback[]) => void;
  isReadOnly: boolean;
  isAksjonspunktOpen: boolean;
  readOnlySubmitButton: boolean;
  visAllePerioder: boolean;
}

const OpptjeningVilkarProsessIndex = ({
  fagsak,
  behandling,
  opptjening,
  aksjonspunkter,
  vilkar,
  lovReferanse,
  submitCallback,
  isReadOnly,
  isAksjonspunktOpen,
  readOnlySubmitButton,
  visAllePerioder,
}: OpptjeningVilkarProsessIndexProps) => {
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
  const getIndexBlantAllePerioder = () =>
    activeVilkår.perioder?.findIndex(({ periode }) => isEqual(periode, activePeriode.periode)) ?? 0;

  return (
    <RawIntlProvider value={intl}>
      <div className={cx('mainContainer--withSideMenu')}>
        <div className={styles.sideMenuContainer}>
          <SideMenu
            links={perioder.map(({ periode, vilkarStatus }, index) => ({
              active: activeTab === index,
              label: `${formatDate(periode.fom)} - ${formatDate(periode.tom)}`,
              iconSrc:
                isAksjonspunktOpen && vilkarStatus === vilkarUtfallType.IKKE_VURDERT ? (
                  <Image
                    src={advarselIcon}
                    className={styles.warningIcon}
                    alt={intl.formatMessage({ id: 'HelpText.Aksjonspunkt' })}
                  />
                ) : null,
            }))}
            onClick={setActiveTab}
            heading={intl.formatMessage({ id: 'Sidemeny.Perioder' })}
          />
        </div>
        <div className={styles.contentContainer}>
          <OpptjeningVilkarForm
            behandlingId={behandling.id}
            behandlingVersjon={behandling.versjon}
            status={activePeriode.vilkarStatus}
            lovReferanse={lovReferanse}
            fagsakType={fagsak.sakstype}
            aksjonspunkter={aksjonspunkter}
            submitCallback={submitCallback}
            readOnly={isReadOnly}
            isAksjonspunktOpen={isAksjonspunktOpen}
            readOnlySubmitButton={readOnlySubmitButton}
            vilkårPerioder={activeVilkår.perioder}
            periodeIndex={getIndexBlantAllePerioder()}
            opptjeninger={opptjening?.opptjeninger}
          />
        </div>
      </div>
    </RawIntlProvider>
  );
};

export default OpptjeningVilkarProsessIndex;
