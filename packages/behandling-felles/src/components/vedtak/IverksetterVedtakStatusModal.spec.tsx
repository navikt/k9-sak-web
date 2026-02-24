import React from 'react';

import behandlingResultatType from '@fpsak-frontend/kodeverk/src/behandlingResultatType';

import { renderWithIntl } from '@fpsak-frontend/utils-test/test-utils';
import { screen } from '@testing-library/react';
import IverksetterVedtakStatusModal from './IverksetterVedtakStatusModal';

describe('<IverksetterVedtakStatusModal>', () => {
  it('skal rendre modal', () => {
    const closeEventCallback = vi.fn();
    renderWithIntl(
      <IverksetterVedtakStatusModal
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
