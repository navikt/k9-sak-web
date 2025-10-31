import { Button, HStack } from '@navikt/ds-react';

type SubmitPanelVariant = 'ka' | 'nkk' | 'standard';

interface BaseProps {
  behandlingPåVent: boolean;
  readOnly: boolean;
  submitCallback: () => void;
  isSubmitting: boolean;
}

interface WithPreview {
  previewVedtakCallback: () => Promise<void>;
}

interface WithGodkjenning {
  godkjentAvMedunderskriver: boolean;
}

type KaProps = BaseProps & WithPreview & WithGodkjenning;
type NkkProps = BaseProps & WithGodkjenning;
type StandardProps = BaseProps & WithPreview;

interface UnifiedProps extends BaseProps {
  variant: SubmitPanelVariant;
  previewVedtakCallback?: () => Promise<void>;
  godkjentAvMedunderskriver?: boolean;
}

const getButtonConfig = (
  variant: SubmitPanelVariant,
  godkjentAvMedunderskriver: boolean,
  behandlingPåVent: boolean,
) => {
  switch (variant) {
    case 'ka':
      return {
        buttons: [
          {
            label: 'Send til medunderskriver',
            disabled: behandlingPåVent || godkjentAvMedunderskriver,
          },
          {
            label: 'Ferdigstill klage',
            disabled: behandlingPåVent || !godkjentAvMedunderskriver,
          },
        ],
        showPreview: true,
      };
    case 'nkk':
      return {
        buttons: [
          {
            label: 'Fatt Vedtak',
            disabled: behandlingPåVent || godkjentAvMedunderskriver,
          },
        ],
        showPreview: false,
      };
    case 'standard':
      return {
        buttons: [
          {
            label: 'Til godkjenning',
            disabled: behandlingPåVent,
          },
        ],
        showPreview: true,
      };
  }
};

export const VedtakKlageSubmitPanelUnified = ({
  variant,
  behandlingPåVent,
  readOnly,
  submitCallback,
  isSubmitting,
  previewVedtakCallback,
  godkjentAvMedunderskriver = false,
}: UnifiedProps) => {
  const config = getButtonConfig(variant, godkjentAvMedunderskriver, behandlingPåVent);

  return (
    <HStack gap="space-16" marginBlock="space-12">
      {!readOnly &&
        config.buttons.map((button, index) => (
          <Button
            key={index}
            variant="primary"
            size="small"
            disabled={button.disabled}
            type="submit"
            onClick={submitCallback}
            loading={isSubmitting}
          >
            {button.label}
          </Button>
        ))}
      {config.showPreview && previewVedtakCallback && (
        <Button variant="tertiary" size="small" type="button" onClick={previewVedtakCallback}>
          Forhåndsvis vedtaksbrev
        </Button>
      )}
    </HStack>
  );
};

// Convenience wrappers med type-safe props
export const VedtakKlageKaSubmitPanel = (props: KaProps) => <VedtakKlageSubmitPanelUnified variant="ka" {...props} />;

export const VedtakKlageNkkSubmitPanel = (props: NkkProps) => (
  <VedtakKlageSubmitPanelUnified variant="nkk" {...props} />
);

export const VedtakKlageSubmitPanel = (props: StandardProps) => (
  <VedtakKlageSubmitPanelUnified variant="standard" {...props} />
);
