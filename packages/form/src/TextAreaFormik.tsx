import React from 'react';
import { Field as FormikField } from 'formik';
import { Textarea } from '@navikt/ds-react';
import { EtikettFokus } from 'nav-frontend-etiketter';
import LabelType from './LabelType';
import ReadOnlyField from './ReadOnlyField';
import styles from './textAreaField.less';

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
}

const renderTextarea = ({ field: { value, name }, form, label, maxLength, badges }) => (
  <div className={badges ? styles.textAreaFieldWithBadges : null}>
    {badges && (
      <div className={styles.etikettWrapper}>
        {badges.map(({ text, type, title }) => (
          <EtikettFokus key={text} type={type} title={title}>
            <span>{text}</span>
          </EtikettFokus>
        ))}
      </div>
    )}
    <Textarea value={value} onChange={form.handleChange(name)} label={label} maxLength={maxLength} />
  </div>
);

const TextAreaFormik = ({ name, label, validate, readOnly, ...otherProps }: TextAreaFieldProps) => (
  <FormikField
    name={name}
    validate={validate}
    component={readOnly ? ReadOnlyField : renderTextarea}
    label={label}
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

export default TextAreaFormik;
