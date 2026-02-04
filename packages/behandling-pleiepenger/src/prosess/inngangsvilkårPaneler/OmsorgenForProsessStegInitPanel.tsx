import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/combined/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import {
  k9_kodeverk_behandling_BehandlingType,
  k9_kodeverk_vilkår_VilkårType,
  k9_sak_kontrakt_aksjonspunkt_AksjonspunktDto,
  k9_sak_kontrakt_vilkår_VilkårMedPerioderDto,
} from '@k9-sak-web/backend/k9sak/generated/types.js';
import VilkarresultatMedOverstyringProsessIndex from '@k9-sak-web/gui/prosess/vilkar-overstyring/VilkarresultatMedOverstyringProsessIndex.js';
import { Behandling } from '@k9-sak-web/types';
import { useMemo, type SetStateAction } from 'react';

const RELEVANTE_VILKAR_KODER = [k9_kodeverk_vilkår_VilkårType.OMSORGEN_FOR];

interface Props {
  behandling: Behandling;
  aksjonspunkter: k9_sak_kontrakt_aksjonspunkt_AksjonspunktDto[];
  submitCallback: (data: any, aksjonspunkt: k9_sak_kontrakt_aksjonspunkt_AksjonspunktDto[]) => Promise<any>;
  overrideReadOnly: boolean;
  kanOverstyreAccess: {
    isEnabled: boolean;
  };
  toggleOverstyring: (overstyrtPanel: SetStateAction<string[]>) => void;
  vilkår: k9_sak_kontrakt_vilkår_VilkårMedPerioderDto[];
  visAllePerioder: boolean;
  overstyrteAksjonspunktKoder: string[];
}

export const OmsorgenForProsessStegInitPanel = (props: Props) => {
  const vilkårForSteg = useMemo(() => {
    if (!props.vilkår) {
      return [];
    }
    return props.vilkår.filter(vilkar => RELEVANTE_VILKAR_KODER.some(kode => kode === vilkar.vilkarType));
  }, [props.vilkår]);
  const skalVisePanel = vilkårForSteg.length > 0;

  const relevanteAksjonspunkter = props.aksjonspunkter?.filter(
    ap => ap.definisjon === AksjonspunktDefinisjon.OVERSTYRING_AV_OMSORGEN_FOR,
  );

  const erOverstyrt = props.overstyrteAksjonspunktKoder.includes(AksjonspunktDefinisjon.OVERSTYRING_AV_OMSORGEN_FOR);

  const handleSubmit = async (data: any) => {
    return props.submitCallback(data, relevanteAksjonspunkter);
  };

  if (!skalVisePanel) {
    return null;
  }

  return (
    <VilkarresultatMedOverstyringProsessIndex
      aksjonspunkter={relevanteAksjonspunkter}
      behandling={{ type: props.behandling.type.kode as k9_kodeverk_behandling_BehandlingType }}
      vilkar={vilkårForSteg}
      erOverstyrt={erOverstyrt}
      overstyringApKode={AksjonspunktDefinisjon.OVERSTYRING_AV_OMSORGEN_FOR}
      erMedlemskapsPanel={false}
      panelTittelKode="Omsorg"
      submitCallback={handleSubmit}
      overrideReadOnly={props.overrideReadOnly}
      kanOverstyreAccess={props.kanOverstyreAccess}
      toggleOverstyring={props.toggleOverstyring}
      visPeriodisering={true}
      visAllePerioder={props.visAllePerioder}
    />
  );
};
