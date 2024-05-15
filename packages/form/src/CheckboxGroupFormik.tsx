import { Checkbox, CheckboxGroup } from '@navikt/ds-react';
import { useField } from 'formik';
import React from 'react';
import Label from './Label';
import { validateAll } from './formikUtils';

interface Checkbox {
  value: string;
  label: string;
}

interface CheckboxGroupFormikProps {
  name: string;
  legend: string;
  checkboxes: Checkbox[];
  hideLegend?: boolean;
  validate?: ((value: string) => string[] | null)[];
}

const CheckboxGroupFormik = ({ name, legend, checkboxes, hideLegend, validate = [] }: CheckboxGroupFormikProps) => {
  const [, meta, helpers] = useField({ name, validate: value => validateAll(validate, value, true) });
  return (
    <CheckboxGroup
      legend={legend}
      onChange={v => helpers.setValue(v)}
      error={meta.error ?? null}
      hideLegend={hideLegend}
      size="small"
    >
      {checkboxes.map(checkbox => (
        <Checkbox key={checkbox.value} value={checkbox.value}>
          <Label input={checkbox.label} textOnly />
        </Checkbox>
      ))}
    </CheckboxGroup>
  );
};

export default CheckboxGroupFormik;
