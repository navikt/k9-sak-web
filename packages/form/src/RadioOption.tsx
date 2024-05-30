/* eslint-disable react/forbid-prop-types */
import { Radio } from '@navikt/ds-react';
import React, { ReactNode, ReactNodeArray } from 'react';
import Label from './Label';
import LabelType from './LabelType';

export interface RadioOptionProps {
  name?: string;
  label: LabelType;
  value: string[] | string | number | boolean;
  actualValue?: string[] | string | number;
  className?: string;
  disabled?: boolean;
  groupDisabled?: boolean;
  onChange?: (value: string[] | string | number | boolean) => void;
  children?: ReactNode | ReactNodeArray;
  style?: any;
  manualHideChildren?: boolean;
  dataId?: string;
  wrapperClassName?: string;
}

export const RadioOption = ({
  name = '',
  className = '',
  label,
  value,
  actualValue,
  disabled = false,
  groupDisabled = false,
  onChange = () => undefined,
  children,
  style,
  manualHideChildren = false,
  dataId,
  wrapperClassName,
}: RadioOptionProps) => {
  const stringifiedValue = JSON.stringify(value);
  const actualStringifiedValue = JSON.stringify(actualValue);
  const checked = stringifiedValue === actualStringifiedValue;
  return (
    <div style={style} className={wrapperClassName}>
      <Radio
        name={name || ''}
        className={className}
        // @ts-ignore TODO Fjern denne. Må fjerna bruken av bolske verdiar som value
        value={value}
        disabled={disabled || groupDisabled}
        onChange={() => onChange?.(value)}
        data-id={dataId}
        size="small"
      >
        <Label input={label} textOnly />
      </Radio>
      {(checked || manualHideChildren) && children}
    </div>
  );
};

RadioOption.displayName = 'RadioOption';

export default RadioOption;
