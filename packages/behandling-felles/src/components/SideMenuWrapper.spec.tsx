import React from 'react';
import sinon from 'sinon';

import { intlMock } from '@fpsak-frontend/utils-test/intl-test-helper';
import { renderWithIntl } from '@fpsak-frontend/utils-test/test-utils';
import { screen } from '@testing-library/react';
import SideMenuWrapper from './SideMenuWrapper';

describe('<SideMenuWrapper>', () => {
  it('skal rendre komponent med sidemeny med ett menyinnslag med aktivt aksjonspunkt', () => {
    const velgPanelCallback = sinon.spy();
    renderWithIntl(
      <SideMenuWrapper.WrappedComponent
        intl={intlMock}
        paneler={[
          {
            tekstKode: 'OmsorgInfoPanel.Omsorg',
            erAktiv: true,
            harAksjonspunkt: true,
          },
        ]}
        onClick={velgPanelCallback}
      >
        <div>test</div>
      </SideMenuWrapper.WrappedComponent>,
    );

    expect(screen.getByRole('button', { name: /Omsorg/i })).toBeInTheDocument();
    expect(screen.getByText('Saksopplysninger')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Aksjonspunkt' })).toBeInTheDocument();
  });

  it('skal rendre komponent med sidemeny med ett menyinnslag med inaktivt aksjonspunkt', () => {
    const velgPanelCallback = sinon.spy();
    renderWithIntl(
      <SideMenuWrapper.WrappedComponent
        intl={intlMock}
        paneler={[
          {
            tekstKode: 'OmsorgInfoPanel.Omsorg',
            erAktiv: true,
            harAksjonspunkt: false,
          },
        ]}
        onClick={velgPanelCallback}
      >
        <div>test</div>
      </SideMenuWrapper.WrappedComponent>,
    );

    expect(screen.getByRole('button', { name: /Omsorg/i })).toBeInTheDocument();
    expect(screen.queryByRole('img', { name: 'Aksjonspunkt' })).not.toBeInTheDocument();
  });
});
