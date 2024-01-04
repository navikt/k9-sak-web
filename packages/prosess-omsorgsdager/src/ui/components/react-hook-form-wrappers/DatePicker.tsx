import { Datepicker } from 'nav-datovelger';
import { DatepickerLimitations } from 'nav-datovelger/lib/types';
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import styles from './datePicker.module.css';

interface OwnProps {
  titel: string;
  navn: `${string}`;
  valideringsFunksjoner;
  begrensningerIKalender?: DatepickerLimitations;
  disabled?: boolean;
}

const DatePicker: React.FunctionComponent<OwnProps> = ({
  titel,
  navn,
  valideringsFunksjoner,
  begrensningerIKalender,
  disabled = false,
}) => {
  const { control } = useFormContext();

  return (
    <div>
      <Controller
        control={control}
        name={navn}
        rules={{
          validate: valideringsFunksjoner,
        }}
        render={({ field: { onChange, value } }) => (
          <label htmlFor="datepicker-input">
            {' '}
            {titel.length > 0 && <span className={styles.gyldigVedtaksPeriodeTilFra}>{titel}</span>}
            <Datepicker
              inputId="datepicker-input"
              onChange={onChange}
              value={value}
              limitations={begrensningerIKalender}
              disabled={disabled}
            />
          </label>
        )}
      />
    </div>
  );
};

export default DatePicker;
