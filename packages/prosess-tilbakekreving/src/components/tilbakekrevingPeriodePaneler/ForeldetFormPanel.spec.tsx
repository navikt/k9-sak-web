import { renderWithIntlAndReduxForm } from '@fpsak-frontend/utils-test/test-utils';
import { screen } from '@testing-library/react';
import React from 'react';
import messages from '../../../i18n/nb_NO.json';
import ForeldetFormPanel from './ForeldetFormPanel';

describe('<ForeldetFormPanel>', () => {
  it('skal rendre komponent korrekt', () => {
    renderWithIntlAndReduxForm(<ForeldetFormPanel />, { messages });
    expect(screen.getByText('Vurder om perioden er foreldet')).toBeInTheDocument();
  });
});
