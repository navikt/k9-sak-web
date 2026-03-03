import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/combined/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import {
  k9_kodeverk_vilkår_VilkårType,
  k9_sak_kontrakt_aksjonspunkt_AksjonspunktDto,
  k9_sak_kontrakt_vilkår_VilkårMedPerioderDto,
} from '@k9-sak-web/backend/k9sak/generated/types.js';
import SoknadsfristVilkarProsessIndex from '@k9-sak-web/gui/prosess/vilkar-soknadsfrist/SoknadsfristVilkarProsessIndex.js';
import { Behandling } from '@k9-sak-web/types';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Dispatch, SetStateAction, useMemo } from 'react';
import { K9SakProsessApi } from '../api/K9SakProsessApi';
import { søknadsfristStatusQueryOptions } from '../api/k9SakQueryOptions';

const RELEVANTE_VILKAR_KODER = [k9_kodeverk_vilkår_VilkårType.SØKNADSFRIST];
const RELEVANTE_AKSJONSPUNKT_KODER = [
  AksjonspunktDefinisjon.OVERSTYRING_AV_SØKNADSFRISTVILKÅRET,
  AksjonspunktDefinisjon.KONTROLLER_OPPLYSNINGER_OM_SØKNADSFRIST,
];

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
  kanEndrePåSøknadsopplysninger: boolean;
  behandling: Behandling;
  api: K9SakProsessApi;
}

export function SøknadsfristProsessStegInitPanel(props: Props) {
  const { data: søknadsfristStatus } = useSuspenseQuery(søknadsfristStatusQueryOptions(props.api, props.behandling));
  // Filtrer vilkår som er relevante for dette panelet
  const vilkårForSteg = useMemo(() => {
    if (!props.vilkår) {
      return [];
    }
    return props.vilkår.filter(vilkar => RELEVANTE_VILKAR_KODER.some(kode => kode === vilkar.vilkarType));
  }, [props.vilkår]);

  const skalVisePanel = vilkårForSteg.length > 0;

  const relevanteAksjonspunkter = props.aksjonspunkter?.filter(ap =>
    RELEVANTE_AKSJONSPUNKT_KODER.some(relevantKode => relevantKode === ap.definisjon),
  );

  if (!skalVisePanel) {
    return null;
  }

  const erOverstyrt = props.overstyrteAksjonspunktKoder.includes(
    AksjonspunktDefinisjon.OVERSTYRING_AV_SØKNADSFRISTVILKÅRET,
  );

  const handleSubmit = async (data: any) => {
    return props.submitCallback(data, relevanteAksjonspunkter);
  };

  return (
    <SoknadsfristVilkarProsessIndex
      submitCallback={handleSubmit}
      toggleOverstyring={props.toggleOverstyring}
      overrideReadOnly={props.overrideReadOnly}
      kanOverstyreAccess={props.kanOverstyreAccess}
      kanEndrePåSøknadsopplysninger={props.kanEndrePåSøknadsopplysninger}
      visAllePerioder={props.visAllePerioder}
      aksjonspunkter={relevanteAksjonspunkter}
      vilkar={vilkårForSteg}
      erOverstyrt={erOverstyrt}
      soknadsfristStatus={søknadsfristStatus || { dokumentStatus: [] }}
      panelTittelKode="Søknadsfrist"
    />
  );
}
