import {
  k9_kodeverk_vilkår_VilkårType,
  k9_sak_kontrakt_aksjonspunkt_AksjonspunktDto,
} from '@k9-sak-web/backend/k9sak/generated/types.js';
import { ProsessPanelContext } from '@k9-sak-web/gui/behandling/prosess/ProsessPanelContext.js';
import { ProsessStegIkkeVurdert } from '@k9-sak-web/gui/behandling/prosess/ProsessStegIkkeVurdert.js';
import { hentAktivePerioderFraVilkar } from '@k9-sak-web/gui/utils/hentAktivePerioderFraVilkar.js';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import { Behandling, Fagsak } from '@k9-sak-web/types';
import { HGrid, Tabs, VStack } from '@navikt/ds-react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useContext, useMemo, useState } from 'react';
import { K9SakProsessApi } from '../api/K9SakProsessApi';
import { aksjonspunkterQueryOptions, vilkårQueryOptions } from '../api/k9SakQueryOptions';
import { FortsattMedlemskapProsessStegInitPanel } from './FortsattMedlemskapProsessStegInitPanel';
import { OpptjeningProsessStegInitPanel } from './OpptjeningProsessStegInitPanel';

// Relevante vilkår for inngangsvilkår-panelet
const RELEVANTE_VILKAR_KODER = [
  k9_kodeverk_vilkår_VilkårType.MEDLEMSKAPSVILKÅRET,
  k9_kodeverk_vilkår_VilkårType.OPPTJENINGSVILKÅRET,
];
const PANEL_ID = prosessStegCodes.OPPTJENING;

interface InngangsvilkarFortsProsessStegInitPanelProps {
  behandling: Behandling;
  submitCallback: (data: any, aksjonspunkt: k9_sak_kontrakt_aksjonspunkt_AksjonspunktDto[]) => Promise<any>;
  overrideReadOnly: boolean;
  kanOverstyreAccess: {
    isEnabled: boolean;
    employeeHasAccess: boolean;
  };
  kanEndrePåSøknadsopplysninger: boolean;
  api: K9SakProsessApi;
  isReadOnly: boolean;
  fagsak: Fagsak;
}

export const InngangsvilkarFortsProsessStegInitPanel = ({
  behandling,
  api,
  isReadOnly,
  submitCallback,
  overrideReadOnly,
  kanOverstyreAccess,
  fagsak,
}: InngangsvilkarFortsProsessStegInitPanelProps) => {
  const [overstyrteAksjonspunktKoder, toggleOverstyring] = useState<string[]>([]);
  const [visAllePerioder, setVisAllePerioder] = useState<boolean>(false);
  const { data: vilkår } = useSuspenseQuery(vilkårQueryOptions(api, behandling));
  const { data: aksjonspunkter = [] } = useSuspenseQuery(aksjonspunkterQueryOptions(api, behandling));
  const prosessPanelContext = useContext(ProsessPanelContext);

  const vilkårForSteg = useMemo(() => {
    if (!vilkår) {
      return [];
    }
    return vilkår.filter(vilkar => RELEVANTE_VILKAR_KODER.some(kode => kode === vilkar.vilkarType));
  }, [vilkår]);

  // TODO: Finn ut om dette blir riktig utledet
  const perioderFraTidligereBehandlinger = useMemo(() => {
    return hentAktivePerioderFraVilkar(vilkårForSteg, true);
  }, [vilkårForSteg]);

  const tabs =
    perioderFraTidligereBehandlinger.length > 0
      ? ['Perioder i behandlingen', 'Tidligere perioder']
      : ['Perioder i behandlingen'];

  const skalVisePanel = vilkårForSteg.length > 0;

  const erValgt = prosessPanelContext?.erValgt(PANEL_ID);
  const erStegVurdert = prosessPanelContext?.erVurdert(PANEL_ID);

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
            vilkår={vilkårForSteg}
            visAllePerioder={visAllePerioder}
            saksnummer={fagsak.saksnummer}
          />
          <FortsattMedlemskapProsessStegInitPanel
            aksjonspunkter={aksjonspunkter}
            submitCallback={submitCallback}
            overrideReadOnly={overrideReadOnly}
            kanOverstyreAccess={kanOverstyreAccess}
            toggleOverstyring={toggleOverstyring}
            vilkår={vilkårForSteg}
            behandling={behandling}
            visAllePerioder={visAllePerioder}
          />
        </VStack>
      </HGrid>
    </div>
  );
};
