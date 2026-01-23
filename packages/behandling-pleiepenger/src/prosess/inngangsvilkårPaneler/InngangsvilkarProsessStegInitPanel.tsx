import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import { k9_sak_kontrakt_aksjonspunkt_AksjonspunktDto } from '@k9-sak-web/backend/k9sak/generated/types.js';
import { ProsessPanelContext } from '@k9-sak-web/gui/behandling/prosess/ProsessPanelContext.js';
import { ProsessStegIkkeVurdert } from '@k9-sak-web/gui/behandling/prosess/ProsessStegIkkeVurdert.js';
import { hentAktivePerioderFraVilkar } from '@k9-sak-web/gui/utils/hentAktivePerioderFraVilkar.js';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import { Behandling } from '@k9-sak-web/types';
import { HGrid, Tabs, VStack } from '@navikt/ds-react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Dispatch, SetStateAction, useContext, useMemo, useState } from 'react';
import { K9SakProsessApi } from '../api/K9SakProsessApi';
import { aksjonspunkterQueryOptions, vilkårQueryOptions } from '../api/k9SakQueryOptions';
import { AlderProsessStegInitPanel } from './AlderProsessStegInitPanel';
import { OmsorgenForProsessStegInitPanel } from './OmsorgenForProsessStegInitPanel';
import { SøknadsfristProsessStegInitPanel } from './SøknadsfristProsessStegInitPanel';

// Relevante vilkår for inngangsvilkår-panelet
const relevanteVilkårkoder = [
  vilkarType.SOKNADSFRISTVILKARET,
  vilkarType.ALDERSVILKARET,
  vilkarType.OMSORGENFORVILKARET,
];

const PANEL_ID = prosessStegCodes.INNGANGSVILKAR;

interface InngangsvilkarProsessStegInitPanelProps {
  behandling: Behandling;
  submitCallback: (data: any, aksjonspunkt?: k9_sak_kontrakt_aksjonspunkt_AksjonspunktDto[]) => Promise<any>;
  overrideReadOnly: boolean;
  kanOverstyreAccess: {
    isEnabled: boolean;
    employeeHasAccess: boolean;
  };
  toggleOverstyring: Dispatch<SetStateAction<string[]>>;
  kanEndrePåSøknadsopplysninger: boolean;
  overstyrteAksjonspunktKoder: string[];
  api: K9SakProsessApi;
}

export const InngangsvilkarProsessStegInitPanel = ({
  submitCallback,
  overrideReadOnly,
  kanOverstyreAccess,
  toggleOverstyring,
  kanEndrePåSøknadsopplysninger,
  overstyrteAksjonspunktKoder,
  behandling,
  api,
}: InngangsvilkarProsessStegInitPanelProps) => {
  const [visAllePerioder, setVisAllePerioder] = useState<boolean>(false);
  const { data: vilkår } = useSuspenseQuery(vilkårQueryOptions(api, behandling));
  const { data: aksjonspunkter } = useSuspenseQuery(aksjonspunkterQueryOptions(api, behandling));
  const prosessPanelContext = useContext(ProsessPanelContext);

  // Filtrer vilkår som er relevante for dette panelet
  const vilkårForSteg = useMemo(() => {
    if (!vilkår) {
      return [];
    }
    return vilkår.filter(vilkar => relevanteVilkårkoder.includes(vilkar.vilkarType));
  }, [vilkår]);

  // TODO: Finn ut om dette blir riktig utledet
  const perioderFraTidligereBehandlinger = useMemo(() => {
    return hentAktivePerioderFraVilkar(vilkårForSteg, true);
  }, [vilkårForSteg]);

  const tabs =
    perioderFraTidligereBehandlinger.length > 0
      ? ['Perioder i behandlingen', 'Tidligere perioder']
      : ['Perioder i behandlingen'];

  // Sjekk om panelet skal vises (kun hvis det finnes relevante vilkår)
  const skalVisePanel = vilkårForSteg.length > 0;

  const erValgt = prosessPanelContext?.erValgt(PANEL_ID);
  const erStegVurdert = prosessPanelContext?.erVurdert(PANEL_ID);

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
      <HGrid columns={2} marginBlock={tabs.length > 1 ? 'space-32' : 'space-16'}>
        <VStack gap="space-48">
          <SøknadsfristProsessStegInitPanel
            behandling={behandling}
            aksjonspunkter={aksjonspunkter}
            submitCallback={submitCallback}
            overrideReadOnly={overrideReadOnly}
            kanOverstyreAccess={kanOverstyreAccess}
            toggleOverstyring={toggleOverstyring}
            overstyrteAksjonspunktKoder={overstyrteAksjonspunktKoder}
            vilkår={vilkår}
            visAllePerioder={visAllePerioder}
            kanEndrePåSøknadsopplysninger={kanEndrePåSøknadsopplysninger}
            api={api}
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
          vilkår={vilkår}
          visAllePerioder={visAllePerioder}
          overstyrteAksjonspunktKoder={overstyrteAksjonspunktKoder}
        />
      </HGrid>
    </div>
  );
};
