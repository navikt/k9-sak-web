import { Button, HGrid, HStack } from '@navikt/ds-react';

interface OwnProps {
  behandlingPåVent: boolean;
  previewVedtakCallback: () => Promise<void>;
  readOnly: boolean;
  submitCallback: () => void;
  isSubmitting: boolean;
}

export const VedtakKlageSubmitPanel = ({
  behandlingPåVent,
  previewVedtakCallback,
  readOnly,
  submitCallback,
  isSubmitting,
}: OwnProps) => {
  return (
    <HGrid gap="space-4" columns={{ xs: '6fr 6fr' }}>
      <HStack gap="space-16" marginBlock="space-12">
        {!readOnly && (
          <Button
            variant="primary"
            size="small"
            disabled={behandlingPåVent}
            type="submit"
            onClick={submitCallback}
            loading={isSubmitting}
          >
            Til godkjenning
          </Button>
        )}
        <Button variant="tertiary" size="small" type="button" onClick={previewVedtakCallback}>
          Forhåndsvis vedtaksbrev
        </Button>
      </HStack>
    </HGrid>
  );
};
