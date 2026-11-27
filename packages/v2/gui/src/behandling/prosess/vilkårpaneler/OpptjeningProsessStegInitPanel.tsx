import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/combined/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { aksjonspunktStatus } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktStatus.js';
import { VilkårType } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/VilkårType.js';
import type { AksjonspunktDto as k9_sak_kontrakt_aksjonspunkt_AksjonspunktDto } from '@k9-sak-web/backend/k9sak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import type { VilkårMedPerioderDto as k9_sak_kontrakt_vilkår_VilkårMedPerioderDto } from '@k9-sak-web/backend/k9sak/kontrakt/vilkår/VilkårMedPerioderDto.js';
import OpptjeningVilkarProsessIndex from '@k9-sak-web/gui/prosess/vilkar-opptjening/OpptjeningVilkarProsessIndex.js';
import VilkarresultatMedOverstyringProsessIndex from '@k9-sak-web/gui/prosess/vilkar-overstyring/VilkarresultatMedOverstyringProsessIndex.js';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useMemo, type Dispatch, type SetStateAction } from 'react';
import type { K9SakProsessApi } from '@k9-sak-web/gui/behandling/prosess/api/K9SakProsessApi.js';
import {
  fagsakQueryOptions,
  opptjeningQueryOptions,
} from '@k9-sak-web/gui/behandling/prosess/api/k9SakQueryOptions.js';
import { toBehandlingType } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/BehandlingType.js';
import type { ProsessBehandling } from './types.js';

const RELEVANTE_VILKAR_KODER = [VilkårType.OPPTJENINGSVILKÅRET];

interface Props {
  aksjonspunkter: k9_sak_kontrakt_aksjonspunkt_AksjonspunktDto[];
  submitCallback: (data: unknown, aksjonspunkt: k9_sak_kontrakt_aksjonspunkt_AksjonspunktDto[]) => Promise<unknown>;
  overrideReadOnly: boolean;
  kanOverstyreAccess: {
    isEnabled: boolean;
    employeeHasAccess: boolean;
  };
  toggleOverstyring: Dispatch<SetStateAction<string[]>>;
  overstyrteAksjonspunktKoder: string[];
  vilkår: Array<k9_sak_kontrakt_vilkår_VilkårMedPerioderDto>;
  visAllePerioder: boolean;
  behandling: ProsessBehandling;
  isReadOnly: boolean;
  api: K9SakProsessApi;
  saksnummer: string;
}

export function OpptjeningProsessStegInitPanel(props: Props) {
  const { data: fagsak } = useSuspenseQuery(fagsakQueryOptions(props.api, props.saksnummer, props.behandling));
  const { data: opptjeningV2 } = useSuspenseQuery(opptjeningQueryOptions(props.api, props.behandling));

  const vilkårForSteg = useMemo(() => {
    if (!props.vilkår) {
      return [];
    }
    return props.vilkår.filter(vilkar => RELEVANTE_VILKAR_KODER.some(kode => kode === vilkar.vilkarType));
  }, [props.vilkår]);

  const skalVisePanel = vilkårForSteg.length > 0;

  const relevanteVurderingsAksjonspunkter = props.aksjonspunkter.filter(
    ap => ap.definisjon === AksjonspunktDefinisjon.VURDER_OPPTJENINGSVILKÅRET,
  );

  const relevanteOverstyringsAksjonspunkter = props.aksjonspunkter.filter(
    ap => ap.definisjon === AksjonspunktDefinisjon.OVERSTYRING_AV_OPPTJENINGSVILKÅRET,
  );

  const isAksjonspunktOpen = relevanteVurderingsAksjonspunkter.some(ap => ap.status === aksjonspunktStatus.OPPRETTET);

  const handleSubmitVurdering = async (data: unknown) => {
    return props.submitCallback(data, relevanteVurderingsAksjonspunkter);
  };

  const handleSubmitOverstyring = async (data: unknown) => {
    return props.submitCallback(data, relevanteOverstyringsAksjonspunkter);
  };

  // Ikke vis panelet hvis det ikke finnes relevante vilkår
  if (!skalVisePanel) {
    return null;
  }

  const erOverstyrt = props.overstyrteAksjonspunktKoder.some(
    kode => kode === AksjonspunktDefinisjon.OVERSTYRING_AV_OPPTJENINGSVILKÅRET,
  );

  const skalViseOverstyringspanel = relevanteVurderingsAksjonspunkter.length === 0;

  if (skalViseOverstyringspanel) {
    const behandlingType = toBehandlingType(props.behandling.type.kode);
    return (
      <VilkarresultatMedOverstyringProsessIndex
        aksjonspunkter={relevanteOverstyringsAksjonspunkter}
        behandling={{ type: behandlingType }}
        panelTittelKode="Opptjening"
        vilkar={vilkårForSteg}
        erOverstyrt={erOverstyrt}
        overstyringApKode={AksjonspunktDefinisjon.OVERSTYRING_AV_OPPTJENINGSVILKÅRET}
        erMedlemskapsPanel={false}
        submitCallback={handleSubmitOverstyring}
        overrideReadOnly={props.overrideReadOnly}
        kanOverstyreAccess={props.kanOverstyreAccess}
        toggleOverstyring={props.toggleOverstyring}
        visPeriodisering={false}
        visAllePerioder={props.visAllePerioder}
      />
    );
  }
  if (opptjeningV2) {
    return (
      <OpptjeningVilkarProsessIndex
        submitCallback={handleSubmitVurdering}
        isReadOnly={props.isReadOnly}
        behandling={props.behandling}
        aksjonspunkter={relevanteVurderingsAksjonspunkter}
        opptjening={opptjeningV2}
        visAllePerioder={props.visAllePerioder}
        vilkar={vilkårForSteg}
        lovReferanse={vilkårForSteg[0]?.lovReferanse}
        isAksjonspunktOpen={isAksjonspunktOpen}
        fagsak={fagsak}
      />
    );
  }
  return null;
}
