import { FagOmrådeKode as K9SakFagOmrådeKode } from '../../../../k9sak/kodeverk/økonomi/oppdrag/FagOmrådeKode.js';
import { safeConstCombine } from '../../../../typecheck/safeConstCombine.js';
import { k9_oppdrag_kontrakt_kodeverk_FagOmrådeKode as UngSakFagOmrådeKode } from '../../../../ungsak/generated/types.js';

export type FagOmrådeKode = K9SakFagOmrådeKode | UngSakFagOmrådeKode;

export const FagOmrådeKode = safeConstCombine(K9SakFagOmrådeKode, UngSakFagOmrådeKode);
