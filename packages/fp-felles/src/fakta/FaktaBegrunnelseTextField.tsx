import React from 'react';
import { decodeHtmlEntity, hasValidText, maxLength, minLength, required } from '@fpsak-frontend/utils';
import { TextAreaField } from '@fpsak-frontend/form';
import { ElementWrapper } from '@fpsak-frontend/shared-components';

import { Aksjonspunkt } from '@k9-frontend/types';
import styles from './faktaBegrunnelseTextField.less';

const minLength3 = minLength(3);
const maxLength1500 = maxLength(1500);

/**
 * FaktaBegrunnelseTextField
 */
const FaktaBegrunnelseTextField = ({
  isReadOnly,
  isSubmittable,
  hasBegrunnelse,
  labelCode = 'FaktaBegrunnelseTextField.BegrunnEndringene',
  hasVurderingText,
  name = 'begrunnelse',
}: FaktaBegrunnelseTextFieldProps) => (
  <ElementWrapper>
    {(isSubmittable || hasBegrunnelse) && (
      <div className={styles.begrunnelseTextField}>
        <TextAreaField
          name={name}
          label={isReadOnly ? '' : { id: hasVurderingText ? 'FaktaBegrunnelseTextField.Vurdering' : labelCode }}
          validate={[required, minLength3, maxLength1500, hasValidText]}
          textareaClass={isReadOnly ? styles.explanationTextareaReadOnly : styles.explanationTextarea}
          maxLength={1500}
          readOnly={isReadOnly}
        />
      </div>
    )}
  </ElementWrapper>
);

interface FaktaBegrunnelseTextFieldProps {
  isReadOnly: boolean;
  isSubmittable: boolean;
  isDirty: boolean;
  hasBegrunnelse: boolean;
  labelCode?: string;
  hasVurderingText?: boolean;
  name?: string;
}

const getBegrunnelse = (aksjonspunkt: Aksjonspunkt[] | Aksjonspunkt) => {
  if (aksjonspunkt && Array.isArray(aksjonspunkt) && aksjonspunkt.length > 0) {
    return aksjonspunkt[0].begrunnelse;
  }
  return aksjonspunkt && !Array.isArray(aksjonspunkt) ? aksjonspunkt.begrunnelse : '';
};

FaktaBegrunnelseTextField.buildInitialValues = (
  aksjonspunkt: Aksjonspunkt[],
  begrunnelseFieldName = 'begrunnelse',
) => ({
  [begrunnelseFieldName]: decodeHtmlEntity(getBegrunnelse(aksjonspunkt)),
});

FaktaBegrunnelseTextField.transformValues = (values: string[], name = 'begrunnelse') => ({
  begrunnelse: values[name],
});

export default FaktaBegrunnelseTextField;
