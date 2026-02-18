import { hasValidText, maxLength, minLength, required } from '@navikt/ft-form-validators';
import { decodeHtmlEntity } from '@navikt/ft-utils';

import styles from './faktaBegrunnelseTextField.module.css';

import { RhfTextarea } from '@navikt/ft-form-hooks';
import { useFormContext } from 'react-hook-form';
import type { BeregningAvklaringsbehov } from '../../types/BeregningAvklaringsbehov';

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
  const { control } = useFormContext();
  const defaultLabel = hasVurderingText ? 'Vurdering' : 'Begrunn endringene';
  const textAreaLabel = label || defaultLabel;
  return (
    (isSubmittable || hasBegrunnelse) && (
      <div className={styles.begrunnelseTextField}>
        <RhfTextarea
          control={control}
          name={name}
          label={isReadOnly ? '' : textAreaLabel}
          validate={isReadOnly ? [] : [required, minLength3, maxLength1500, hasValidText]}
          className={isReadOnly ? styles.explanationTextareaReadOnly : styles.explanationTextarea}
          maxLength={1500}
          readOnly={isReadOnly}
        />
      </div>
    )
  );
};

const getBegrunnelse = (avklaringsbehov: BeregningAvklaringsbehov): string => avklaringsbehov?.begrunnelse ?? '';

FaktaBegrunnelseTextField.buildInitialValues = (
  avklaringsbehov: BeregningAvklaringsbehov,
  begrunnelseFieldName = 'begrunnelse',
): FormValues => ({
  [begrunnelseFieldName]: decodeHtmlEntity(getBegrunnelse(avklaringsbehov)),
});

FaktaBegrunnelseTextField.transformValues = (values: FormValues, name = 'begrunnelse'): TransformedValues => ({
  begrunnelse: values[name] as string,
});
