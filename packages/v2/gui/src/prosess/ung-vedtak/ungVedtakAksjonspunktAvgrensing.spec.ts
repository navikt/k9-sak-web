import { describe, it, expect } from 'vitest';
import { isVedtakAksjonspunktDto, type VedtakAksjonspunktDto } from './ungVedtakAksjonspunktAvgrensing.js';
import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/combined/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { ignoreUnusedDeclared } from '../../storybook/mocks/ignoreUnusedDeclared.js';
import type { AksjonspunktDto } from '@k9-sak-web/backend/ungsak/kontrakt/aksjonspunkt/AksjonspunktDto.js';

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
