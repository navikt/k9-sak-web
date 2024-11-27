import { TextAreaField } from '@fpsak-frontend/form';
import { decodeHtmlEntity, hasValidText, maxLength, minLength, required } from '@fpsak-frontend/utils';

import { Aksjonspunkt } from '@k9-sak-web/types';
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
  [key: string]: string;
};

type TransformedValues = {
  begrunnelse: string;
};

/**
 * FaktaBegrunnelseTextField
 */
const FaktaBegrunnelseTextField = ({
  isReadOnly,
  isSubmittable,
  hasBegrunnelse,
  label,
  hasVurderingText = false,
  name = 'begrunnelse',
}: OwnProps) => {
  const defaultLabel = hasVurderingText ? 'Vurdering' : 'Begrunn endringene';
  const textAreaLabel = label || defaultLabel;
  return (
    <>
      {(isSubmittable || hasBegrunnelse) && (
        <div className={styles.begrunnelseTextField}>
          <TextAreaField
            name={name}
            label={isReadOnly ? '' : textAreaLabel}
            validate={[required, minLength3, maxLength1500, hasValidText]}
            maxLength={1500}
            readOnly={isReadOnly}
          />
        </div>
      )}
    </>
  );
};

const getBegrunnelse = (aksjonspunkt: Aksjonspunkt[] | Aksjonspunkt): string => {
  if (aksjonspunkt && Array.isArray(aksjonspunkt)) {
    return aksjonspunkt.length > 0 ? aksjonspunkt[0].begrunnelse : '';
  }
  return aksjonspunkt && !Array.isArray(aksjonspunkt) ? aksjonspunkt.begrunnelse : '';
};

FaktaBegrunnelseTextField.buildInitialValues = (
  aksjonspunkt: Aksjonspunkt[] | Aksjonspunkt,
  begrunnelseFieldName = 'begrunnelse',
): FormValues => ({
  [begrunnelseFieldName]: decodeHtmlEntity(getBegrunnelse(aksjonspunkt)),
});

FaktaBegrunnelseTextField.transformValues = (values: FormValues, name = 'begrunnelse'): TransformedValues => ({
  begrunnelse: values[name],
});

export default FaktaBegrunnelseTextField;
