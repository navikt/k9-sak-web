import { HStack, Radio, RadioGroup } from '@navikt/ds-react';
import classnames from 'classnames/bind';
import React, { Fragment, ReactElement, ReactNode } from 'react';
import { Field, WrappedFieldInputProps } from 'redux-form';
import LabelType from './LabelType';
import { RadioOptionProps } from './RadioOption';
import styles from './radioGroupField.module.css';
import renderNavField from './renderNavField';

type Direction = 'horizontal' | 'vertical';

interface RenderProp<TChildrenProps, TElement = any> {
  (props: TChildrenProps): React.ReactElement<TElement>;
}

interface RadioProps {
  value: string | boolean;
  label: string | ReactNode;
  disabled?: boolean;
  element?: ReactElement;
}

interface RadioGroupFieldProps {
  name: string;
  label?: LabelType;
  /**
   * columns: Antall kolonner som valgene skal fordeles på. Default er samme som antall valg.
   */
  columns?: number;
  bredde?: string;
  children?:
    | RenderProp<{ value: any; optionProps: any }>
    | React.ReactElement<RadioOptionProps>[]
    | React.ReactElement<RadioOptionProps>;
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
  radios: RadioProps[];
  parse?: (value: string | boolean) => any;
  isVertical?: boolean;
}

const classNames = classnames.bind(styles);

const renderRadioGroupField = renderNavField(
  ({
    label,
    value,
    onChange,
    bredde,
    readOnly,
    error,
    parse = v => v,
    isVertical = false,
    radios,
  }: RadioGroupFieldProps & WrappedFieldInputProps) => (
    <RadioGroup
      className={classNames(`input--${bredde}`, 'radioGroup', { readOnly })}
      error={readOnly ? undefined : error}
      legend={label}
      onChange={onChange}
      size="small"
      value={value}
      disabled={readOnly}
    >
      {isVertical &&
        radios
          .filter(radio => !readOnly || value === parse(radio.value))
          .map(radio => (
            <Fragment key={`${radio.value}`}>
              <Radio value={parse(radio.value)} disabled={radio.disabled || readOnly}>
                {radio.label}
              </Radio>
              {value === parse(radio.value) && radio.element}
            </Fragment>
          ))}
      {!isVertical && (
        <>
          <HStack gap="4">
            {radios
              .filter(radio => !readOnly || value === parse(radio.value))
              .map(radio => (
                <Radio key={`${radio.value}`} value={parse(radio.value)} disabled={radio.disabled || readOnly}>
                  {radio.label}
                </Radio>
              ))}
          </HStack>
          {radios
            .filter(radio => value === parse(radio.value))
            .map(radio => (
              <React.Fragment key={`${radio.value}`}>{radio.element}</React.Fragment>
            ))}
        </>
      )}
      {/* {childIsRenderFn ? children({ value, optionProps }) : children} */}
    </RadioGroup>
  ),
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
