import { renderWithIntlAndReduxForm } from '@fpsak-frontend/utils-test';
import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';
import { screen } from '@testing-library/react';
import { expect } from 'chai';
import React from 'react';
import { reduxForm } from 'redux-form';
import { intlMock } from '../../i18n';
import messages from '../../i18n/nb_NO.json';
import { VurderSoknadsfristPleiepengerFormImpl as UnwrappedForm } from './VurderSoknadsfristPleiepengerForm';

describe('<VurderSoknadsfristPleiepengerForm>', () => {
  const MockForm = reduxForm({ form: 'mock', onSubmit: vi.fn() })(({ children }) => <div>{children}</div>);

  it('skal rendre form og vise søknadsfristdato som er lik mottatt dato minus antallDagerSoknadLevertForSent', () => {
    renderWithIntlAndReduxForm(
      <MockForm>
        <UnwrappedForm
          {...reduxFormPropsMock}
          readOnly={false}
          readOnlySubmitButton={false}
          mottattDato="2017-10-15"
          antallDagerSoknadLevertForSent={9}
          soknadsperiodeStart="2017-06-05"
          soknadsperiodeSlutt="2017-11-01"
          soknadsfristdato="2017-09-30"
          isApOpen
          behandlingId={1}
          behandlingVersjon={1}
        />
      </MockForm>,
      { messages },
    );

    expect(screen.getByText('Søknad ble mottatt 9 dager etter søknadsfrist (30.09.2017)')).toBeInTheDocument();
  });

  it('skal rendre form og vise mottatt dato, periode og begrunnelse', () => {
    renderWithIntlAndReduxForm(
      <MockForm>
        <UnwrappedForm
          {...reduxFormPropsMock}
          intl={intlMock}
          readOnly={false}
          readOnlySubmitButton={false}
          mottattDato="2017-10-15"
          antallDagerSoknadLevertForSent={9}
          soknadsperiodeStart="2017-06-05"
          soknadsperiodeSlutt="2017-11-01"
          soknadsfristdato="2017-09-30"
          isApOpen
          behandlingId={1}
          behandlingVersjon={1}
        />
      </MockForm>,
      { messages },
    );

    expect(screen.getByText('15.10.2017')).toBeInTheDocument();
    expect(screen.getByText('05.06.2017 - 01.11.2017')).toBeInTheDocument();
  });

  it('skal rendre radiobuttons', () => {
    renderWithIntlAndReduxForm(
      <MockForm>
        <UnwrappedForm
          {...reduxFormPropsMock}
          intl={intlMock}
          readOnly={false}
          readOnlySubmitButton={false}
          gyldigSenFremsetting={false}
          mottattDato="2017-10-15"
          antallDagerSoknadLevertForSent={15}
          soknadsperiodeStart="2017-06-05"
          soknadsperiodeSlutt="2017-11-01"
          soknadsfristdato="2017-09-30"
          isApOpen
          behandlingId={1}
          behandlingVersjon={1}
        />
      </MockForm>,
      { messages },
    );

    expect(screen.getByRole('radio', { name: 'Gyldig grunn for sen fremsetting av søknaden' })).toBeInTheDocument();
    expect(
      screen.getByRole('radio', { name: 'Ingen gyldig grunn for sen fremsetting av søknaden' }),
    ).toBeInTheDocument();
  });

  it('skal ikke vise datepicker når gyldigSenFremsetting er false', () => {
    renderWithIntlAndReduxForm(
      <MockForm>
        <UnwrappedForm
          {...reduxFormPropsMock}
          intl={intlMock}
          readOnly={false}
          readOnlySubmitButton={false}
          gyldigSenFremsetting={false}
          mottattDato="2017-10-15"
          antallDagerSoknadLevertForSent={15}
          soknadsperiodeStart="2017-06-05"
          soknadsperiodeSlutt="2017-11-01"
          soknadsfristdato="2017-09-30"
          isApOpen
          behandlingId={1}
          behandlingVersjon={1}
        />
      </MockForm>,
      { messages },
    );
    expect(screen.queryByText('Dato for når søknaden kan anses som mottatt')).not.toBeInTheDocument();
  });

  it('skal vise datepicker når gyldigSenFremsetting er true', () => {
    renderWithIntlAndReduxForm(
      <MockForm>
        <UnwrappedForm
          {...reduxFormPropsMock}
          intl={intlMock}
          gyldigSenFremsetting
          readOnly={false}
          readOnlySubmitButton={false}
          mottattDato="2017-10-15"
          antallDagerSoknadLevertForSent={15}
          soknadsperiodeStart="2017-06-05"
          soknadsperiodeSlutt="2017-11-01"
          soknadsfristdato="2017-09-30"
          isApOpen
          behandlingId={1}
          behandlingVersjon={1}
        />
      </MockForm>,
      { messages },
    );
    expect(screen.getByRole('textbox', { name: 'Dato for når søknaden kan anses som mottatt' })).toBeInTheDocument();
  });
});
