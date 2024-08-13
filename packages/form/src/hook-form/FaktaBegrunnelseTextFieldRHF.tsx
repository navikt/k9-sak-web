import React, { FunctionComponent } from 'react';

import { decodeHtmlEntity } from '@fpsak-frontend/utils';
import { hasValidText, maxLength, minLength, required } from '@navikt/ft-form-validators';
import TextArea from './TextArea';
import styles from './faktaBegrunnelseTextField.module.css';

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
  begrunnelse: string;
};

type TransformedValues = {
  begrunnelse: string;
};

interface StaticFunctions {
  buildInitialValues: (
    aksjonspunkt: { begrunnelse: string }[] | { begrunnelse: string },
    begrunnelseFieldName?: string,
  ) => FormValues;
  transformValues: (values: FormValues, name: string) => TransformedValues;
}

/**
 * FaktaBegrunnelseTextField
 */
const FaktaBegrunnelseTextFieldRHF: FunctionComponent<OwnProps> & StaticFunctions = ({
  isReadOnly,
  isSubmittable,
  hasBegrunnelse,
  label,
  name = 'begrunnelse',
}) =>
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
): FormValues => ({
  begrunnelse: decodeHtmlEntity(getBegrunnelse(aksjonspunkt)),
});

FaktaBegrunnelseTextFieldRHF.transformValues = (values: FormValues, name = 'begrunnelse'): TransformedValues => ({
  begrunnelse: values[name],
});

export default FaktaBegrunnelseTextFieldRHF;
