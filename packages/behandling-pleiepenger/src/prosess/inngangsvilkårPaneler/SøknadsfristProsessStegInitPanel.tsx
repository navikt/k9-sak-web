import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import SoknadsfristVilkarProsessIndex from '@k9-sak-web/gui/prosess/vilkar-soknadsfrist/SoknadsfristVilkarProsessIndex.js';
import { SøknadsfristTilstand } from '@k9-sak-web/gui/prosess/vilkar-soknadsfrist/types/SøknadsfristTilstand.js';
import {
  k9_sak_kontrakt_aksjonspunkt_AksjonspunktDto,
  k9_sak_kontrakt_vilkår_VilkårMedPerioderDto,
} from '@navikt/k9-sak-typescript-client/types';
import { Dispatch, SetStateAction, useMemo } from 'react';
import { PleiepengerBehandlingApiKeys, restApiPleiepengerHooks } from '../../data/pleiepengerBehandlingApi';

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
  kanEndrePåSøknadsopplysninger: boolean;
}

export function SøknadsfristProsessStegInitPanel(props: Props) {
  const restApiData = restApiPleiepengerHooks.useMultipleRestApi<{
    soknadsfristStatus: SøknadsfristTilstand;
  }>([{ key: PleiepengerBehandlingApiKeys.SOKNADSFRIST_STATUS }], {
    keepData: true,
    suspendRequest: false,
    updateTriggers: [],
  });

  // Relevante vilkår for inngangsvilkår-panelet
  const RELEVANTE_VILKAR_KODER = [vilkarType.SOKNADSFRISTVILKARET];

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
    return (
      kode === aksjonspunktCodes.OVERSTYR_SOKNADSFRISTVILKAR ||
      kode === aksjonspunktCodes.KONTROLLER_OPPLYSNINGER_OM_SØKNADSFRIST
    );
  });

  if (!skalVisePanel) {
    return null;
  }

  const erOverstyrt = props.overstyrteAksjonspunktKoder.includes(aksjonspunktCodes.OVERSTYR_SOKNADSFRISTVILKAR);

  return (
    <SoknadsfristVilkarProsessIndex
      submitCallback={props.submitCallback}
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
