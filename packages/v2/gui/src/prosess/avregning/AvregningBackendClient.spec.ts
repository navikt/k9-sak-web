import { beforeEach, describe, expect, test, vi } from 'vitest';
import { K9AvregningBackendClient } from './K9AvregningBackendClient.js';
import { UngAvregningBackendClient } from './UngAvregningBackendClient.js';

const { k9HentVarselbrev, ungHentVarselbrev } = vi.hoisted(() => ({
  k9HentVarselbrev: vi.fn(),
  ungHentVarselbrev: vi.fn(),
}));

vi.mock('@k9-sak-web/backend/k9tilbake/generated/sdk.js', () => ({
  dokument_hentForhåndsvisningVarselbrev: k9HentVarselbrev,
}));
vi.mock('@k9-sak-web/backend/ungtilbake/generated/sdk.js', () => ({
  dokument_hentForhåndsvisningVarselbrev: ungHentVarselbrev,
}));

describe('hentForhåndsvisningVarselbrev', () => {
  beforeEach(() => {
    k9HentVarselbrev.mockReset().mockResolvedValue({ data: new Blob() });
    ungHentVarselbrev.mockReset().mockResolvedValue({ data: new Blob() });
  });

  test('ung-klienten godtar aktivitetspenger', async () => {
    await new UngAvregningBackendClient().hentForhåndsvisningVarselbrev('uuid', 'AVP', 'tekst');

    expect(ungHentVarselbrev).toHaveBeenCalledWith({
      body: { ytelsesbehandlingUuid: 'uuid', fagsakYtelseType: 'AVP', varseltekst: 'tekst' },
    });
  });

  test('ung-klienten godtar ungdomsprogramytelse', async () => {
    await new UngAvregningBackendClient().hentForhåndsvisningVarselbrev('uuid', 'UNG');

    expect(ungHentVarselbrev).toHaveBeenCalledOnce();
  });

  test('k9-klienten godtar pleiepenger', async () => {
    await new K9AvregningBackendClient().hentForhåndsvisningVarselbrev('uuid', 'PSB', 'tekst');

    expect(k9HentVarselbrev).toHaveBeenCalledWith({
      body: { behandlingUuid: 'uuid', fagsakYtelseType: 'PSB', varseltekst: 'tekst' },
    });
  });

  test('k9-klienten avviser ytelsestype som k9-tilbake ikke støtter', async () => {
    await expect(new K9AvregningBackendClient().hentForhåndsvisningVarselbrev('uuid', 'AVP')).rejects.toThrow(
      'Ugyldig fagsak ytelse type',
    );
    expect(k9HentVarselbrev).not.toHaveBeenCalled();
  });
});
