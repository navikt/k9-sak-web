import React from 'react';
import { useIntl } from 'react-intl';
import { FieldArrayMetaProps, WrappedFieldInputProps } from 'redux-form';
import Label from './Label';
import LabelType from './LabelType';

interface FieldComponentProps {
  input: WrappedFieldInputProps;
  meta: FieldArrayMetaProps;
  label?: LabelType;
  readOnly?: boolean;
  readOnlyHideEmpty?: boolean;
  isEdited?: boolean;
}

const renderNavField = WrappedNavFieldComponent => {
  const FieldComponent = (props: FieldComponentProps) => {
    const intl = useIntl();
    const formatError = (submitFailed: boolean, error: any) => {
      if (submitFailed && error) {
        // @ts-ignore
        return intl.formatMessage(...error);
      }
      return undefined;
    };

    const {
      input,
      meta: { submitFailed, error },
      label,
      readOnly,
      isEdited,
      readOnlyHideEmpty,
      ...otherProps
    } = props;
    const isEmpty = input.value === null || input.value === undefined || input.value === '';
    if (readOnly && readOnlyHideEmpty && isEmpty) {
      return null;
    }
    const fieldProps = {
      id: input.name,
      error: formatError(submitFailed, error),
      label: <Label input={label} readOnly={readOnly} />,
    };
    if (!readOnly) {
      return <WrappedNavFieldComponent {...fieldProps} {...input} {...otherProps} readOnly={readOnly} />;
    }
    return (
      <WrappedNavFieldComponent {...fieldProps} {...input} isEdited={isEdited} {...otherProps} readOnly={readOnly} />
    );
  };

  // FieldComponent.defaultProps = {
  //   readOnly: false,
  //   readOnlyHideEmpty: false,
  //   isEdited: false,
  // };

  return FieldComponent;
};

export default renderNavField;
