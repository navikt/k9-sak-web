import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import messages from '@fpsak-frontend/sak-totrinnskontroll/i18n/nb_NO.json';
import { renderWithIntl } from '@fpsak-frontend/utils-test/test-utils';
import { Behandling } from '@k9-sak-web/types';
import { screen } from '@testing-library/react';
import React from 'react';
import { K9sakApiKeys, requestApi } from '../../data/k9sakApi';
import BeslutterModalIndex from './BeslutterModalIndex';

describe('<BeslutterModalIndex>', () => {
  const behandling = {
    id: 1,
    versjon: 2,
    behandlingsresultat: { type: 'IKKE_FASTSATT' },
    type: behandlingType.FORSTEGANGSSOKNAD,
    status: behandlingStatus.OPPRETTET,
  } as Behandling;

  it('skal vise modal når beslutter godkjenner', () => {
    requestApi.mock(K9sakApiKeys.HAR_REVURDERING_SAMME_RESULTAT, {
      harRevurderingSammeResultat: true,
    });

    renderWithIntl(
      <BeslutterModalIndex
        behandling={behandling}
        fagsakYtelseType={fagsakYtelseType.FORELDREPENGER}
        allAksjonspunktApproved={false}
        erKlageWithKA={false}
      />,
      { messages },
    );

    expect(
      screen.getByRole('dialog', { name: 'Forslag til vedtak er sendt til beslutter. Du kommer nå til forsiden.' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Vedtak returneres til saksbehandler for ny vurdering.')).toBeInTheDocument();
    expect(screen.getByText('Du kommer nå til forsiden.')).toBeInTheDocument();
  });
});
