import { render, screen } from '@testing-library/react';
import { FaktaSubmitButton } from './FaktaSubmitButton';

describe('<FaktaSubmitButton>', () => {
  it('skal ikke vise knapp når readonly', () => {
    render(
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
    );

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('skal vise knapp som trykkbar når en kan avklare aksjonspunkt og en har gjort endringer', () => {
    render(
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
    );

    expect(screen.getByRole('button', { name: 'Bekreft og fortsett' })).not.toBeDisabled();
  });

  it('skal vise knapp som utgrået når en ikke kan avklare aksjonspunkt', () => {
    render(
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
    );

    expect(screen.getByRole('button', { name: 'Bekreft og fortsett' })).toBeDisabled();
  });

  it('skal vise knapp som utgrået når en har trykket på knapp', () => {
    render(
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
    );

    expect(screen.getByRole('button', { name: 'Bekreft og fortsett' })).toBeDisabled();
  });

  it('skal vise knapp som utgrået når en ikke har gjort endringer og det er tomme obligatoriske felter', () => {
    render(
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
    );

    expect(screen.getByRole('button', { name: 'Bekreft og fortsett' })).toBeDisabled();
  });

  it('skal vise knapp som trykkbar når en ikke har gjort endringer men alle obligatoriske felter er utfylte', () => {
    render(
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
    );

    expect(screen.getByRole('button', { name: 'Bekreft og fortsett' })).not.toBeDisabled();
  });

  it('skal vise knapp som utgrået når en ikke har gjort endringer og aksjonspunktet er løst tidligere', () => {
    render(
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
    );

    expect(screen.getByRole('button', { name: 'Bekreft og fortsett' })).toBeDisabled();
  });
});
