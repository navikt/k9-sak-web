import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import AvregningTable from './AvregningTable';

const simuleringResultat = {
  perioderPerMottaker: [],
  periode: {},
};
const mottaker = {
  mottakerNavn: '',
  mottakerNummer: '',
  mottakerType: '',
  resultatPerFagområde: [
    {
      fagOmrådeKode: '',
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
  toggleDetails: sinon.spy(),
  showDetails: [],
  simuleringResultat,
  ingenPerioderMedAvvik: false,
};

describe('<AvregningTable>', () => {
  it('skal ikke vise tabele hvis perioderPerMottaker er tømt array', () => {
    const wrapper = shallow(<AvregningTable {...mockProps} />);

    const table = wrapper.find('Table');
    expect(table).to.have.length(0);
  });

  it('skal vise så mange tabeller som det er mottakere i perioderPerMottaker array', () => {
    const props = {
      ...mockProps,
      simuleringResultat: {
        perioderPerMottaker: [mottaker, mottaker],
        periode: {},
      },
    };
    const wrapper = shallow(<AvregningTable {...props} />);

    const table = wrapper.find('Table');
    expect(table).to.have.length(2);
  });

  it('skal vise så mange rader i tabele som det er rader i resultatPerFagområde og resultatOgMotregningRader arrays', () => {
    const props = {
      ...mockProps,
      simuleringResultat: {
        perioderPerMottaker: [mottaker],
        periode: {},
      },
    };
    const wrapper = shallow(<AvregningTable {...props} />);

    const tableRow = wrapper.find('TableRow');
    expect(tableRow).to.have.length(3);
  });

  it('skal vise mottaker navn og nummer hvis mottaker er arbeidsgiver', () => {
    const arbeidsgiver = {
      mottakerNavn: 'Statoil',
      mottakerNummer: '1234567',
      mottakerType: 'ARBG_ORG',
    };
    const props = {
      ...mockProps,
      simuleringResultat: {
        perioderPerMottaker: [mottaker, { ...mottaker, ...arbeidsgiver }],
        periode: {},
      },
    };
    const wrapper = shallow(<AvregningTable {...props} />);

    const normaltekst = wrapper.find('Normaltekst');
    expect(normaltekst).to.have.length(1);
    expect(normaltekst.html()).to.equal('<p class="typo-normal tableTitle">Statoil (1234567)</p>');
  });
});
