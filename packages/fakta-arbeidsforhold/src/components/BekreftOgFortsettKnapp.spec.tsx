import { renderWithIntl } from '@fpsak-frontend/utils-test/test-utils';
import { screen } from '@testing-library/react';
import React from 'react';
import messages from '../../i18n/nb_NO.json';
import { BekreftOgForsettKnapp } from './BekreftOgForsettKnapp';

describe('<BekreftOgForsettKnapp>', () => {
  it('Skal vise en enablet hovedknapp hvis readOnly og isSubmitting er false', () => {
    renderWithIntl(<BekreftOgForsettKnapp readOnly={false} isSubmitting={false} />, { messages });
    screen.debug();
    expect(screen.getByRole('button', { name: 'Bekreft og fortsett' })).not.toBeDisabled();
  });
  it('Skal vise en disablet hovedknapp hvis readOnly er true', () => {
    renderWithIntl(<BekreftOgForsettKnapp readOnly isSubmitting={false} />, { messages });
    expect(screen.getByRole('button', { name: 'Bekreft og fortsett' })).toBeDisabled();
  });
  it('Skal vise en disablet hovedknapp hvis isSubmitting er true', () => {
    renderWithIntl(<BekreftOgForsettKnapp readOnly={false} isSubmitting />, { messages });
    expect(screen.getByRole('button', { name: 'Laster' })).toBeDisabled();
  });
});
