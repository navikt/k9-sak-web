import { Input as NavInput } from 'nav-frontend-skjema';
import React, { Component } from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { Field as reduxFormField } from 'redux-form';
import LabelType from './LabelType';
import ReadOnlyField from './ReadOnlyField';
import renderNavField from './renderNavField';

interface DecimalFieldProps {
  name: string;
  type?: string;
  label?: LabelType;
  validate?: () => void[];
  readOnly?: boolean;
  isEdited?: boolean;
  normalizeOnBlur: () => void;
}

const createNormalizeOnBlurField = WrappedNavFieldComponent => {
  interface FieldComponent {
    normalizeOnBlur: (value: any) => void;
    component?: () => reduxFormField;
  }
  class FieldComponent extends Component<FieldComponent & WrappedComponentProps> {
    constructor(props: FieldComponent & WrappedComponentProps) {
      super(props);
      this.blurHandler = this.blurHandler.bind(this);
    }

    blurHandler({ input: { onBlur, ...input }, ...props }) {
      const { normalizeOnBlur, component: Comp } = this.props;
      return (
        <Comp
          {...props}
          input={{
            ...input,
            onBlur: event => {
              const value =
                event && event.target && Object.prototype.hasOwnProperty.call(event.target, 'value')
                  ? event.target.value
                  : event;
              const newValue = normalizeOnBlur ? normalizeOnBlur(value) : value;
              onBlur(newValue);
            },
          }}
        />
      );
    }

    render() {
      const { component, normalizeOnBlur, ...props } = this.props;
      if (normalizeOnBlur) {
        return <WrappedNavFieldComponent component={this.blurHandler} {...props} />;
      }
      return <WrappedNavFieldComponent component={component} {...props} />;
    }
  }

  const FieldComponentWithIntl = injectIntl(FieldComponent);

  FieldComponentWithIntl.WrappedComponent = FieldComponent;

  return FieldComponentWithIntl;
};

const renderNavInput = renderNavField(NavInput);
const NormalizeOnBlurField = createNormalizeOnBlurField(reduxFormField);

const DecimalField = ({
  name,
  type,
  label,
  validate,
  readOnly,
  isEdited,
  normalizeOnBlur,
  ...otherProps
}: DecimalFieldProps) => (
  <NormalizeOnBlurField
    name={name}
    validate={validate}
    component={readOnly ? ReadOnlyField : renderNavInput}
    type={type}
    label={label}
    normalizeOnBlur={normalizeOnBlur}
    {...otherProps}
    readOnly={readOnly}
    readOnlyHideEmpty
    isEdited={isEdited}
    autoComplete="off"
  />
);

DecimalField.defaultProps = {
  type: 'number',
  validate: null,
  readOnly: false,
  label: '',
  isEdited: false,
};

export default DecimalField;
