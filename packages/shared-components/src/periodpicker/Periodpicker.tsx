import { ReadOnlyField } from '@fpsak-frontend/form';
import { DDMMYYYY_DATE_FORMAT, ISO_DATE_FORMAT, haystack } from '@fpsak-frontend/utils';
import { DatePicker, HStack, Label, VStack, useDatepicker } from '@navikt/ds-react';
import dayjs from 'dayjs';
import { FunctionComponent, default as React, default as React, ReactNode } from 'react';
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
  const stringToDate = (date: string | Date): Date => {
    const newDate = dayjs(date, [ISO_DATE_FORMAT, DDMMYYYY_DATE_FORMAT, 'YYYY.MM.DD'], true);
    return newDate.isValid() ? newDate.toDate() : undefined;
  };

  const intl = useIntl();
  const { label, disabled = false, disabledDays, readOnly, feil } = props;
  const fomFormField = getStartDateFormField(props);
  const tomFormField = getEndDateFormField(props);

  const getDefaultMonth = () => {
    if (tomFormField.input.value) {
      return dayjs(tomFormField.input.value, [ISO_DATE_FORMAT, DDMMYYYY_DATE_FORMAT], true).toDate();
    }
    if (disabledDays) {
      if (Array.isArray(disabledDays)) {
        return disabledDays[disabledDays.length - 1].after;
      }
      return disabledDays.after;
    }
    if (fomFormField.input.value) {
      return dayjs(fomFormField.input.value, [ISO_DATE_FORMAT, DDMMYYYY_DATE_FORMAT], true).toDate();
    }
    return undefined;
  };

  const { datepickerProps: datepickerPropsFom, inputProps: inputPropsFom } = useDatepicker({
    onDateChange: date => {
      if (date !== undefined) {
        const verdi = dayjs(date).format(ISO_DATE_FORMAT);
        if (fomFormField.input.onChange) {
          fomFormField.input.onChange(verdi);
        }
      }
    },
    defaultSelected: fomFormField.input.value ? stringToDate(fomFormField.input.value) : undefined,
    defaultMonth: getDefaultMonth(),
  });

  const { datepickerProps: datepickerPropsTom, inputProps: inputPropsTom } = useDatepicker({
    onDateChange: date => {
      if (date !== undefined) {
        const verdi = dayjs(date).format(ISO_DATE_FORMAT);
        if (tomFormField.input.onChange) {
          tomFormField.input.onChange(verdi);
        }
      }
    },
    defaultSelected: tomFormField.input.value ? stringToDate(tomFormField.input.value) : undefined,
    defaultMonth: getDefaultMonth(),
  });

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

  const dpPropsFom = {
    ...datepickerPropsFom,
    fromDate: disabledDays ? (Array.isArray(disabledDays) ? disabledDays[0].before : disabledDays?.before) : undefined,
    toDate: disabledDays
      ? Array.isArray(disabledDays)
        ? disabledDays[disabledDays.length - 1].after
        : disabledDays?.after
      : undefined,
  };

  const dpPropsTom = {
    ...datepickerPropsTom,
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
    <>
      <Label size="small">{label}</Label>
      <HStack gap="4">
        <DatePicker {...dpPropsFom}>
          <VStack gap="2">
            <DatePicker.Input
              {...inputPropsFom}
              size="small"
              hideLabel
              label="Fra"
              disabled={disabled}
              error={getError(fomFormField?.meta?.error) || feil}
            />
          </VStack>
        </DatePicker>
        <DatePicker {...dpPropsTom}>
          <VStack gap="2">
            <DatePicker.Input
              {...inputPropsTom}
              size="small"
              hideLabel
              label="Til"
              disabled={disabled}
              error={getError(tomFormField?.meta?.error) || feil}
            />
          </VStack>
        </DatePicker>
      </HStack>
    </>
  );
};

export default Periodpicker;
