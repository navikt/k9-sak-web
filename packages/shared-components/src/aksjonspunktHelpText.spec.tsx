import { intlMock } from '@fpsak-frontend/utils-test/intl-test-helper';
import { renderWithIntl } from '@fpsak-frontend/utils-test/test-utils';
import { screen } from '@testing-library/react';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import AksjonspunktHelpText from './AksjonspunktHelpText';

describe('<AksjonspunktHelpText>', () => {
  it('skal vise hjelpetekst og ikon når aksjonspunkt er åpent', () => {
    renderWithIntl(
      <AksjonspunktHelpText.WrappedComponent isAksjonspunktOpen intl={intlMock}>
        {[<FormattedMessage key="1" id="HelpText.Aksjonspunkt" />]}
      </AksjonspunktHelpText.WrappedComponent>,
    );

    expect(screen.getByText('Aksjonspunkt')).toBeInTheDocument();
  });

  it('skal kun vise hjelpetekst når aksjonspunkt er lukket', () => {
    renderWithIntl(
      <AksjonspunktHelpText.WrappedComponent isAksjonspunktOpen={false} intl={intlMock}>
        {[<FormattedMessage key="1" id="HelpText.Aksjonspunkt" />]}
      </AksjonspunktHelpText.WrappedComponent>,
    );
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(screen.getByText('Aksjonspunkt')).toBeInTheDocument();
  });
});
