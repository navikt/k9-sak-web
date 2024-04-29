import { renderWithIntl } from '@fpsak-frontend/utils-test/test-utils';
import { screen } from '@testing-library/react';
import React from 'react';
import messages from '../../i18n/nb_NO.json';
import AvregningTable from './AvregningTable';

const simuleringResultat = {
  perioderPerMottaker: [],
  periode: {},
};
const mottaker = {
  mottakerNavn: '',
  mottakerNummer: '',
  mottakerType: {
    kode: '',
    kodeverk: '',
  },
  mottakerIdentifikator: '',
  resultatPerFagområde: [
    {
      fagOmrådeKode: {
        kode: '',
        kodeverk: '',
      },
      rader: [
        {
          feltnavn: '',
          resultaterPerMåned: [],
        },
        {
          feltnavn: '',
          resultaterPerMåned: [],
        },
        {
          feltnavn: '',
          resultaterPerMåned: [],
        },
      ],
    },
  ],
  nesteUtbPeriode: {},
  resultatOgMotregningRader: [],
};
const mockProps = {
  toggleDetails: vi.fn(),
  showDetails: [],
  simuleringResultat,
  ingenPerioderMedAvvik: false,
};

describe('<AvregningTable>', () => {
  it('skal ikke vise tabell hvis perioderPerMottaker er tømt array', () => {
    renderWithIntl(<AvregningTable {...mockProps} />, { messages });

    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  it('skal vise så mange tabeller som det er mottakere i perioderPerMottaker array', () => {
    const props = {
      ...mockProps,
      simuleringResultat: {
        perioderPerMottaker: [mottaker, mottaker],
        periode: {},
      },
    };
    renderWithIntl(<AvregningTable {...props} />, { messages });

    expect(screen.getAllByRole('table').length).toBe(props.simuleringResultat.perioderPerMottaker.length);
  });

  it('skal vise så mange rader i tabell som det er rader i resultatPerFagområde og resultatOgMotregningRader arrays', () => {
    const props = {
      ...mockProps,
      simuleringResultat: {
        perioderPerMottaker: [mottaker],
        periode: {},
      },
    };
    const { container } = renderWithIntl(<AvregningTable {...props} />, { messages });

    expect(container.getElementsByTagName('tbody')[0].getElementsByTagName('tr').length).toBe(
      props.simuleringResultat.perioderPerMottaker.reduce(
        (acc, obj) => acc + obj.resultatPerFagområde.reduce((acc2, obj2) => acc2 + obj2.rader.length, 0),
        0,
      ) +
        props.simuleringResultat.perioderPerMottaker.reduce(
          (acc, obj) => acc + obj.resultatOgMotregningRader.length,
          0,
        ),
    );
  });

  it('skal vise mottaker navn og nummer hvis mottaker er arbeidsgiver', () => {
    const arbeidsgiver = {
      mottakerNavn: 'Statoil',
      mottakerNummer: '1234567',
      mottakerType: {
        kode: 'ARBG_ORG',
        kodeverk: '',
      },
    };
    const props = {
      ...mockProps,
      simuleringResultat: {
        perioderPerMottaker: [mottaker, { ...mottaker, ...arbeidsgiver }],
        periode: {},
      },
    };
    renderWithIntl(<AvregningTable {...props} />, { messages });

    expect(screen.getByText('Statoil (1234567)')).toBeInTheDocument();
  });
});
