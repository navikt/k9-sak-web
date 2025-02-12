import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import { TextAreaField } from '@navikt/ft-form-hooks';
import { hasValidText, maxLength, minLength, required } from '@navikt/ft-form-validators';
import { decodeHtmlEntity } from '@navikt/ft-utils';

import styles from './faktaBegrunnelseTextField.module.css';

import messages from '../../../i18n/nb_NO.json';
import type { BeregningAvklaringsbehov } from '../../types/BeregningAvklaringsbehov';

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

type Props = {
  isReadOnly: boolean;
  isSubmittable: boolean;
  hasBegrunnelse: boolean;
  label?: string;
  hasVurderingText?: boolean;
  name: string;
};

export type FormValues = {
  [key: string]: any;
};

type TransformedValues = {
  begrunnelse: string;
};

/**
 * FaktaBegrunnelseTextField
 */
export const FaktaBegrunnelseTextField = ({
  isReadOnly,
  isSubmittable,
  hasBegrunnelse,
  label,
  hasVurderingText = false,
  name = 'begrunnelse',
}: Props) => {
  const code = hasVurderingText ? 'FaktaBegrunnelseTextField.Vurdering' : 'FaktaBegrunnelseTextField.BegrunnEndringene';
  const textAreaLabel = label || intl.formatMessage({ id: code });
  return (
    <RawIntlProvider value={intl}>
      {(isSubmittable || hasBegrunnelse) && (
        <div className={styles.begrunnelseTextField}>
          <TextAreaField
            name={name}
            label={isReadOnly ? '' : textAreaLabel}
            validate={isReadOnly ? [] : [required, minLength3, maxLength1500, hasValidText]}
            className={isReadOnly ? styles.explanationTextareaReadOnly : styles.explanationTextarea}
            maxLength={1500}
            readOnly={isReadOnly}
          />
        </div>
      )}
    </RawIntlProvider>
  );
};

const getBegrunnelse = (avklaringsbehov: BeregningAvklaringsbehov): string =>
  avklaringsbehov && avklaringsbehov.begrunnelse ? avklaringsbehov.begrunnelse : '';

FaktaBegrunnelseTextField.buildInitialValues = (
  avklaringsbehov: BeregningAvklaringsbehov,
  begrunnelseFieldName = 'begrunnelse',
): FormValues => ({
  [begrunnelseFieldName]: decodeHtmlEntity(getBegrunnelse(avklaringsbehov)),
});

FaktaBegrunnelseTextField.transformValues = (values: FormValues, name = 'begrunnelse'): TransformedValues => ({
  begrunnelse: values[name] as string,
});
