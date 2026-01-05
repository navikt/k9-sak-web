import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import OpptjeningVilkarProsessIndex from '@fpsak-frontend/prosess-vilkar-opptjening-oms';
import FeatureTogglesContext from '@k9-sak-web/gui/featuretoggles/FeatureTogglesContext.js';
import OpptjeningVilkarProsessIndexV2 from '@k9-sak-web/gui/prosess/vilkar-opptjening/OpptjeningVilkarProsessIndexV2.js';
import VilkarresultatMedOverstyringProsessIndex from '@k9-sak-web/gui/prosess/vilkar-overstyring/VilkarresultatMedOverstyringProsessIndex.js';
import { Behandling } from '@k9-sak-web/types';
import {
  k9_kodeverk_behandling_BehandlingType,
  k9_sak_kontrakt_aksjonspunkt_AksjonspunktDto,
  k9_sak_kontrakt_vilkår_VilkårMedPerioderDto,
} from '@navikt/k9-sak-typescript-client/types';
import { useQuery } from '@tanstack/react-query';
import { Dispatch, SetStateAction, use, useMemo } from 'react';
import { PleiepengerBehandlingApiKeys, restApiPleiepengerHooks } from '../data/pleiepengerBehandlingApi';
import { K9SakProsessApi } from './K9SakProsessApi';

interface Props {
  aksjonspunkter: k9_sak_kontrakt_aksjonspunkt_AksjonspunktDto[];
  submitCallback: (data: any) => Promise<any>;
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
  visPeriodisering: boolean;
  isReadOnly: boolean;
  api: K9SakProsessApi;
  saksnummer: string;
}

export function OpptjeningProsessStegInitPanel(props: Props) {
  const { data: fagsak } = useQuery({
    queryKey: ['fagsak', props.saksnummer],
    queryFn: () => props.api.getFagsak(props.saksnummer),
  });
  const { BRUK_V2_VILKAR_OPPTJENING } = use(FeatureTogglesContext);
  // Hent standard props for å få tilgang til vilkår

  const RELEVANTE_VILKAR_KODER = [vilkarType.OPPTJENINGSVILKARET];

  const restApiData = restApiPleiepengerHooks.useMultipleRestApi<{
    opptjening: any;
  }>([{ key: PleiepengerBehandlingApiKeys.OPPTJENING }], { keepData: true, suspendRequest: false, updateTriggers: [] });

  // Filtrer vilkår som er relevante for dette panelet
  const vilkarForSteg = useMemo(() => {
    if (!props.vilkår) {
      return [];
    }
    return props.vilkår.filter(vilkar => RELEVANTE_VILKAR_KODER.includes(vilkar.vilkarType));
  }, [props.vilkår]);
  // Sjekk om panelet skal vises (kun hvis det finnes relevante vilkår)
  const skalVisePanel = vilkarForSteg.length > 0;

  // Beregn paneltype basert på vilkårstatus (for menystatusindikator)

  // Ikke vis panelet hvis det ikke finnes relevante vilkår
  if (!skalVisePanel) {
    return null;
  }

  const data = restApiData.data;
  if (!data || !fagsak) {
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
        submitCallback={props.submitCallback}
        overrideReadOnly={props.overrideReadOnly}
        kanOverstyreAccess={props.kanOverstyreAccess}
        toggleOverstyring={props.toggleOverstyring}
        visPeriodisering={false}
        visAllePerioder={false}
      />
    );
  }
  if (BRUK_V2_VILKAR_OPPTJENING) {
    const OpptjeningVilkarProsessIndexV2Props = {
      submitCallback: props.submitCallback,
      isReadOnly: props.isReadOnly,
      behandling: props.behandling,
      aksjonspunkter: relevanteAksjonspunkter,
      opptjening: data.opptjening,
      visAllePerioder: false,
      readOnlySubmitButton: false,
      vilkar: vilkarForSteg,
      lovReferanse: vilkarForSteg[0].lovReferanse,
      isAksjonspunktOpen,
      fagsak,
    };
    return <OpptjeningVilkarProsessIndexV2 {...OpptjeningVilkarProsessIndexV2Props} />;
  }
  const OpptjeningVilkarProsessIndexProps = {
    ...props,
    fagsak: { sakstype: fagsak.sakstype },
    opptjening: data.opptjening,
    vilkar: vilkarForSteg,
    isAksjonspunktOpen,
    readOnlySubmitButton: false,
  };
  return <OpptjeningVilkarProsessIndex {...OpptjeningVilkarProsessIndexProps} />;
}
