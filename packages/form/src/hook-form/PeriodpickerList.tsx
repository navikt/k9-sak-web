/* eslint-disable react/jsx-props-no-spreading */
import { ErrorMessage } from '@navikt/ds-react';
import { Box, Margin } from '@navikt/ft-plattform-komponenter';
import '@navikt/ft-plattform-komponenter/dist/style.css';
import { Period } from '@fpsak-frontend/utils';
import React from 'react';
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';
import { DatepickerLimitations } from './pure/DatepickerLimitations';
import PureDatepicker from './pure/PureDatepicker';
import styles from './periodpickerList.css';

interface DatepickerProps {
  label?: string;
  ariaLabel?: string;
  fromDate?: Date;
  toDate?: Date;
  initialMonth?: Date;
  /**
   * @deprecated Bruk disabledDays, fromDate og toDate istedet.
   */
  limitations?: DatepickerLimitations;
  disabledDays?: {
    from: Date;
    to?: Date;
  }[];
  hideLabel?: boolean;
}
interface PeriodpickerListProps {
  name: string;
  legend: string;
  validators?: { [key: string]: (v: any) => string | boolean | undefined };
  defaultValues?: Period[];
  fromDatepickerProps: DatepickerProps;
  toDatepickerProps: DatepickerProps;
  renderContentAfterElement?: (index: number, numberOfItems: number, fieldArrayMethods) => JSX.Element;
  renderBeforeFieldArray?: (fieldArrayMethods) => JSX.Element;
  renderAfterFieldArray?: (fieldArrayMethods) => JSX.Element;
  afterOnChange?: () => void;
  disabled?: boolean;
}
const PeriodpickerList = ({
  name,
  legend,
  validators,
  fromDatepickerProps,
  toDatepickerProps,
  defaultValues,
  renderBeforeFieldArray,
  renderAfterFieldArray,
  renderContentAfterElement,
  afterOnChange,
  disabled,
}: PeriodpickerListProps): JSX.Element => {
  const formMethods = useFormContext();
  const { control, formState } = formMethods;
  const { errors } = formState;
  const fieldArrayMethods = useFieldArray({
    control,
    name,
  });
  const { fields } = fieldArrayMethods;

  return (
    <div className={styles.periodpickerList}>
      {renderBeforeFieldArray && renderBeforeFieldArray(fieldArrayMethods)}
      <fieldset>
        <legend>{legend}</legend>
        {fields.map((item, index) => {
          const errorMessage = errors[name] && errors[name][index]?.period.message;
          const hasDefaultValue = defaultValues && defaultValues[index];
          return (
            <Box key={item.id} marginTop={Margin.medium}>
              <div className={styles.periodpickerList__flexContainer}>
                <Controller
                  name={`${name}[${index}].period`}
                  rules={{ validate: { ...(validators || {}) } }}
                  defaultValue={hasDefaultValue ? defaultValues[index] : new Period('', '')}
                  render={({ field }) => {
                    const { value, onChange } = field;
                    return (
                      <>
                        <PureDatepicker
                          {...fromDatepickerProps}
                          label={fromDatepickerProps.label}
                          ariaLabel={fromDatepickerProps.ariaLabel}
                          value={value?.fom || ''}
                          onChange={fomValue => {
                            onChange(new Period(fomValue, value?.tom || ''));
                            if (afterOnChange) afterOnChange();
                          }}
                          inputId={`${name}[${index}].fom`}
                          disabled={disabled}
                        />
                        <div className={styles.periodpickerList__datepickerTom}>
                          <PureDatepicker
                            {...toDatepickerProps}
                            initialMonth={value?.fom}
                            label={toDatepickerProps.label}
                            ariaLabel={toDatepickerProps.ariaLabel}
                            value={value?.tom || ''}
                            onChange={tomValue => {
                              onChange(new Period(value?.fom || '', tomValue));
                              if (afterOnChange) afterOnChange();
                            }}
                            inputId={`${name}[${index}].tom`}
                            disabled={disabled}
                          />
                        </div>
                      </>
                    );
                  }}
                />
                {renderContentAfterElement && renderContentAfterElement(index, fields.length, fieldArrayMethods)}
              </div>
              {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
            </Box>
          );
        })}
      </fieldset>
      {renderAfterFieldArray && renderAfterFieldArray(fieldArrayMethods)}
    </div>
  );
};
export default PeriodpickerList;
