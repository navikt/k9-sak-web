import type { Brevmottaker } from '../RedigeringUtils';

export interface TilgjengeligeVedtaksbrev {
  begrunnelse: string;
  alternativeMottakere: Array<Brevmottaker>;
  vedtaksbrevmaler: Record<string, string>;
}
