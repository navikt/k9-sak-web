import { VilkårPeriodeDtoVilkarStatus, type OpptjeningDto } from '@k9-sak-web/backend/k9sak/generated';
import { formatDate } from '@k9-sak-web/lib/dateUtils/dateUtils.js';
import { ExclamationmarkTriangleFillIcon } from '@navikt/aksel-icons';
import { SideMenu } from '@navikt/ft-plattform-komponenter';
import { createIntl } from '@navikt/ft-utils';
import classNames from 'classnames/bind';
import { isEqual } from 'lodash';
import { useEffect, useState } from 'react';
import { RawIntlProvider } from 'react-intl';
import { hentAktivePerioderFraVilkar } from '../../utils/hentAktivePerioderFraVilkar';
import OpptjeningVilkarAksjonspunktPanel from './components/OpptjeningVilkarAksjonspunktPanel';
import styles from './opptjeningVilkarProsessIndex.module.css';
import type { Aksjonspunkt } from './types/Aksjonspunkt';
import type { Behandling } from './types/Behandling';
import type { Fagsak } from './types/Fagsak';
import type { SubmitCallback } from './types/SubmitCallback';
import type { Vilkår } from './types/Vilkår';

const cx = classNames.bind(styles);

const intl = createIntl({
  locale: 'nb-NO',
});

interface OpptjeningVilkarProsessIndexProps {
  fagsak: Fagsak;
  behandling: Behandling;
  opptjening: { opptjeninger: OpptjeningDto[] };
  aksjonspunkter: Aksjonspunkt[];
  vilkar: Vilkår[];
  lovReferanse?: string;
  submitCallback: (props: SubmitCallback[]) => void;
  isReadOnly: boolean;
  isAksjonspunktOpen: boolean;
  readOnlySubmitButton: boolean;
  visAllePerioder: boolean;
}

const OpptjeningVilkarProsessIndexV2 = ({
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
  }, [activeTab, visAllePerioder, perioder.length]);

  const activePeriode = perioder.length === 1 ? perioder[0] : perioder[activeTab];
  if (!activePeriode) {
    return null;
  }
  const getIndexBlantAllePerioder = () =>
    activeVilkår?.perioder?.findIndex(({ periode }) => isEqual(periode, activePeriode?.periode)) ?? 0;

  return (
    <RawIntlProvider value={intl}>
      <div className={cx('mainContainer--withSideMenu')}>
        <div className={styles.sideMenuContainer}>
          <SideMenu
            links={perioder.map(({ periode, vilkarStatus }, index) => ({
              active: activeTab === index,
              label: `${formatDate(periode.fom)} - ${formatDate(periode.tom)}`,
              icon:
                isAksjonspunktOpen && vilkarStatus === VilkårPeriodeDtoVilkarStatus.IKKE_VURDERT ? (
                  <ExclamationmarkTriangleFillIcon
                    title="Aksjonspunkt"
                    fontSize="1.5rem"
                    className="text-[var(--ac-alert-icon-warning-color,var(--a-icon-warning))] text-2xl ml-2"
                  />
                ) : null,
            }))}
            onClick={setActiveTab}
            heading="Perioder"
          />
        </div>
        <div className={styles.contentContainer}>
          <OpptjeningVilkarAksjonspunktPanel
            behandlingId={behandling.id}
            behandlingVersjon={behandling.versjon}
            lovReferanse={lovReferanse}
            fagsakType={fagsak.sakstype}
            aksjonspunkter={aksjonspunkter}
            submitCallback={submitCallback}
            readOnly={isReadOnly}
            readOnlySubmitButton={readOnlySubmitButton}
            vilkårPerioder={activeVilkår?.perioder ?? []}
            periodeIndex={getIndexBlantAllePerioder()}
            opptjeninger={opptjening?.opptjeninger}
            isApOpen={isAksjonspunktOpen}
          />
        </div>
      </div>
    </RawIntlProvider>
  );
};

export default OpptjeningVilkarProsessIndexV2;
