import { k9_kodeverk_økonomi_tilbakekreving_TilbakekrevingVidereBehandling as K9SakTilbakekrevingVidereBehandling } from '@k9-sak-web/backend/k9sak/generated/types.js';
import { ung_kodeverk_økonomi_tilbakekreving_TilbakekrevingVidereBehandling as UngSakTilbakekrevingVidereBehandling } from '@k9-sak-web/backend/ungsak/generated/types.js';
import { safeConstCombine } from '../../../../typecheck/safeConstCombine.js';

export type TilbakekrevingVidereBehandling = K9SakTilbakekrevingVidereBehandling | UngSakTilbakekrevingVidereBehandling;

export const TilbakekrevingVidereBehandling = safeConstCombine(
  K9SakTilbakekrevingVidereBehandling,
  UngSakTilbakekrevingVidereBehandling,
);
