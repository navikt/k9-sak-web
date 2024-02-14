import { renderWithIntlAndReduxForm } from '@fpsak-frontend/utils-test';
import { screen } from '@testing-library/react';
import React from 'react';
import messages from '../i18n/nb_NO.json';
import { ProsessStegSubmitButton } from './ProsessStegSubmitButton';

describe('<ProsessStegSubmitButton>', () => {
  it('skal ikke vise submit-knapp når behandlingspunkt er readonly', () => {
    renderWithIntlAndReduxForm(
      <ProsessStegSubmitButton
        behandlingId={1}
        behandlingVersjon={2}
        formName="test"
        isBehandlingFormSubmitting={() => undefined}
        isBehandlingFormDirty={() => undefined}
        hasBehandlingFormErrorsOfType={() => undefined}
        isReadOnly
        isSubmittable={false}
        isSubmitting={false}
        isDirty={false}
        hasEmptyRequiredFields={false}
      />,
      { messages },
    );
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('skal vise submit-knapp med standard tekst når behandlingspunkt ikke er readonly', () => {
    renderWithIntlAndReduxForm(
      <ProsessStegSubmitButton
        behandlingId={1}
        behandlingVersjon={2}
        formName="test"
        isBehandlingFormSubmitting={() => undefined}
        isBehandlingFormDirty={() => undefined}
        hasBehandlingFormErrorsOfType={() => undefined}
        isReadOnly={false}
        isSubmittable={false}
        isSubmitting={false}
        isDirty={false}
        hasEmptyRequiredFields={false}
      />,
      { messages },
    );
    expect(screen.getByRole('button', { name: 'Bekreft og fortsett' })).toBeInTheDocument();
  });

  it('skal vise submit-knapp med spesifikk tekst når behandlingspunkt ikke er readonly', () => {
    renderWithIntlAndReduxForm(
      <ProsessStegSubmitButton
        behandlingId={1}
        behandlingVersjon={2}
        formName="test"
        isBehandlingFormSubmitting={() => undefined}
        isBehandlingFormDirty={() => undefined}
        hasBehandlingFormErrorsOfType={() => undefined}
        isReadOnly={false}
        isSubmittable={false}
        isSubmitting={false}
        isDirty={false}
        hasEmptyRequiredFields={false}
        text="Bekreft"
      />,
      { messages },
    );

    expect(screen.getByRole('button', { name: 'Bekreft' })).toBeInTheDocument();
  });

  it('skal vise knapp som enabled når behandlingspunkt er dirty og submittable', () => {
    renderWithIntlAndReduxForm(
      <ProsessStegSubmitButton
        behandlingId={1}
        behandlingVersjon={2}
        formName="test"
        isBehandlingFormSubmitting={() => undefined}
        isBehandlingFormDirty={() => undefined}
        hasBehandlingFormErrorsOfType={() => undefined}
        isReadOnly={false}
        isSubmittable
        isSubmitting={false}
        isDirty
        hasEmptyRequiredFields={false}
      />,
      { messages },
    );

    expect(screen.getByRole('button', { name: 'Bekreft og fortsett' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Bekreft og fortsett' })).not.toBeDisabled();
  });

  it('skal vise knapp som disabled når behandlingspunkt ikke er dirty eller submittable', () => {
    renderWithIntlAndReduxForm(
      <ProsessStegSubmitButton
        behandlingId={1}
        behandlingVersjon={2}
        formName="test"
        isBehandlingFormSubmitting={() => undefined}
        isBehandlingFormDirty={() => undefined}
        hasBehandlingFormErrorsOfType={() => undefined}
        isReadOnly={false}
        isSubmittable={false}
        isSubmitting={false}
        isDirty={false}
        hasEmptyRequiredFields={false}
      />,
      { messages },
    );

    expect(screen.getByRole('button', { name: 'Bekreft og fortsett' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Bekreft og fortsett' })).toBeDisabled();
  });

  it('skal vise knapp som disabled når innsending av behandlingspunkt-data pågår', () => {
    renderWithIntlAndReduxForm(
      <ProsessStegSubmitButton
        behandlingId={1}
        behandlingVersjon={2}
        formName="test"
        isBehandlingFormSubmitting={() => undefined}
        isBehandlingFormDirty={() => undefined}
        hasBehandlingFormErrorsOfType={() => undefined}
        isReadOnly={false}
        isSubmittable
        isSubmitting
        isDirty
        hasEmptyRequiredFields={false}
      />,
      { messages },
    );

    expect(screen.getByRole('button', { name: 'Laster' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Laster' })).toBeDisabled();
  });

  it('skal vise knapp som disabled en ikke har fylt ut alle obligatoriske felter', () => {
    renderWithIntlAndReduxForm(
      <ProsessStegSubmitButton
        behandlingId={1}
        behandlingVersjon={2}
        formName="test"
        isBehandlingFormSubmitting={() => undefined}
        isBehandlingFormDirty={() => undefined}
        hasBehandlingFormErrorsOfType={() => undefined}
        isReadOnly={false}
        isSubmittable
        isSubmitting={false}
        isDirty
        hasEmptyRequiredFields
      />,
      { messages },
    );

    expect(screen.getByRole('button', { name: 'Bekreft og fortsett' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Bekreft og fortsett' })).toBeDisabled();
  });

  it('skal vise knapp som disabled når behandlingspunkt ikke er dirty og en ikke har fylt ut alle obligatoriske felter', () => {
    renderWithIntlAndReduxForm(
      <ProsessStegSubmitButton
        behandlingId={1}
        behandlingVersjon={2}
        formName="test"
        isBehandlingFormSubmitting={() => undefined}
        isBehandlingFormDirty={() => undefined}
        hasBehandlingFormErrorsOfType={() => undefined}
        isReadOnly={false}
        isSubmittable
        isSubmitting={false}
        isDirty={false}
        hasEmptyRequiredFields
      />,
      { messages },
    );

    expect(screen.getByRole('button', { name: 'Bekreft og fortsett' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Bekreft og fortsett' })).toBeDisabled();
  });
});
