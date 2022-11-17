import React from 'react';
import { shallow } from 'enzyme';

import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';

import TotrinnskontrollSaksbehandlerPanel from './TotrinnskontrollSaksbehandlerPanel';

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

const totrinnskontrollSkjermlenkeContext = [
  {
    skjermlenkeType: 'FOEDSEL',
    totrinnskontrollAksjonspunkter: getTotrinnsaksjonspunkterFødsel(),
  },
  {
    skjermlenkeType: 'OMSORG',
    totrinnskontrollAksjonspunkter: getTotrinnsaksjonspunkterOmsorg(),
  },
  {
    skjermlenkeType: 'FORELDREANSVAR',
    totrinnskontrollAksjonspunkter: getTotrinnsaksjonspunkterForeldreansvar(),
  },
];

const location = {
  key: '1',
  pathname: '',
  search: '',
  state: {},
  hash: '',
};

describe('<TotrinnskontrollSaksbehandlerPanel>', () => {
  it('skal vise korrekt antall element og navn', () => {
    const wrapper = shallow(
      <TotrinnskontrollSaksbehandlerPanel
        totrinnskontrollSkjermlenkeContext={totrinnskontrollSkjermlenkeContext}
        behandlingStatus={behandlingStatus.BEHANDLING_UTREDES}
        arbeidsforholdHandlingTyper={[]}
        erTilbakekreving={false}
        vurderArsaker={[]}
        skjemalenkeTyper={[
          {
            kode: 'FOEDSEL',
            navn: 'Fødsel',
            kodeverk: '',
          },
          {
            kode: 'OMSORG',
            navn: 'Omsorg',
            kodeverk: '',
          },
          {
            kode: 'FORELDREANSVAR',
            navn: 'Foreldreansvar',
            kodeverk: '',
          },
        ]}
        lagLenke={() => location}
      />,
    );
    const navFieldGroup = wrapper.find('NavLink');
    expect(navFieldGroup).toHaveLength(3);
    const normaltekst = wrapper.find('pre');
    expect(normaltekst).toHaveLength(7);
  });
});
