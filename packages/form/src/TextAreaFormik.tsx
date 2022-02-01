import React from 'react';
import { Field as FormikField, connect, getIn, FormikState } from 'formik';
import { Textarea } from '@navikt/ds-react';
import { EtikettFokus } from 'nav-frontend-etiketter';
import { useIntl } from 'react-intl';
import LabelType from './LabelType';
import ReadOnlyField from './ReadOnlyField';
import styles from './textAreaField.less';
import { validateAll } from './formikUtils';
import './TextAreaFormik.less';

interface TextAreaFieldProps {
  name: string;
  label: LabelType;
  validate?: (
    | ((text: any) => ({ id: string; length?: undefined } | { length: any; id?: undefined })[])
    | ((value: any, allValues: any, props: any) => { id: string }[])
    | ((value: any) => { id: string }[])
    | ((text: any) => ({ id: string; text?: undefined } | { text: any; id?: undefined })[])
  )[];
  readOnly?: boolean;
  dataId?: string;
  textareaClass?: string;
  maxLength?: number;
  placeholder?: string;
  formik: FormikState<any>;
}

const renderTextarea = ({ field: { value, name }, form, label, maxLength, badges, touched, error }) => {
  const intl = useIntl();
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
        label={label}
        error={touched && error ? intl.formatMessage(error) : null}
        maxLength={maxLength}
      />
    </div>
  );
};

const TextAreaFormik = ({ name, label, validate, readOnly, formik, ...otherProps }: TextAreaFieldProps) => (
  <FormikField
    name={name}
    validate={value => validateAll(validate, value)}
    component={readOnly ? ReadOnlyField : renderTextarea}
    label={label}
    error={getIn(formik.errors, name)}
    touched={getIn(formik.touched, name)}
    {...otherProps}
    readOnly={readOnly}
    readOnlyHideEmpty
    autoComplete="off"
    type="textarea"
  />
);

TextAreaFormik.defaultProps = {
  validate: null,
  readOnly: false,
};

export default connect(TextAreaFormik);
