/* eslint-disable react/jsx-props-no-spreading */
import { HStack } from '@navikt/ds-react';
import { PeriodFieldArray, RhfDatepicker } from '@navikt/ft-form-hooks';
import { dateAfterOrEqual, dateBeforeOrEqual, hasValidDate, required } from '@navikt/ft-form-validators';
import { type JSX } from 'react';
import { useFieldArray, useFormContext, type FieldValues } from 'react-hook-form';

interface PeriodpickerListProps {
  name: string;
  legend: string;
  readOnly?: boolean;
  fromDate?: string;
  toDate?: string;
}
export const PeriodpickerList = ({ name, legend, readOnly, fromDate, toDate }: PeriodpickerListProps): JSX.Element => {
  const formMethods = useFormContext<FieldValues>();
  const { control, formState, getValues, trigger } = formMethods;
  const { isSubmitted } = formState;
  const fieldArrayMethods = useFieldArray({
    control,
    name,
  });
  const { fields } = fieldArrayMethods;
  return (
    <PeriodFieldArray
      fields={fields}
      remove={fieldArrayMethods.remove}
      append={fieldArrayMethods.append}
      bodyText={legend}
      readOnly={readOnly}
    >
      {(field, index, getRemoveButton) => {
        return (
          <HStack key={field.id} gap="space-16" paddingBlock="2">
            <RhfDatepicker
              name={`${name}.${index}.fom`}
              control={control}
              label={index === 0 ? 'Fra' : ''}
              validate={[
                required,
                hasValidDate,
                fomVerdi => {
                  const tomVerdi = getValues(`${name}.${index}.tom`);
                  return tomVerdi && fomVerdi ? dateBeforeOrEqual(tomVerdi)(fomVerdi) : null;
                },
              ]}
              onChange={() => (isSubmitted ? trigger() : undefined)}
              fromDate={fromDate ? new Date(fromDate) : undefined}
              toDate={toDate ? new Date(toDate) : undefined}
            />
            <RhfDatepicker
              name={`${name}.${index}.tom`}
              control={control}
              label={index === 0 ? 'Til' : ''}
              validate={[
                required,
                hasValidDate,
                tomVerdi => {
                  const fomVerdi = getValues(`${name}.${index}.fom`);
                  return tomVerdi && fomVerdi ? dateAfterOrEqual(fomVerdi)(tomVerdi) : null;
                },
              ]}
              onChange={() => (isSubmitted ? trigger() : undefined)}
              fromDate={fromDate ? new Date(fromDate) : undefined}
              toDate={toDate ? new Date(toDate) : undefined}
            />
            {getRemoveButton && <div>{getRemoveButton()}</div>}
          </HStack>
        );
      }}
    </PeriodFieldArray>
  );
};
