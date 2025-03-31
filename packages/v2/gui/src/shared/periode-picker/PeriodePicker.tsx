import { DatePicker, HStack } from '@navikt/ds-react';
import { useRangeDatepicker } from '@navikt/ds-react';
import { useController, useFormContext } from 'react-hook-form';
import { useEffect } from 'react';

interface PeriodePickerProps {
  minDate: Date;
  maxDate: Date;
  fromFieldName: string;
  toFieldName: string;
  fromLabel?: string;
  toLabel?: string;
}

/**
 * A reusable date range picker component that integrates with react-hook-form
 * @param minDate - The minimum allowed date
 * @param maxDate - The maximum allowed date
 * @param fromFieldName - The form field name for the start date (default: 'periode.fom')
 * @param toFieldName - The form field name for the end date (default: 'periode.tom')
 * @param fromLabel - Label for the start date input (default: 'Fra')
 * @param toLabel - Label for the end date input (default: 'Til')
 */
const PeriodePicker = ({
  minDate,
  maxDate,
  fromFieldName,
  toFieldName,
  fromLabel = 'Fra',
  toLabel = 'Til',
}: PeriodePickerProps) => {
  const formMethods = useFormContext();

  const fomMethods = useController({
    control: formMethods.control,
    name: fromFieldName,
    defaultValue: new Date(minDate),
  });
  const tomMethods = useController({
    control: formMethods.control,
    name: toFieldName,
    defaultValue: new Date(maxDate),
  });

  useEffect(() => {
    return () => {
      formMethods.unregister(fromFieldName);
      formMethods.unregister(toFieldName);
    };
  }, [fromFieldName, toFieldName]);

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
      <HStack wrap gap="4" justify="center">
        <DatePicker.Input {...fromInputProps} label={fromLabel} />
        <DatePicker.Input {...toInputProps} label={toLabel} />
      </HStack>
    </DatePicker>
  );
};

export default PeriodePicker;
