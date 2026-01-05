import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import { ProsessPanelContext } from '@k9-sak-web/gui/behandling/prosess/ProsessPanelContext.js';
import { usePanelRegistrering } from '@k9-sak-web/gui/behandling/prosess/hooks/usePanelRegistrering.js';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import { Behandling, Fagsak } from '@k9-sak-web/types';
import { HGrid, VStack } from '@navikt/ds-react';
import { ProcessMenuStepType } from '@navikt/ft-plattform-komponenter';
import { useQuery } from '@tanstack/react-query';
import { Dispatch, SetStateAction, useContext, useMemo } from 'react';
import { FortsattMedlemskapProsessStegInitPanel } from './FortsattMedlemskapProsessStegInitPanel';
import { K9SakProsessApi } from './K9SakProsessApi';
import { OpptjeningProsessStegInitPanel } from './OpptjeningProsessStegInitPanel';

// Relevante vilkår for inngangsvilkår-panelet
const RELEVANTE_VILKAR_KODER = [vilkarType.MEDLEMSKAPSVILKARET, vilkarType.OPPTJENINGSVILKARET];

interface InngangsvilkarFortsProsessStegInitPanelProps {
  urlKode: string;
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
  isReadOnly: boolean;
  fagsak: Fagsak;
}

export const InngangsvilkarFortsProsessStegInitPanel = ({
  behandling,
  api,
  isReadOnly,
  submitCallback,
  overstyrteAksjonspunktKoder,
  overrideReadOnly,
  kanOverstyreAccess,
  toggleOverstyring,
  fagsak,
}: InngangsvilkarFortsProsessStegInitPanelProps) => {
  const { data: vilkår } = useQuery({
    queryKey: ['vilkar', behandling.uuid],
    queryFn: () => api.getVilkår(behandling.uuid),
  });
  const { data: aksjonspunkter = [] } = useQuery({
    queryKey: ['aksjonspunkter', behandling.uuid],
    queryFn: () => api.getAksjonspunkter(behandling.uuid),
  });
  const context = useContext(ProsessPanelContext);
  // Definer panel-identitet som konstanter
  const PANEL_ID = prosessStegCodes.OPPTJENING;
  const PANEL_TEKST = 'Behandlingspunkt.InngangsvilkarForts';

  // Hent standard props for å få tilgang til vilkår

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
        (kode === aksjonspunktCodes.OVERSTYR_MEDLEMSKAPSVILKAR ||
          kode === aksjonspunktCodes.VURDER_OPPTJENINGSVILKARET) &&
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
  usePanelRegistrering({ ...context, erValgt }, PANEL_ID, PANEL_TEKST, panelType);

  // Ikke vis panelet hvis det ikke finnes relevante vilkår
  if (!skalVisePanel) {
    return null;
  }

  // Render kun hvis panelet er valgt (injisert av ProsessMeny)
  if (!erValgt) {
    return null;
  }
  return (
    <HGrid columns={2} gap="space-24" marginBlock="space-16">
      <VStack gap="space-48">
        <OpptjeningProsessStegInitPanel
          aksjonspunkter={aksjonspunkter}
          api={api}
          behandling={behandling}
          isReadOnly={isReadOnly}
          submitCallback={submitCallback}
          overstyrteAksjonspunktKoder={overstyrteAksjonspunktKoder}
          overrideReadOnly={overrideReadOnly}
          kanOverstyreAccess={kanOverstyreAccess}
          toggleOverstyring={toggleOverstyring}
          vilkår={vilkarForSteg}
          visAllePerioder={true}
          visPeriodisering={false}
          saksnummer={fagsak.saksnummer}
        />
        <FortsattMedlemskapProsessStegInitPanel
          aksjonspunkter={aksjonspunkter}
          submitCallback={submitCallback}
          overrideReadOnly={overrideReadOnly}
          kanOverstyreAccess={kanOverstyreAccess}
          toggleOverstyring={toggleOverstyring}
          vilkår={vilkarForSteg}
          behandling={behandling}
        />
      </VStack>
    </HGrid>
  );
};
