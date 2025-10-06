import { renderWithIntl } from '@fpsak-frontend/utils-test/test-utils';
import { behandlingType } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/BehandlingType.js';
import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { screen } from '@testing-library/react';
import { UngSakApiKeys, requestApi } from '../../data/ungsakApi';
import BeslutterModalIndex from './BeslutterModalIndex';
import { TotrinnskontrollBehandling } from '@k9-sak-web/gui/sak/totrinnskontroll/types/TotrinnskontrollBehandling.js';
import { BehandlingStatus } from '@k9-sak-web/backend/k9sak/kodeverk/BehandlingStatus.js';

describe('<BeslutterModalIndex>', () => {
  const behandling: TotrinnskontrollBehandling = {
    id: 1,
    uuid: '1-1',
    versjon: 2,
    behandlingsresultatType: 'IKKE_FASTSATT',
    type: behandlingType.FØRSTEGANGSSØKNAD,
    status: BehandlingStatus.OPPRETTET,
  };

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
