/* eslint-disable react/jsx-props-no-spreading */
import { HStack } from '@navikt/ds-react';
import { RhfDatepicker, RhfFieldArray } from '@navikt/ft-form-hooks';
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <RhfFieldArray
      fields={fields as any}
      remove={fieldArrayMethods.remove}
      append={fieldArrayMethods.append as any}
      titleText={legend}
      readOnly={readOnly}
      addButtonText="Legg til periode"
      emptyTemplate={{ fom: '', tom: '' } as any}
      size="small"
    >
      {(field, index, removeButton) => {
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
            {removeButton && <div>{removeButton}</div>}
          </HStack>
        );
      }}
    </RhfFieldArray>
  );
};
