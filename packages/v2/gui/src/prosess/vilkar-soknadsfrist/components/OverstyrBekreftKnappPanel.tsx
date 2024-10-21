import { Button } from '@navikt/ds-react';

interface OwnProps {
  disabled?: boolean;
  submitting: boolean;
  pristine: boolean;
  overrideReadOnly: boolean;
}

const OverstyrBekreftKnappPanel = ({ disabled = false, submitting, pristine, overrideReadOnly }: OwnProps) => {
  if (overrideReadOnly) {
    return null;
  }
  return (
    <Button variant="primary" size="small" loading={submitting} disabled={disabled || submitting || pristine}>
      Bekreft overstyring
    </Button>
  );
};

export default OverstyrBekreftKnappPanel;
