import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import { ProsessPanelContext } from '@k9-sak-web/gui/behandling/prosess/ProsessPanelContext.js';
import { usePanelRegistrering } from '@k9-sak-web/gui/behandling/prosess/hooks/usePanelRegistrering.js';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import { Behandling } from '@k9-sak-web/types';
import { HGrid, VStack } from '@navikt/ds-react';
import { ProcessMenuStepType } from '@navikt/ft-plattform-komponenter';
import { useQuery } from '@tanstack/react-query';
import { Dispatch, SetStateAction, useContext, useMemo } from 'react';
import { AlderProsessStegInitPanel } from './AlderProsessStegInitPanel';
import { K9SakProsessApi } from './K9SakProsessApi';
import { OmsorgenForProsessStegInitPanel } from './OmsorgenForProsessStegInitPanel';
import { SøknadsfristProsessStegInitPanel } from './SøknadsfristProsessStegInitPanel';

interface InngangsvilkarProsessStegInitPanelProps {
  // aksjonspunkter: Aksjonspunkt[];
  behandling: Behandling;
  submitCallback: (data: any) => Promise<any>;
  overrideReadOnly: boolean;
  kanOverstyreAccess: {
    isEnabled: boolean;
    employeeHasAccess: boolean;
  };
  toggleOverstyring: Dispatch<SetStateAction<string[]>>;
  // vilkar: Vilkar[];
  visAllePerioder: boolean;
  kanEndrePåSøknadsopplysninger: boolean;
  overstyrteAksjonspunktKoder: string[];
  api: K9SakProsessApi;
}

export const InngangsvilkarProsessStegInitPanel = ({
  // aksjonspunkter,
  submitCallback,
  overrideReadOnly,
  kanOverstyreAccess,
  toggleOverstyring,
  // vilkar,
  visAllePerioder,
  kanEndrePåSøknadsopplysninger,
  overstyrteAksjonspunktKoder,
  behandling,
  api,
}: InngangsvilkarProsessStegInitPanelProps) => {
  const { data: vilkår } = useQuery({
    queryKey: ['vilkar', behandling.uuid],
    queryFn: () => api.getVilkår(behandling.uuid),
  });
  const { data: aksjonspunkter } = useQuery({
    queryKey: ['aksjonspunkter', behandling.uuid],
    queryFn: () => api.getAksjonspunkter(behandling.uuid),
  });
  const context = useContext(ProsessPanelContext);
  // Definer panel-identitet som konstanter
  const PANEL_ID = prosessStegCodes.INNGANGSVILKAR;
  const PANEL_TEKST = 'Behandlingspunkt.Inngangsvilkar';

  // Hent standard props for å få tilgang til vilkår

  // Relevante vilkår for inngangsvilkår-panelet
  const RELEVANTE_VILKAR_KODER = [
    vilkarType.SOKNADSFRISTVILKARET,
    vilkarType.ALDERSVILKARET,
    vilkarType.OMSORGENFORVILKARET,
  ];

  // Filtrer vilkår som er relevante for dette panelet
  const vilkarForSteg = useMemo(() => {
    if (!vilkår) {
      return [];
    }
    return vilkår.filter(vilkar => RELEVANTE_VILKAR_KODER.includes(vilkar.vilkarType));
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
        (kode === aksjonspunktCodes.OVERSTYR_SOKNADSFRISTVILKAR ||
          kode === aksjonspunktCodes.KONTROLLER_OPPLYSNINGER_OM_SØKNADSFRIST ||
          kode === aksjonspunktCodes.OVERSTYR_OMSORGEN_FOR) &&
        ap.status === 'OPPR'
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
  usePanelRegistrering({ ...context, erValgt: true }, PANEL_ID, PANEL_TEKST, panelType);

  const harLastetData = vilkår !== undefined && aksjonspunkter !== undefined;

  // Ikke vis panelet hvis det ikke finnes relevante vilkår
  if (!skalVisePanel || !vilkår || !harLastetData) {
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
