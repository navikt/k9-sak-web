import { Button, HGrid } from '@navikt/ds-react';

import styles from './vedtakKlageSubmitPanel.module.css';

// const getPreviewCallback = async (
//   formState: FormState<FormValues>,
//   previewVedtakCallback: OwnProps['previewVedtakCallback'],
// ) => {
//   if (formState.isValid || !formState.isDirty) {
//     await previewVedtakCallback({ dokumentMal: dokumentMalType.UTLED });
//   }
//   // else {
//   //   formProps.submit();
//   // }
// };

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
  // const previewBrev = () => getPreviewCallback(formState, previewVedtakCallback);

  return (
    <HGrid gap="space-4" columns={{ xs: '6fr 6fr' }}>
      <div>
        {!readOnly && (
          <Button
            variant="primary"
            size="small"
            className={styles.mainButton}
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
      </div>
    </HGrid>
  );
};
