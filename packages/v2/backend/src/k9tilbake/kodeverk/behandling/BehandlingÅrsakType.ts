type TilbakekrevingBehandlingÅrsakTypeName =
  | 'RE_KLAGE_KA'
  | 'RE_KLAGE_NFP'
  | 'RE_VILKÅR'
  | 'RE_FORELDELSE'
  | 'RE_FEILUTBETALT_BELØP_REDUSERT';

export const behandlingÅrsakType: Readonly<Record<TilbakekrevingBehandlingÅrsakTypeName, string>> = {
  RE_KLAGE_KA: 'RE_KLAGE_KA',
  RE_KLAGE_NFP: 'RE_KLAGE_NFP',
  RE_VILKÅR: 'RE_VILKÅR',
  RE_FORELDELSE: 'RE_FORELDELSE',
  RE_FEILUTBETALT_BELØP_REDUSERT: 'RE_FEILUTBETALT_BELØP_REDUSERT',
};
