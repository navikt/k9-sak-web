import { PureDatepicker } from '@fpsak-frontend/form';
import { parseCurrencyInput } from '@fpsak-frontend/utils';
import { Table, TextField } from '@navikt/ds-react';
import { Field, useFormikContext } from 'formik';
import React from 'react';
import { WrappedComponentProps, injectIntl } from 'react-intl';
import { OverstyrInputForBeregningDto } from '../types/OverstyrInputForBeregningDto';
import styles from './OverstyrBeregningFaktaForm.module.css';

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
  intl,
}) => {
  const { setFieldValue, setFieldTouched, values } = useFormikContext<OverstyrInputForBeregningDto>();
  return (
    <Table.Row key={key}>
      <Table.DataCell>
        <span className={styles.firmaNavn}>{firmaNavn}</span>
      </Table.DataCell>
      <Table.DataCell>
        <Field name={`perioder.${periodeIndex}.aktivitetliste.${aktivitetIndex}.inntektPrAar`}>
          {({ field, meta }) => (
            <TextField
              size="small"
              {...field}
              id={`perioder-${periodeIndex}-aktivitetliste-${aktivitetIndex}-inntekt`}
              type="text"
              placeholder={intl.formatMessage({ id: 'OverstyrInputForm.InntektPrAar' })}
              onChange={e => {
                const tallverdi: number = parseInt(e.target.value.replace(/\D+/g, ''), 10);
                setFieldValue(field.name, tallverdi);
              }}
              maxLength={10}
              value={parseCurrencyInput(field.value)}
              error={meta.touched && meta.error ? meta.error : false}
              disabled={readOnly}
              hideLabel
            />
          )}
        </Field>
      </Table.DataCell>
      <Table.DataCell>
        <Field name={`perioder.${periodeIndex}.aktivitetliste.${aktivitetIndex}.refusjonPrAar`}>
          {({ field, meta }) => (
            <TextField
              size="small"
              {...field}
              id={`perioder-${periodeIndex}-aktivitetliste-${aktivitetIndex}-refusjon`}
              type="text"
              placeholder={intl.formatMessage({ id: 'OverstyrInputForm.RefusjonPrAar' })}
              onChange={e => {
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
              error={meta.touched && meta.error ? meta.error : false}
              disabled={readOnly || !skalKunneEndreRefusjon}
              hideLabel
            />
          )}
        </Field>
      </Table.DataCell>
      <Table.DataCell>
        <Field name={`perioder.${periodeIndex}.aktivitetliste.${aktivitetIndex}.startdatoRefusjon`}>
          {({ field, meta }) => (
            <PureDatepicker
              label={intl.formatMessage({ id: 'OverstyrInputForm.StartdatoRefusjonPlaceholder' })}
              hideLabel
              errorMessage={meta.touched && meta.error ? meta.error : ''}
              value={field.value}
              onChange={value => {
                setFieldTouched(field.name, true);
                setFieldValue(field.name, value);
              }}
              disabled={readOnly}
            />
          )}
        </Field>
      </Table.DataCell>
      <Table.DataCell>
        <Field name={`perioder.${periodeIndex}.aktivitetliste.${aktivitetIndex}.opphørRefusjon`}>
          {({ field, meta }) => {
            const tallverdi = values.perioder[periodeIndex].aktivitetliste[aktivitetIndex].refusjonPrAar;
            return (
              <PureDatepicker
                label={intl.formatMessage({ id: 'OverstyrInputForm.OpphorRefusjonPlaceholder' })}
                hideLabel
                errorMessage={meta.touched && meta.error ? meta.error : ''}
                value={field.value}
                onChange={value => {
                  setFieldTouched(field.name, true);
                  setFieldValue(field.name, value);
                }}
                disabled={(Number(tallverdi) || 0) <= 0 || !Number(tallverdi) || readOnly || !skalKunneEndreRefusjon}
              />
            );
          }}
        </Field>
      </Table.DataCell>
    </Table.Row>
  );
};

export default injectIntl(OverstyrBeregningAktivitetForm);
