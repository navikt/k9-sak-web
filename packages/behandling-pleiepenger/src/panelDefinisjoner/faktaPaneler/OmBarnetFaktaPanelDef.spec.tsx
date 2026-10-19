import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import OmBarnetFaktaIndex from '@k9-sak-web/gui/fakta/om-barnet/OmBarnetFaktaIndex.js';
import { describe, expect, it, vi } from 'vitest';
import OmBarnet from '../../components/OmBarnet';
import OmBarnetFaktaPanelDef from './OmBarnetFaktaPanelDef';

const lagProps = ({
  featureToggles = { BRUK_V2_OM_BARNET: true },
  aksjonspunkter = [{ definisjon: { kode: AksjonspunktDefinisjon.VURDER_RETT_ETTER_PLEIETRENGENDES_DØD } }],
  readOnly = false,
  submittable = true,
}: {
  featureToggles?: { BRUK_V2_OM_BARNET: boolean };
  aksjonspunkter?: { definisjon: { kode: string } }[];
  readOnly?: boolean;
  submittable?: boolean;
} = {}) => ({
  featureToggles,
  behandling: { uuid: 'test-behandling-uuid', versjon: 3, links: [] },
  aksjonspunkter,
  readOnly,
  submittable,
  submitCallback: vi.fn(),
  alleKodeverk: {},
});

describe('OmBarnetFaktaPanelDef', () => {
  const panelDef = new OmBarnetFaktaPanelDef();

  it('knytter panelet til aksjonspunkt 9202', () => {
    expect(panelDef.getAksjonspunktKoder()).toEqual(['9202']);
  });

  it('bruker v1 når feature toggle er av', () => {
    const element = panelDef.getKomponent(lagProps({ featureToggles: { BRUK_V2_OM_BARNET: false } }));

    expect(element.type).toBe(OmBarnet);
  });

  it('sender kun nødvendige props til v2 når feature toggle er på', () => {
    const props = lagProps();

    const element = panelDef.getKomponent(props);

    expect(element.type).toBe(OmBarnetFaktaIndex);
    expect(element.props).toEqual({
      behandlingUuid: 'test-behandling-uuid',
      behandlingVersjon: 3,
      readOnly: false,
      submittable: true,
      harAksjonspunkt: true,
      submitCallback: props.submitCallback,
    });
  });

  it('sender harAksjonspunkt false til v2 uten aksjonspunkt 9202', () => {
    const element = panelDef.getKomponent(lagProps({ aksjonspunkter: [] }));

    expect(element.props.harAksjonspunkt).toBe(false);
  });

  it('bevarer readOnly og submittable fra skallet', () => {
    const element = panelDef.getKomponent(lagProps({ readOnly: true, submittable: false }));

    expect(element.props.readOnly).toBe(true);
    expect(element.props.submittable).toBe(false);
  });
});
