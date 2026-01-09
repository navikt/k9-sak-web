import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import OpptjeningVilkarProsessIndex from '@fpsak-frontend/prosess-vilkar-opptjening-oms';
import FeatureTogglesContext from '@k9-sak-web/gui/featuretoggles/FeatureTogglesContext.js';
import OpptjeningVilkarProsessIndexV2 from '@k9-sak-web/gui/prosess/vilkar-opptjening/OpptjeningVilkarProsessIndexV2.js';
import VilkarresultatMedOverstyringProsessIndex from '@k9-sak-web/gui/prosess/vilkar-overstyring/VilkarresultatMedOverstyringProsessIndex.js';
import { Aksjonspunkt, Behandling } from '@k9-sak-web/types';
import {
  k9_kodeverk_behandling_BehandlingType,
  k9_sak_kontrakt_aksjonspunkt_AksjonspunktDto,
  k9_sak_kontrakt_vilkår_VilkårMedPerioderDto,
} from '@navikt/k9-sak-typescript-client/types';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Dispatch, SetStateAction, use, useMemo } from 'react';
import { PleiepengerBehandlingApiKeys, restApiPleiepengerHooks } from '../../data/pleiepengerBehandlingApi';
import { K9SakProsessApi } from '../api/K9SakProsessApi';

const RELEVANTE_VILKAR_KODER = [vilkarType.OPPTJENINGSVILKARET];

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
  const { data: fagsak } = useSuspenseQuery({
    queryKey: ['fagsak', props.saksnummer, props.behandling.versjon],
    queryFn: () => props.api.getFagsak(props.saksnummer),
  });
  const { BRUK_V2_VILKAR_OPPTJENING } = use(FeatureTogglesContext);
  // Hent standard props for å få tilgang til vilkår

  const restApiData = restApiPleiepengerHooks.useMultipleRestApi<{
    opptjening: any;
  }>([{ key: PleiepengerBehandlingApiKeys.OPPTJENING }], {
    keepData: true,
    suspendRequest: false,
    updateTriggers: [props.behandling.versjon],
  });

  // Filtrer vilkår som er relevante for dette panelet
  const vilkarForSteg = useMemo(() => {
    if (!props.vilkår) {
      return [];
    }
    return props.vilkår.filter(vilkar => RELEVANTE_VILKAR_KODER.includes(vilkar.vilkarType));
  }, [props.vilkår]);
  // Sjekk om panelet skal vises (kun hvis det finnes relevante vilkår)
  const skalVisePanel = vilkarForSteg.length > 0;

  const data = restApiData.data;

  // Ikke vis panelet hvis det ikke finnes relevante vilkår
  if (!skalVisePanel || !data) {
    return null;
  }

  const erAlleVilkårVurdert = vilkarForSteg.every(vilkar =>
    vilkar.perioder?.every(periode => periode.vilkarStatus !== 'IKKE_VURDERT'),
  );

  const relevanteAksjonspunkter = props.aksjonspunkter?.filter(ap => {
    const kode = ap.definisjon;
    return kode === aksjonspunktCodes.VURDER_OPPTJENINGSVILKARET;
  });

  const isAksjonspunktOpen = relevanteAksjonspunkter.some(ap => ap.status === 'OPPR');

  const handleSubmit = async (data: any) => {
    return props.submitCallback(data, relevanteAksjonspunkter);
  };

  if (erAlleVilkårVurdert) {
    return (
      <VilkarresultatMedOverstyringProsessIndex
        aksjonspunkter={[]}
        behandling={{ type: props.behandling.type.kode as k9_kodeverk_behandling_BehandlingType }}
        panelTittelKode="Opptjening"
        vilkar={vilkarForSteg}
        erOverstyrt={false}
        overstyringApKode=""
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
  if (BRUK_V2_VILKAR_OPPTJENING) {
    return (
      <OpptjeningVilkarProsessIndexV2
        submitCallback={handleSubmit}
        isReadOnly={props.isReadOnly}
        behandling={props.behandling}
        aksjonspunkter={relevanteAksjonspunkter}
        opptjening={data.opptjening}
        visAllePerioder={props.visAllePerioder}
        readOnlySubmitButton={false}
        vilkar={vilkarForSteg}
        lovReferanse={vilkarForSteg[0].lovReferanse}
        isAksjonspunktOpen={isAksjonspunktOpen}
        fagsak={fagsak}
      />
    );
  }

  return (
    <OpptjeningVilkarProsessIndex
      behandling={props.behandling}
      submitCallback={handleSubmit}
      isReadOnly={props.isReadOnly}
      aksjonspunkter={props.aksjonspunkterMedKodeverk}
      fagsak={{ sakstype: fagsak.sakstype }}
      opptjening={data.opptjening}
      vilkar={vilkarForSteg}
      isAksjonspunktOpen={isAksjonspunktOpen}
      readOnlySubmitButton={false}
      visAllePerioder={props.visAllePerioder}
    />
  );
}
