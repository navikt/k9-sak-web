import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/combined/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import type { BehandlingType } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/BehandlingType.js';
import { vilkarType } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/VilkårType.js';
import { AksjonspunktDto } from '@k9-sak-web/backend/k9sak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import type { VilkårMedPerioderDto } from '@k9-sak-web/backend/k9sak/kontrakt/vilkår/VilkårMedPerioderDto.js';
import VilkarresultatMedOverstyringProsessIndex from '@k9-sak-web/gui/prosess/vilkar-overstyring/VilkarresultatMedOverstyringProsessIndex.js';
import { Behandling } from '@k9-sak-web/types';
import { useMemo, type SetStateAction } from 'react';

const RELEVANTE_VILKAR_KODER = [vilkarType.OMSORGEN_FOR];

interface Props {
  behandling: Behandling;
  aksjonspunkter: AksjonspunktDto[];
  submitCallback: (data: any, aksjonspunkt: AksjonspunktDto[]) => Promise<any>;
  overrideReadOnly: boolean;
  kanOverstyreAccess: {
    isEnabled: boolean;
  };
  toggleOverstyring: (overstyrtPanel: SetStateAction<string[]>) => void;
  vilkår: VilkårMedPerioderDto[];
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
      behandling={{ type: props.behandling.type.kode as BehandlingType }}
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
