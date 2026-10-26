import type { BehandlingContextType } from '@k9-sak-web/gui/context/BehandlingContext.js';

const harVersjon = (verdi: unknown): verdi is { versjon: number } =>
  typeof verdi === 'object' && verdi !== null && 'versjon' in verdi && typeof verdi.versjon === 'number';

/**
 * Setter ny behandling fra et lagringssvar før kalleren navigerer, f.eks. til punkt=default. Da vet Index at
 * behandlingsdata er utdatert når den nye URL-en rendres, og prosessteg velges ikke ut fra forrige versjon.
 */
const settBehandlingFraLagring = (
  settBehandling: BehandlingContextType['settBehandling'],
  lagringsresultat: unknown,
): void => {
  if (settBehandling && harVersjon(lagringsresultat)) {
    settBehandling(lagringsresultat);
  }
};

export default settBehandlingFraLagring;
