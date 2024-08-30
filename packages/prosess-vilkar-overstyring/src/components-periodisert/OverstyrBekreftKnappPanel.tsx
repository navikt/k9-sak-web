import { Button } from '@navikt/ds-react';

interface OwnProps {
  submitting: boolean;
  pristine: boolean;
  overrideReadOnly: boolean;
}

const OverstyrBekreftKnappPanel = ({ submitting, pristine, overrideReadOnly }: OwnProps) => {
  if (overrideReadOnly) {
    return null;
  }
  return (
    <Button variant="primary" size="small" loading={submitting} disabled={submitting || pristine}>
      Bekreft overstyring
    </Button>
  );
};

export default OverstyrBekreftKnappPanel;
