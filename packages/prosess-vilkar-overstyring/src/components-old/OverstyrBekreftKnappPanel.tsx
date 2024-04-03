import { Button } from '@navikt/ds-react';
import React from 'react';
import { FormattedMessage } from 'react-intl';

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
      <FormattedMessage id="OverstyrBekreftKnappPanel.ConfirmInformation" />
    </Button>
  );
};

export default OverstyrBekreftKnappPanel;
