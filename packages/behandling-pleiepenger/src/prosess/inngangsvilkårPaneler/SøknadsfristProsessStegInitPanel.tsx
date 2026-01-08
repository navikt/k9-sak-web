import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import SoknadsfristVilkarProsessIndex from '@k9-sak-web/gui/prosess/vilkar-soknadsfrist/SoknadsfristVilkarProsessIndex.js';
import { SøknadsfristTilstand } from '@k9-sak-web/gui/prosess/vilkar-soknadsfrist/types/SøknadsfristTilstand.js';
import { Behandling } from '@k9-sak-web/types';
import {
  k9_sak_kontrakt_aksjonspunkt_AksjonspunktDto,
  k9_sak_kontrakt_vilkår_VilkårMedPerioderDto,
} from '@navikt/k9-sak-typescript-client/types';
import { Dispatch, SetStateAction, useMemo } from 'react';
import { PleiepengerBehandlingApiKeys, restApiPleiepengerHooks } from '../../data/pleiepengerBehandlingApi';

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
}

export function SøknadsfristProsessStegInitPanel(props: Props) {
  const restApiData = restApiPleiepengerHooks.useMultipleRestApi<{
    soknadsfristStatus: SøknadsfristTilstand;
  }>([{ key: PleiepengerBehandlingApiKeys.SOKNADSFRIST_STATUS }], {
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

  const skalVisePanel = vilkarForSteg.length > 0;

  const relevanteAksjonspunkter = props.aksjonspunkter?.filter(ap => {
    const kode = ap.definisjon;
    return RELEVANTE_AKSJONSPUNKT_KODER.some(relevantKode => relevantKode === kode);
  });

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
      vilkar={vilkarForSteg}
      erOverstyrt={erOverstyrt}
      soknadsfristStatus={restApiData.data?.soknadsfristStatus || { dokumentStatus: [] }}
      panelTittelKode="Søknadsfrist"
    />
  );
}
