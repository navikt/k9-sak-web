import innsynResultatTyperKV from '@fpsak-frontend/kodeverk/src/innsynResultatType';
import { renderWithIntlAndReduxForm } from '@fpsak-frontend/utils-test';
import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';
import { screen } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import { intlMock } from '../../i18n';
import messages from '../../i18n/nb_NO.json';
import { InnsynFormImpl } from './InnsynForm';

describe('<InnsynForm>', () => {
  it('skal vise radioknapper for valg av sett på vent når innvilget', () => {
    renderWithIntlAndReduxForm(
      <InnsynFormImpl
        {...reduxFormPropsMock}
        intl={intlMock}
        readOnly={false}
        isSubmittable
        innsynResultatTyper={[{ kode: innsynResultatTyperKV.INNVILGET, navn: 'navnTest' }]}
        innsynResultatType={innsynResultatTyperKV.INNVILGET}
        behandlingTypes={[{ kode: 'kodeTest', navn: 'navnTest' }]}
        saksNr={123}
        documents={[]}
        vedtaksdokumenter={[]}
        isApOpen
      />,
      { messages },
    );

    expect(screen.getByRole('radio', { name: 'Sett behandling på vent i påvente av skanning' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Foreslå og fatte vedtak' })).toBeInTheDocument();
  });

  it('skal ikke vise radioknapper for valg av sett på vent når innvilget', () => {
    renderWithIntlAndReduxForm(
      <InnsynFormImpl
        {...reduxFormPropsMock}
        intl={intlMock}
        readOnly={false}
        isSubmittable
        innsynResultatTyper={[{ kode: innsynResultatTyperKV.AVVIST, navn: 'navnTest' }]}
        innsynResultatType={innsynResultatTyperKV.AVVIST}
        behandlingTypes={[{ kode: 'kodeTest', navn: 'navnTest' }]}
        saksNr={123}
        documents={[]}
        vedtaksdokumenter={[]}
        isApOpen
      />,
      { messages },
    );
    expect(
      screen.queryByRole('radio', { name: 'Sett behandling på vent i påvente av skanning' }),
    ).not.toBeInTheDocument();
    expect(screen.queryByRole('radio', { name: 'Foreslå og fatte vedtak' })).not.toBeInTheDocument();
  });
});
