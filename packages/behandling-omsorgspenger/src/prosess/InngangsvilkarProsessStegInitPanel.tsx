import { VilkårType } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/VilkårType.js';
import type { AksjonspunktDto } from '@k9-sak-web/backend/k9sak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import { ProsessPanelContext } from '@k9-sak-web/gui/behandling/prosess/ProsessPanelContext.js';
import { ProsessStegIkkeBehandlet } from '@k9-sak-web/gui/behandling/prosess/ProsessStegIkkeBehandlet.js';
import {
  aksjonspunkterQueryOptions,
  arbeidsgiverOpplysningerQueryOptions,
  vilkårQueryOptions,
} from '@k9-sak-web/gui/behandling/prosess/api/k9SakQueryOptions.js';
import type { K9SakProsessApi } from '@k9-sak-web/gui/behandling/prosess/api/K9SakProsessApi.js';
import { AlderProsessStegInitPanel } from '@k9-sak-web/gui/behandling/prosess/vilkårpaneler/AlderProsessStegInitPanel.js';
import { FortsattMedlemskapProsessStegInitPanel } from '@k9-sak-web/gui/behandling/prosess/vilkårpaneler/FortsattMedlemskapProsessStegInitPanel.js';
import { OmsorgenForProsessStegInitPanel } from '@k9-sak-web/gui/behandling/prosess/vilkårpaneler/OmsorgenForProsessStegInitPanel.js';
import { OpptjeningProsessStegInitPanel } from '@k9-sak-web/gui/behandling/prosess/vilkårpaneler/OpptjeningProsessStegInitPanel.js';
import { SøknadsfristProsessStegInitPanel } from '@k9-sak-web/gui/behandling/prosess/vilkårpaneler/SøknadsfristProsessStegInitPanel.js';
import type { ProsessBehandling } from '@k9-sak-web/gui/behandling/prosess/vilkårpaneler/types.js';
import { hentAktivePerioderFraVilkar } from '@k9-sak-web/gui/utils/hentAktivePerioderFraVilkar.js';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import { Behandling, Fagsak } from '@k9-sak-web/types';
import { HGrid, Tabs } from '@navikt/ds-react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useContext, useMemo, useState } from 'react';
import { TiDagerProsessStegInitPanel } from './TiDagerProsessStegInitPanel.js';

const RELEVANTE_VILKÅR_KODER = [
  VilkårType.SØKNADSFRIST,
  VilkårType.ARBEIDSGIVER_UTBETALT_PLIKTIGE_DAGER,
  VilkårType.OMSORGEN_FOR,
  VilkårType.OPPTJENINGSVILKÅRET,
  VilkårType.MEDLEMSKAPSVILKÅRET,
  VilkårType.ALDERSVILKÅR,
];
const PANEL_ID = prosessStegCodes.INNGANGSVILKAR;

interface Props {
  behandling: Behandling;
  submitCallback: (data: unknown, aksjonspunkt?: AksjonspunktDto[]) => Promise<unknown>;
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

export const InngangsvilkarProsessStegInitPanel = ({
  behandling,
  submitCallback,
  overrideReadOnly,
  kanOverstyreAccess,
  kanEndrePåSøknadsopplysninger,
  api,
  isReadOnly,
  fagsak,
}: Props) => {
  const [overstyrteAksjonspunktKoder, toggleOverstyring] = useState<string[]>([]);
  const [visAllePerioder, setVisAllePerioder] = useState(false);
  const { data: vilkår } = useSuspenseQuery(vilkårQueryOptions(api, behandling));
  const { data: aksjonspunkter } = useSuspenseQuery(aksjonspunkterQueryOptions(api, behandling));
  const { data: arbeidsgiverOpplysninger } = useSuspenseQuery(arbeidsgiverOpplysningerQueryOptions(api, behandling));
  const arbeidsgiverOpplysningerPerId = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(arbeidsgiverOpplysninger.arbeidsgivere ?? {}).map(([id, opplysninger]) => [
          id,
          { navn: opplysninger.navn ?? '' },
        ]),
      ),
    [arbeidsgiverOpplysninger],
  );
  const prosessPanelContext = useContext(ProsessPanelContext);

  const vilkårForSteg = useMemo(
    () => vilkår.filter(vilkår => RELEVANTE_VILKÅR_KODER.some(kode => kode === vilkår.vilkarType)),
    [vilkår],
  );
  const perioderFraTidligereBehandlinger = useMemo(
    () => hentAktivePerioderFraVilkar(vilkårForSteg, true),
    [vilkårForSteg],
  );
  const tabs =
    perioderFraTidligereBehandlinger.length > 0
      ? ['Perioder i behandlingen', 'Tidligere perioder']
      : ['Perioder i behandlingen'];

  const erValgt = prosessPanelContext?.erValgt(PANEL_ID);
  const erTilBehandlingEllerBehandlet = prosessPanelContext?.erTilBehandlingEllerBehandlet(PANEL_ID);

  if (vilkårForSteg.length === 0 || !erValgt) {
    return null;
  }

  if (!erTilBehandlingEllerBehandlet) {
    return <ProsessStegIkkeBehandlet />;
  }

  const prosessBehandling: ProsessBehandling = behandling;

  return (
    <div>
      {tabs.length > 1 && (
        <Tabs defaultValue={'0'}>
          <Tabs.List>
            {tabs.map((tab, index) => (
              <Tabs.Tab key={tab} value={String(index)} label={tab} onClick={() => setVisAllePerioder(index === 1)} />
            ))}
          </Tabs.List>
        </Tabs>
      )}
      <HGrid columns={2} gap={'space-24'} marginBlock={tabs.length > 1 ? 'space-32' : 'space-16'}>
        <SøknadsfristProsessStegInitPanel
          behandling={prosessBehandling}
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
        <TiDagerProsessStegInitPanel
          behandling={prosessBehandling}
          aksjonspunkter={aksjonspunkter}
          vilkår={vilkårForSteg}
          arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
          saksnummer={fagsak.saksnummer}
          isReadOnly={isReadOnly}
          submitCallback={submitCallback}
        />
        <OmsorgenForProsessStegInitPanel
          behandling={prosessBehandling}
          aksjonspunkter={aksjonspunkter}
          submitCallback={submitCallback}
          overrideReadOnly={overrideReadOnly}
          kanOverstyreAccess={kanOverstyreAccess}
          toggleOverstyring={toggleOverstyring}
          vilkår={vilkår}
          visAllePerioder={visAllePerioder}
          overstyrteAksjonspunktKoder={overstyrteAksjonspunktKoder}
        />
        <OpptjeningProsessStegInitPanel
          aksjonspunkter={aksjonspunkter}
          api={api}
          behandling={prosessBehandling}
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
          behandling={prosessBehandling}
          visAllePerioder={visAllePerioder}
          overstyrteAksjonspunktKoder={overstyrteAksjonspunktKoder}
        />
        <AlderProsessStegInitPanel
          behandling={prosessBehandling}
          submitCallback={submitCallback}
          overrideReadOnly={overrideReadOnly}
          kanOverstyreAccess={kanOverstyreAccess}
          toggleOverstyring={toggleOverstyring}
          visPeriodisering={false}
          vilkår={vilkår}
          visAllePerioder={visAllePerioder}
        />
      </HGrid>
    </div>
  );
};
