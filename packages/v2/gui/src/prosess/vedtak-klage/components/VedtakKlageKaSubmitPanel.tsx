import { type ung_sak_kontrakt_klage_KlageVurderingResultatDto } from '@k9-sak-web/backend/ungsak/generated/types.js';
import { Button, HGrid, HStack } from '@navikt/ds-react';

interface OwnProps {
  behandlingPåVent: boolean;
  readOnly: boolean;
  klageResultat: ung_sak_kontrakt_klage_KlageVurderingResultatDto;
  previewVedtakCallback: () => Promise<void>;
  submitCallback: () => void;
  isSubmitting: boolean;
}

export const VedtakKlageKaSubmitPanel = ({
  behandlingPåVent,
  previewVedtakCallback,
  klageResultat,
  readOnly,
  submitCallback,
  isSubmitting,
}: OwnProps) => {
  return (
    <HGrid gap="space-4" columns={{ xs: '8fr 4fr' }}>
      <HStack gap="space-16" marginBlock="space-12">
        {!readOnly && (
          <Button
            variant="primary"
            size="small"
            disabled={behandlingPåVent || klageResultat.godkjentAvMedunderskriver}
            type="submit"
            onClick={submitCallback}
            loading={isSubmitting}
          >
            Send til medunderskriver
          </Button>
        )}
        {!readOnly && (
          <Button
            variant="primary"
            size="small"
            disabled={behandlingPåVent || !klageResultat.godkjentAvMedunderskriver}
            type="submit"
            onClick={submitCallback}
            loading={isSubmitting}
          >
            Ferdigstill klage
          </Button>
        )}
        <Button variant="tertiary" size="small" type="button" onClick={previewVedtakCallback}>
          Forhåndsvis vedtaksbrev
        </Button>
      </HStack>
    </HGrid>
  );
};
