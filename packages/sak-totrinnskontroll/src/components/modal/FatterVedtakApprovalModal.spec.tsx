import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import BehandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import { renderWithIntl } from '@fpsak-frontend/utils-test/test-utils';
import { screen } from '@testing-library/react';
import FatterVedtakApprovalModal from './FatterVedtakApprovalModal';

describe('<FatterVedtakApprovalModal>', () => {
  const closeEventCallback = vi.fn();
  it('skal rendre modal for fatter vedtak', () => {
    renderWithIntl(
      <FatterVedtakApprovalModal
        closeEvent={closeEventCallback}
        allAksjonspunktApproved
        behandlingStatusKode={behandlingStatus.FATTER_VEDTAK}
        behandlingTypeKode={BehandlingType.KLAGE}
        fagsakYtelseType={{
          kode: fagsakYtelseType.FORELDREPENGER,
          kodeverk: '',
        }}
        erKlageWithKA
      />,
    );

    expect(screen.getByText('Klagen returneres til saksbehandler for iverksettelse.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'OK' })).toBeInTheDocument();
  });

  it('skal rendre modal for iverksetter vedtak', () => {
    renderWithIntl(
      <FatterVedtakApprovalModal
        closeEvent={closeEventCallback}
        allAksjonspunktApproved
        behandlingStatusKode={behandlingStatus.FATTER_VEDTAK}
        behandlingTypeKode={BehandlingType.FORSTEGANGSSOKNAD}
        fagsakYtelseType={{
          kode: fagsakYtelseType.ENGANGSSTONAD,
          kodeverk: '',
        }}
        erKlageWithKA
      />,
    );

    expect(screen.getByText('Omsorgspenger er innvilget og vedtaket blir iverksatt')).toBeInTheDocument();
    expect(screen.getByText('Du kommer nå til forsiden.')).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'OK' })).toBeInTheDocument();
  });

  it('skal rendre modal for iverksetter vedtak utvidet rett', () => {
    renderWithIntl(
      <FatterVedtakApprovalModal
        closeEvent={closeEventCallback}
        allAksjonspunktApproved
        behandlingStatusKode={behandlingStatus.FATTER_VEDTAK}
        behandlingTypeKode={BehandlingType.FORSTEGANGSSOKNAD}
        fagsakYtelseType={{
          kode: fagsakYtelseType.OMSORGSPENGER_KRONISK_SYKT_BARN,
          kodeverk: '',
        }}
        erKlageWithKA
      />,
    );

    expect(screen.getByText('Ekstra omsorgsdager er innvilget og vedtaket blir iverksatt')).toBeInTheDocument();
    expect(screen.getByText('Du kommer nå til forsiden.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'OK' })).toBeInTheDocument();
  });
});
