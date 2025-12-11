import {
  k9_oppdrag_kontrakt_kodeverk_FagOmrådeKode,
  k9_oppdrag_kontrakt_kodeverk_MottakerType,
  k9_oppdrag_kontrakt_simulering_v1_RadId,
} from '@k9-sak-web/backend/k9sak/generated/types.js';
import { render, screen } from '@testing-library/react';
import { AvregningTable } from './AvregningTable';

const simuleringResultat = {
  perioderPerMottaker: [],
  periode: { fom: '', tom: '' },
};
const mottaker = {
  mottakerNavn: '',
  mottakerNummer: '',
  mottakerType: k9_oppdrag_kontrakt_kodeverk_MottakerType.ARBG_ORG,
  mottakerIdentifikator: '',
  resultatPerFagområde: [
    {
      fagOmrådeKode: k9_oppdrag_kontrakt_kodeverk_FagOmrådeKode.PLEIEPENGER_SYKT_BARN,
      rader: [
        {
          feltnavn: k9_oppdrag_kontrakt_simulering_v1_RadId.NYTT_BELØP,
          resultaterPerMåned: [],
        },
        {
          feltnavn: k9_oppdrag_kontrakt_simulering_v1_RadId.TIDLIGERE_UTBETALT,
          resultaterPerMåned: [],
        },
        {
          feltnavn: k9_oppdrag_kontrakt_simulering_v1_RadId.DIFFERANSE,
          resultaterPerMåned: [],
        },
      ],
    },
  ],
  nesteUtbPeriode: { fom: '', tom: '' },
  resultatOgMotregningRader: [],
};
const mockProps = {
  toggleDetails: vi.fn(),
  showDetails: [],
  simuleringResultat,
  ingenPerioderMedAvvik: false,
  isUngFagsak: false,
};

describe('<AvregningTable>', () => {
  it('skal ikke vise tabell hvis perioderPerMottaker er tømt array', () => {
    render(<AvregningTable {...mockProps} />);

    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  it('skal vise så mange tabeller som det er mottakere i perioderPerMottaker array', () => {
    const props = {
      ...mockProps,
      simuleringResultat: {
        perioderPerMottaker: [mottaker, mottaker],
        periode: { fom: '', tom: '' },
      },
    };
    render(<AvregningTable {...props} />);

    expect(screen.getAllByRole('table').length).toBe(props.simuleringResultat.perioderPerMottaker.length);
  });

  it('skal vise mottaker navn og nummer hvis mottaker er arbeidsgiver', () => {
    const arbeidsgiver = {
      mottakerNavn: 'Statoil',
      mottakerNummer: '1234567',
      mottakerType: k9_oppdrag_kontrakt_kodeverk_MottakerType.ARBG_ORG,
    };
    const props = {
      ...mockProps,
      simuleringResultat: {
        perioderPerMottaker: [mottaker, { ...mottaker, ...arbeidsgiver }],
        periode: { fom: '', tom: '' },
      },
    };
    render(<AvregningTable {...props} />);

    expect(screen.getByText('Statoil (1234567)')).toBeInTheDocument();
  });
});
