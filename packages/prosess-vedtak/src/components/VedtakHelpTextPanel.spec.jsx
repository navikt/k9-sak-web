import aksjonspunktCodes from '@k9-sak-web/kodeverk/src/aksjonspunktCodes';
import { renderWithIntl } from '@k9-sak-web/utils-test/test-utils';
import { screen } from '@testing-library/react';

import React from 'react';
import { intlMock } from '../../i18n';
import messages from '../../i18n/nb_NO.json';
import { VedtakHelpTextPanelImpl } from './VedtakHelpTextPanel';

describe('<VedtakHelpTextPanel>', () => {
  it('skal vise hjelpetekst for vurdering av dokument når en har dette aksjonspunktet', () => {
    renderWithIntl(
      <VedtakHelpTextPanelImpl
        intl={intlMock}
        aksjonspunktKoder={[aksjonspunktCodes.VURDERE_DOKUMENT]}
        readOnly={false}
      />,
      { messages },
    );

    expect(screen.getByText('Vurder om den åpne oppgaven «Vurder dokument» påvirker behandlingen')).toBeInTheDocument();
  });

  it('skal vise hjelpetekst for vurdering av dokument og vurdering av annen ytelse når en har disse aksjonspunktetene', () => {
    renderWithIntl(
      <VedtakHelpTextPanelImpl
        intl={intlMock}
        aksjonspunktKoder={[aksjonspunktCodes.VURDERE_ANNEN_YTELSE, aksjonspunktCodes.VURDERE_DOKUMENT]}
        readOnly={false}
      />,
      { messages },
    );

    expect(
      screen.getByText('Vurder om den åpne oppgaven «Vurder konsekvens for ytelse» påvirker behandlingen'),
    ).toBeInTheDocument();
    expect(screen.getByText('Vurder om den åpne oppgaven «Vurder dokument» påvirker behandlingen')).toBeInTheDocument();
  });

  it('skal ikke vise hjelpetekst når en ikke har gitte aksjonspunkter', () => {
    renderWithIntl(
      <VedtakHelpTextPanelImpl
        intl={intlMock}
        aksjonspunktKoder={[aksjonspunktCodes.FORESLA_VEDTAK]}
        readOnly={false}
      />,
      { messages },
    );

    expect(
      screen.queryByText('Vurder om den åpne oppgaven «Vurder konsekvens for ytelse» påvirker behandlingen'),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText('Vurder om den åpne oppgaven «Vurder dokument» påvirker behandlingen'),
    ).not.toBeInTheDocument();
  });
});
