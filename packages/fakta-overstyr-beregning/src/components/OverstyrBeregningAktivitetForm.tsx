import React from "react";
import { injectIntl, WrappedComponentProps } from 'react-intl';

import { TableColumn, TableRow } from '@fpsak-frontend/shared-components';
import { parseCurrencyInput } from '@fpsak-frontend/utils';
import { Field, useFormikContext } from "formik";
import { Input } from "nav-frontend-skjema";
import { Datepicker } from 'nav-datovelger';
import styles from './OverstyrBeregningFaktaForm.less';
import { OverstyrInputForBeregningDto } from "../types/OverstyrInputForBeregningDto";

interface Props {
  key: string;
  periodeIndex: number;
  aktivitetIndex: number;
  firmaNavn: string;
  skalKunneEndreRefusjon: boolean;
  readOnly: boolean;
}

const OverstyrBeregningAktivitetForm: React.FC<Props & WrappedComponentProps> = ({
  key,
  periodeIndex,
  aktivitetIndex,
  firmaNavn,
  skalKunneEndreRefusjon,
  readOnly,
  intl
}) => {
  const { setFieldValue, setFieldTouched, values } = useFormikContext<OverstyrInputForBeregningDto>();
  return (
    <TableRow key={key}>
      <TableColumn>
        <span className={styles.firmaNavn}>
          {firmaNavn}
        </span>
      </TableColumn>
      <TableColumn>
        <Field name={`perioder.${periodeIndex}.aktivitetliste.${aktivitetIndex}.inntektPrAar`}>
          {({ field, meta }) => (
            <Input
              {...field}
              id={`perioder-${periodeIndex}-aktivitetliste-${aktivitetIndex}-inntekt`}
              type="text"
              placeholder={intl.formatMessage({ id: 'OverstyrInputForm.InntektPrAar' })}
              onChange={(e) => {
                const tallverdi: number = parseInt(e.target.value.replace(/\D+/g, ''), 10);
                setFieldValue(field.name, tallverdi);
              }}
              maxLength={10}
              value={parseCurrencyInput(field.value)}
              feil={meta.touched && meta.error ? meta.error : false}
              disabled={readOnly}
            />
          )}
        </Field>
      </TableColumn>
      <TableColumn>
        <Field name={`perioder.${periodeIndex}.aktivitetliste.${aktivitetIndex}.refusjonPrAar`}>
          {({ field, meta }) => (<Input
            {...field}
            id={`perioder-${periodeIndex}-aktivitetliste-${aktivitetIndex}-refusjon`}
            type="text"
            placeholder={intl.formatMessage({ id: 'OverstyrInputForm.RefusjonPrAar' })}
            onChange={(e) => {
              const tallverdi: number = parseInt(e.target.value.replace(/\D+/g, ''), 10);
              setFieldValue(field.name, tallverdi);
              if (tallverdi <= 0 || !tallverdi) {
                const targetFieldName = `perioder.${periodeIndex}.aktivitetliste.${aktivitetIndex}.opphørRefusjon`;
                setFieldValue(targetFieldName, '');
                setFieldTouched(targetFieldName, true);
              }
            }}
            maxLength={10}
            value={parseCurrencyInput(field.value)}
            feil={meta.touched && meta.error ? meta.error : false}
            disabled={readOnly || !skalKunneEndreRefusjon}
          />)}
        </Field>
      </TableColumn>
      <TableColumn>
        <Field name={`perioder.${periodeIndex}.aktivitetliste.${aktivitetIndex}.startdatoRefusjon`}>
          {({ field, meta }) => (
            <>
              <Datepicker
                inputProps={{
                  placeholder: intl.formatMessage({ id: 'OverstyrInputForm.StartdatoRefusjonPlaceholder' }),
                  'aria-invalid': !!(meta.touched && meta.error),
                }}
                value={field.value}
                onChange={(value) => {
                  setFieldTouched(field.name, true);
                  setFieldValue(field.name, value);
                }}
                disabled={readOnly}
              />
              {(meta.touched && meta.error) && (<p className={styles.errorText}>{meta.error}</p>)}
            </>
          )}
        </Field>
      </TableColumn>
      <TableColumn>
        <Field name={`perioder.${periodeIndex}.aktivitetliste.${aktivitetIndex}.opphørRefusjon`}>
          {({ field, meta }) => {
            const tallverdi = values.perioder[periodeIndex].aktivitetliste[aktivitetIndex].refusjonPrAar;
            return (
              <>
                <Datepicker
                  inputProps={{
                    placeholder: intl.formatMessage({ id: 'OverstyrInputForm.OpphorRefusjonPlaceholder' }),
                    'aria-invalid': !!(meta.touched && meta.error),
                  }}
                  value={field.value}
                  onChange={(value) => {
                    setFieldTouched(field.name, true);
                    setFieldValue(field.name, value);
                  }}
                  disabled={(tallverdi <= 0 || !tallverdi || readOnly || !skalKunneEndreRefusjon)}
                />
                {(meta.touched && meta.error) && (<p className={styles.errorText}>{meta.error}</p>)}
              </>
            )
          }}
        </Field>
      </TableColumn>
    </TableRow>
  )
};

export default injectIntl(OverstyrBeregningAktivitetForm);


