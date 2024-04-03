import { renderWithIntlAndReduxForm } from '@fpsak-frontend/utils-test/test-utils';
import { screen } from '@testing-library/react';
import React from 'react';
import messages from '../../i18n/nb_NO.json';
import { FaktaSubmitButton } from './FaktaSubmitButton';

describe('<FaktaSubmitButton>', () => {
  it('skal ikke vise knapp når readonly', () => {
    renderWithIntlAndReduxForm(
      <FaktaSubmitButton
        isReadOnly
        isSubmittable
        isSubmitting={false}
        isDirty={false}
        hasEmptyRequiredFields={false}
        hasOpenAksjonspunkter
        behandlingId={1}
        behandlingVersjon={2}
      />,
      { messages },
    );

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('skal vise knapp som trykkbar når en kan avklare aksjonspunkt og en har gjort endringer', () => {
    renderWithIntlAndReduxForm(
      <FaktaSubmitButton
        isReadOnly={false}
        isSubmittable
        isSubmitting={false}
        isDirty
        hasEmptyRequiredFields={false}
        hasOpenAksjonspunkter
        behandlingId={1}
        behandlingVersjon={2}
      />,
      { messages },
    );

    expect(screen.getByRole('button', { name: 'Bekreft og fortsett' })).not.toBeDisabled();
  });

  it('skal vise knapp som utgrået når en ikke kan avklare aksjonspunkt', () => {
    renderWithIntlAndReduxForm(
      <FaktaSubmitButton
        isReadOnly={false}
        isSubmittable={false}
        isSubmitting={false}
        isDirty
        hasEmptyRequiredFields={false}
        hasOpenAksjonspunkter
        behandlingId={1}
        behandlingVersjon={2}
      />,
      { messages },
    );

    expect(screen.getByRole('button', { name: 'Bekreft og fortsett' })).toBeDisabled();
  });

  it('skal vise knapp som utgrået når en har trykket på knapp', () => {
    renderWithIntlAndReduxForm(
      <FaktaSubmitButton
        isReadOnly={false}
        isSubmittable
        isSubmitting
        isDirty
        hasEmptyRequiredFields={false}
        hasOpenAksjonspunkter
        behandlingId={1}
        behandlingVersjon={2}
      />,
      { messages },
    );

    expect(screen.getByRole('button', { name: 'Bekreft og fortsett' })).toBeDisabled();
  });

  it('skal vise knapp som utgrået når en ikke har gjort endringer og det er tomme obligatoriske felter', () => {
    renderWithIntlAndReduxForm(
      <FaktaSubmitButton
        isReadOnly={false}
        isSubmittable
        isSubmitting={false}
        isDirty={false}
        hasEmptyRequiredFields
        hasOpenAksjonspunkter
        behandlingId={1}
        behandlingVersjon={2}
      />,
      { messages },
    );

    expect(screen.getByRole('button', { name: 'Bekreft og fortsett' })).toBeDisabled();
  });

  it('skal vise knapp som trykkbar når en ikke har gjort endringer men alle obligatoriske felter er utfylte', () => {
    renderWithIntlAndReduxForm(
      <FaktaSubmitButton
        isReadOnly={false}
        isSubmittable
        isSubmitting={false}
        isDirty={false}
        hasEmptyRequiredFields={false}
        hasOpenAksjonspunkter
        behandlingId={1}
        behandlingVersjon={2}
      />,
      { messages },
    );

    expect(screen.getByRole('button', { name: 'Bekreft og fortsett' })).not.toBeDisabled();
  });

  it('skal vise knapp som utgrået når en ikke har gjort endringer og aksjonspunktet er løst tidligere', () => {
    renderWithIntlAndReduxForm(
      <FaktaSubmitButton
        isReadOnly={false}
        isSubmittable
        isSubmitting={false}
        isDirty={false}
        hasEmptyRequiredFields={false}
        hasOpenAksjonspunkter={false}
        behandlingId={1}
        behandlingVersjon={2}
      />,
      { messages },
    );

    expect(screen.getByRole('button', { name: 'Bekreft og fortsett' })).toBeDisabled();
  });
});
