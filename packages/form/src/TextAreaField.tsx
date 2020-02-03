import EtikettFokus from 'nav-frontend-etiketter';
import { Textarea as NavTextarea, TextareaProps } from 'nav-frontend-skjema';
import React from 'react';
import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl';
import { Field } from 'redux-form';
import LabelType from './LabelType';
import ReadOnlyField from './ReadOnlyField';
import renderNavField from './renderNavField';
import styles from './textAreaField.less';

type BadgesType = 'suksess' | 'info' | 'advarsel' | 'fokus';

interface Badges {
  textId: string;
  type: BadgesType;
  title: string;
}

interface TextAreaWithBadgeProps {
  badges: Badges[];
}

interface TextAreaFieldProps {
  name: string;
  label: LabelType;
  validate?: ((value: string) => boolean | undefined)[] | ((value: string) => boolean | undefined);
  readOnly?: boolean;
}

const TextAreaWithBadge = ({
  badges,
  intl,
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
    <NavTextarea {...otherProps} />
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

TextAreaWithBadge.defaultProps = {
  badges: null,
};

export default TextAreaField;
