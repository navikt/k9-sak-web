import { TextAreaField } from '@fpsak-frontend/form';
import { decodeHtmlEntity, hasValidText, maxLength, minLength, required } from '@fpsak-frontend/utils';
import React from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import { Aksjonspunkt } from '@k9-sak-web/types';
import messages from '../../i18n/nb_NO.json';
import styles from './faktaBegrunnelseTextField.css';

const cache = createIntlCache();

const intl = createIntl(
  {
    locale: 'nb-NO',
    messages,
  },
  cache,
);

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
  hasVurderingText,
  name,
}: OwnProps) => {
  const code = hasVurderingText ? 'FaktaBegrunnelseTextField.Vurdering' : 'FaktaBegrunnelseTextField.BegrunnEndringene';
  const textAreaLabel = label || { id: code };
  return (
    <RawIntlProvider value={intl}>
      {(isSubmittable || hasBegrunnelse) && (
        <div className={styles.begrunnelseTextField}>
          <TextAreaField
            name={name}
            label={isReadOnly ? '' : textAreaLabel}
            validate={[required, minLength3, maxLength1500, hasValidText]}
            textareaClass={isReadOnly ? styles.explanationTextareaReadOnly : styles.explanationTextarea}
            maxLength={1500}
            readOnly={isReadOnly}
          />
        </div>
      )}
    </RawIntlProvider>
  );
};

FaktaBegrunnelseTextField.defaultProps = {
  name: 'begrunnelse',
  hasVurderingText: false,
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
