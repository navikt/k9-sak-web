import React from 'react';

import { decodeHtmlEntity } from '@fpsak-frontend/utils';
import TextArea from './TextArea';
import styles from './faktaBegrunnelseTextField.module.css';
import { hasValidText, maxLength, minLength, required } from './validators';

const minLength3 = minLength(3);
const maxLength1500 = maxLength(1500);

type OwnProps = {
  isReadOnly: boolean;
  isSubmittable: boolean;
  hasBegrunnelse: boolean;
  label?: string;
  hasVurderingText?: boolean;
  name?: string;
};

export type FormValues = {
  [key: string]: string;
};

type TransformedValues = {
  begrunnelse: string;
};

/**
 * FaktaBegrunnelseTextField
 */
const FaktaBegrunnelseTextFieldRHF = ({
  isReadOnly,
  isSubmittable,
  hasBegrunnelse,
  label,
  name = 'begrunnelse',
}: OwnProps) =>
  (isSubmittable || hasBegrunnelse) && (
    <div className={styles.begrunnelseTextField}>
      <TextArea
        name={name}
        label={isReadOnly ? '' : label}
        validators={{ required, minLength3, maxLength1500, hasValidText }}
        disabled={isReadOnly}
      />
    </div>
  );

const getBegrunnelse = (aksjonspunkt: { begrunnelse: string }[] | { begrunnelse: string }): string => {
  if (aksjonspunkt && Array.isArray(aksjonspunkt)) {
    return aksjonspunkt.length > 0 ? aksjonspunkt[0].begrunnelse : '';
  }
  return aksjonspunkt && !Array.isArray(aksjonspunkt) ? aksjonspunkt.begrunnelse : '';
};

FaktaBegrunnelseTextFieldRHF.buildInitialValues = (
  aksjonspunkt: { begrunnelse: string }[] | { begrunnelse: string },
  begrunnelseFieldName = 'begrunnelse',
): FormValues => ({
  [begrunnelseFieldName]: decodeHtmlEntity(getBegrunnelse(aksjonspunkt)),
});

FaktaBegrunnelseTextFieldRHF.transformValues = (values: FormValues, name = 'begrunnelse'): TransformedValues => ({
  begrunnelse: values[name],
});

export default FaktaBegrunnelseTextFieldRHF;
