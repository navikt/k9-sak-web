import { behandlingType } from '@k9-sak-web/backend/k9klage/kodeverk/behandling/BehandlingType.js';
import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { BehandlingDtoStatus } from '@navikt/k9-sak-typescript-client';
import { render, screen } from '@testing-library/react';
import FatterVedtakApprovalModal from './FatterVedtakApprovalModal';

describe('<FatterVedtakApprovalModal>', () => {
  const closeEventCallback = vi.fn();
  it('skal rendre modal for fatter vedtak', () => {
    render(
      <FatterVedtakApprovalModal
        closeEvent={closeEventCallback}
        allAksjonspunktApproved
        behandlingStatusKode={BehandlingDtoStatus.FATTER_VEDTAK}
        behandlingTypeKode={behandlingType.KLAGE}
        fagsakYtelseType={fagsakYtelsesType.FORELDREPENGER}
        erKlageWithKA
      />,
    );

    expect(screen.getByText('Klagen returneres til saksbehandler for iverksettelse.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'OK' })).toBeInTheDocument();
  });

  it('skal rendre modal for iverksetter vedtak', () => {
    render(
      <FatterVedtakApprovalModal
        closeEvent={closeEventCallback}
        allAksjonspunktApproved
        behandlingStatusKode={BehandlingDtoStatus.FATTER_VEDTAK}
        behandlingTypeKode={behandlingType.FØRSTEGANGSSØKNAD}
        fagsakYtelseType={fagsakYtelsesType.ENGANGSTØNAD}
        erKlageWithKA
      />,
    );

    expect(screen.getAllByText('Omsorgspenger er innvilget og vedtaket blir iverksatt')).toHaveLength(1);
    expect(screen.getByText('Du kommer nå til forsiden.')).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'OK' })).toBeInTheDocument();
  });

  it('skal rendre modal for iverksetter vedtak utvidet rett', () => {
    render(
      <FatterVedtakApprovalModal
        closeEvent={closeEventCallback}
        allAksjonspunktApproved
        behandlingStatusKode={BehandlingDtoStatus.FATTER_VEDTAK}
        behandlingTypeKode={behandlingType.FØRSTEGANGSSØKNAD}
        fagsakYtelseType={fagsakYtelsesType.OMSORGSPENGER_KS}
        erKlageWithKA
      />,
    );

    expect(screen.getByText('Ekstra omsorgsdager er innvilget og vedtaket blir iverksatt')).toBeInTheDocument();
    expect(screen.getByText('Du kommer nå til forsiden.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'OK' })).toBeInTheDocument();
  });
});
