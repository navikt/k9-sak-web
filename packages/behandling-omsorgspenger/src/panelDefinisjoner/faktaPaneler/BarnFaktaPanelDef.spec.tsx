import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import BarnFaktaIndex from '@k9-sak-web/fakta-barn-oms';
import BarnOmsFaktaIndex from '@k9-sak-web/gui/fakta/barn-oms/BarnOmsFaktaIndex.js';
import { describe, expect, it } from 'vitest';
import BarnFaktaPanelDef from './BarnFaktaPanelDef';

const lagProps = (BRUK_V2_BARN_OMS: boolean) => ({
  featureToggles: { BRUK_V2_BARN_OMS },
  behandling: { uuid: 'test-behandling-uuid', versjon: 3, links: [] },
  fagsak: { sakstype: fagsakYtelsesType.OMSORGSPENGER },
  alleKodeverk: {},
});

describe('BarnFaktaPanelDef (omsorgspenger)', () => {
  const panelDef = new BarnFaktaPanelDef();

  it('bruker v1 når feature toggle er av', () => {
    const element = panelDef.getKomponent(lagProps(false));

    expect(element.type).toBe(BarnFaktaIndex);
    expect(element.props).toEqual({
      behandlingUuid: 'test-behandling-uuid',
      fagsaksType: fagsakYtelsesType.OMSORGSPENGER,
    });
  });

  it('sender kun nødvendige props til v2 når feature toggle er på', () => {
    const element = panelDef.getKomponent(lagProps(true));

    expect(element.type).toBe(BarnOmsFaktaIndex);
    expect(element.props).toEqual({
      behandlingUuid: 'test-behandling-uuid',
      behandlingVersjon: 3,
      fagsakYtelseType: fagsakYtelsesType.OMSORGSPENGER,
    });
  });

  it.each([true, false])('viser panelet bare når forbrukte dager finnes (toggle %s)', BRUK_V2_BARN_OMS => {
    const featureToggles = { BRUK_V2_BARN_OMS };

    expect(panelDef.skalVisePanel([], { forbrukteDager: {} }, featureToggles)).toBe(true);
    expect(panelDef.skalVisePanel([], { forbrukteDager: undefined }, featureToggles)).toBe(false);
  });
});
