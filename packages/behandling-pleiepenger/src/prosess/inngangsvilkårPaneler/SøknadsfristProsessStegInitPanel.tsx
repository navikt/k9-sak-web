import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import {
  k9_sak_kontrakt_aksjonspunkt_AksjonspunktDto,
  k9_sak_kontrakt_vilkår_VilkårMedPerioderDto,
} from '@k9-sak-web/backend/k9sak/generated/types.js';
import SoknadsfristVilkarProsessIndex from '@k9-sak-web/gui/prosess/vilkar-soknadsfrist/SoknadsfristVilkarProsessIndex.js';
import { Behandling } from '@k9-sak-web/types';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Dispatch, SetStateAction, useMemo } from 'react';
import { K9SakProsessApi } from '../api/K9SakProsessApi';
import { søknadsfristStatusQueryOptions } from '../api/k9SakQueryOptions';

const RELEVANTE_VILKAR_KODER = [vilkarType.SOKNADSFRISTVILKARET];
const RELEVANTE_AKSJONSPUNKT_KODER = [
  aksjonspunktCodes.OVERSTYR_SOKNADSFRISTVILKAR,
  aksjonspunktCodes.KONTROLLER_OPPLYSNINGER_OM_SØKNADSFRIST,
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
    return props.vilkår.filter(vilkar => RELEVANTE_VILKAR_KODER.includes(vilkar.vilkarType));
  }, [props.vilkår]);

  const skalVisePanel = vilkårForSteg.length > 0;

  const relevanteAksjonspunkter = props.aksjonspunkter?.filter(ap =>
    RELEVANTE_AKSJONSPUNKT_KODER.some(relevantKode => relevantKode === ap.definisjon),
  );

  if (!skalVisePanel) {
    return null;
  }

  const erOverstyrt = props.overstyrteAksjonspunktKoder.includes(aksjonspunktCodes.OVERSTYR_SOKNADSFRISTVILKAR);

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
