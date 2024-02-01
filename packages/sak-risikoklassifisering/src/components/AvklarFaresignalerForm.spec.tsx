import { renderWithIntlAndReduxForm } from '@fpsak-frontend/utils-test';
import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';
import { Risikoklassifisering } from '@k9-sak-web/types';
import { screen } from '@testing-library/react';
import React from 'react';
import { reduxForm } from 'redux-form';
import messages from '../../i18n/nb_NO.json';
import faresignalVurdering from '../kodeverk/faresignalVurdering';
import {
  AvklarFaresignalerForm,
  begrunnelseFieldName,
  buildInitialValues,
  radioFieldName,
} from './AvklarFaresignalerForm';

const mockAksjonspunkt = (status, begrunnelse) => ({
  definisjon: {
    kode: '5095',
    kodeverk: '',
  },
  status: {
    kode: status,
    kodeverk: '',
  },
  begrunnelse,
  kanLoses: true,
  erAktivt: true,
});

const mockRisikoklassifisering = kode => ({
  kontrollresultat: {
    kode: 'HOY',
    kodeverk: 'Kontrollresultat',
  },
  faresignalVurdering: {
    kode,
    kodeverk: 'Faresignalvurdering',
  },
  medlFaresignaler: undefined,
  iayFaresignaler: undefined,
});

describe('<AvklarFaresignalerForm>', () => {
  const MockForm = reduxForm({ form: 'mock', onSubmit: vi.fn() })(({ children }) => <div>{children}</div>);
  it('skal teste at komponent mountes korrekt med inputfelter', () => {
    renderWithIntlAndReduxForm(
      <MockForm>
        <AvklarFaresignalerForm
          readOnly={false}
          aksjonspunkt={mockAksjonspunkt('UTFO', undefined)}
          submitCallback={() => undefined}
          risikoklassifisering={{} as Risikoklassifisering}
          {...reduxFormPropsMock}
        />
      </MockForm>,
      { messages },
    );
    expect(screen.getByRole('radio', { name: 'Faresignalene hadde innvirkning på behandlingen' })).toBeInTheDocument();
    expect(
      screen.getByRole('radio', { name: 'Faresignalene hadde ingen innvirkning på behandlingen' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Vurdering' })).toBeInTheDocument();
  });

  it('skal teste at komponent gir inputfelter korrekte verdier', () => {
    renderWithIntlAndReduxForm(
      <MockForm>
        <AvklarFaresignalerForm
          readOnly
          aksjonspunkt={mockAksjonspunkt('UTFO', undefined)}
          submitCallback={() => undefined}
          risikoklassifisering={{} as Risikoklassifisering}
          {...reduxFormPropsMock}
        />
      </MockForm>,
      { messages },
    );
    expect(screen.queryByRole('textbox', { name: 'Vurdering' })).not.toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Faresignalene hadde innvirkning på behandlingen' })).toBeDisabled();
    expect(screen.getByRole('radio', { name: 'Faresignalene hadde ingen innvirkning på behandlingen' })).toBeDisabled();
  });

  it('skal teste at buildInitialValues gir korrekte verdier', () => {
    const expectedInitialValues = {
      [begrunnelseFieldName]: 'Dette er en begrunnelse',
      [radioFieldName]: true,
    };
    const actualValues = buildInitialValues.resultFunc(
      mockRisikoklassifisering(faresignalVurdering.INNVIRKNING),
      mockAksjonspunkt('UTFO', 'Dette er en begrunnelse'),
    );

    expect(actualValues).toEqual(expectedInitialValues);
  });
});
