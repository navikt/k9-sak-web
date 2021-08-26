import React, { FunctionComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import { Hovedknapp } from 'nav-frontend-knapper';

interface OwnProps {
  disabled?: boolean;
  submitting: boolean;
  pristine: boolean;
  overrideReadOnly: boolean;
}

const OverstyrBekreftKnappPanel: FunctionComponent<OwnProps> = ({
  disabled,
  submitting,
  pristine,
  overrideReadOnly,
}) => {
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
