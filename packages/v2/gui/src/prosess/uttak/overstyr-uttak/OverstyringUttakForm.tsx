import type { OverstyrUttakPeriodeDto } from '@k9-sak-web/backend/k9sak/kontrakt/uttak/overstyring/OverstyrUttakPeriodeDto.js';
import { Button, DatePicker, Heading, Loader, useRangeDatepicker, type DatePickerProps } from '@navikt/ds-react';
import { RhfForm, RhfNumericField, RhfTextarea } from '@navikt/ft-form-hooks';
import { maxLength, maxValue, minLength, minValue, required } from '@navikt/ft-form-validators';
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useEffect, type FC } from 'react';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import { useUttakApi } from '../api/UttakApiContext.js';
import {
  uttakAktuelleAktiviteterQueryOptions,
  uttakOverstyringerQueryOptions,
  uttakQueryOptions,
} from '../api/uttakQueryOptions.js';
import { useUttakContext } from '../context/UttakContext.js';
import {
  finnSisteSluttDatoFraPerioderTilVurdering,
  finnTidligsteStartDatoFraPerioderTilVurdering,
  formaterOverstyringAktiviteter,
} from '../utils/overstyringUtils.js';
import OverstyrAktivitetListe from './OverstyrAktivitetListe.js';
import styles from './overstyringUttakForm.module.css';

type OwnProps = {
  overstyring?: OverstyrUttakPeriodeDto;
  lagre: (values: OverstyrUttakPeriodeDto) => void;
  avbryt: () => void;
  loading: boolean;
};

const OverstyringUttakForm: FC<OwnProps> = ({ overstyring, lagre, avbryt, loading }) => {
  const { behandling } = useUttakContext();
  const uttakApi = useUttakApi();
  const { data: uttak } = useSuspenseQuery(uttakQueryOptions(uttakApi, behandling.uuid, behandling.versjon));
  const { data: overstyrte } = useQuery(uttakOverstyringerQueryOptions(uttakApi, behandling.uuid));
  const perioderTilVurdering = uttak?.perioderTilVurdering ?? [];
  const erNyOverstyring = overstyring === undefined;

  const formMethods = useForm<OverstyrUttakPeriodeDto>({
    reValidateMode: 'onBlur',
    mode: 'onChange',
    defaultValues: overstyring ?? {
      periode: { fom: '', tom: '' },
      begrunnelse: '',
      utbetalingsgrader: [],
    },
  });
  const {
    control,
    setValue,
    register,
    formState: { isValid },
  } = formMethods;

  // Datoene settes via datovelgeren, så de registreres her for at påkrevd-regelen skal gjelde i isValid
  register('periode.fom', { required: true });
  register('periode.tom', { required: true });

  const tidligsteStartDato = finnTidligsteStartDatoFraPerioderTilVurdering(perioderTilVurdering);

  const { fields, replace: replaceAktiviteter } = useFieldArray({ control, name: 'utbetalingsgrader' });

  const { datepickerProps, toInputProps, fromInputProps } = useRangeDatepicker({
    onRangeChange: values => {
      if (values) {
        setValue('periode.fom', values.from ? dayjs(values.from).format('YYYY-MM-DD') : '', { shouldValidate: true });
        setValue('periode.tom', values.to ? dayjs(values.to).format('YYYY-MM-DD') : '', { shouldValidate: true });
      }
    },
    defaultSelected: erNyOverstyring
      ? undefined
      : { from: dayjs(overstyring.periode.fom).toDate(), to: dayjs(overstyring.periode.tom).toDate() },
    defaultMonth: tidligsteStartDato,
  });

  const [fom, tom] = useWatch({ control, name: ['periode.fom', 'periode.tom'] });
  const beggeDatoerValgt = Boolean(fom) && Boolean(tom);

  // Aktiviteter hentes kun for nye overstyringer. Eksisterende overstyringer bruker aktivitetene som allerede er lagret.
  const { data: aktuelleAktiviteter, isLoading: lasterAktiviteter } = useQuery(
    uttakAktuelleAktiviteterQueryOptions(uttakApi, behandling.uuid, fom, tom, beggeDatoerValgt && erNyOverstyring),
  );

  useEffect(() => {
    if (erNyOverstyring) {
      replaceAktiviteter(
        aktuelleAktiviteter?.arbeidsforholdsperioder
          ? formaterOverstyringAktiviteter(aktuelleAktiviteter.arbeidsforholdsperioder)
          : [],
      );
    }
  }, [erNyOverstyring, aktuelleAktiviteter, replaceAktiviteter]);

  const arbeidsgivere = erNyOverstyring
    ? aktuelleAktiviteter?.arbeidsgiverOversikt?.arbeidsgivere
    : overstyrte?.arbeidsgiverOversikt?.arbeidsgivere;

  const deaktiverLeggTil = beggeDatoerValgt && !isValid;

  const disabledDays: DatePickerProps['disabled'] = [
    date => dayjs(date).isBefore(tidligsteStartDato, 'day'),
    date => dayjs(date).isAfter(finnSisteSluttDatoFraPerioderTilVurdering(perioderTilVurdering), 'day'),
  ];

  return (
    <div className={styles.overstyringSkjemaWrapper}>
      <Heading size="xsmall">Overstyr periode</Heading>
      <RhfForm
        onSubmit={values => lagre({ ...values, søkersUttaksgrad: values.søkersUttaksgrad ?? undefined })}
        formMethods={formMethods}
      >
        <div className={styles.overstyringDatoOgUttaksgrad}>
          <DatePicker {...datepickerProps} disabled={disabledDays}>
            <div className={styles.overstyringDatoVelger}>
              <DatePicker.Input {...fromInputProps} label="Fra og med" size="small" disabled={loading} />
              <DatePicker.Input {...toInputProps} label="Til og med" size="small" disabled={loading} />
            </div>
          </DatePicker>
          <RhfNumericField
            control={control}
            name="søkersUttaksgrad"
            label="Ny uttaksgrad (%)"
            size="small"
            htmlSize={3}
            maxLength={3}
            returnAsNumber
            disabled={loading}
            validate={[minValue(0), maxValue(100)]}
          />
        </div>

        <div className={styles.overstyringAktivitetListe}>
          {lasterAktiviteter && <Loader />}
          {!lasterAktiviteter && fields.length > 0 && (
            <OverstyrAktivitetListe fields={fields} loading={loading} arbeidsgivere={arbeidsgivere} />
          )}
          {!lasterAktiviteter && fields.length === 0 && (
            <>Kunne ikke finne noen overstyrbare aktiviteter i den angitte perioden</>
          )}
        </div>

        <div className={styles.overstyringBegrunnelse}>
          <RhfTextarea
            control={control}
            name="begrunnelse"
            label="Begrunnelse"
            disabled={loading}
            validate={[required, minLength(5), maxLength(1500)]}
            maxLength={1500}
          />
        </div>
        <div className={styles.overstyringKnapperad}>
          <Button variant="primary" size="small" disabled={deaktiverLeggTil} loading={loading}>
            {erNyOverstyring ? 'Legg til overstyring' : 'Endre overstyring'}
          </Button>
          <Button variant="secondary" size="small" type="button" onClick={avbryt} loading={loading}>
            Avbryt
          </Button>
        </div>
      </RhfForm>
    </div>
  );
};

export default OverstyringUttakForm;
