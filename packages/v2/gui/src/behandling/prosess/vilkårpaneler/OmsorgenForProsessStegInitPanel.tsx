import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/combined/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { VilkårType } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/VilkårType.js';
import type { AksjonspunktDto as k9_sak_kontrakt_aksjonspunkt_AksjonspunktDto } from '@k9-sak-web/backend/k9sak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import type { VilkårMedPerioderDto as k9_sak_kontrakt_vilkår_VilkårMedPerioderDto } from '@k9-sak-web/backend/k9sak/kontrakt/vilkår/VilkårMedPerioderDto.js';
import VilkarresultatMedOverstyringProsessIndex from '@k9-sak-web/gui/prosess/vilkar-overstyring/VilkarresultatMedOverstyringProsessIndex.js';
import { useMemo, type SetStateAction } from 'react';
import { toBehandlingType } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/BehandlingType.js';
import type { ProsessBehandling } from './types.js';

const RELEVANTE_VILKAR_KODER = [VilkårType.OMSORGEN_FOR];

interface Props {
  behandling: ProsessBehandling;
  aksjonspunkter: k9_sak_kontrakt_aksjonspunkt_AksjonspunktDto[];
  submitCallback: (data: unknown, aksjonspunkt: k9_sak_kontrakt_aksjonspunkt_AksjonspunktDto[]) => Promise<unknown>;
  overrideReadOnly: boolean;
  kanOverstyreAccess: {
    isEnabled: boolean;
    employeeHasAccess: boolean;
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

  const relevanteAksjonspunkter = props.aksjonspunkter.filter(
    ap => ap.definisjon === AksjonspunktDefinisjon.OVERSTYRING_AV_OMSORGEN_FOR,
  );

  const erOverstyrt = props.overstyrteAksjonspunktKoder.includes(AksjonspunktDefinisjon.OVERSTYRING_AV_OMSORGEN_FOR);

  const handleSubmit = async (data: unknown) => {
    return props.submitCallback(data, relevanteAksjonspunkter);
  };

  if (!skalVisePanel) {
    return null;
  }

  const behandlingType = toBehandlingType(props.behandling.type.kode);

  return (
    <VilkarresultatMedOverstyringProsessIndex
      aksjonspunkter={relevanteAksjonspunkter}
      behandling={{ type: behandlingType }}
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
