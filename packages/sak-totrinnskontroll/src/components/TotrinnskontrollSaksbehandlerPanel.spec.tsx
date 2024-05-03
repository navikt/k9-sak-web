import behandlingStatus from '@k9-sak-web/kodeverk/src/behandlingStatus';
import { renderWithIntl } from '@k9-sak-web/utils-test/test-utils';
import { screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router';
import messages from '../../i18n/nb_NO.json';
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
    renderWithIntl(
      <MemoryRouter>
        <TotrinnskontrollSaksbehandlerPanel
          totrinnskontrollSkjermlenkeContext={totrinnskontrollSkjermlenkeContext}
          behandlingStatus={{
            kode: behandlingStatus.BEHANDLING_UTREDES,
            kodeverk: '',
          }}
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
        />
      </MemoryRouter>,
      { messages },
    );

    expect(screen.getByRole('link', { name: 'Fødsel' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Omsorg' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Foreldreansvar' })).toBeInTheDocument();
    expect(
      screen.getAllByText(
        (_, element) =>
          element.textContent === 'Løst aksjonspunkt: Kontroller endrede opplysninger og faglige vurderinger',
      )[0],
    ).toBeInTheDocument();
  });
});
