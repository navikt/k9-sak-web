import { Textarea } from '@navikt/ds-react';
import { Field as FormikField, FormikState, connect, getIn } from 'formik';
import { EtikettFokus } from 'nav-frontend-etiketter';
import React from 'react';
import { useIntl } from 'react-intl';
import LabelType from './LabelType';
import ReadOnlyField from './ReadOnlyField';
import styles from './TextAreaFormik.css';
import { validateAll } from './formikUtils';

interface TextAreaFieldProps {
  name: string;
  label: LabelType;
  validate?: ((value: string) => null | any)[];
  readOnly?: boolean;
  dataId?: string;
  textareaClass?: string;
  maxLength?: number;
  placeholder?: string;
  formik?: FormikState<any>;
}

const renderTextarea = ({ field: { value, name }, form, label, maxLength, badges, touched, error, intl, disabled }) => {
  const { id, ...intlParams } = error ?? {};

  return (
    <div className={badges ? styles.textAreaFieldWithBadges : null}>
      {badges && (
        <div className={styles.etikettWrapper}>
          {badges.map(({ text, title }) => (
            <EtikettFokus key={text} title={title}>
              <span>{text}</span>
            </EtikettFokus>
          ))}
        </div>
      )}
      <Textarea
        value={value}
        onChange={form.handleChange(name)}
        onBlur={form.handleBlur(name)}
        disabled={disabled}
        label={label}
        error={touched && error ? intl.formatMessage({ id }, { ...intlParams }) : null}
        maxLength={maxLength}
        size="small"
      />
    </div>
  );
};

const TextAreaFormik = ({ name, readOnly, formik, label, validate = [], ...otherProps }: TextAreaFieldProps) => {
  const intl = useIntl();
  return (
    <FormikField
      name={name}
      validate={value => validateAll(validate, value)}
      component={readOnly ? ReadOnlyField : renderTextarea}
      label={label}
      error={getIn(formik.errors, name)}
      touched={getIn(formik.touched, name)}
      {...otherProps}
      disabled={readOnly}
      readOnlyHideEmpty
      autoComplete="off"
      type="textarea"
      intl={intl}
    />
  );
};

TextAreaFormik.defaultProps = {
  validate: null,
  readOnly: false,
};

export default connect(TextAreaFormik);
