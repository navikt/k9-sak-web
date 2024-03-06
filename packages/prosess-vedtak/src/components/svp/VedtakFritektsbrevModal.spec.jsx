import behandlingResultatType from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import { renderWithIntl } from '@fpsak-frontend/utils-test/test-utils';
import { screen } from '@testing-library/react';

import React from 'react';
import { intlMock } from '../../../i18n';
import messages from '../../../i18n/nb_NO.json';
import { VedtakFritekstbrevModal } from './VedtakFritekstbrevModal';

describe('<VedtakFritekstbrevModal>', () => {
  it('skal vise modal når behandlingsresultat er AVSLATT', () => {
    renderWithIntl(
      <VedtakFritekstbrevModal
        intl={intlMock}
        readOnly={false}
        behandlingsresultat={{
          type: behandlingResultatType.AVSLATT,
        }}
        erSVP
      />,
      { messages },
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(
      screen.getByText(
        "I denne behandlingen er det ikke automatisk vedtaksbrev. Du må velge 'Overstyr automatisk brev' og skrive fritekstbrev.",
      ),
    ).toBeInTheDocument();
  });

  it('skal vise modal når behandlingsresultat er OPPHOR', () => {
    renderWithIntl(
      <VedtakFritekstbrevModal
        intl={intlMock}
        readOnly={false}
        behandlingsresultat={{
          type: behandlingResultatType.OPPHOR,
        }}
        erSVP
      />,
      { messages },
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(
      screen.getByText(
        "I denne behandlingen er det ikke automatisk vedtaksbrev. Du må velge 'Overstyr automatisk brev' og skrive fritekstbrev.",
      ),
    ).toBeInTheDocument();
  });

  it('skal ikke vise modal når behandlingsresultat er noe annet en OPPHOR og AVSLATT', () => {
    renderWithIntl(
      <VedtakFritekstbrevModal
        intl={intlMock}
        readOnly={false}
        behandlingsresultat={{
          type: behandlingResultatType.INNVILGET,
        }}
        erSVP
      />,
      { messages },
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('skal ikke vise modal når readOnly er true', () => {
    renderWithIntl(
      <VedtakFritekstbrevModal
        intl={intlMock}
        readOnly
        behandlingsresultat={{
          type: behandlingResultatType.AVSLATT,
        }}
        erSVP
      />,
      { messages },
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('skal ikke vise modal når ikke SVP', () => {
    renderWithIntl(
      <VedtakFritekstbrevModal
        intl={intlMock}
        readOnly={false}
        behandlingsresultat={{
          type: behandlingResultatType.AVSLATT,
        }}
        erSVP={false}
      />,
      { messages },
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
