import type { Decorator } from '@storybook/react';
import { type KodeverkContextValuesType, KodeverkProvider } from '../../kodeverk/index.js';
import { kodeverkK9Sak } from '../../../../../storybook/stories/mocks/kodeverK9Sak.js';
import { kodeverkK9Tilbake } from '../../../../../storybook/stories/mocks/kodeverkK9Tilbake.js';
import { kodeverkK9Klage } from '../../../../../storybook/stories/mocks/kodeverkK9Klage.js';
import type { AlleKodeverk } from '@k9-sak-web/lib/kodeverk/types/AlleKodeverk.js';
import type { KodeverkObject } from '@k9-sak-web/lib/kodeverk/types/KodeverkV2.js';

// Det viser seg at nokre kodeverk oppslagsobjekt frå k9-tilbake og k9-klage har null-verdi for navn.
// Fikser disse her for å unngå nullpointer feil.
type KodeverkNullableNavn = Omit<KodeverkObject, 'navn'> & { navn: null | string };

const settNavnPåNull = (kodeverkNullNavn: KodeverkNullableNavn): KodeverkObject => ({
  ...kodeverkNullNavn,
  navn: kodeverkNullNavn.navn ?? 'Navn ikke satt',
});

const kodeverkK9TilbakeFiksa: AlleKodeverk = {
  ...kodeverkK9Tilbake,
  Fagsystem: kodeverkK9Tilbake.Fagsystem.map(settNavnPåNull),
  HistorikkOpplysningType: kodeverkK9Tilbake.HistorikkOpplysningType.map(settNavnPåNull),
};

const kodeverkK9KlageFiksa: AlleKodeverk = {
  ...kodeverkK9Klage,
  FagsakYtelseType: kodeverkK9Klage.FagsakYtelseType.map(settNavnPåNull),
};
// ^- fiks slutt

/**
 * storybook decorator som legger inn provider med alle kodeverk. Som standard brukast mock verdier kopiert ut frå server.
 * @param behandlingType
 * @param kodeverk Kan settast viss ein vil overstyre kodeverk oppslagsobjekt frå k9-sak
 * @param tilbakeKodeverk Kan settast viss ein vil overstyre kodeverk oppslagsobjekt frå k9-tilbake
 * @param klageKodeverk Kan settast viss ein vil overstyre kodeverk oppslagsobjekt frå k9-klage
 */
const withKodeverkContext =
  ({
    behandlingType = undefined,
    kodeverk = kodeverkK9Sak,
    tilbakeKodeverk = kodeverkK9TilbakeFiksa,
    klageKodeverk = kodeverkK9KlageFiksa,
  }: Partial<KodeverkContextValuesType> = {}): Decorator =>
  Story => {
    return (
      <KodeverkProvider
        behandlingType={behandlingType}
        kodeverk={kodeverk}
        tilbakeKodeverk={tilbakeKodeverk}
        klageKodeverk={klageKodeverk}
      >
        <Story />
      </KodeverkProvider>
    );
  };

export default withKodeverkContext;
