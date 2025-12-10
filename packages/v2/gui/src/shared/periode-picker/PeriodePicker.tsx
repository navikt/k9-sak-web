import { useFormContext } from 'react-hook-form';
import dayjs from 'dayjs';
import Datovelger from '../datovelger/Datovelger';
import { ErrorMessage, HStack, VStack } from '@navikt/ds-react';
import { useEffect } from 'react';

interface PeriodePickerProps {
  minDate: Date | undefined;
  maxDate: Date | undefined;
  fromField: Field;
  toField: Field;
  fromLabel?: string;
  toLabel?: string;
  readOnly?: boolean;
  size?: 'medium' | 'small';
  shouldUnregister?: boolean;
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
  size = 'small',
}: PeriodePickerProps) => {
  const formMethods = useFormContext();

  const fraVerdi = formMethods.watch(fromField.name);
  const tilVerdi = formMethods.watch(toField.name);

  const fromErrorMessage = formMethods.getFieldState(fromField.name).error?.message as string | undefined;
  const toErrorMessage = formMethods.getFieldState(toField.name).error?.message as string | undefined;

  // if one changes, trigger the other
  useEffect(() => {
    if (fraVerdi) {
      void formMethods.trigger(toField.name);
    }
    if (tilVerdi) {
      void formMethods.trigger(fromField.name);
    }
  }, [fraVerdi, tilVerdi]);
  return (
    <VStack gap="space-16">
      <HStack gap="space-16">
        <Datovelger
          name={fromField.name}
          label={fromLabel}
          disabled={readOnly}
          size={size}
          validators={[
            (value: string) => (value && dayjs(value).isValid() ? undefined : 'Fra er påkrevd'),
            (value: string) => {
              if (!value || !tilVerdi) return undefined;
              return dayjs(value).isAfter(dayjs(tilVerdi)) ? 'Kan ikke være etter til' : undefined;
            },
            (value: string) => {
              if (!value || !minDate) return undefined;
              if (dayjs(value).isBefore(dayjs(minDate)))
                return `Fra kan ikke være før ${dayjs(minDate).format('DD.MM.YYYY')}`;
              return undefined;
            },
            (value: string) => {
              if (!value || !maxDate) return undefined;
              if (dayjs(value).isAfter(dayjs(maxDate)))
                return `Fra kan ikke være etter ${dayjs(maxDate).format('DD.MM.YYYY')}`;
              return undefined;
            },
          ]}
          fromDate={minDate}
          toDate={maxDate}
        />
        <Datovelger
          name={toField.name}
          label={toLabel}
          disabled={readOnly}
          size={size}
          validators={[
            (value: string) => (value && dayjs(value).isValid() ? undefined : 'Er påkrevd'),
            (value: string) => {
              if (!value || !maxDate) return undefined;
              if (dayjs(value).isAfter(dayjs(maxDate)))
                return `Kan ikke være etter ${dayjs(maxDate).format('DD.MM.YYYY')}`;
              return undefined;
            },
            (value: string) => {
              if (!value || !minDate) return undefined;
              if (dayjs(value).isBefore(dayjs(minDate)))
                return `Kan ikke være før ${dayjs(minDate).format('DD.MM.YYYY')}`;
              return undefined;
            },
          ]}
          fromDate={minDate}
          toDate={maxDate}
        />
      </HStack>
      <VStack gap="space-8">
        {fromErrorMessage && (
          <ErrorMessage aria-describedby={fromField.name} showIcon size={size}>
            Fra og med: {fromErrorMessage}
          </ErrorMessage>
        )}
        {toErrorMessage && (
          <ErrorMessage aria-describedby={toField.name} showIcon size={size}>
            Til og med: {toErrorMessage}
          </ErrorMessage>
        )}
      </VStack>
    </VStack>
  );
};

export default PeriodePicker;
