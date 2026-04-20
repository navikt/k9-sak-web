import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/redux-form-test-helper';
import { renderWithIntlAndReduxForm } from '@fpsak-frontend/utils-test/test-utils';
import { screen } from '@testing-library/react';
import React from 'react';
import messages from '../../i18n/nb_NO.json';
import { RegistrereVergeInfoPanel } from './RegistrereVergeInfoPanel';

describe('<RegistrereVergeInfoPanel>', () => {
  it('skal vise faktapanel og form for registrere verge', () => {
    renderWithIntlAndReduxForm(
      <RegistrereVergeInfoPanel
        {...reduxFormPropsMock}
        submittable
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
      { messages },
    );

    expect(screen.getByRole('textbox', { name: 'Begrunnelse' })).toBeInTheDocument();
  });
});
