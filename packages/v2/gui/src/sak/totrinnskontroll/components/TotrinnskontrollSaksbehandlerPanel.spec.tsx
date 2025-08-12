import { k9_kodeverk_behandling_BehandlingStatus as BehandlingAksjonspunktDtoBehandlingStatus } from '@navikt/k9-sak-typescript-client';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import TotrinnskontrollSaksbehandlerPanel from './TotrinnskontrollSaksbehandlerPanel';

const getTotrinnsaksjonspunkterFødsel = () => [
  {
    aksjonspunktKode: '5027',
    beregningDto: null,
    besluttersBegrunnelse: undefined,
    opptjeningAktiviteter: [],
    totrinnskontrollGodkjent: undefined,
    vurderPaNyttArsaker: [],
    arbeidsforholdDtos: [],
    beregningDtoer: [],
  },
  {
    aksjonspunktKode: '5001',
    beregningDto: null,
    besluttersBegrunnelse: undefined,
    opptjeningAktiviteter: [],
    totrinnskontrollGodkjent: undefined,
    vurderPaNyttArsaker: [],
    arbeidsforholdDtos: [],
    beregningDtoer: [],
  },
  {
    aksjonspunktKode: '7002',
    beregningDto: null,
    besluttersBegrunnelse: undefined,
    opptjeningAktiviteter: [],
    totrinnskontrollGodkjent: undefined,
    vurderPaNyttArsaker: [],
    arbeidsforholdDtos: [],
    beregningDtoer: [],
  },
];

const getTotrinnsaksjonspunkterOmsorg = () => [
  {
    aksjonspunktKode: '5008',
    beregningDto: null,
    besluttersBegrunnelse: undefined,
    opptjeningAktiviteter: [],
    totrinnskontrollGodkjent: undefined,
    vurderPaNyttArsaker: [],
    arbeidsforholdDtos: [],
    beregningDtoer: [],
  },
  {
    aksjonspunktKode: '5011',
    beregningDto: null,
    besluttersBegrunnelse: undefined,
    opptjeningAktiviteter: [],
    totrinnskontrollGodkjent: undefined,
    vurderPaNyttArsaker: [],
    arbeidsforholdDtos: [],
    beregningDtoer: [],
  },
];

const getTotrinnsaksjonspunkterForeldreansvar = () => [
  {
    aksjonspunktKode: '5014',
    beregningDto: null,
    besluttersBegrunnelse: undefined,
    opptjeningAktiviteter: [],
    totrinnskontrollGodkjent: undefined,
    vurderPaNyttArsaker: [],
    arbeidsforholdDtos: [],
    beregningDtoer: [],
  },
  {
    aksjonspunktKode: '5013',
    beregningDto: null,
    besluttersBegrunnelse: undefined,
    opptjeningAktiviteter: [],
    totrinnskontrollGodkjent: undefined,
    vurderPaNyttArsaker: [],
    arbeidsforholdDtos: [],
    beregningDtoer: [],
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
    render(
      <MemoryRouter>
        <TotrinnskontrollSaksbehandlerPanel
          totrinnskontrollSkjermlenkeContext={totrinnskontrollSkjermlenkeContext}
          behandlingStatus={BehandlingAksjonspunktDtoBehandlingStatus.UTREDES}
          arbeidsforholdHandlingTyper={[]}
          erTilbakekreving={false}
          vurderArsaker={[]}
          skjermlenkeTyper={[
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
    );

    expect(screen.getByRole('link', { name: 'Fødsel' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Omsorg' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Foreldreansvar' })).toBeInTheDocument();
    expect(
      screen.getAllByText(
        (_, element) =>
          element?.textContent === 'Løst aksjonspunkt: Kontroller endrede opplysninger og faglige vurderinger',
      )[0],
    ).toBeInTheDocument();
  });
});
