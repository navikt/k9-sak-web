import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/combined/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { VilkårType } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/VilkårType.js';
import type { AksjonspunktDto as k9_sak_kontrakt_aksjonspunkt_AksjonspunktDto } from '@k9-sak-web/backend/k9sak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import type { VilkårMedPerioderDto as k9_sak_kontrakt_vilkår_VilkårMedPerioderDto } from '@k9-sak-web/backend/k9sak/kontrakt/vilkår/VilkårMedPerioderDto.js';
import SoknadsfristVilkarProsessIndex from '@k9-sak-web/gui/prosess/vilkar-soknadsfrist/SoknadsfristVilkarProsessIndex.js';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useMemo, type Dispatch, type SetStateAction } from 'react';
import type { K9SakProsessApi } from '@k9-sak-web/gui/behandling/prosess/api/K9SakProsessApi.js';
import { søknadsfristStatusQueryOptions } from '@k9-sak-web/gui/behandling/prosess/api/k9SakQueryOptions.js';
import type { ProsessBehandling } from './types.js';

const RELEVANTE_VILKAR_KODER = [VilkårType.SØKNADSFRIST];
const RELEVANTE_AKSJONSPUNKT_KODER = [
  AksjonspunktDefinisjon.OVERSTYRING_AV_SØKNADSFRISTVILKÅRET,
  AksjonspunktDefinisjon.KONTROLLER_OPPLYSNINGER_OM_SØKNADSFRIST,
];

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
  kanEndrePåSøknadsopplysninger: boolean;
  behandling: ProsessBehandling;
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

  const relevanteAksjonspunkter = props.aksjonspunkter.filter(ap =>
    RELEVANTE_AKSJONSPUNKT_KODER.some(relevantKode => relevantKode === ap.definisjon),
  );

  if (!skalVisePanel) {
    return null;
  }

  const erOverstyrt = props.overstyrteAksjonspunktKoder.includes(
    AksjonspunktDefinisjon.OVERSTYRING_AV_SØKNADSFRISTVILKÅRET,
  );

  const handleSubmit = async (data: unknown) => {
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
