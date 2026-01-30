import OpptjeningVilkarProsessIndex from '@fpsak-frontend/prosess-vilkar-opptjening-oms';
import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/combined/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import {
  k9_kodeverk_behandling_aksjonspunkt_AksjonspunktStatus,
  k9_kodeverk_behandling_BehandlingType,
  k9_kodeverk_vilkår_VilkårType,
  k9_sak_kontrakt_aksjonspunkt_AksjonspunktDto,
  k9_sak_kontrakt_vilkår_VilkårMedPerioderDto,
} from '@k9-sak-web/backend/k9sak/generated/types.js';
import FeatureTogglesContext from '@k9-sak-web/gui/featuretoggles/FeatureTogglesContext.js';
import OpptjeningVilkarProsessIndexV2 from '@k9-sak-web/gui/prosess/vilkar-opptjening/OpptjeningVilkarProsessIndexV2.js';
import VilkarresultatMedOverstyringProsessIndex from '@k9-sak-web/gui/prosess/vilkar-overstyring/VilkarresultatMedOverstyringProsessIndex.js';
import { Aksjonspunkt, Behandling } from '@k9-sak-web/types';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Dispatch, SetStateAction, use, useMemo } from 'react';
import { PleiepengerBehandlingApiKeys, restApiPleiepengerHooks } from '../../data/pleiepengerBehandlingApi';
import { K9SakProsessApi } from '../api/K9SakProsessApi';
import { fagsakQueryOptions, opptjeningQueryOptions } from '../api/k9SakQueryOptions';

const RELEVANTE_VILKAR_KODER = [k9_kodeverk_vilkår_VilkårType.OPPTJENINGSVILKÅRET];

interface Props {
  aksjonspunkter: k9_sak_kontrakt_aksjonspunkt_AksjonspunktDto[];
  submitCallback: (data: any, aksjonspunkt: k9_sak_kontrakt_aksjonspunkt_AksjonspunktDto[]) => Promise<any>;
  overrideReadOnly: boolean;
  kanOverstyreAccess: {
    isEnabled: boolean;
    employeeHasAccess: boolean;
  };
  toggleOverstyring: Dispatch<SetStateAction<string[]>>;
  overstyrteAksjonspunktKoder: string[];
  vilkår: Array<k9_sak_kontrakt_vilkår_VilkårMedPerioderDto>;
  visAllePerioder: boolean;
  behandling: Behandling;
  isReadOnly: boolean;
  api: K9SakProsessApi;
  saksnummer: string;
  aksjonspunkterMedKodeverk: Aksjonspunkt[];
}

export function OpptjeningProsessStegInitPanel(props: Props) {
  const { data: fagsak } = useSuspenseQuery(fagsakQueryOptions(props.api, props.saksnummer, props.behandling));
  const { data: opptjeningV2 } = useSuspenseQuery(opptjeningQueryOptions(props.api, props.behandling));
  const { BRUK_V2_VILKAR_OPPTJENING } = use(FeatureTogglesContext);

  const restApiData = restApiPleiepengerHooks.useMultipleRestApi<{
    opptjening: any;
  }>([{ key: PleiepengerBehandlingApiKeys.OPPTJENING }], {
    keepData: true,
    suspendRequest: false,
    updateTriggers: [props.behandling.versjon],
  });

  const vilkårForSteg = useMemo(() => {
    if (!props.vilkår) {
      return [];
    }
    return props.vilkår.filter(vilkar => RELEVANTE_VILKAR_KODER.some(kode => kode === vilkar.vilkarType));
  }, [props.vilkår]);

  const skalVisePanel = vilkårForSteg.length > 0;

  const data = restApiData.data;

  const erAlleVilkårVurdert = vilkårForSteg.every(vilkar =>
    vilkar.perioder?.every(periode => periode.vilkarStatus !== 'IKKE_VURDERT'),
  );

  const relevanteAksjonspunkter = props.aksjonspunkter?.filter(
    ap => ap.definisjon === AksjonspunktDefinisjon.VURDER_OPPTJENINGSVILKÅRET,
  );

  const isAksjonspunktOpen = relevanteAksjonspunkter.some(
    ap => ap.status === k9_kodeverk_behandling_aksjonspunkt_AksjonspunktStatus.OPPRETTET,
  );

  const handleSubmit = async (data: any) => {
    return props.submitCallback(data, relevanteAksjonspunkter);
  };
  // Ikke vis panelet hvis det ikke finnes relevante vilkår
  if (!skalVisePanel) {
    return null;
  }

  if (erAlleVilkårVurdert) {
    return (
      <VilkarresultatMedOverstyringProsessIndex
        aksjonspunkter={[]}
        behandling={{ type: props.behandling.type.kode as k9_kodeverk_behandling_BehandlingType }}
        panelTittelKode="Opptjening"
        vilkar={vilkårForSteg}
        erOverstyrt={props.overstyrteAksjonspunktKoder.some(
          kode => kode === AksjonspunktDefinisjon.OVERSTYRING_AV_OPPTJENINGSVILKÅRET,
        )}
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
  if (BRUK_V2_VILKAR_OPPTJENING && opptjeningV2) {
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
  if (data) {
    return (
      <OpptjeningVilkarProsessIndex
        behandling={props.behandling}
        submitCallback={handleSubmit}
        isReadOnly={props.isReadOnly}
        aksjonspunkter={props.aksjonspunkterMedKodeverk}
        fagsak={{ sakstype: fagsak.sakstype }}
        opptjening={data.opptjening}
        vilkar={vilkårForSteg}
        isAksjonspunktOpen={isAksjonspunktOpen}
        readOnlySubmitButton={false}
        visAllePerioder={props.visAllePerioder}
      />
    );
  }
}
