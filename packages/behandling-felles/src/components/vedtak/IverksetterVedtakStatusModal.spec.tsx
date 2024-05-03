import React from 'react';

import behandlingResultatType from '@k9-sak-web/kodeverk/src/behandlingResultatType';

import { intlMock } from '@k9-sak-web/utils-test/intl-test-helper';
import { renderWithIntl } from '@k9-sak-web/utils-test/test-utils';
import { screen } from '@testing-library/react';
import IverksetterVedtakStatusModal from './IverksetterVedtakStatusModal';

describe('<IverksetterVedtakStatusModal>', () => {
  it('skal rendre modal', () => {
    const closeEventCallback = vi.fn();
    renderWithIntl(
      <IverksetterVedtakStatusModal.WrappedComponent
        intl={intlMock}
        visModal
        lukkModal={closeEventCallback}
        behandlingsresultat={{
          type: {
            kode: behandlingResultatType.AVSLATT,
            kodeverk: 'test',
          },
        }}
      />,
    );

    expect(screen.getByRole('dialog', { name: 'Avslått' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'OK' })).toBeInTheDocument();
  });
});
