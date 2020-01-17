import getAksjonspunktTextSelector from '@fpsak-frontend/sak-totrinnskontroll/src/components/ApprovalTextUtils';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import TilbakemeldingerFraTotrinnskontroll from './TilbakemeldingerFraTotrinnskontroll';

const getTotrinnsaksjonspunkterFødsel = () => [
  {
    aksjonspunktKode: '5027',
    beregningDto: null,
    besluttersBegrunnelse: null,
    opptjeningAktiviteter: [],
    totrinnskontrollGodkjent: null,
    vurderPaNyttArsaker: [],
  },
  {
    aksjonspunktKode: '5001',
    beregningDto: null,
    besluttersBegrunnelse: null,
    opptjeningAktiviteter: [],
    totrinnskontrollGodkjent: null,
    vurderPaNyttArsaker: [],
  },
  {
    aksjonspunktKode: '7002',
    beregningDto: null,
    besluttersBegrunnelse: null,
    opptjeningAktiviteter: [],
    totrinnskontrollGodkjent: null,
    vurderPaNyttArsaker: [],
  },
];

const getTotrinnsaksjonspunkterOmsorg = () => [
  {
    aksjonspunktKode: '5008',
    beregningDto: null,
    besluttersBegrunnelse: null,
    opptjeningAktiviteter: [],
    totrinnskontrollGodkjent: null,
    vurderPaNyttArsaker: [],
  },
  {
    aksjonspunktKode: '5011',
    beregningDto: null,
    besluttersBegrunnelse: null,
    opptjeningAktiviteter: [],
    totrinnskontrollGodkjent: null,
    vurderPaNyttArsaker: [],
  },
];

const getTotrinnsaksjonspunkterForeldreansvar = () => [
  {
    aksjonspunktKode: '5014',
    beregningDto: null,
    besluttersBegrunnelse: null,
    opptjeningAktiviteter: [],
    totrinnskontrollGodkjent: null,
    vurderPaNyttArsaker: [],
  },
  {
    aksjonspunktKode: '5013',
    beregningDto: null,
    besluttersBegrunnelse: null,
    opptjeningAktiviteter: [],
    totrinnskontrollGodkjent: null,
    vurderPaNyttArsaker: [],
  },
];

describe('<ToTrinnsFormReadOnly>', () => {
  it('skal vise korrekt antall element og navn', () => {
    const aksjonspunkterFødsel = getTotrinnsaksjonspunkterFødsel();
    const aksjonspunkterOmsorg = getTotrinnsaksjonspunkterOmsorg();
    const aksjonspunkterForeldreansvar = getTotrinnsaksjonspunkterForeldreansvar();

    const approvalList = [
      {
        contextCode: 'FOEDSEL',
        skjermlenkeId: 'Behandlingspunkt.Fodselsvilkaret',
        skjermlenke: 'testLocation',
        aksjonspunkter: aksjonspunkterFødsel,
        skjermlenkeNavn: '',
      },
      {
        contextCode: 'OMSORG',
        skjermlenkeId: 'Behandlingspunkt.Omsorgsvilkaret',
        skjermlenke: 'testLocation',
        aksjonspunkter: aksjonspunkterOmsorg,
        skjermlenkeNavn: '',
      },
      {
        contextCode: 'FORELDREANSVAR',
        skjermlenkeId: 'Behandlingspunkt.Foreldreansvar',
        skjermlenke: 'testLocation',
        aksjonspunkter: aksjonspunkterForeldreansvar,
        skjermlenkeNavn: '',
      },
    ];

    const wrapper = shallow(
      <TilbakemeldingerFraTotrinnskontroll
        approvalList={approvalList}
        getAksjonspunktText={getAksjonspunktTextSelector.resultFunc(true, null, null, null)}
      />,
    );
    const navFieldGroup = wrapper.find('NavLink');
    expect(navFieldGroup).to.have.length(3);
    const normaltekst = wrapper.find('pre');
    expect(normaltekst).to.have.length(7);
  });
});
