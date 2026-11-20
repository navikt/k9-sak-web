import VergeFaktaIndex from '@fpsak-frontend/fakta-verge';
import BekreftVergeFakta from '@k9-sak-web/gui/fakta/verge/BekreftVergeFakta.js';
import { describe, expect, it, vi } from 'vitest';
import VergeFaktaPanelDef from './VergeFaktaPanelDef';

const submitCallback = vi.fn();

const lagProps = (BRUK_V2_VERGE: boolean, statusKode = 'OPPR') => ({
  featureToggles: { BRUK_V2_VERGE },
  behandling: { id: 1, versjon: 3, uuid: 'behandling-uuid' },
  aksjonspunkter: [
    {
      definisjon: { kode: '5030', kodeverk: 'AKSJONSPUNKT_DEF' },
      status: { kode: statusKode, kodeverk: 'AKSJONSPUNKT_STATUS' },
      begrunnelse: 'Lagret begrunnelse',
      kanLoses: true,
      erAktivt: true,
    },
  ],
  readOnly: false,
  submittable: true,
  harApneAksjonspunkter: true,
  alleMerknaderFraBeslutter: {},
  alleKodeverk: {},
  submitCallback,
});

describe('VergeFaktaPanelDef (omsorgspenger)', () => {
  const panelDef = new VergeFaktaPanelDef();

  it('bruker v1 med alle props når feature toggle er av', () => {
    const props = lagProps(false);
    const element = panelDef.getKomponent(props);

    expect(element.type).toBe(VergeFaktaIndex);
    expect(element.props).toEqual(props);
  });

  it('sender kun navngitte props med status og begrunnelse fra legacy aksjonspunkt til v2', () => {
    const element = panelDef.getKomponent(lagProps(true));

    expect(element.type).toBe(BekreftVergeFakta);
    expect(element.props).toEqual({
      aksjonspunktStatus: 'OPPR',
      lagretBegrunnelse: 'Lagret begrunnelse',
      readOnly: false,
      submittable: true,
      submitCallback,
    });
  });

  it('sender ukjent status som undefined til v2', () => {
    expect(panelDef.getKomponent(lagProps(true, 'UKJENT')).props.aksjonspunktStatus).toBeUndefined();
  });
});
