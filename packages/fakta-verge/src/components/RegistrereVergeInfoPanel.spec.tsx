import { intlWithMessages } from '@k9-sak-web/utils-test/intl-test-helper';
import { reduxFormPropsMock } from '@k9-sak-web/utils-test/redux-form-test-helper';
import { renderWithIntlAndReduxForm } from '@k9-sak-web/utils-test/test-utils';
import { screen } from '@testing-library/react';
import React from 'react';
import messages from '../../i18n/nb_NO.json';
import { RegistrereVergeInfoPanelImpl } from './RegistrereVergeInfoPanel';

const intlMock = intlWithMessages(messages);

describe('<RegistrereVergeInfoPanel>', () => {
  it('skal vise faktapanel og form for registrere verge', () => {
    renderWithIntlAndReduxForm(
      <RegistrereVergeInfoPanelImpl
        {...reduxFormPropsMock}
        submittable
        intl={intlMock}
        openInfoPanels={['verge']}
        toggleInfoPanelCallback={vi.fn()}
        hasOpenAksjonspunkter
        readOnly={false}
        aksjonspunkt={{
          kode: 5030,
          id: 100001,
          definisjon: { kode: '5030', navn: 'VERGE' },
          status: { kode: 'OPPR', navn: 'Opprettet', kodeverk: 'AKSJONSPUNKT_STATUS' },
          kanLoses: true,
          erAktivt: true,
        }}
        vergetyper={[{}]}
        behandlingId={1}
        behandlingVersjon={1}
        alleMerknaderFraBeslutter={{}}
      />,
    );

    expect(screen.getByRole('textbox', { name: 'Begrunnelse' })).toBeInTheDocument();
  });
});
