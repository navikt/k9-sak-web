import { HStack } from '@navikt/ds-react';
import { RhfFieldArray } from '@navikt/ft-form-hooks';
import { dateAfterOrEqual, dateBeforeOrEqual, hasValidDate, required } from '@navikt/ft-form-validators';
import { type JSX } from 'react';
import { useFieldArray, useFormContext, type FieldPath } from 'react-hook-form';
import Datovelger from '../datovelger/Datovelger.js';

type PeriodField = { fom: string; tom: string };
type PeriodListFormValues = { [key: string]: PeriodField[] };

interface PeriodpickerListProps {
  name: string;
  legend: string;
  readOnly?: boolean;
  fromDate?: string;
  toDate?: string;
}
export const PeriodpickerList = ({ name, legend, readOnly, fromDate, toDate }: PeriodpickerListProps): JSX.Element => {
  const { control, formState, getValues, trigger } = useFormContext<PeriodListFormValues>();
  const { isSubmitted } = formState;
  const { fields, remove, append } = useFieldArray<PeriodListFormValues, string>({
    control,
    name,
  });
  return (
    <RhfFieldArray<PeriodListFormValues, string>
      fields={fields}
      remove={remove}
      append={append}
      titleText={legend}
      readOnly={readOnly}
      addButtonText="Legg til periode"
      emptyTemplate={{ fom: '', tom: '' }}
      size="small"
    >
      {(field, index, removeButton) => {
        return (
          <HStack key={field.id} gap="space-16" paddingBlock="space-2" align="end">
            <Datovelger
              name={`${name}.${index}.fom` as FieldPath<PeriodListFormValues>}
              label={index === 0 ? 'Fra' : ''}
              validate={[
                required,
                hasValidDate,
                fomVerdi => {
                  const tomVerdi = getValues(`${name}.${index}.tom` as FieldPath<PeriodListFormValues>);
                  return tomVerdi && fomVerdi ? dateBeforeOrEqual(String(tomVerdi))(fomVerdi) : null;
                },
              ]}
              onChange={() => (isSubmitted ? trigger() : undefined)}
              readOnly={readOnly}
              fromDate={fromDate ? new Date(fromDate) : undefined}
              toDate={toDate ? new Date(toDate) : undefined}
            />
            <Datovelger
              name={`${name}.${index}.tom` as FieldPath<PeriodListFormValues>}
              label={index === 0 ? 'Til' : ''}
              validate={[
                required,
                hasValidDate,
                tomVerdi => {
                  const fomVerdi = getValues(`${name}.${index}.fom` as FieldPath<PeriodListFormValues>);
                  return tomVerdi && fomVerdi ? dateAfterOrEqual(String(fomVerdi))(tomVerdi) : null;
                },
              ]}
              onChange={() => (isSubmitted ? trigger() : undefined)}
              readOnly={readOnly}
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
