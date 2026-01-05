import { useFormContext } from 'react-hook-form';
import dayjs from 'dayjs';
import Datovelger from '../datovelger/Datovelger';
import { ErrorMessage, HStack, VStack } from '@navikt/ds-react';
import { useEffect, useRef } from 'react';

interface PeriodevelgerProps {
  minDate?: Date;
  maxDate?: Date;
  fromField: { name: string; validators?: ((value: string) => string | undefined)[] };
  toField: { name: string; validators?: ((value: string) => string | undefined)[] };
  fromLabel?: string;
  toLabel?: string;
  readOnly?: boolean;
  size?: 'medium' | 'small';
  shouldUnregister?: boolean;
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
const Periodevelger = ({
  minDate,
  maxDate,
  fromField,
  toField,
  fromLabel = 'Fra',
  toLabel = 'Til',
  readOnly = false,
  size = 'small',
}: PeriodevelgerProps) => {
  const formMethods = useFormContext();

  const fraVerdi = formMethods.watch(fromField.name);
  const tilVerdi = formMethods.watch(toField.name);

  const fromErrorMessage = formMethods.getFieldState(fromField.name).error?.message as string | undefined;
  const toErrorMessage = formMethods.getFieldState(toField.name).error?.message as string | undefined;

  const fromRef = useRef<string>(fraVerdi);
  const toRef = useRef<string>(tilVerdi);

  // Hvis fraVerdi endres, trigger vi tilField
  useEffect(() => {
    if (fraVerdi !== fromRef.current) {
      fromRef.current = fraVerdi;
      void formMethods.trigger(toField.name);
    }
  }, [fraVerdi, fromRef, formMethods, toField.name]);

  // Hvis tilVerdi endres, trigger vi fromField
  useEffect(() => {
    if (tilVerdi !== toRef.current) {
      toRef.current = tilVerdi;
      void formMethods.trigger(fromField.name);
    }
  }, [tilVerdi, toRef, formMethods, fromField.name]);

  const maxDateValidator = (value?: string, maxDate?: Date) => {
    if (!value || !maxDate) return undefined;
    if (dayjs(value).isAfter(dayjs(maxDate), 'day')) return `Dato må være før ${dayjs(maxDate).format('DD.MM.YYYY')}`;
    return undefined;
  };
  const minDateValidator = (value?: string, minDate?: Date) => {
    if (!value || !minDate) return undefined;
    if (dayjs(value).isBefore(dayjs(minDate), 'day'))
      return `Dato må være etter ${dayjs(minDate).format('DD.MM.YYYY')}`;
    return undefined;
  };
  return (
    <VStack gap="space-16">
      <HStack gap="space-16">
        <Datovelger
          name={fromField.name}
          label={fromLabel}
          disabled={readOnly}
          size={size}
          validators={[
            ...(fromField.validators || []),
            (value: string) => {
              if (!value || !tilVerdi) return undefined;
              return dayjs(value).isAfter(dayjs(tilVerdi), 'day') ? `Kan ikke være etter "${toLabel}"` : undefined;
            },
            value => minDateValidator(value, minDate),
            value => maxDateValidator(value, maxDate),
          ]}
          fromDate={minDate}
          toDate={maxDate}
          showErrorMessage={false}
        />
        <Datovelger
          name={toField.name}
          label={toLabel}
          disabled={readOnly}
          size={size}
          validators={[
            ...(toField.validators || []),
            (value: string) => {
              if (!value || !fraVerdi) return undefined;
              return dayjs(value).isSameOrBefore(dayjs(fraVerdi), 'day')
                ? `Kan ikke være før "${fromLabel}"`
                : undefined;
            },
            value => maxDateValidator(value, maxDate),
            value => minDateValidator(value, minDate),
          ]}
          fromDate={minDate}
          toDate={maxDate}
          showErrorMessage={false}
        />
      </HStack>
      <VStack gap="space-8">
        {fromErrorMessage && (
          <ErrorMessage aria-describedby={fromField.name} showIcon size={size}>
            {fromLabel}: {fromErrorMessage}
          </ErrorMessage>
        )}
        {toErrorMessage && (
          <ErrorMessage aria-describedby={toField.name} showIcon size={size}>
            {toLabel}: {toErrorMessage}
          </ErrorMessage>
        )}
      </VStack>
    </VStack>
  );
};

export default Periodevelger;
