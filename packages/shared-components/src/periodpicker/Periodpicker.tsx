import { ReadOnlyField } from '@fpsak-frontend/form';
import { DDMMYYYY_DATE_FORMAT, ISO_DATE_FORMAT, haystack } from '@fpsak-frontend/utils';
import { DatePicker, HStack, Label, VStack, useRangeDatepicker } from '@navikt/ds-react';
import dayjs from 'dayjs';
import React, { FunctionComponent, ReactNode, useCallback, useState } from 'react';
import { useIntl } from 'react-intl';
import { FieldArrayMetaProps, WrappedFieldInputProps } from 'redux-form';

interface FieldComponentProps {
  input: WrappedFieldInputProps;
  meta: FieldArrayMetaProps;
}

interface PeriodpickerProps {
  names: string[];
  label?: ReactNode;
  feil?: string;
  disabled?: boolean;
  disabledDays?: { before: Date; after: Date } | { before: Date; after: Date }[];
  readOnly?: boolean;
}

const getStartDateFormField = (props: PeriodpickerProps): FieldComponentProps => haystack(props, props.names[0]);
const getEndDateFormField = (props: PeriodpickerProps): FieldComponentProps => haystack(props, props.names[1]);

const Periodpicker: FunctionComponent<PeriodpickerProps> = (props): JSX.Element => {
  const intl = useIntl();
  const { label, disabled = false, disabledDays, readOnly, feil } = props;
  const fomFormField = getStartDateFormField(props);
  const tomFormField = getEndDateFormField(props);
  const defaultDateFom = fomFormField.input.value
    ? dayjs(fomFormField.input.value, [ISO_DATE_FORMAT, DDMMYYYY_DATE_FORMAT], true).format(DDMMYYYY_DATE_FORMAT)
    : '';
  const [fieldValueFom, setFieldValueFom] = useState<string>(defaultDateFom);
  const defaultDateTom = tomFormField.input.value
    ? dayjs(tomFormField.input.value, [ISO_DATE_FORMAT, DDMMYYYY_DATE_FORMAT], true).format(DDMMYYYY_DATE_FORMAT)
    : '';
  const [fieldValueTom, setFieldValueTom] = useState<string>(defaultDateTom);

  const getDefaultMonth = () => {
    if (defaultDateTom) {
      return dayjs(defaultDateTom, DDMMYYYY_DATE_FORMAT, true).toDate();
    }
    if (disabledDays) {
      if (Array.isArray(disabledDays)) {
        return disabledDays[disabledDays.length - 1].after;
      }
      return disabledDays.after;
    }
    if (defaultDateFom) {
      return dayjs(defaultDateFom, DDMMYYYY_DATE_FORMAT, true).toDate();
    }
    return undefined;
  };

  const { datepickerProps, toInputProps, fromInputProps } = useRangeDatepicker({
    onRangeChange: range => {
      const fom = range?.from ? dayjs(range?.from).format(ISO_DATE_FORMAT) : undefined;
      setFieldValueFom(dayjs(fom, ISO_DATE_FORMAT, true).format(DDMMYYYY_DATE_FORMAT));

      const tom = range?.to ? dayjs(range?.to).format(ISO_DATE_FORMAT) : undefined;
      setFieldValueTom(tom ? dayjs(tom, ISO_DATE_FORMAT, true).format(DDMMYYYY_DATE_FORMAT) : '');
      if (fom && tom) {
        fomFormField.input.onChange(fom);
        tomFormField.input.onChange(tom);
      }
    },
    defaultMonth: getDefaultMonth(),
  });

  const onChangeInputFom = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const verdi = dayjs(event.target.value, DDMMYYYY_DATE_FORMAT, true).format(ISO_DATE_FORMAT);
      const validDate = verdi !== 'Invalid Date';

      setFieldValueFom(event.target.value);
      if (validDate) {
        fomFormField.input.onChange(validDate ? verdi : event.target.value);
      }
    },
    [setFieldValueFom, fomFormField],
  );

  const onChangeInputTom = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const verdi = dayjs(event.target.value, DDMMYYYY_DATE_FORMAT, true).format(ISO_DATE_FORMAT);
      const validDate = verdi !== 'Invalid Date';

      setFieldValueTom(event.target.value);
      if (validDate) {
        tomFormField.input.onChange(validDate ? verdi : event.target.value);
      }
    },
    [setFieldValueTom, tomFormField],
  );

  if (readOnly) {
    const fom = fomFormField.input.value
      ? dayjs(fomFormField.input.value, ISO_DATE_FORMAT, true).format(DDMMYYYY_DATE_FORMAT)
      : undefined;
    const tom = tomFormField.input.value
      ? dayjs(tomFormField.input.value, ISO_DATE_FORMAT, true).format(DDMMYYYY_DATE_FORMAT)
      : undefined;
    const readOnlyValues = {
      value: `${fom} - ${tom || ''}`,
    };
    return <ReadOnlyField input={readOnlyValues} label={label} />;
  }

  const dpProps = {
    ...datepickerProps,
    fromDate: disabledDays ? (Array.isArray(disabledDays) ? disabledDays[0].before : disabledDays?.before) : undefined,
    toDate: disabledDays
      ? Array.isArray(disabledDays)
        ? disabledDays[disabledDays.length - 1].after
        : disabledDays?.after
      : undefined,
  };

  const getError = (errors: { id: string }[]) => {
    if (!errors || errors.length === 0) {
      return undefined;
    }
    return intl.formatMessage(errors[0]);
  };

  return (
    <DatePicker {...dpProps}>
      <VStack gap="2">
        <Label size="small">{label}</Label>
        <HStack gap="4">
          <DatePicker.Input
            {...fromInputProps}
            onChange={onChangeInputFom}
            value={fieldValueFom}
            size="small"
            hideLabel
            label="Fra"
            disabled={disabled}
            error={getError(fomFormField?.meta?.error) || feil}
          />
          <DatePicker.Input
            {...toInputProps}
            onChange={onChangeInputTom}
            value={fieldValueTom}
            size="small"
            label="Til"
            hideLabel
            disabled={disabled}
            error={getError(tomFormField?.meta?.error) || feil}
          />
        </HStack>
      </VStack>
    </DatePicker>
  );
};

export default Periodpicker;
