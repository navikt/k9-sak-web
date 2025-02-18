import { Tag, Textarea } from '@navikt/ds-react';
import { Field as FormikField, FormikState, connect, getIn } from 'formik';
import { useIntl } from 'react-intl';
import LabelType from './LabelType';
import ReadOnlyField from './ReadOnlyField';
import styles from './TextAreaFormik.module.css';
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
  badges?: { type: string; text: string; title: string }[];
}

const renderTextarea = ({ field: { value, name }, form, label, maxLength, badges, touched, error, intl, disabled }) => {
  const { id, ...intlParams } = error ?? {};

  return (
    <div className={badges ? styles.textAreaFieldWithBadges : null}>
      {badges && (
        <div className={styles.etikettWrapper}>
          {badges.map(({ text, title }) => (
            <Tag variant="warning" key={text} title={title}>
              <span>{text}</span>
            </Tag>
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

const TextAreaFormik = ({
  name,
  readOnly = false,
  formik,
  label,
  validate = [],
  ...otherProps
}: TextAreaFieldProps) => {
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

export default connect(TextAreaFormik);
