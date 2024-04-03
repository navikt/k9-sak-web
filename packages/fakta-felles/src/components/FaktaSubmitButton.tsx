import React from 'react';
import { FormattedMessage, RawIntlProvider, createIntl, createIntlCache } from 'react-intl';
import { connect } from 'react-redux';

import { hasBehandlingFormErrorsOfType, isBehandlingFormDirty, isBehandlingFormSubmitting } from '@fpsak-frontend/form';
import { ariaCheck, isRequiredMessage } from '@fpsak-frontend/utils';

import { Button } from '@navikt/ds-react';
import messages from '../../i18n/nb_NO.json';

const cache = createIntlCache();

const intl = createIntl(
  {
    locale: 'nb-NO',
    messages,
  },
  cache,
);

const isDisabled = (
  isDirty: boolean,
  isSubmitting: boolean,
  isSubmittable: boolean,
  hasEmptyRequiredFields: boolean,
  hasOpenAksjonspunkter: boolean,
): boolean => {
  if (!isSubmittable || isSubmitting) {
    return true;
  }
  if (hasOpenAksjonspunkter) {
    return hasEmptyRequiredFields || (!isDirty && hasEmptyRequiredFields);
  }

  return !isDirty;
};

interface PureOwnProps {
  behandlingId: number;
  behandlingVersjon: number;
  formNames?: string[];
  formName?: string;
  doNotCheckForRequiredFields?: boolean;
  buttonText?: string;
  isReadOnly: boolean;
  isSubmittable: boolean;
  hasOpenAksjonspunkter: boolean;
  onClick?: (event: React.MouseEvent) => void;
  dataId?: string;
}

interface MappedOwnProps {
  isSubmitting: boolean;
  isDirty: boolean;
  hasEmptyRequiredFields: boolean;
}

/**
 * FaktaSubmitButton
 */
export const FaktaSubmitButton = ({
  isReadOnly,
  isSubmittable,
  isSubmitting,
  isDirty,
  hasEmptyRequiredFields,
  hasOpenAksjonspunkter,
  buttonText,
  onClick,
  dataId,
}: Partial<PureOwnProps> & MappedOwnProps) => (
  <RawIntlProvider value={intl}>
    {!isReadOnly && (
      <Button
        variant="primary"
        size="small"
        loading={isSubmitting}
        disabled={isDisabled(isDirty, isSubmitting, isSubmittable, hasEmptyRequiredFields, hasOpenAksjonspunkter)}
        onClick={onClick || ariaCheck}
        type={onClick ? 'button' : 'submit'}
        data-id={dataId}
      >
        {!!buttonText && buttonText}
        {!buttonText && <FormattedMessage id="SubmitButton.ConfirmInformation" />}
      </Button>
    )}
  </RawIntlProvider>
);

const mapStateToProps = (state: any, ownProps: PureOwnProps): MappedOwnProps => {
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
          // @ts-ignore Fiks denne (reselect)
          hasBehandlingFormErrorsOfType(formName, behandlingId, behandlingVersjon, isRequiredMessage())(state),
        ),
  };
};

export default connect(mapStateToProps)(FaktaSubmitButton);
