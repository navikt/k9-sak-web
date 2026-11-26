import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/combined/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { VilkårType } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/VilkårType.js';
import type { AksjonspunktDto as k9_sak_kontrakt_aksjonspunkt_AksjonspunktDto } from '@k9-sak-web/backend/k9sak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import type { VilkårMedPerioderDto as k9_sak_kontrakt_vilkår_VilkårMedPerioderDto } from '@k9-sak-web/backend/k9sak/kontrakt/vilkår/VilkårMedPerioderDto.js';
import VilkarresultatMedOverstyringProsessIndex from '@k9-sak-web/gui/prosess/vilkar-overstyring/VilkarresultatMedOverstyringProsessIndex.js';
import { useMemo, type Dispatch, type SetStateAction } from 'react';
import { toBehandlingType } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/BehandlingType.js';
import type { ProsessBehandling } from './types.js';

interface Props {
  aksjonspunkter: k9_sak_kontrakt_aksjonspunkt_AksjonspunktDto[];
  submitCallback: (data: unknown, aksjonspunkt: k9_sak_kontrakt_aksjonspunkt_AksjonspunktDto[]) => Promise<unknown>;
  overrideReadOnly: boolean;
  kanOverstyreAccess: {
    isEnabled: boolean;
    employeeHasAccess: boolean;
  };
  toggleOverstyring: Dispatch<SetStateAction<string[]>>;
  vilkår: Array<k9_sak_kontrakt_vilkår_VilkårMedPerioderDto>;
  behandling: ProsessBehandling;
  visAllePerioder: boolean;
  overstyrteAksjonspunktKoder: string[];
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
    return props.vilkår.filter(vilkår => vilkår.vilkarType === VilkårType.MEDLEMSKAPSVILKÅRET);
  }, [props.vilkår]);

  const skalVisePanel = vilkårForSteg.length > 0;

  const relevanteAksjonspunkter = props.aksjonspunkter.filter(
    ap => ap.definisjon === AksjonspunktDefinisjon.OVERSTYRING_AV_MEDLEMSKAPSVILKÅRET,
  );

  const erOverstyrt = props.overstyrteAksjonspunktKoder.includes(
    AksjonspunktDefinisjon.OVERSTYRING_AV_MEDLEMSKAPSVILKÅRET,
  );

  const handleSubmit = async (data: unknown) => {
    return props.submitCallback(data, relevanteAksjonspunkter);
  };

  if (!skalVisePanel) {
    return null;
  }

  const behandlingType = toBehandlingType(props.behandling.type.kode);

  return (
    <VilkarresultatMedOverstyringProsessIndex
      submitCallback={handleSubmit}
      overrideReadOnly={props.overrideReadOnly}
      kanOverstyreAccess={props.kanOverstyreAccess}
      toggleOverstyring={props.toggleOverstyring}
      aksjonspunkter={relevanteAksjonspunkter}
      behandling={{ type: behandlingType }}
      vilkar={vilkårForSteg}
      erOverstyrt={erOverstyrt}
      overstyringApKode={AksjonspunktDefinisjon.OVERSTYRING_AV_MEDLEMSKAPSVILKÅRET}
      erMedlemskapsPanel={false}
      visPeriodisering={false}
      visAllePerioder={props.visAllePerioder}
      panelTittelKode="Medlemskap"
    />
  );
}
