import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import { ProsessPanelContext } from '@k9-sak-web/gui/behandling/prosess/ProsessPanelContext.js';
import { usePanelRegistrering } from '@k9-sak-web/gui/behandling/prosess/hooks/usePanelRegistrering.js';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import { Behandling } from '@k9-sak-web/types';
import { HGrid, VStack } from '@navikt/ds-react';
import { ProcessMenuStepType } from '@navikt/ft-plattform-komponenter';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Dispatch, SetStateAction, useContext, useMemo } from 'react';
import { K9SakProsessApi } from '../K9SakProsessApi';
import { AlderProsessStegInitPanel } from './AlderProsessStegInitPanel';
import { OmsorgenForProsessStegInitPanel } from './OmsorgenForProsessStegInitPanel';
import { SøknadsfristProsessStegInitPanel } from './SøknadsfristProsessStegInitPanel';

// Relevante vilkår for inngangsvilkår-panelet
const relevanteVilkårkoder = [
  vilkarType.SOKNADSFRISTVILKARET,
  vilkarType.ALDERSVILKARET,
  vilkarType.OMSORGENFORVILKARET,
];

const relevanteAksjonspunktkoder = [
  aksjonspunktCodes.OVERSTYR_SOKNADSFRISTVILKAR,
  aksjonspunktCodes.KONTROLLER_OPPLYSNINGER_OM_SØKNADSFRIST,
  aksjonspunktCodes.OVERSTYR_OMSORGEN_FOR,
];

interface InngangsvilkarProsessStegInitPanelProps {
  behandling: Behandling;
  submitCallback: (data: any) => Promise<any>;
  overrideReadOnly: boolean;
  kanOverstyreAccess: {
    isEnabled: boolean;
    employeeHasAccess: boolean;
  };
  toggleOverstyring: Dispatch<SetStateAction<string[]>>;
  visAllePerioder: boolean;
  kanEndrePåSøknadsopplysninger: boolean;
  overstyrteAksjonspunktKoder: string[];
  api: K9SakProsessApi;
}

export const InngangsvilkarProsessStegInitPanel = ({
  submitCallback,
  overrideReadOnly,
  kanOverstyreAccess,
  toggleOverstyring,
  visAllePerioder,
  kanEndrePåSøknadsopplysninger,
  overstyrteAksjonspunktKoder,
  behandling,
  api,
}: InngangsvilkarProsessStegInitPanelProps) => {
  const { data: vilkår } = useSuspenseQuery({
    queryKey: ['vilkar', behandling.uuid],
    queryFn: () => api.getVilkår(behandling.uuid),
  });
  const { data: aksjonspunkter } = useSuspenseQuery({
    queryKey: ['aksjonspunkter', behandling.uuid],
    queryFn: () => api.getAksjonspunkter(behandling.uuid),
  });
  const context = useContext(ProsessPanelContext);
  // Definer panel-identitet som konstanter
  const PANEL_ID = prosessStegCodes.INNGANGSVILKAR;
  const PANEL_TEKST = 'Behandlingspunkt.Inngangsvilkar';

  // Filtrer vilkår som er relevante for dette panelet
  const vilkarForSteg = useMemo(() => {
    if (!vilkår) {
      return [];
    }
    return vilkår.filter(vilkar => relevanteVilkårkoder.includes(vilkar.vilkarType));
  }, [vilkår]);

  // Sjekk om panelet skal vises (kun hvis det finnes relevante vilkår)
  const skalVisePanel = vilkarForSteg.length > 0;

  // Beregn paneltype basert på vilkårstatus (for menystatusindikator)
  const panelType = useMemo((): ProcessMenuStepType => {
    // Hvis panelet ikke skal vises, bruk default
    if (!skalVisePanel) {
      return ProcessMenuStepType.default;
    }

    // Samle alle periode-statuser fra alle relevante vilkår
    const vilkarStatusCodes: string[] = [];
    vilkarForSteg.forEach(vilkar => {
      vilkar.perioder
        ?.filter(periode => periode.vurderesIBehandlingen)
        .forEach(periode => vilkarStatusCodes.push(periode.vilkarStatus));
    });

    // Sjekk om noen vilkår ikke er oppfylt (danger)
    const harIkkeOppfyltVilkar = vilkarStatusCodes.some(kode => kode === 'IKKE_OPPFYLT');
    if (harIkkeOppfyltVilkar) {
      return ProcessMenuStepType.danger;
    }

    // Sjekk om alle vilkår er oppfylt (success)
    const alleVilkarOppfylt = vilkarStatusCodes.length > 0 && vilkarStatusCodes.every(kode => kode === 'OPPFYLT');
    if (alleVilkarOppfylt) {
      return ProcessMenuStepType.success;
    }

    // Sjekk om det finnes åpne aksjonspunkter for inngangsvilkår (warning)
    const harApenAksjonspunkt = aksjonspunkter?.some(ap => {
      const kode = ap.definisjon;
      return (
        relevanteAksjonspunktkoder.some(relevantAksjonspunkt => relevantAksjonspunkt === kode) && ap.status === 'OPPR'
      );
    });
    if (harApenAksjonspunkt) {
      return ProcessMenuStepType.warning;
    }

    // Default tilstand
    return ProcessMenuStepType.default;
  }, [skalVisePanel, vilkarForSteg, aksjonspunkter]);

  const erValgt = context?.erValgt(PANEL_ID);
  // Registrer panel med menyen
  usePanelRegistrering({ ...context, erValgt }, PANEL_ID, PANEL_TEKST, panelType);

  if (!skalVisePanel || !erValgt) {
    return null;
  }

  return (
    <HGrid columns={2} gap="space-24" marginBlock="space-16">
      <VStack gap="space-48">
        <SøknadsfristProsessStegInitPanel
          aksjonspunkter={aksjonspunkter}
          submitCallback={submitCallback}
          overrideReadOnly={overrideReadOnly}
          kanOverstyreAccess={kanOverstyreAccess}
          toggleOverstyring={toggleOverstyring}
          overstyrteAksjonspunktKoder={overstyrteAksjonspunktKoder}
          vilkår={vilkår}
          visAllePerioder={visAllePerioder}
          kanEndrePåSøknadsopplysninger={kanEndrePåSøknadsopplysninger}
        />
        <AlderProsessStegInitPanel
          behandling={behandling}
          submitCallback={submitCallback}
          overrideReadOnly={overrideReadOnly}
          kanOverstyreAccess={kanOverstyreAccess}
          toggleOverstyring={toggleOverstyring}
          visPeriodisering={false}
          vilkår={vilkår}
          visAllePerioder={visAllePerioder}
        />
      </VStack>

      <OmsorgenForProsessStegInitPanel
        behandling={behandling}
        aksjonspunkter={aksjonspunkter}
        submitCallback={submitCallback}
        overrideReadOnly={overrideReadOnly}
        kanOverstyreAccess={kanOverstyreAccess}
        toggleOverstyring={toggleOverstyring}
        visPeriodisering={false}
        vilkår={vilkår}
        visAllePerioder={visAllePerioder}
        overstyrteAksjonspunktKoder={overstyrteAksjonspunktKoder}
      />
    </HGrid>
  );
};
