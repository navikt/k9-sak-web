import React from 'react';
import sinon from 'sinon';

import behandlingResultatType from '@fpsak-frontend/kodeverk/src/behandlingResultatType';

import { intlMock } from '@fpsak-frontend/utils-test/intl-test-helper';
import { renderWithIntl } from '@fpsak-frontend/utils-test/test-utils';
import { screen } from '@testing-library/react';
import IverksetterVedtakStatusModal from './IverksetterVedtakStatusModal';

describe('<IverksetterVedtakStatusModal>', () => {
  it('skal rendre modal', () => {
    const closeEventCallback = sinon.spy();
    renderWithIntl(
      <IverksetterVedtakStatusModal.WrappedComponent
        intl={intlMock}
        visModal
        lukkModal={closeEventCallback}
        behandlingsresultat={{
          type: behandlingResultatType.AVSLATT,
        }}
      />,
    );

    expect(screen.getByRole('dialog', { name: 'Avslått' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'OK' })).toBeInTheDocument();
  });
});
