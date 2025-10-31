import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import {
  VedtakKlageKaSubmitPanel,
  VedtakKlageNkkSubmitPanel,
  VedtakKlageSubmitPanel,
  VedtakKlageSubmitPanelUnified,
} from './VedtakKlageSubmitPanel';

describe('VedtakKlageSubmitPanelUnified', () => {
  const defaultProps = {
    behandlingPåVent: false,
    readOnly: false,
    submitCallback: vi.fn(),
    isSubmitting: false,
  };

  describe('KA variant', () => {
    it('skal vise "Send til medunderskriver" knapp når ikke godkjent', () => {
      render(
        <VedtakKlageSubmitPanelUnified
          {...defaultProps}
          variant="ka"
          godkjentAvMedunderskriver={false}
          previewVedtakCallback={vi.fn()}
        />,
      );

      expect(screen.getByRole('button', { name: 'Send til medunderskriver' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Send til medunderskriver' })).not.toBeDisabled();
    });

    it('skal vise "Ferdigstill klage" knapp som disabled når ikke godkjent', () => {
      render(
        <VedtakKlageSubmitPanelUnified
          {...defaultProps}
          variant="ka"
          godkjentAvMedunderskriver={false}
          previewVedtakCallback={vi.fn()}
        />,
      );

      expect(screen.getByRole('button', { name: 'Ferdigstill klage' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Ferdigstill klage' })).toBeDisabled();
    });

    it('skal vise "Ferdigstill klage" knapp som enabled når godkjent', () => {
      render(
        <VedtakKlageSubmitPanelUnified
          {...defaultProps}
          variant="ka"
          godkjentAvMedunderskriver={true}
          previewVedtakCallback={vi.fn()}
        />,
      );

      expect(screen.getByRole('button', { name: 'Ferdigstill klage' })).not.toBeDisabled();
      expect(screen.getByRole('button', { name: 'Send til medunderskriver' })).toBeDisabled();
    });

    it('skal vise preview knapp', () => {
      render(
        <VedtakKlageSubmitPanelUnified
          {...defaultProps}
          variant="ka"
          godkjentAvMedunderskriver={false}
          previewVedtakCallback={vi.fn()}
        />,
      );

      expect(screen.getByRole('button', { name: 'Forhåndsvis vedtaksbrev' })).toBeInTheDocument();
    });

    it('skal disable alle knapper når behandling er på vent', () => {
      render(
        <VedtakKlageSubmitPanelUnified
          {...defaultProps}
          behandlingPåVent={true}
          variant="ka"
          godkjentAvMedunderskriver={false}
          previewVedtakCallback={vi.fn()}
        />,
      );

      expect(screen.getByRole('button', { name: 'Send til medunderskriver' })).toBeDisabled();
      expect(screen.getByRole('button', { name: 'Ferdigstill klage' })).toBeDisabled();
    });
  });

  describe('NKK variant', () => {
    it('skal vise "Fatt Vedtak" knapp når ikke godkjent', () => {
      render(<VedtakKlageSubmitPanelUnified {...defaultProps} variant="nkk" godkjentAvMedunderskriver={false} />);

      expect(screen.getByRole('button', { name: 'Fatt Vedtak' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Fatt Vedtak' })).not.toBeDisabled();
    });

    it('skal disable "Fatt Vedtak" når godkjent', () => {
      render(<VedtakKlageSubmitPanelUnified {...defaultProps} variant="nkk" godkjentAvMedunderskriver={true} />);

      expect(screen.getByRole('button', { name: 'Fatt Vedtak' })).toBeDisabled();
    });

    it('skal IKKE vise preview knapp', () => {
      render(<VedtakKlageSubmitPanelUnified {...defaultProps} variant="nkk" godkjentAvMedunderskriver={false} />);

      expect(screen.queryByRole('button', { name: 'Forhåndsvis vedtaksbrev' })).not.toBeInTheDocument();
    });
  });

  describe('Standard variant', () => {
    it('skal vise "Til godkjenning" knapp', () => {
      render(<VedtakKlageSubmitPanelUnified {...defaultProps} variant="standard" previewVedtakCallback={vi.fn()} />);

      expect(screen.getByRole('button', { name: 'Til godkjenning' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Til godkjenning' })).not.toBeDisabled();
    });

    it('skal vise preview knapp', () => {
      render(<VedtakKlageSubmitPanelUnified {...defaultProps} variant="standard" previewVedtakCallback={vi.fn()} />);

      expect(screen.getByRole('button', { name: 'Forhåndsvis vedtaksbrev' })).toBeInTheDocument();
    });

    it('skal disable knapp når behandling er på vent', () => {
      render(
        <VedtakKlageSubmitPanelUnified
          {...defaultProps}
          behandlingPåVent={true}
          variant="standard"
          previewVedtakCallback={vi.fn()}
        />,
      );

      expect(screen.getByRole('button', { name: 'Til godkjenning' })).toBeDisabled();
    });
  });

  describe('ReadOnly state', () => {
    it('skal ikke vise submit knapper når readOnly', () => {
      render(
        <VedtakKlageSubmitPanelUnified
          {...defaultProps}
          readOnly={true}
          variant="ka"
          godkjentAvMedunderskriver={false}
          previewVedtakCallback={vi.fn()}
        />,
      );

      expect(screen.queryByRole('button', { name: 'Send til medunderskriver' })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Ferdigstill klage' })).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Forhåndsvis vedtaksbrev' })).toBeInTheDocument();
    });
  });

  describe('Wrapper components', () => {
    it('VedtakKlageKaSubmitPanel skal fungere med riktig typing', () => {
      render(
        <VedtakKlageKaSubmitPanel
          {...defaultProps}
          godkjentAvMedunderskriver={false}
          previewVedtakCallback={vi.fn()}
        />,
      );

      expect(screen.getByRole('button', { name: 'Send til medunderskriver' })).toBeInTheDocument();
    });

    it('VedtakKlageNkkSubmitPanel skal fungere med riktig typing', () => {
      render(<VedtakKlageNkkSubmitPanel {...defaultProps} godkjentAvMedunderskriver={false} />);

      expect(screen.getByRole('button', { name: 'Fatt Vedtak' })).toBeInTheDocument();
    });

    it('VedtakKlageSubmitPanelUnified skal fungere med riktig typing', () => {
      render(<VedtakKlageSubmitPanel {...defaultProps} previewVedtakCallback={vi.fn()} />);

      expect(screen.getByRole('button', { name: 'Til godkjenning' })).toBeInTheDocument();
    });
  });
});
