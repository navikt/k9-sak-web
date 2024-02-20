import React from 'react';
import { useFormContext, FieldArrayWithId } from 'react-hook-form';

import { ErrorMessage, Label, TextField } from '@navikt/ds-react';
import { OverstyrUttakFormFieldName, arbeidstypeTilVisning } from '../../../constants';

import styles from './overstyrAktivitetListe.module.css';
import { OverstyrUttakFormData } from '../../../types';
import { useOverstyrUttak } from '../../context/OverstyrUttakContext';

type ownProps = {
  fields: FieldArrayWithId<OverstyrUttakFormData, OverstyrUttakFormFieldName.UTBETALINGSGRADER, 'id'>[];
  loading: boolean;
};

const OverstyrAktivitetListe: React.FC<ownProps> = ({ fields, loading }) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const { utledAktivitetNavn } = useOverstyrUttak();

  return (
    <>
      <Label size="small">Ny utbetalingsgrad per aktivitet</Label>
      <div className={styles.overstyringSkjemaAktiviteter}>
        {fields.map((field, index) => {
          const arbeidstype =
            field.arbeidsforhold?.type !== 'BA' ? arbeidstypeTilVisning[field.arbeidsforhold?.type] : false;
          const harFeil =
            !!errors[OverstyrUttakFormFieldName.UTBETALINGSGRADER]?.[index]?.[
              OverstyrUttakFormFieldName.AKTIVITET_UTBETALINGSGRAD
            ];

          return (
            <div key={field.id} className={styles.overstyringSkjemaAktivitet}>
              <div>
                {utledAktivitetNavn(field.arbeidsforhold)}
                {arbeidstype && <span>, {arbeidstype}</span>}
              </div>
              <div className={harFeil ? 'navds-error-message navds-label' : ''}>
                <TextField
                  {...register(
                    `${OverstyrUttakFormFieldName.UTBETALINGSGRADER}.${index}.${OverstyrUttakFormFieldName.AKTIVITET_UTBETALINGSGRAD}`,
                  )}
                  className={harFeil ? 'navds-text-field--error' : ''}
                  label="Ny utbetalingsgrad (%)"
                  hideLabel
                  size="small"
                  htmlSize={3}
                  maxLength={3}
                  min={0}
                  max={100}
                  type="number"
                  disabled={loading}
                />
                %
                {harFeil && (
                  <ErrorMessage className="inline ml-4">
                    {
                      errors[OverstyrUttakFormFieldName.UTBETALINGSGRADER][index][
                        OverstyrUttakFormFieldName.AKTIVITET_UTBETALINGSGRAD
                      ]?.message
                    }
                  </ErrorMessage>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default OverstyrAktivitetListe;
