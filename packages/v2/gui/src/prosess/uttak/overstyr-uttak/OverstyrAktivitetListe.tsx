import type { ArbeidsgiverOversiktDto } from '@k9-sak-web/backend/k9sak/kontrakt/arbeidsforhold/ArbeidsgiverOversiktDto.js';
import type { OverstyrUttakPeriodeDto } from '@k9-sak-web/backend/k9sak/kontrakt/uttak/overstyring/OverstyrUttakPeriodeDto.js';
import { Label } from '@navikt/ds-react';
import { RhfNumericField } from '@navikt/ft-form-hooks';
import { maxValue, minValue, required } from '@navikt/ft-form-validators';
import { type FC } from 'react';
import { useFormContext, type FieldArrayWithId } from 'react-hook-form';
import { utledArbeidstypeVisningsnavn } from '../utils/aktivitetVisning.js';
import { utledAktivitetNavn } from '../utils/overstyringUtils.js';
import styles from './overstyrAktivitetListe.module.css';

type ownProps = {
  fields: FieldArrayWithId<OverstyrUttakPeriodeDto, 'utbetalingsgrader', 'id'>[];
  loading: boolean;
  arbeidsgivere: ArbeidsgiverOversiktDto['arbeidsgivere'];
};

const OverstyrAktivitetListe: FC<ownProps> = ({ fields, loading, arbeidsgivere }) => {
  const { control } = useFormContext<OverstyrUttakPeriodeDto>();

  return (
    <>
      <Label size="small">Ny utbetalingsgrad per aktivitet</Label>
      <div className={styles.overstyringSkjemaAktiviteter}>
        {fields.map((field, index) => {
          const arbeidstype =
            field.arbeidsforhold.type !== 'BA' ? utledArbeidstypeVisningsnavn(field.arbeidsforhold.type) : undefined;

          return (
            <div key={field.id} className={styles.overstyringSkjemaAktivitet}>
              <div>
                {utledAktivitetNavn(field.arbeidsforhold, arbeidsgivere)}
                {arbeidstype && <span>, {arbeidstype}</span>}
              </div>
              <div>
                <RhfNumericField
                  control={control}
                  name={`utbetalingsgrader.${index}.utbetalingsgrad`}
                  label="Ny utbetalingsgrad (%)"
                  hideLabel
                  size="small"
                  htmlSize={3}
                  maxLength={3}
                  returnAsNumber
                  disabled={loading}
                  validate={[required, minValue(0), maxValue(100)]}
                />
                %
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default OverstyrAktivitetListe;
