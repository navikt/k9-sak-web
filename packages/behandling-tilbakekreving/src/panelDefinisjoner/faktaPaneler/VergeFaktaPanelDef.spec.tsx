import VergeFaktaIndex from '@fpsak-frontend/fakta-verge';
import RegistrerVergeFaktaIndex from '@k9-sak-web/gui/fakta/verge/RegistrerVergeFaktaIndex.js';
import { describe, expect, it, vi } from 'vitest';
import { TilbakekrevingBehandlingApiKeys } from '../../data/tilbakekrevingBehandlingApi';
import VergeFaktaPanelDef from './VergeFaktaPanelDef';

const submitCallback = vi.fn();

const lagProps = (BRUK_V2_VERGE: boolean) => ({
  featureToggles: { BRUK_V2_VERGE },
  behandling: { id: 1, versjon: 3, uuid: 'behandling-uuid' },
  aksjonspunkter: [
    {
      definisjon: { kode: '5030', kodeverk: 'AKSJONSPUNKT_DEF' },
      status: { kode: 'UTFO', kodeverk: 'AKSJONSPUNKT_STATUS' },
      kanLoses: true,
      erAktivt: true,
    },
  ],
  verge: { navn: 'Legacy verge' },
  readOnly: false,
  submittable: true,
  harApneAksjonspunkter: false,
  alleMerknaderFraBeslutter: {},
  alleKodeverk: {},
  submitCallback,
});

describe('VergeFaktaPanelDef (tilbakekreving)', () => {
  const panelDef = new VergeFaktaPanelDef();

  it('bruker v1 med alle props og henter verge via legacy-endepunktet når feature toggle er av', () => {
    const props = lagProps(false);
    const element = panelDef.getKomponent(props);

    expect(element.type).toBe(VergeFaktaIndex);
    expect(element.props).toEqual(props);
    expect(panelDef.getEndepunkter(props.featureToggles)).toEqual([TilbakekrevingBehandlingApiKeys.VERGE]);
  });

  it('sender kun navngitte props til v2 og henter ikke verge via legacy-endepunktet når feature toggle er på', () => {
    const props = lagProps(true);
    const element = panelDef.getKomponent(props);

    expect(element.type).toBe(RegistrerVergeFaktaIndex);
    expect(element.props).toEqual({
      behandlingUuid: 'behandling-uuid',
      behandlingVersjon: 3,
      aksjonspunktStatus: 'UTFO',
      readOnly: false,
      submittable: true,
      submitCallback,
    });
    expect(panelDef.getEndepunkter(props.featureToggles)).toEqual([]);
  });
});
