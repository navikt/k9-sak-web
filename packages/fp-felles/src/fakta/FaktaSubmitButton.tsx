import React, { FunctionComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Hovedknapp } from 'nav-frontend-knapper';

import { ariaCheck, isRequiredMessage } from '@fpsak-frontend/utils';

import {
  isBehandlingFormDirty,
  isBehandlingFormSubmitting,
  hasBehandlingFormErrorsOfType,
} from '@fpsak-frontend/form/src/behandlingForm';

const isDisabled = (
  isDirty: boolean,
  isSubmitting: boolean,
  isSubmittable: boolean,
  hasEmptyRequiredFields: boolean,
  hasOpenAksjonspunkter: boolean,
) => {
  if (!isSubmittable || isSubmitting) {
    return true;
  }
  if (hasOpenAksjonspunkter) {
    return hasEmptyRequiredFields || (!isDirty && hasEmptyRequiredFields);
  }

  return !isDirty;
};

interface FaktaSubmitButtonProps {
  buttonTextId?: string;
  isReadOnly: boolean;
  isSubmittable: boolean;
  isSubmitting?: boolean;
  isDirty?: boolean;
  hasEmptyRequiredFields?: boolean;
  hasOpenAksjonspunkter: boolean;
  onClick?: () => void;
  formName?: string;
  formNames?: string[];
  behandlingId?: number;
  behandlingVersjon?: number;
  doNotCheckForRequiredFields?: boolean;
  dataId?: string;
}

/**
 * FaktaSubmitButton
 */
export const FaktaSubmitButton: FunctionComponent<FaktaSubmitButtonProps> = ({
  isReadOnly,
  isSubmittable,
  isSubmitting,
  isDirty,
  hasEmptyRequiredFields,
  hasOpenAksjonspunkter,
  buttonTextId = 'SubmitButton.ConfirmInformation',
  onClick,
  dataId,
}) => (
  <>
    {!isReadOnly && (
      <Hovedknapp
        mini
        spinner={isSubmitting}
        disabled={isDisabled(isDirty, isSubmitting, isSubmittable, hasEmptyRequiredFields, hasOpenAksjonspunkter)}
        onClick={onClick || ariaCheck}
        htmlType={onClick ? 'button' : 'submit'}
        data-id={dataId}
      >
        <FormattedMessage id={buttonTextId} />
      </Hovedknapp>
    )}
  </>
);

const mapStateToProps = (state, ownProps: FaktaSubmitButtonProps) => {
  const { behandlingId, behandlingVersjon } = ownProps;
  const fNames = ownProps.formNames ? ownProps.formNames : [ownProps.formName];
  const formNames = fNames.map(f => (f.includes('.') ? f.substr(f.lastIndexOf('.') + 1) : f));
  return {
    isSubmitting: formNames.some(formName =>
      isBehandlingFormSubmitting(formName, behandlingId, behandlingVersjon)(state),
    ),
    isDirty: formNames.some(formName => isBehandlingFormDirty(formName, behandlingId, behandlingVersjon)(state)),
    hasEmptyRequiredFields: ownProps.doNotCheckForRequiredFields
      ? false
      : formNames.some(formName =>
          hasBehandlingFormErrorsOfType(formName, behandlingId, behandlingVersjon, isRequiredMessage())(state),
        ),
  };
};

export default connect(mapStateToProps)(FaktaSubmitButton);
