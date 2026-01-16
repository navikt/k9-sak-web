import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import { k9_sak_kontrakt_aksjonspunkt_AksjonspunktDto } from '@k9-sak-web/backend/k9sak/generated/types.js';
import { ProsessPanelContext } from '@k9-sak-web/gui/behandling/prosess/ProsessPanelContext.js';
import { ProsessStegIkkeVurdert } from '@k9-sak-web/gui/behandling/prosess/ProsessStegIkkeVurdert.js';
import { usePanelRegistrering } from '@k9-sak-web/gui/behandling/prosess/hooks/usePanelRegistrering.js';
import { sjekkDelvisVilkårStatus } from '@k9-sak-web/gui/behandling/prosess/utils/vilkårUtils.js';
import { hentAktivePerioderFraVilkar } from '@k9-sak-web/gui/utils/hentAktivePerioderFraVilkar.js';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import { Aksjonspunkt, Behandling, Fagsak } from '@k9-sak-web/types';
import { HGrid, Tabs, VStack } from '@navikt/ds-react';
import { ProcessMenuStepType } from '@navikt/ft-plattform-komponenter';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Dispatch, SetStateAction, useContext, useMemo, useState } from 'react';
import { K9SakProsessApi } from '../api/K9SakProsessApi';
import { FortsattMedlemskapProsessStegInitPanel } from './FortsattMedlemskapProsessStegInitPanel';
import { OpptjeningProsessStegInitPanel } from './OpptjeningProsessStegInitPanel';

// Relevante vilkår for inngangsvilkår-panelet
const RELEVANTE_VILKAR_KODER = [vilkarType.MEDLEMSKAPSVILKARET, vilkarType.OPPTJENINGSVILKARET];
const PANEL_ID = prosessStegCodes.OPPTJENING;
const PANEL_TEKST = 'Inngangsvilkår Fortsettelse';

interface InngangsvilkarFortsProsessStegInitPanelProps {
  behandling: Behandling;
  submitCallback: (data: any, aksjonspunkt: k9_sak_kontrakt_aksjonspunkt_AksjonspunktDto[]) => Promise<any>;
  overrideReadOnly: boolean;
  kanOverstyreAccess: {
    isEnabled: boolean;
    employeeHasAccess: boolean;
  };
  toggleOverstyring: Dispatch<SetStateAction<string[]>>;
  kanEndrePåSøknadsopplysninger: boolean;
  overstyrteAksjonspunktKoder: string[];
  api: K9SakProsessApi;
  isReadOnly: boolean;
  fagsak: Fagsak;
  aksjonspunkterMedKodeverk: Aksjonspunkt[];
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
  aksjonspunkterMedKodeverk,
}: InngangsvilkarFortsProsessStegInitPanelProps) => {
  const [visAllePerioder, setVisAllePerioder] = useState<boolean>(false);
  const { data: vilkår } = useSuspenseQuery({
    queryKey: ['vilkar', behandling.uuid, behandling.versjon],
    queryFn: () => api.getVilkår(behandling.uuid),
  });
  const { data: aksjonspunkter = [] } = useSuspenseQuery({
    queryKey: ['aksjonspunkter', behandling.uuid, behandling.versjon],
    queryFn: () => api.getAksjonspunkter(behandling.uuid),
  });
  const context = useContext(ProsessPanelContext);

  const vilkarForSteg = useMemo(() => {
    if (!vilkår) {
      return [];
    }
    return vilkår.filter(vilkar => RELEVANTE_VILKAR_KODER.includes(vilkar.vilkarType));
  }, [vilkår]);

  // TODO: Finn ut om dette blir riktig utledet
  const perioderFraTidligereBehandlinger = useMemo(() => {
    return hentAktivePerioderFraVilkar(vilkarForSteg, true);
  }, [vilkarForSteg]);

  const tabs =
    perioderFraTidligereBehandlinger.length > 0
      ? ['Perioder i behandlingen', 'Tidligere perioder']
      : ['Perioder i behandlingen'];

  const skalVisePanel = vilkarForSteg.length > 0;

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

  const visDelvisStatus = useMemo(() => sjekkDelvisVilkårStatus(vilkarForSteg), [vilkarForSteg]);

  const erValgt = context?.erValgt(PANEL_ID);
  usePanelRegistrering({ ...context, erValgt }, PANEL_ID, PANEL_TEKST, panelType, visDelvisStatus);

  const erStegVurdert = panelType !== ProcessMenuStepType.default;

  // Ikke vis panelet hvis det ikke finnes relevante vilkår
  if (!skalVisePanel || !erValgt) {
    return null;
  }

  if (!erStegVurdert) {
    return <ProsessStegIkkeVurdert />;
  }

  return (
    <div>
      {tabs.length > 1 && (
        <Tabs defaultValue="0">
          <Tabs.List>
            {tabs.map((tab, index) => (
              <Tabs.Tab key={tab} value={`${index}`} label={tab} onClick={() => setVisAllePerioder(index === 1)} />
            ))}
          </Tabs.List>
        </Tabs>
      )}
      <HGrid columns={2} gap="space-24" marginBlock={tabs.length > 1 ? 'space-32' : 'space-16'}>
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
            visAllePerioder={visAllePerioder}
            saksnummer={fagsak.saksnummer}
            aksjonspunkterMedKodeverk={aksjonspunkterMedKodeverk}
          />
          <FortsattMedlemskapProsessStegInitPanel
            aksjonspunkter={aksjonspunkter}
            submitCallback={submitCallback}
            overrideReadOnly={overrideReadOnly}
            kanOverstyreAccess={kanOverstyreAccess}
            toggleOverstyring={toggleOverstyring}
            vilkår={vilkarForSteg}
            behandling={behandling}
            visAllePerioder={visAllePerioder}
          />
        </VStack>
      </HGrid>
    </div>
  );
};
