/* eslint-disable react/forbid-prop-types */
import { Radio as NavRadio } from 'nav-frontend-skjema';
import { Normaltekst } from 'nav-frontend-typografi';
import React, { ReactNode, ReactNodeArray } from 'react';
import Label from './Label';
import LabelType from './LabelType';

export interface RadioOptionProps {
  name?: string;
  label: LabelType;
  value: string[] | string | number;
  actualValue?: string[] | string | number;
  className?: string;
  disabled?: boolean;
  groupDisabled?: boolean;
  onChange?: (value: string[] | string | number) => void;
  children: ReactNode | ReactNodeArray;
  style: object;
  manualHideChildren?: boolean;
  dataId?: string;
}

export const RadioOption = ({
  name,
  className,
  label,
  value,
  actualValue,
  disabled,
  groupDisabled,
  onChange,
  children,
  style,
  manualHideChildren,
  dataId,
}: RadioOptionProps) => {
  const stringifiedValue = JSON.stringify(value);
  const actualStringifiedValue = JSON.stringify(actualValue);
  const checked = stringifiedValue === actualStringifiedValue;
  return (
    <div style={style}>
      <NavRadio
        name={name}
        className={className}
        label={<Label input={label} typographyElement={Normaltekst} />}
        value={value}
        checked={checked}
        disabled={disabled || groupDisabled}
        onChange={() => onChange(value)}
        data-id={dataId}
      />
      {(checked || manualHideChildren) && children}
    </div>
  );
};

RadioOption.defaultProps = {
  name: '',
  label: undefined,
  className: '',
  disabled: false,
  groupDisabled: false,
  actualValue: undefined,
  onChange: () => undefined,
  children: undefined,
  style: undefined,
  manualHideChildren: false,
};

RadioOption.displayName = 'RadioOption';

export default RadioOption;
