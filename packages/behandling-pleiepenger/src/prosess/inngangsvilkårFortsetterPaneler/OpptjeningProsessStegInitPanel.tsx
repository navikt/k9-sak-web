import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/combined/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { aksjonspunktStatus } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktStatus.js';
import type { BehandlingType } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/BehandlingType.js';
import { vilkarType } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/VilkårType.js';
import { AksjonspunktDto } from '@k9-sak-web/backend/k9sak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import type { VilkårMedPerioderDto } from '@k9-sak-web/backend/k9sak/kontrakt/vilkår/VilkårMedPerioderDto.js';
import OpptjeningVilkarProsessIndexV2 from '@k9-sak-web/gui/prosess/vilkar-opptjening/OpptjeningVilkarProsessIndexV2.js';
import VilkarresultatMedOverstyringProsessIndex from '@k9-sak-web/gui/prosess/vilkar-overstyring/VilkarresultatMedOverstyringProsessIndex.js';
import { Behandling } from '@k9-sak-web/types';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Dispatch, SetStateAction, useMemo } from 'react';
import { K9SakProsessApi } from '../api/K9SakProsessApi';
import { fagsakQueryOptions, opptjeningQueryOptions } from '../api/k9SakQueryOptions';

const RELEVANTE_VILKAR_KODER = [vilkarType.OPPTJENINGSVILKÅRET];

interface Props {
  aksjonspunkter: AksjonspunktDto[];
  submitCallback: (data: any, aksjonspunkt: AksjonspunktDto[]) => Promise<any>;
  overrideReadOnly: boolean;
  kanOverstyreAccess: {
    isEnabled: boolean;
    employeeHasAccess: boolean;
  };
  toggleOverstyring: Dispatch<SetStateAction<string[]>>;
  overstyrteAksjonspunktKoder: string[];
  vilkår: Array<VilkårMedPerioderDto>;
  visAllePerioder: boolean;
  behandling: Behandling;
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

  const erAlleVilkårVurdert = vilkårForSteg.every(vilkar =>
    vilkar.perioder?.every(periode => periode.vilkarStatus !== 'IKKE_VURDERT'),
  );

  const relevanteAksjonspunkter = props.aksjonspunkter?.filter(
    ap => ap.definisjon === AksjonspunktDefinisjon.VURDER_OPPTJENINGSVILKÅRET,
  );

  const isAksjonspunktOpen = relevanteAksjonspunkter.some(
    ap => ap.status === aksjonspunktStatus.OPPRETTET,
  );

  const handleSubmit = async (data: any) => {
    return props.submitCallback(data, relevanteAksjonspunkter);
  };

  // Ikke vis panelet hvis det ikke finnes relevante vilkår
  if (!skalVisePanel) {
    return null;
  }

  const erOverstyrt = props.overstyrteAksjonspunktKoder.some(
    kode => kode === AksjonspunktDefinisjon.OVERSTYRING_AV_OPPTJENINGSVILKÅRET,
  );

  if (erAlleVilkårVurdert) {
    return (
      <VilkarresultatMedOverstyringProsessIndex
        aksjonspunkter={[]}
        behandling={{ type: props.behandling.type.kode as BehandlingType }}
        panelTittelKode="Opptjening"
        vilkar={vilkårForSteg}
        erOverstyrt={erOverstyrt}
        overstyringApKode={AksjonspunktDefinisjon.OVERSTYRING_AV_OPPTJENINGSVILKÅRET}
        erMedlemskapsPanel={false}
        submitCallback={handleSubmit}
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
      <OpptjeningVilkarProsessIndexV2
        submitCallback={handleSubmit}
        isReadOnly={props.isReadOnly}
        behandling={props.behandling}
        aksjonspunkter={relevanteAksjonspunkter}
        opptjening={opptjeningV2}
        visAllePerioder={props.visAllePerioder}
        readOnlySubmitButton={false}
        vilkar={vilkårForSteg}
        lovReferanse={vilkårForSteg[0].lovReferanse}
        isAksjonspunktOpen={isAksjonspunktOpen}
        fagsak={fagsak}
      />
    );
  }
}
