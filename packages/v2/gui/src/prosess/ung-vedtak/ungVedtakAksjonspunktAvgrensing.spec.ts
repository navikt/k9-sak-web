import { describe, it, expect } from 'vitest';
import type { BekreftetAksjonspunktDto } from '@k9-sak-web/backend/ungsak/kontrakt/aksjonspunkt/BekreftetAksjonspunktDto.js';
import {
  isVedtakAksjonspunktDto,
  isVedtakBekreftetAksjonspunktDto,
  type VedtakAksjonspunktDto,
  type VedtakBekreftetAksjonspunktDto,
} from './ungVedtakAksjonspunktAvgrensing.js';
import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/combined/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { ignoreUnusedDeclared } from '../../storybook/mocks/ignoreUnusedDeclared.js';
import type { AksjonspunktDto } from '@k9-sak-web/backend/ungsak/kontrakt/aksjonspunkt/AksjonspunktDto.js';

describe('VedtakBekreftetAksjonspunktDto', () => {
  const bekreftet: BekreftetAksjonspunktDto = {
    '@type': AksjonspunktDefinisjon.FORESLÅ_VEDTAK,
    skalBrukeOverstyrendeFritekstBrev: false,
  };
  const bekreftetIkkeVedtak: BekreftetAksjonspunktDto = {
    '@type': AksjonspunktDefinisjon.KONTROLLER_INNTEKT,
    begrunnelse: 'xxxx',
    perioder: [],
  };
  it('should return true when type is matched', () => {
    expect(isVedtakBekreftetAksjonspunktDto(bekreftet)).toBe(true);
    // Sjekk at kompilator er einig
    const typecheck: VedtakBekreftetAksjonspunktDto = bekreftet;
    ignoreUnusedDeclared(typecheck);
  });
  it('should return false when type is not matched', () => {
    // @ts-expect-error Forventer typefeil her, testinput skal ikke matche VedtakBekreftetAksjonspunktDto
    const typecheck: VedtakBekreftetAksjonspunktDto = bekreftetIkkeVedtak;
    ignoreUnusedDeclared(typecheck);
    expect(isVedtakBekreftetAksjonspunktDto(bekreftetIkkeVedtak)).toBe(false);
  });
});

describe('VedtakAksjonspunktDto', () => {
  const ok: AksjonspunktDto = {
    definisjon: AksjonspunktDefinisjon.FORESLÅ_VEDTAK,
    kanLoses: true,
  };
  const ikkeOk: AksjonspunktDto = {
    definisjon: AksjonspunktDefinisjon.KONTROLLER_INNTEKT,
    kanLoses: true,
  };
  it('should return true when type is matched', () => {
    expect(isVedtakAksjonspunktDto(ok)).toBe(true);
    // Sjekk at kompilator er einig
    if (isVedtakAksjonspunktDto(ok)) {
      const typecheck: VedtakAksjonspunktDto = ok;
      ignoreUnusedDeclared(typecheck);
    }
  });
  it('should return false when type is not matched', () => {
    expect(isVedtakAksjonspunktDto(ikkeOk)).toBe(false);
    // Sjekk at kompilator er einig
    // @ts-expect-error Forventer typefeil her.
    const typecheck: VedtakAksjonspunktDto = ok;
    ignoreUnusedDeclared(typecheck);
  });
});
