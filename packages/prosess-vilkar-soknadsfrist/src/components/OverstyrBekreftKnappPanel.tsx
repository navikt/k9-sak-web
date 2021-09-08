import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Hovedknapp } from 'nav-frontend-knapper';

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
    <Hovedknapp mini spinner={submitting} disabled={disabled || submitting || pristine}>
      <FormattedMessage id="OverstyrBekreftKnappPanel.ConfirmInformation" />
    </Hovedknapp>
  );
};

OverstyrBekreftKnappPanel.defaultProps = {
  disabled: false,
};

export default OverstyrBekreftKnappPanel;
