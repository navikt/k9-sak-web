import { intlWithMessages } from '@fpsak-frontend/utils-test/intl-test-helper';
import { renderWithIntlAndReduxForm } from '@fpsak-frontend/utils-test/test-utils';
import { screen } from '@testing-library/react';
import React from 'react';
import messages from '../../i18n/nb_NO.json';
import vergeType from '../kodeverk/vergeType';
import RegistrereVergeFaktaForm from './RegistrereVergeFaktaForm';

const intlMock = intlWithMessages(messages);

const vergetyper = [
  {
    kode: vergeType.BARN,
    navn: 'Barn',
  },
  {
    kode: vergeType.ANNEN_F,
    navn: 'Annen foreldre',
  },
];

describe('<RegistrereVergeFaktaForm>', () => {
  it('skal vise kun dropdown for vergetype når dette ikke er satt', () => {
    renderWithIntlAndReduxForm(
      <RegistrereVergeFaktaForm
        intl={intlMock}
        readOnly={false}
        vergetyper={vergetyper}
        alleMerknaderFraBeslutter={{}}
      />,
    );

    expect(screen.getByRole('combobox', { name: 'Type verge' })).toBeInTheDocument();
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('skal vise alle felter når dette vergetype er valgt', () => {
    renderWithIntlAndReduxForm(
      <RegistrereVergeFaktaForm
        intl={intlMock}
        readOnly={false}
        vergetyper={vergetyper}
        alleMerknaderFraBeslutter={{}}
        valgtVergeType={vergeType.BARN}
      />,
    );

    expect(screen.getByRole('combobox', { name: 'Type verge' })).toBeInTheDocument();
    expect(screen.getAllByRole('textbox').length).toBe(4);
  });

  it('skal sette opp initielle verdier fra behandling', () => {
    const verge = {
      navn: 'Tester',
      gyldigFom: '2017',
      gyldigTom: '2018',
      fnr: '1234',
      vergeType: { kode: vergeType.BARN },
    };

    const initialValues = RegistrereVergeFaktaForm.buildInitialValues(verge);

    expect(initialValues).toStrictEqual({
      navn: 'Tester',
      gyldigFom: '2017',
      gyldigTom: '2018',
      fnr: '1234',
      organisasjonsnummer: undefined,
      vergeType: vergeType.BARN,
    });
  });
});
