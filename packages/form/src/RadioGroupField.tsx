import classnames from 'classnames/bind';
import { SkjemaGruppe as NavSkjemaGruppe } from 'nav-frontend-skjema';
import React from 'react';
import { Field } from 'redux-form';
import LabelType from './LabelType';
import OptionGrid from './OptionGrid';
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
  legend?: React.ReactNode;
  isEdited?: boolean;
  dataId?: string;
}

const classNames = classnames.bind(styles);

const isChecked = (radioOption, actualValueStringified) => radioOption.key === actualValueStringified;

const renderRadioGroupField = renderNavField(
  ({
    label,
    columns,
    name,
    value,
    onChange,
    bredde,
    readOnly,
    isEdited,
    feil,
    children,
    spaceBetween,
    rows,
    direction,
    DOMName,
    legend,
  }) => {
    const optionProps = {
      onChange,
      name: DOMName || name,
      groupDisabled: readOnly,
      className: classNames('radio'),
      actualValue: value,
    };

    const actualValueStringified = JSON.stringify(value);
    const showCheckedOnly = readOnly && value !== null && value !== undefined && value !== '';
    const renderFn = typeof children === 'function';
    const options = !renderFn
      ? children
          .filter(radioOption => !!radioOption)
          .map(radioOption =>
            React.cloneElement(radioOption, { key: JSON.stringify(radioOption.props.value), ...optionProps }),
          )
          .filter(radioOption => !showCheckedOnly || isChecked(radioOption, actualValueStringified))
      : null;

    return (
      <NavSkjemaGruppe
        feil={readOnly ? undefined : feil}
        className={classNames(`input--${bredde}`, 'radioGroup', { readOnly })}
        legend={legend}
      >
        {label.props.input && <div className={classNames('radioGroupLabel', { readOnly })}>{label}</div>}
        {renderFn && children({ value, optionProps })}
        {options && (
          <OptionGrid
            direction={direction}
            isEdited={readOnly && isEdited}
            options={options}
            spaceBetween={spaceBetween}
            columns={showCheckedOnly ? 1 : columns}
            rows={showCheckedOnly ? 1 : rows}
          />
        )}
      </NavSkjemaGruppe>
    );
  },
);

export const RadioGroupField = (props: RadioGroupFieldProps) => <Field component={renderRadioGroupField} {...props} />;

// const radioOptionsOnly = (options, key) => {
//   const option = options[key];
//   if (option) {
//     const type = option.type || {};
//     if (type.displayName !== RadioOption.displayName) {
//       return new Error('RadioGroupField children should be of type "RadioOption"');
//     }
//   }
//   return undefined;
// };

RadioGroupField.defaultProps = {
  columns: 0,
  rows: 0,
  label: '',
  bredde: 'fullbredde',
  spaceBetween: false,
  direction: 'horizontal',
  DOMName: undefined,
  legend: '',
};

export default RadioGroupField;
