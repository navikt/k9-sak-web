import { RadId as K9SakRadId } from '../../../../k9sak/kodeverk/økonomi/oppdrag/RadId.js';
import { k9_oppdrag_kontrakt_simulering_v1_RadId as UngSakRadId } from '../../../../ungsak/generated/types.js';
import { safeConstCombine } from '../../../../typecheck/safeConstCombine.js';

export type RadId = K9SakRadId | UngSakRadId;

export const RadId = safeConstCombine(K9SakRadId, UngSakRadId);
