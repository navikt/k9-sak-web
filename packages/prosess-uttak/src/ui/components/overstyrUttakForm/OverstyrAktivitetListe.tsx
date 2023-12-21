import React from 'react';
import { useFormContext, FieldArrayWithId } from 'react-hook-form';

import { Label, TextField } from '@navikt/ds-react';
import { OverstyrUttakFormFieldName } from '../../../constants';

import styles from './overstyrAktivitetListe.module.css';
import { OverstyrUttakFormData } from '../../../types';
import { useOverstyrUttak } from '../../context/OverstyrUttakContext';

type ownProps = {
  fields: FieldArrayWithId<OverstyrUttakFormData, OverstyrUttakFormFieldName.UTBETALINGSGRADER, 'id'>[];
  loading: boolean;
};

const OverstyrAktivitetListe: React.FC<ownProps> = ({ fields, loading }) => {
  const { register } = useFormContext();
  const { utledAktivitetNavn } = useOverstyrUttak();

  return (
    <>
      <Label size="small">Ny utbetalingsgrad per aktivitet</Label>
      <div className={styles.overstyringSkjemaAktiviteter}>
        {fields.map((field, index) => (
          <div key={field.id} className={styles.overstyringSkjemaAktivitet}>
            <div>{utledAktivitetNavn(field.arbeidsforhold)}</div>
            <div>
              <TextField
                {...register(
                  `${OverstyrUttakFormFieldName.UTBETALINGSGRADER}.${index}.${OverstyrUttakFormFieldName.AKTIVITET_UTBETALINGSGRAD}`,
                )}
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
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default OverstyrAktivitetListe;
