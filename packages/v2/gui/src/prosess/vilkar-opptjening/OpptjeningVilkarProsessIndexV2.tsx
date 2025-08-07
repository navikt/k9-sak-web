import { VilkårPeriodeDtoVilkarStatus, type OpptjeningDto } from '@k9-sak-web/backend/k9sak/generated';
import { formatDate } from '@k9-sak-web/lib/dateUtils/dateUtils.js';
import { CheckmarkCircleFillIcon, XMarkOctagonFillIcon } from '@navikt/aksel-icons';
import { SideMenu } from '@navikt/ft-plattform-komponenter';
import { useEffect, useState } from 'react';
import { hentAktivePerioderFraVilkar } from '../../utils/hentAktivePerioderFraVilkar';
import OpptjeningVilkarAksjonspunktPanel from './components/OpptjeningVilkarAksjonspunktPanel';
import styles from './opptjeningVilkarProsessIndex.module.css';
import type { Aksjonspunkt } from './types/Aksjonspunkt';
import type { Behandling } from './types/Behandling';
import type { Fagsak } from './types/Fagsak';
import type { SubmitCallback } from './types/SubmitCallback';
import type { Vilkår } from './types/Vilkår';
import AksjonspunktIkon from '../../shared/aksjonspunkt-ikon/AksjonspunktIkon';

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

const getIconForOpptjeningStatus = (vilkarStatus: VilkårPeriodeDtoVilkarStatus, isAksjonspunktOpen: boolean) => {
  if (isAksjonspunktOpen && vilkarStatus === VilkårPeriodeDtoVilkarStatus.IKKE_VURDERT) {
    return <AksjonspunktIkon size="small" />;
  }
  if (vilkarStatus === VilkårPeriodeDtoVilkarStatus.OPPFYLT) {
    return <CheckmarkCircleFillIcon style={{ color: 'var(--ax-bg-success-strong)' }} />;
  }
  if (vilkarStatus === VilkårPeriodeDtoVilkarStatus.IKKE_OPPFYLT) {
    return <XMarkOctagonFillIcon style={{ color: 'var(--ax-bg-danger-strong)' }} />;
  }
  return null;
};

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
    activeVilkår?.perioder?.findIndex(
      ({ periode }) => periode.fom === activePeriode?.periode.fom && periode.tom === activePeriode?.periode.tom,
    ) ?? 0;

  return (
    <>
      <div className={styles.mainContainerWithSideMenu}>
        <div className="flex-shrink-0">
          <SideMenu
            links={perioder.map(({ periode, vilkarStatus }, index) => ({
              active: activeTab === index,
              label: `${formatDate(periode.fom)} - ${formatDate(periode.tom)}`,
              icon: getIconForOpptjeningStatus(vilkarStatus, isAksjonspunktOpen),
            }))}
            onClick={setActiveTab}
            heading="Perioder"
          />
        </div>
        <div>
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
    </>
  );
};

export default OpptjeningVilkarProsessIndexV2;
