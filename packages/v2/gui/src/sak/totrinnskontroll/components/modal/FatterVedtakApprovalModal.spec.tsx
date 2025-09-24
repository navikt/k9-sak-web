import { behandlingType } from '@k9-sak-web/backend/k9klage/kodeverk/behandling/BehandlingType.js';
import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { k9_kodeverk_behandling_BehandlingStatus as BehandlingDtoStatus } from '@k9-sak-web/backend/k9sak/generated/types.js';
import { render, screen } from '@testing-library/react';
import FatterVedtakApprovalModal from './FatterVedtakApprovalModal.js';
import { BehandlingResultatType } from '@k9-sak-web/backend/combined/kodeverk/behandling/BehandlingResultatType.js';

describe('<FatterVedtakApprovalModal>', () => {
  const closeEventCallback = vi.fn();
  it('skal rendre modal for fatter vedtak', () => {
    render(
      <FatterVedtakApprovalModal
        closeEvent={closeEventCallback}
        allAksjonspunktApproved
        behandlingStatusKode={BehandlingDtoStatus.FATTER_VEDTAK}
        behandlingTypeKode={behandlingType.KLAGE}
        behandlingsresultatType={BehandlingResultatType.IKKE_FASTSATT}
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
        behandlingsresultatType={BehandlingResultatType.IKKE_FASTSATT}
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
        behandlingsresultatType={BehandlingResultatType.IKKE_FASTSATT}
        fagsakYtelseType={fagsakYtelsesType.OMSORGSPENGER_KS}
        erKlageWithKA
      />,
    );

    expect(screen.getByText('Ekstra omsorgsdager er innvilget og vedtaket blir iverksatt')).toBeInTheDocument();
    expect(screen.getByText('Du kommer nå til forsiden.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'OK' })).toBeInTheDocument();
  });
});
