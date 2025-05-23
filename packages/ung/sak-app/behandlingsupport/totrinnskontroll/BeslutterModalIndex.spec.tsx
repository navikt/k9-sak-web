import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import { renderWithIntl } from '@fpsak-frontend/utils-test/test-utils';
import { behandlingType } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/BehandlingType.js';
import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { Behandling } from '@k9-sak-web/types';
import { screen } from '@testing-library/react';
import { UngSakApiKeys, requestApi } from '../../data/ungsakApi';
import BeslutterModalIndex from './BeslutterModalIndex';

describe('<BeslutterModalIndex>', () => {
  const behandling = {
    id: 1,
    versjon: 2,
    behandlingsresultat: {
      type: {
        kode: 'IKKE_FASTSATT',
        kodeverk: 'BEHANDLING_RESULTAT_TYPE',
      },
    },
    type: {
      kode: behandlingType.FØRSTEGANGSSØKNAD,
      kodeverk: 'BEHANDLING_TYPE',
    },
    status: {
      kode: behandlingStatus.OPPRETTET,
      kodeverk: '',
    },
  } as Behandling;

  it('skal vise modal når beslutter godkjenner', () => {
    requestApi.mock(UngSakApiKeys.HAR_REVURDERING_SAMME_RESULTAT, {
      harRevurderingSammeResultat: true,
    });

    renderWithIntl(
      <BeslutterModalIndex
        behandling={behandling}
        fagsakYtelseType={fagsakYtelsesType.FORELDREPENGER}
        allAksjonspunktApproved={false}
        erKlageWithKA={false}
      />,
    );

    expect(
      screen.getByRole('dialog', { name: 'Forslag til vedtak er sendt til beslutter. Du kommer nå til forsiden.' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Vedtak returneres til saksbehandler for ny vurdering.')).toBeInTheDocument();
    expect(screen.getByText('Du kommer nå til forsiden.')).toBeInTheDocument();
  });
});
