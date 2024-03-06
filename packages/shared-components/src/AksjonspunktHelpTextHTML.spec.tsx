import { intlMock } from '@fpsak-frontend/utils-test/intl-test-helper';
import { renderWithIntl } from '@fpsak-frontend/utils-test/test-utils';
import { screen } from '@testing-library/react';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import AksjonspunktHelpTextHTML from './AksjonspunktHelpTextHTML';

describe('<AksjonspunktHelpTextHTML>', () => {
  it('Skal teste at aksjonspunkt hjelp viser riktig', () => {
    renderWithIntl(
      <AksjonspunktHelpTextHTML.WrappedComponent intl={intlMock}>
        {[<FormattedMessage key="1" id="Beregningsgrunnlag.Helptext.Arbeidstaker2" values={{ verdi: 23 }} />]}
      </AksjonspunktHelpTextHTML.WrappedComponent>,
    );

    expect(screen.getByText('Beregningsgrunnlag.Helptext.Arbeidstaker2')).toBeInTheDocument();
    expect(screen.getAllByRole('img')).toHaveLength(1);
  });
  it('Skal teste at aksjonspunkt hjelp ikke vises når ikke aksjonspunkt', () => {
    renderWithIntl(
      <AksjonspunktHelpTextHTML.WrappedComponent intl={intlMock}>{[]}</AksjonspunktHelpTextHTML.WrappedComponent>,
    );
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });
});
