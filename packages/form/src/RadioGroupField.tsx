import { RadioGroup } from '@navikt/ds-react';
import classnames from 'classnames/bind';
import React from 'react';
import { Field, WrappedFieldInputProps } from 'redux-form';
import LabelType from './LabelType';
import { RadioOptionProps } from './RadioOption';
import styles from './radioGroupField.module.css';
import renderNavField from './renderNavField';

type Direction = 'horizontal' | 'vertical';

interface RenderProp<TChildrenProps, TElement = any> {
  (props: TChildrenProps): React.ReactElement<TElement>;
}

interface RadioGroupFieldProps {
  name: string;
  label?: LabelType;
  /**
   * columns: Antall kolonner som valgene skal fordeles på. Default er samme som antall valg.
   */
  columns?: number;
  bredde?: string;
  children?: RenderProp<{ value: any; optionProps: any }> | React.ReactElement<RadioOptionProps>[];
  spaceBetween?: boolean;
  rows?: number;
  direction?: Direction;
  DOMName?: string;
  validate?:
    | ((value: any) => { id: string }[])[]
    | ((value: string) => boolean | undefined)[]
    | ((value: string) => boolean | undefined);
  readOnly?: boolean;
  isEdited?: boolean;
  dataId?: string;
  error?: string;
}

const classNames = classnames.bind(styles);

const renderRadioGroupField = renderNavField(
  ({
    label,
    name,
    value,
    onChange,
    bredde,
    readOnly,
    error,
    children,
    DOMName,
  }: RadioGroupFieldProps & WrappedFieldInputProps) => {
    const optionProps = {
      onChange,
      name: DOMName || name,
      groupDisabled: readOnly,
      className: classNames('radio'),
      actualValue: value,
    };
    const childIsRenderFn = typeof children === 'function';

    return (
      <RadioGroup
        className={classNames(`input--${bredde}`, 'radioGroup', { readOnly })}
        error={readOnly ? undefined : error}
        legend={label}
        onChange={onChange}
        size="small"
        value={value}
        disabled={readOnly}
      >
        {childIsRenderFn ? children({ value, optionProps }) : children}
      </RadioGroup>
    );
  },
);

export const RadioGroupField = (props: RadioGroupFieldProps) => <Field component={renderRadioGroupField} {...props} />;

RadioGroupField.defaultProps = {
  columns: 0,
  rows: 0,
  label: '',
  bredde: 'fullbredde',
  spaceBetween: false,
  direction: 'horizontal',
  DOMName: undefined,
};

export default RadioGroupField;
