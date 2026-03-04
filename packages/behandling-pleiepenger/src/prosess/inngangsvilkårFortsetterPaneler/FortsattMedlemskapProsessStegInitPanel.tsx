import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/combined/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import type { BehandlingType } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/BehandlingType.js';
import { vilkarType } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/VilkårType.js';
import { AksjonspunktDto } from '@k9-sak-web/backend/k9sak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import type { VilkårMedPerioderDto } from '@k9-sak-web/backend/k9sak/kontrakt/vilkår/VilkårMedPerioderDto.js';
import VilkarresultatMedOverstyringProsessIndex from '@k9-sak-web/gui/prosess/vilkar-overstyring/VilkarresultatMedOverstyringProsessIndex.js';
import { Behandling } from '@k9-sak-web/types';
import { Dispatch, SetStateAction, useMemo } from 'react';

interface Props {
  aksjonspunkter: AksjonspunktDto[];
  submitCallback: (data: any, aksjonspunkt: AksjonspunktDto[]) => Promise<any>;
  overrideReadOnly: boolean;
  kanOverstyreAccess: {
    isEnabled: boolean;
    employeeHasAccess: boolean;
  };
  toggleOverstyring: Dispatch<SetStateAction<string[]>>;
  vilkår: Array<VilkårMedPerioderDto>;
  behandling: Behandling;
  visAllePerioder: boolean;
}

/**
 * InitPanel for fortsatt medlemskap prosesssteg
 *
 * Wrapper for fortsatt medlemskap-panelet som håndterer:
 * - Registrering med menyen via usePanelRegistrering
 * - Synlighetslogikk basert på tilstedeværelse av løpende medlemskapsvilkår
 * - Beregning av paneltype basert på vilkårstatus og aksjonspunkter
 * - Rendering av legacy panelkomponent via ProsessDefaultInitPanel
 *
 * Dette panelet viser overstyring av løpende medlemskapsvilkår.
 */
export function FortsattMedlemskapProsessStegInitPanel(props: Props) {
  const vilkårForSteg = useMemo(() => {
    if (!props.vilkår) {
      return [];
    }
    return props.vilkår.filter(vilkår => vilkår.vilkarType === vilkarType.MEDLEMSKAPSVILKÅRET);
  }, [props.vilkår]);

  const skalVisePanel = vilkårForSteg.length > 0;

  const relevanteAksjonspunkter = props.aksjonspunkter?.filter(
    ap => ap.definisjon === AksjonspunktDefinisjon.OVERSTYRING_AV_MEDLEMSKAPSVILKÅRET,
  );

  const handleSubmit = async (data: any) => {
    return props.submitCallback(data, relevanteAksjonspunkter);
  };

  if (!skalVisePanel) {
    return null;
  }

  return (
    <VilkarresultatMedOverstyringProsessIndex
      submitCallback={handleSubmit}
      overrideReadOnly={props.overrideReadOnly}
      kanOverstyreAccess={props.kanOverstyreAccess}
      toggleOverstyring={props.toggleOverstyring}
      aksjonspunkter={relevanteAksjonspunkter}
      behandling={{ type: props.behandling.type.kode as BehandlingType }}
      vilkar={vilkårForSteg}
      erOverstyrt={false}
      overstyringApKode=""
      erMedlemskapsPanel={false}
      visPeriodisering={false}
      visAllePerioder={props.visAllePerioder}
      panelTittelKode="Medlemskap"
    />
  );
}
