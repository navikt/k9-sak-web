import EtikettFokus from 'nav-frontend-etiketter';
import { Textarea as NavTextarea, TextareaProps } from 'nav-frontend-skjema';
import React from 'react';
import { FormattedMessage, WrappedComponentProps, injectIntl } from 'react-intl';
import { Field } from 'redux-form';
import LabelType from './LabelType';
import ReadOnlyField from './ReadOnlyField';
import renderNavField from './renderNavField';
import styles from './textAreaField.css';

type BadgesType = 'suksess' | 'info' | 'advarsel' | 'fokus';

interface Badges {
  textId: string;
  type: BadgesType;
  title: string;
}

interface TextAreaWithBadgeProps {
  badges: Badges[];
  dataId?: string;
}

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
  badges?: Badges[];
  placeholder?: string;
}

const TextAreaWithBadge = ({
  badges,
  intl,
  dataId,
  ...otherProps
}: TextAreaWithBadgeProps & WrappedComponentProps & TextareaProps) => (
  <div className={badges ? styles.textAreaFieldWithBadges : null}>
    {badges && (
      <div className={styles.etikettWrapper}>
        {badges.map(({ textId, type, title }) => (
          <EtikettFokus key={textId} type={type} title={intl.formatMessage({ id: title })}>
            <FormattedMessage id={textId} />
          </EtikettFokus>
        ))}
      </div>
    )}
    <NavTextarea data-id={dataId} {...otherProps} />
  </div>
);

const renderNavTextArea = renderNavField(injectIntl(TextAreaWithBadge));

const TextAreaField = ({ name, label, validate, readOnly, ...otherProps }: TextAreaFieldProps) => (
  <Field
    name={name}
    validate={validate}
    component={readOnly ? ReadOnlyField : renderNavTextArea}
    label={label}
    {...otherProps}
    readOnly={readOnly}
    readOnlyHideEmpty
    autoComplete="off"
    type="textarea"
  />
);

TextAreaField.defaultProps = {
  validate: null,
  readOnly: false,
};

export default TextAreaField;
