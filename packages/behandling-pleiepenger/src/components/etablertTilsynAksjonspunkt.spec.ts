import { describe, expect, it } from 'vitest';
import type { Aksjonspunkt } from '@k9-sak-web/types';
import { lagEtablertTilsynAksjonspunktData, utledEtablertTilsynAksjonspunkt } from './etablertTilsynAksjonspunkt';

const lagAksjonspunkt = (kode: string, status: string): Aksjonspunkt => ({
  definisjon: { kode, kodeverk: 'AKSJONSPUNKT_DEF' },
  status: { kode: status, kodeverk: 'AKSJONSPUNKT_STATUS' },
  kanLoses: true,
  erAktivt: true,
});

const periode = { fom: '2024-01-01', tom: '2024-01-31' };
const vurderinger = [{ periode, resultat: 'IKKE_OPPFYLT', begrunnelse: 'Ny vurdering', kilde: 'SØKER' }];

describe('utledEtablertTilsynAksjonspunkt', () => {
  it('bruker ordinært aksjonspunkt når det er åpent', () => {
    const tilstand = utledEtablertTilsynAksjonspunkt([lagAksjonspunkt('9201', 'OPPR')], 'BEREDSKAP', true);
    expect(tilstand).toEqual({
      kode: '9201',
      erOverstyring: false,
      harUløstAksjonspunkt: true,
      harLøstAksjonspunkt: false,
      kanRedigere: true,
    });
  });

  it('bruker ordinært aksjonspunkt når det er utført, også med toggle av', () => {
    const tilstand = utledEtablertTilsynAksjonspunkt([lagAksjonspunkt('9200', 'UTFO')], 'NATTEVÅK', false);
    expect(tilstand.kode).toBe('9200');
    expect(tilstand.harLøstAksjonspunkt).toBe(true);
    expect(tilstand.kanRedigere).toBe(true);
  });

  it('bruker overstyringsaksjonspunkt når ordinært ikke finnes', () => {
    expect(utledEtablertTilsynAksjonspunkt([], 'NATTEVÅK', true).kode).toBe('6018');
    expect(utledEtablertTilsynAksjonspunkt([], 'BEREDSKAP', true).kode).toBe('6019');
  });

  it('bruker overstyringsaksjonspunkt når det allerede er utført', () => {
    const tilstand = utledEtablertTilsynAksjonspunkt([lagAksjonspunkt('6018', 'UTFO')], 'NATTEVÅK', true);
    expect(tilstand.kode).toBe('6018');
    expect(tilstand.harLøstAksjonspunkt).toBe(false);
    expect(tilstand.kanRedigere).toBe(true);
  });

  it('blander ikke nattevåk og beredskap', () => {
    const tilstand = utledEtablertTilsynAksjonspunkt([lagAksjonspunkt('9200', 'OPPR')], 'BEREDSKAP', true);
    expect(tilstand.kode).toBe('6019');
    expect(tilstand.harUløstAksjonspunkt).toBe(false);
  });

  it('gir ingen redigering uten ordinært aksjonspunkt når toggle er av', () => {
    expect(utledEtablertTilsynAksjonspunkt([], 'BEREDSKAP', false)).toEqual({
      kode: undefined,
      erOverstyring: false,
      harUløstAksjonspunkt: false,
      harLøstAksjonspunkt: false,
      kanRedigere: false,
    });
  });
});

describe('lagEtablertTilsynAksjonspunktData', () => {
  it('sender periode med overstyringsaksjonspunkt', () => {
    const tilstand = utledEtablertTilsynAksjonspunkt([], 'BEREDSKAP', true);
    expect(lagEtablertTilsynAksjonspunktData(tilstand, 'Beredskap er behandlet', { periode, vurderinger })).toEqual({
      kode: '6019',
      begrunnelse: 'Beredskap er behandlet',
      periode,
      vurderinger,
    });
  });

  it('sender ordinært aksjonspunkt uten periode', () => {
    const tilstand = utledEtablertTilsynAksjonspunkt([lagAksjonspunkt('9200', 'OPPR')], 'NATTEVÅK', true);
    expect(lagEtablertTilsynAksjonspunktData(tilstand, 'Nattevåk er behandlet', { periode, vurderinger })).toEqual({
      kode: '9200',
      begrunnelse: 'Nattevåk er behandlet',
      vurderinger,
    });
  });
});
