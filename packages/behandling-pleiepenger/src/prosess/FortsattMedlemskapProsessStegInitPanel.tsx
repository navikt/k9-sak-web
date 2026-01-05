import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import VilkarresultatMedOverstyringProsessIndex from '@k9-sak-web/gui/prosess/vilkar-overstyring/VilkarresultatMedOverstyringProsessIndex.js';
import { Behandling } from '@k9-sak-web/types';
import {
  k9_kodeverk_behandling_BehandlingType,
  k9_sak_kontrakt_aksjonspunkt_AksjonspunktDto,
  k9_sak_kontrakt_vilkår_VilkårMedPerioderDto,
} from '@navikt/k9-sak-typescript-client/types';
import { Dispatch, SetStateAction, useMemo } from 'react';

interface Props {
  aksjonspunkter: k9_sak_kontrakt_aksjonspunkt_AksjonspunktDto[];
  submitCallback: (data: any) => Promise<any>;
  overrideReadOnly: boolean;
  kanOverstyreAccess: {
    isEnabled: boolean;
    employeeHasAccess: boolean;
  };
  toggleOverstyring: Dispatch<SetStateAction<string[]>>;
  vilkår: Array<k9_sak_kontrakt_vilkår_VilkårMedPerioderDto>;
  behandling: Behandling;
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
  // Hent standard props for å få tilgang til vilkår og aksjonspunkter

  // Filtrer vilkår som er relevante for dette panelet (løpende medlemskap)
  const vilkarForSteg = useMemo(() => {
    if (!props.vilkår) {
      return [];
    }
    return props.vilkår.filter(vilkår => vilkår.vilkarType === vilkarType.MEDLEMSKAPSVILKARET);
  }, [props.vilkår]);

  // Sjekk om panelet skal vises (kun hvis det finnes løpende medlemskapsvilkår)
  const skalVisePanel = vilkarForSteg.length > 0;

  // Beregn paneltype basert på vilkårstatus og aksjonspunkter (for menystatusindikator)

  // Ikke vis panelet hvis det ikke finnes løpende medlemskapsvilkår
  // VIKTIG: Returner tidlig FØR registrering for å unngå at panelet vises i menyen
  if (!skalVisePanel) {
    return null;
  }

  const relevanteAksjonspunkter = props.aksjonspunkter?.filter(ap => {
    const kode = ap.definisjon;
    return kode === aksjonspunktCodes.OVERSTYR_MEDLEMSKAPSVILKAR;
  });

  const VilkarresultatMedOverstyringProsessIndexProps = {
    // ...props,
    submitCallback: props.submitCallback,
    overrideReadOnly: props.overrideReadOnly,
    kanOverstyreAccess: props.kanOverstyreAccess,
    toggleOverstyring: props.toggleOverstyring,
    aksjonspunkter: relevanteAksjonspunkter,
    behandling: { type: props.behandling.type.kode as k9_kodeverk_behandling_BehandlingType },
    vilkar: vilkarForSteg,
    erOverstyrt: false,
    overstyringApKode: '',
    erMedlemskapsPanel: false,
    visPeriodisering: false,
    visAllePerioder: false,
  };
  return (
    <VilkarresultatMedOverstyringProsessIndex
      {...VilkarresultatMedOverstyringProsessIndexProps}
      panelTittelKode="Medlemskap"
    />
  );
}
