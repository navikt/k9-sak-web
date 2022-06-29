import React from 'react';
import { expect } from 'chai';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import avklaringsbehovCodes from '@fpsak-frontend/kodeverk/src/beregningAvklaringsbehovCodes';
import VurderVarigEndretEllerNyoppstartetSN, {
  VurderVarigEndretEllerNyoppstartetSN as UnwrappedForm,
  begrunnelseFieldname,
  fastsettInntektFieldname,
  varigEndringRadioname,
} from './VurderVarigEndretEllerNyoppstartetSN';

import shallowWithIntl, { intlMock } from '../../../i18n';

const { VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE } = avklaringsbehovCodes;

const mockAvklaringsbehovMedKodeOgStatus = (apKode, begrunnelse, status) => ({
  definisjon: apKode,
  status: status,
  begrunnelse,
});

const lagAndel = (status, fastsattBelop) => ({
  aktivitetStatus: status,
  beregnetPrAar: 200000,
  overstyrtPrAar: fastsattBelop,
  beregningsperiodeFom: '2015-01-01',
  beregningsperiodeTom: '2017-01-01',
});

describe('<VurderVarigEndretEllerNyoppstartetSN>', () => {
  it('Skal teste at det rendres riktig antall rader', () => {
    const wrapper = shallowWithIntl(
      <UnwrappedForm
        readOnly={false}
        erVarigEndring
        erNyoppstartet
        erVarigEndretNaering={false}
        endretTekst="tekst"
        intl={intlMock}
      />,
    );

    const rows = wrapper.find('Row');
    expect(rows.length).to.equal(2);
  });

  it('Skal teste at buildInitialValues bygges korrekt når tidligere vurdert ingen varig endring', () => {
    const andeler = [
      lagAndel(aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE, null),
      lagAndel(aktivitetStatus.ARBEIDSTAKER, 250000),
    ];
    const avklaringsbehov = [
      mockAvklaringsbehovMedKodeOgStatus(
        VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE,
        'Ok.',
        'UTFO',
      ),
    ];

    const actualValues = VurderVarigEndretEllerNyoppstartetSN.buildInitialValues(andeler, avklaringsbehov);

    const expectedValues = {
      [varigEndringRadioname]: false,
      [begrunnelseFieldname]: 'Ok.',
      [fastsettInntektFieldname]: undefined,
    };
    expect(actualValues).to.deep.equal(expectedValues);
  });

  it('Skal teste at buildInitialValues bygges korrekt når tidligere vurdert til ingen varig endring med fastsatt belop', () => {
    const andeler = [
      lagAndel(aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE, 300000),
      lagAndel(aktivitetStatus.ARBEIDSTAKER, 250000),
    ];
    const avklaringsbehov = [
      mockAvklaringsbehovMedKodeOgStatus(
        VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE,
        'Ok.',
        'UTFO',
      ),
    ];

    const actualValues = VurderVarigEndretEllerNyoppstartetSN.buildInitialValues(andeler, avklaringsbehov);

    const expectedValues = {
      [fastsettInntektFieldname]: '300 000',
      [varigEndringRadioname]: true,
      [begrunnelseFieldname]: 'Ok.',
    };

    expect(actualValues).to.deep.equal(expectedValues);
  });

  it('Skal teste at buildInitialValues bygges korrekt når ikke tidligere vurdert', () => {
    const andeler = [
      lagAndel(aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE, null),
      lagAndel(aktivitetStatus.ARBEIDSTAKER, 250000),
    ];
    const avklaringsbehov = [
      mockAvklaringsbehovMedKodeOgStatus(
        VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE,
        undefined,
        'OPPR',
      ),
    ];

    const actualValues = VurderVarigEndretEllerNyoppstartetSN.buildInitialValues(andeler, avklaringsbehov);

    const expectedValues = {
      [fastsettInntektFieldname]: undefined,
      [varigEndringRadioname]: undefined,
      [begrunnelseFieldname]: '',
    };

    expect(actualValues).to.deep.equal(expectedValues);
  });
});
