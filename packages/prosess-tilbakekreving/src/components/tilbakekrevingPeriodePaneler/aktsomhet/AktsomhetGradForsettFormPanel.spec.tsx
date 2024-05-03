import { renderWithIntlAndReduxForm } from '@k9-sak-web/utils-test/test-utils';
import { screen } from '@testing-library/react';
import React from 'react';
import messages from '../../../../i18n/nb_NO.json';
import AktsomhetGradForsettFormPanel from './AktsomhetGradForsettFormPanel';

describe('<AktsomhetGradForsettFormPanel>', () => {
  it('skal vise panel for å forsett når denne radio-knappen er valgt', () => {
    renderWithIntlAndReduxForm(<AktsomhetGradForsettFormPanel readOnly={false} />, { messages });

    expect(screen.getByText('Andel som skal tilbakekreves')).toBeInTheDocument();
    expect(screen.getByText('100 %')).toBeInTheDocument();
    expect(screen.getByText('Det legges til 10 % renter')).toBeInTheDocument();
  });

  it('skal vise valg for om det skal tillegges renter når forsett er valgt og det er forsto eller burde forstått', () => {
    renderWithIntlAndReduxForm(
      <AktsomhetGradForsettFormPanel readOnly={false} erValgtResultatTypeForstoBurdeForstaatt />,
      { messages },
    );

    expect(screen.getByText('Andel som skal tilbakekreves')).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Ja' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Nei' })).toBeInTheDocument();
  });
});
