import { getUngSakClient } from '@k9-sak-web/backend/ungsak/client';
import UngMeldingerBackendClient from '@k9-sak-web/gui/sak/ung-meldinger/UngMeldingerBackendClient.js';
import { UngMessagesFormState } from '@k9-sak-web/gui/sak/ung-meldinger/UngMessagesFormState.js';
import { UngMessagesIndex } from '@k9-sak-web/gui/sak/ung-meldinger/UngMessagesIndex.js';
import { BehandlingAppKontekst } from '@k9-sak-web/types';
import { useState } from 'react';

interface OwnProps {
  alleBehandlinger: BehandlingAppKontekst[];
  behandlingId: number;
}

/**
 * MeldingIndex
 *
 * Container komponent. Har ansvar for å hente mottakere og brevmaler fra serveren.
 */
const MeldingIndex = ({ alleBehandlinger, behandlingId }: OwnProps) => {
  const behandling = alleBehandlinger.find(b => b.id === behandlingId);
  const ungMeldingerBackendClient = new UngMeldingerBackendClient(getUngSakClient());
  const [ungMessagesFormValues, setUngMessagesFormValues] = useState<UngMessagesFormState | undefined>(undefined);
  /*
    Før var det kode for å vise to ulike modaler etter at melding vart sendt i denne komponenten.

    På grunn av at resetMessage under alltid utfører ein reload av heile sida etter at ei melding er sendt vart koden
    for visning av modaler etter sending aldri køyrt. Den er derfor fjerna.

    Ein av dialogane var for å vise at behandling hadde blitt satt på vent etter sending av melding. Ein litt anna
    dialog som seier det samme blir automatisk vist etter reload, så dette behovet er dekka inn så lenge reload() blir
    utført. Viss det kan skje at behandling blir satt på vent av å sende ei melding bør ein finne ei løysing for dette
    viss ein fjerne reload() kallet.

    Den andre dialogen var berre ein enkel bekreftelse på at melding var sendt. Ikkje så viktig, men kan gjerne
    implementerast på nytt seinare når reload() har blitt fjerna, som ein "toast" type melding eller liknande.
   */

  const reloadWindow = () => {
    // FIXME temp fiks for å unngå prod-feil (her skjer det ein oppdatering av behandling, så må oppdatera)
    window.location.reload();
  };

  return (
    <UngMessagesIndex
      api={ungMeldingerBackendClient}
      behandlingId={behandlingId}
      onMessageSent={reloadWindow}
      språkkode={behandling?.språkkode.kode ?? ''}
      ungMessagesFormValues={ungMessagesFormValues}
      setUngMessagesFormValues={setUngMessagesFormValues}
    />
  );
};

export default MeldingIndex;
