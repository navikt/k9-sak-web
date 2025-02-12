import React from 'react';

import { Button } from '@navikt/ds-react';

import { ariaCheck } from '@navikt/ft-form-validators';

import { createIntl, createIntlCache } from 'react-intl';
import messages from '../../../i18n/nb_NO.json';

const cache = createIntlCache();

const intl = createIntl(
  {
    locale: 'nb-NO',
    messages,
  },
  cache,
);

const isDisabled = (isDirty: boolean, isSubmitting: boolean, isSubmittable: boolean): boolean => {
  if (!isSubmittable || isSubmitting) {
    return true;
  }
  return !isDirty;
};

export interface Props {
  isReadOnly: boolean;
  isSubmittable: boolean;
  isSubmitting: boolean;
  isDirty: boolean;
  onClick?: (event: React.MouseEvent) => void;
}

/**
 * ProsessStegSubmitButton
 */
export const SubmitButton = ({ isReadOnly, isSubmittable, onClick, isSubmitting, isDirty }: Props) => {
  if (!isReadOnly) {
    return (
      <Button
        size="small"
        loading={isSubmitting}
        disabled={isDisabled(isDirty, isSubmitting, isSubmittable)}
        onClick={onClick || ariaCheck}
        type={onClick ? 'button' : 'submit'}
      >
        {intl.formatMessage({ id: 'SubmitButton.ConfirmInformation' })}
      </Button>
    );
  }
  return null;
};
