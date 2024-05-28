import type { Kodeverk } from '../../shared/Kodeverk.ts';

/**
 * Skal matche no.nav.k9.kodeverk.api.Kodeverdi.Språkkode
 */
export type Språkkode = Kodeverk<string, 'SPRAAK_KODE'>;
