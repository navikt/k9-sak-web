import { DatePicker } from '@navikt/ds-react';
import { useRangeDatepicker } from '@navikt/ds-react';
import { useController, useFormContext } from 'react-hook-form';
import { useEffect } from 'react';

interface PeriodePickerProps {
  minDate: Date;
  maxDate: Date;
  fromField: Field;
  toField: Field;
  fromLabel?: string;
  toLabel?: string;
  readOnly?: boolean;
  size?: 'medium' | 'small';
}

interface Field {
  name: string;
  validate?: (value: string) => string | undefined;
  label?: string;
}

/**
 * A reusable date range picker component that integrates with react-hook-form
 * @param minDate - The minimum allowed date
 * @param maxDate - The maximum allowed date
 * @param fromFieldName - The form field name for the start date (default: 'periode.fom')
 * @param toFieldName - The form field name for the end date (default: 'periode.tom')
 * @param fromLabel - Label for the start date input (default: 'Fra')
 * @param toLabel - Label for the end date input (default: 'Til')
 * @param readOnly - Whether the picker is read-only (default: false)
 */
const PeriodePicker = ({
  minDate,
  maxDate,
  fromField,
  toField,
  fromLabel = 'Fra',
  toLabel = 'Til',
  readOnly = false,
  size = 'medium',
}: PeriodePickerProps) => {
  const formMethods = useFormContext();

  const fomMethods = useController({
    control: formMethods.control,
    name: fromField.name,
    defaultValue: new Date(minDate),
    rules: { validate: fromField.validate },
  });
  const tomMethods = useController({
    control: formMethods.control,
    name: toField.name,
    defaultValue: new Date(maxDate),
    rules: { validate: toField.validate },
  });

  useEffect(() => {
    return () => {
      formMethods.unregister(fromField.name);
      formMethods.unregister(toField.name);
    };
  }, []);

  const { datepickerProps, toInputProps, fromInputProps } = useRangeDatepicker({
    fromDate: minDate,
    toDate: maxDate,
    defaultSelected: {
      from: new Date(fomMethods.field.value),
      to: new Date(tomMethods.field.value),
    },
    today: minDate,
    onRangeChange: val => {
      fomMethods.field.onChange(val?.from);
      tomMethods.field.onChange(val?.to);
    },
  });

  return (
    <DatePicker {...datepickerProps}>
      <div className="flex gap-4 items-baseline">
        <DatePicker.Input
          {...fromInputProps}
          size={size}
          label={fromLabel}
          readOnly={readOnly}
          error={fomMethods.fieldState.error?.message}
        />
        <DatePicker.Input
          {...toInputProps}
          size={size}
          label={toLabel}
          readOnly={readOnly}
          error={tomMethods.fieldState.error?.message}
        />
      </div>
    </DatePicker>
  );
};

export default PeriodePicker;
