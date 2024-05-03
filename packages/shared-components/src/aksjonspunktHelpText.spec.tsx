import { intlMock } from '@k9-sak-web/utils-test/intl-test-helper';
import { renderWithIntl } from '@k9-sak-web/utils-test/test-utils';
import { screen } from '@testing-library/react';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import AksjonspunktHelpText from './AksjonspunktHelpText';

describe('<AksjonspunktHelpText>', () => {
  it('Skal teste at aksjonspunkt hjelp viser riktig', () => {
    renderWithIntl(
      <AksjonspunktHelpText.WrappedComponent intl={intlMock} isAksjonspunktOpen>
        {[<FormattedMessage key="1" id="Beregningsgrunnlag.Helptext.Arbeidstaker2" values={{ verdi: 23 }} />]}
      </AksjonspunktHelpText.WrappedComponent>,
    );

    expect(screen.getByText('Beregningsgrunnlag.Helptext.Arbeidstaker2')).toBeInTheDocument();
    expect(screen.getAllByRole('img')).toHaveLength(1);
  });
  it('Skal teste at aksjonspunkt hjelp ikke vises når ikke aksjonspunkt', () => {
    renderWithIntl(
      <AksjonspunktHelpText.WrappedComponent isAksjonspunktOpen={false} intl={intlMock}>
        {[]}
      </AksjonspunktHelpText.WrappedComponent>,
    );
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

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
