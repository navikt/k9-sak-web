import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { BarnOmsFakta } from '@k9-sak-web/gui/fakta/barn-oms/BarnOmsFakta.js';
import { describe, expect, it } from 'vitest';
import UtvidetRettBarnFakta from '../../components/UtvidetRettBarnFakta/UtvidetRettBarnFakta';
import BarnFaktaPanelDef from './BarnFaktaPanelDef';

const personopplysninger = {
  barn: [
    { fnr: '01011012345', fodselsdato: '2010-01-01' },
    { fnr: '02021254321', fodselsdato: '2012-02-02' },
  ],
  barnSoktFor: [{ fnr: '03031598765', fodselsdato: '2015-03-03' }],
};

const rammevedtak = [{ type: 'UtvidetRett', utvidetRettFor: '03031598765' }];

const lagProps = (BRUK_V2_BARN_OMS: boolean, fagsaksType: string) => ({
  featureToggles: { BRUK_V2_BARN_OMS },
  behandling: { uuid: 'test-behandling-uuid', versjon: 3, links: [] },
  personopplysninger,
  rammevedtak,
  fagsaksType,
});

describe('BarnFaktaPanelDef (utvidet rett)', () => {
  const panelDef = new BarnFaktaPanelDef();

  it('bruker v1 når feature toggle er av', () => {
    const element = panelDef.getKomponent(lagProps(false, fagsakYtelsesType.OMSORGSPENGER_KS));

    expect(element.type).toBe(UtvidetRettBarnFakta);
    expect(element.props).toEqual({
      personopplysninger,
      fagsaksType: fagsakYtelsesType.OMSORGSPENGER_KS,
      rammevedtak,
    });
  });

  it('sender barnet det er søkt for til v2 for kronisk sykt barn', () => {
    const element = panelDef.getKomponent(lagProps(true, fagsakYtelsesType.OMSORGSPENGER_KS));

    expect(element.type).toBe(BarnOmsFakta);
    expect(element.props).toEqual({
      barn: [{ personIdent: '03031598765', fødselsdato: '2015-03-03', barnType: 'VANLIG' }],
      rammevedtak,
      fagsakYtelseType: fagsakYtelsesType.OMSORGSPENGER_KS,
    });
  });

  it.each([fagsakYtelsesType.OMSORGSPENGER_MA, fagsakYtelsesType.OMSORGSPENGER_AO])(
    'sender registrerte barn til v2 for %s',
    fagsaksType => {
      const element = panelDef.getKomponent(lagProps(true, fagsaksType));

      expect(element.type).toBe(BarnOmsFakta);
      expect(element.props.barn).toEqual([
        { personIdent: '01011012345', fødselsdato: '2010-01-01', barnType: 'VANLIG' },
        { personIdent: '02021254321', fødselsdato: '2012-02-02', barnType: 'VANLIG' },
      ]);
      expect(element.props.fagsakYtelseType).toBe(fagsaksType);
    },
  );

  it('sender tom barneliste til v2 uten personopplysninger', () => {
    const element = panelDef.getKomponent({
      ...lagProps(true, fagsakYtelsesType.OMSORGSPENGER_KS),
      personopplysninger: undefined,
    });

    expect(element.props.barn).toEqual([]);
  });

  it.each([true, false])('viser panelet når rammevedtak er hentet (toggle %s)', BRUK_V2_BARN_OMS => {
    const featureToggles = { BRUK_V2_BARN_OMS };

    expect(panelDef.skalVisePanel([], { rammevedtak: {} }, featureToggles)).toBe(true);
    expect(panelDef.skalVisePanel([], { rammevedtak: undefined }, featureToggles)).toBe(false);
  });
});
