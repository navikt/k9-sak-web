import { intlWithMessages } from '@fpsak-frontend/utils-test/intl-test-helper';
import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/redux-form-test-helper';
import { renderWithIntlAndReduxForm } from '@fpsak-frontend/utils-test/test-utils';
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
          definisjon: '5030',
          status: 'OPPR',
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
