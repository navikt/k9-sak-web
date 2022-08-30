import { expect } from 'chai';
import { submitKnappTekst } from './VedtakRevurderingSubmitPanel';

describe('<VedtakRevurderingSubmitPanel>', () => {
  it('knapp skal vise til godkjenning tekst når det finnes aktive aksjonspunkter som skal til totrinn', () => {
    const aksjonspunkter = [
      { kode: '5058', erAktivt: true, toTrinnsBehandling: false },
      { kode: '5027', erAktivt: true, toTrinnsBehandling: true },
    ];
    const tekstId = submitKnappTekst(aksjonspunkter);
    expect(tekstId).to.equal('VedtakForm.TilGodkjenning');
  });

  it('knapp skal vise fatt vedtak tekst når det finnes inaktive aksjonspunkter som skal til totrinn', () => {
    const aksjonspunkter = [
      { kode: '5058', erAktivt: true, toTrinnsBehandling: false },
      { kode: '5027', erAktivt: false, toTrinnsBehandling: true },
    ];
    const tekstId = submitKnappTekst(aksjonspunkter);
    expect(tekstId).to.equal('VedtakForm.FattVedtak');
  });

  it('knapp skal vise fatt vedtak tekst når det ikkje finnes aksjonspunkter som skal til totrinn', () => {
    const aksjonspunkter = [
      { kode: '5058', erAktivt: true, toTrinnsBehandling: false },
      { kode: '5027', erAktivt: true, toTrinnsBehandling: false },
    ];
    const tekstId = submitKnappTekst(aksjonspunkter);
    expect(tekstId).to.equal('VedtakForm.FattVedtak');
  });
});
