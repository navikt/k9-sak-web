import { Button } from '@navikt/ds-react';
import React from 'react';
import { FormattedMessage } from 'react-intl';

interface OwnProps {
  disabled?: boolean;
  submitting: boolean;
  pristine: boolean;
  overrideReadOnly: boolean;
}

const OverstyrBekreftKnappPanel = ({ disabled, submitting, pristine, overrideReadOnly }: OwnProps) => {
  if (overrideReadOnly) {
    return null;
  }
  return (
    <Button variant="primary" size="small" loading={submitting} disabled={disabled || submitting || pristine}>
      <FormattedMessage id="OverstyrBekreftKnappPanel.ConfirmInformation" />
    </Button>
  );
};

OverstyrBekreftKnappPanel.defaultProps = {
  disabled: false,
};

export default OverstyrBekreftKnappPanel;
