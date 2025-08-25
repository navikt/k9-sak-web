import React from 'react';
import { useFormContext, type FieldArrayWithId } from 'react-hook-form';
import { ErrorMessage, Label, TextField } from '@navikt/ds-react';
import type {
  k9_sak_kontrakt_arbeidsforhold_ArbeidsgiverOversiktDto as ArbeidsgiverOversiktDto,
  k9_sak_kontrakt_uttak_overstyring_OverstyrUttakPeriodeDto as OverstyrUttakPeriodeDto,
} from '@k9-sak-web/backend/k9sak/generated/types.js';
import { utledAktivitetNavn } from '../utils/overstyringUtils';
import { arbeidstypeTilVisning } from '../constants/Arbeidstype';
import styles from './overstyrAktivitetListe.module.css';

type ownProps = {
  fields: FieldArrayWithId<OverstyrUttakPeriodeDto, 'utbetalingsgrader', 'id'>[];
  loading: boolean;
  arbeidsgivere: ArbeidsgiverOversiktDto['arbeidsgivere'];
};

const OverstyrAktivitetListe: React.FC<ownProps> = ({ fields, loading, arbeidsgivere }) => {
  const {
    register,
    formState: { errors },
  } = useFormContext<OverstyrUttakPeriodeDto>();

  return (
    <>
      <Label size="small">Ny utbetalingsgrad per aktivitet</Label>
      <div className={styles.overstyringSkjemaAktiviteter}>
        {fields.map((field, index) => {
          const arbeidstype =
            field.arbeidsforhold?.type !== 'BA' ? arbeidstypeTilVisning[field.arbeidsforhold?.type] : false;
          const harFeil = !!errors['utbetalingsgrader']?.[index]?.utbetalingsgrad;

          return (
            <div key={field.id} className={styles.overstyringSkjemaAktivitet}>
              <div>
                {utledAktivitetNavn(field.arbeidsforhold, arbeidsgivere)}
                {arbeidstype && <span>, {arbeidstype}</span>}
              </div>
              <div className={harFeil ? 'navds-error-message navds-label' : ''}>
                <TextField
                  {...register(`utbetalingsgrader.${index}.utbetalingsgrad`)}
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
                    {errors['utbetalingsgrader']?.[index]?.utbetalingsgrad?.message || 'Ukjent feil'}
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
