import { Tag, Textarea, TextareaProps } from '@navikt/ds-react';
import React from 'react';
import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl';
import { Field } from 'redux-form';
import LabelType from './LabelType';
import ReadOnlyField from './ReadOnlyField';
import renderNavField from './renderNavField';
import styles from './textAreaField.module.css';
import { ValidationReturnType } from '@fpsak-frontend/utils/src/validation/validators';

type BadgesType = 'success' | 'info' | 'warning' | 'error';

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
    | ((value: string) => ValidationReturnType)
    | ((value: string, allValues, props: { pristine: boolean }) => ValidationReturnType)
  )[];
  readOnly?: boolean;
  dataId?: string;
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
  <div className={badges ? styles.textAreaFieldWithBadges : undefined}>
    {badges && (
      <div className={styles.etikettWrapper}>
        {badges.map(({ textId, type, title }) => (
          <Tag variant={type || 'warning'} key={textId} title={intl.formatMessage({ id: title })}>
            <FormattedMessage id={textId} />
          </Tag>
        ))}
      </div>
    )}
    <Textarea size="small" data-testid={dataId} {...otherProps} />
  </div>
);

const renderNavTextArea = renderNavField(injectIntl(TextAreaWithBadge));

const TextAreaField = ({ name, label, validate = undefined, readOnly = false, ...otherProps }: TextAreaFieldProps) => (
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

export default TextAreaField;
