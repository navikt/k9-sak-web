import BarnFaktaIndex from '@k9-sak-web/fakta-barn-oms';
import BarnOmsFaktaIndex from '@k9-sak-web/gui/fakta/barn-oms/BarnOmsFaktaIndex.js';
import { describe, expect, it } from 'vitest';
import BarnFaktaPanelDef from './BarnFaktaPanelDef';

const lagProps = (BRUK_V2_BARN_OMS: boolean) => ({
  featureToggles: { BRUK_V2_BARN_OMS },
  behandling: { uuid: 'test-behandling-uuid', versjon: 3, links: [] },
  barn: [],
  alleKodeverk: {},
});

describe('BarnFaktaPanelDef (unntak)', () => {
  const panelDef = new BarnFaktaPanelDef();

  it('bruker v1 når feature toggle er av', () => {
    const element = panelDef.getKomponent(lagProps(false));

    expect(element.type).toBe(BarnFaktaIndex);
    expect(element.props).toEqual({ behandlingUuid: 'test-behandling-uuid' });
  });

  it('sender kun uuid og versjon til v2 når feature toggle er på', () => {
    const element = panelDef.getKomponent(lagProps(true));

    expect(element.type).toBe(BarnOmsFaktaIndex);
    expect(element.props).toEqual({ behandlingUuid: 'test-behandling-uuid', behandlingVersjon: 3 });
  });

  it.each([true, false])('viser panelet bare når forbrukte dager finnes (toggle %s)', BRUK_V2_BARN_OMS => {
    const featureToggles = { BRUK_V2_BARN_OMS };

    expect(panelDef.skalVisePanel([], { forbrukteDager: {} }, featureToggles)).toBe(true);
    expect(panelDef.skalVisePanel([], { forbrukteDager: undefined }, featureToggles)).toBe(false);
  });

  it('beholder getData uendret', () => {
    expect(panelDef.getData({ forbrukteDager: { barna: [{ personIdent: '1' }] } })).toEqual({
      barn: [{ personIdent: '1' }],
    });
  });
});
