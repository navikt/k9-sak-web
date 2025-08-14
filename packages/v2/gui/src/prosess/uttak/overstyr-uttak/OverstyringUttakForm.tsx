import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  DatePicker,
  Heading,
  Loader,
  TextField,
  Textarea,
  useRangeDatepicker,
  type DatePickerProps,
} from '@navikt/ds-react';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { useFieldArray, useForm, type Resolver } from 'react-hook-form';
import OverstyrAktivitetListe from './OverstyrAktivitetListe';

import type {
  k9_sak_kontrakt_arbeidsforhold_ArbeidsgiverOversiktDto as ArbeidsgiverOversiktDto,
  k9_sak_kontrakt_behandling_BehandlingDto as BehandlingDto,
  k9_sak_kontrakt_uttak_overstyring_OverstyrUttakPeriodeDto as OverstyrUttakPeriodeDto,
} from '@k9-sak-web/backend/k9sak/generated';
import { RhfForm } from '@navikt/ft-form-hooks';
import { useQuery } from '@tanstack/react-query';
import type BehandlingUttakBackendClient from '../BehandlingUttakBackendClient';
import type { HandleOverstyringType } from '../types/OverstyringUttakTypes';
import {
  finnSisteSluttDatoFraPerioderTilVurdering,
  finnTidligsteStartDatoFraPerioderTilVurdering,
  formaterOverstyringAktiviteter,
  overstyrUttakFormValidationSchema,
} from '../utils/overstyringUtils';
import styles from './overstyringUttakForm.module.css';
import { OverstyrUttakHandling } from './OverstyrUttak';

type OwnProps = {
  behandling: Pick<BehandlingDto, 'uuid' | 'versjon'>;
  handleAvbrytOverstyringForm: () => void;
  overstyring?: OverstyrUttakPeriodeDto; // OverstyrUttakFormData;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  perioderTilVurdering?: string[];
  api: BehandlingUttakBackendClient;
  handleOverstyring: HandleOverstyringType;
};

const OverstyringUttakForm: React.FC<OwnProps> = ({
  behandling,
  handleAvbrytOverstyringForm,
  overstyring,
  loading,
  handleOverstyring,
  perioderTilVurdering,
  api,
}) => {
  const erNyOverstyring = overstyring === undefined;
  const [arbeidsgivere, setArbeidsgivere] = useState<ArbeidsgiverOversiktDto['arbeidsgivere']>(undefined);

  const [deaktiverLeggTil, setDeaktiverLeggTil] = useState<boolean>(true);
  const resolver: Resolver<OverstyrUttakPeriodeDto, any> = yupResolver(overstyrUttakFormValidationSchema) as Resolver<
    any,
    any
  >;

  const formMethods = useForm<OverstyrUttakPeriodeDto>({
    reValidateMode: 'onBlur',
    defaultValues: overstyring || {
      periode: {
        fom: undefined,
        tom: undefined,
      },
      søkersUttaksgrad: undefined,
      begrunnelse: '',
      utbetalingsgrader: [],
    },
    mode: 'onChange',
    resolver,
  });
  const tidligsteStartDato: Date = finnTidligsteStartDatoFraPerioderTilVurdering(perioderTilVurdering ?? []);

  const {
    control,
    setValue,
    watch,
    register,
    formState: { errors, isValid },
  } = formMethods;

  const { fields, replace: replaceAktiviteter } = useFieldArray({
    control,
    name: 'utbetalingsgrader',
  });

  const { datepickerProps, toInputProps, fromInputProps } = useRangeDatepicker({
    onRangeChange: values => {
      if (values) {
        setValue('periode.fom', values.from ? dayjs(values.from).format('YYYY-MM-DD') : '');
        setValue('periode.tom', values.to ? dayjs(values.to).format('YYYY-MM-DD') : '');
      }
    },
    defaultSelected: erNyOverstyring
      ? undefined
      : { from: dayjs(overstyring.periode.fom).toDate(), to: dayjs(overstyring.periode.tom).toDate() },
    defaultMonth: dayjs(tidligsteStartDato).toDate(),
  });

  const watchFraDato = watch('periode.fom', undefined);
  const watchTilDato = watch('periode.tom', undefined);

  const { isLoading: lasterAktiviteter } = useQuery({
    queryKey: ['overstyrte', behandling.uuid, watchFraDato, watchTilDato],
    queryFn: async () => {
      const aktuelleAktiviteter = await api.hentAktuelleAktiviteter(
        behandling.uuid,
        dayjs(watchFraDato).format('YYYY-MM-DD'),
        dayjs(watchTilDato).format('YYYY-MM-DD'),
      );
      if (aktuelleAktiviteter.arbeidsforholdsperioder) {
        replaceAktiviteter(formaterOverstyringAktiviteter(aktuelleAktiviteter.arbeidsforholdsperioder));
      }
      setArbeidsgivere(aktuelleAktiviteter.arbeidsgiverOversikt?.arbeidsgivere ?? undefined);
      return aktuelleAktiviteter;
    },
  });

  useEffect(
    () => setDeaktiverLeggTil(Boolean(watchFraDato && watchTilDato && !isValid)),
    [watchFraDato, watchTilDato, isValid],
  );

  const disabledDays: DatePickerProps['disabled'] = [
    date => dayjs(date).isBefore(tidligsteStartDato),
    date => dayjs(date).isAfter(finnSisteSluttDatoFraPerioderTilVurdering(perioderTilVurdering ?? [])),
  ];

  return (
    <div className={styles.overstyringSkjemaWrapper}>
      <Heading size="xsmall">Overstyr periode</Heading>
      <RhfForm
        onSubmit={values => handleOverstyring({ action: OverstyrUttakHandling.LAGRE, values })}
        formMethods={formMethods}
      >
        <div className={styles.overstyringDatoOgUttaksgrad}>
          <DatePicker {...datepickerProps} disabled={disabledDays}>
            <div className={styles.overstyringDatoVelger}>
              <DatePicker.Input {...fromInputProps} label="Fra og med" size="small" disabled={loading} />
              <DatePicker.Input {...toInputProps} label="Til og med" size="small" disabled={loading} />
            </div>
          </DatePicker>
          <TextField
            {...register('søkersUttaksgrad')}
            label="Ny uttaksgrad (%)"
            size="small"
            htmlSize={3}
            maxLength={3}
            min={0}
            max={100}
            type="number"
            disabled={loading}
            error={errors['søkersUttaksgrad']?.message}
          />
        </div>

        {lasterAktiviteter !== null && (
          <div className={styles.overstyringAktivitetListe}>
            {lasterAktiviteter && <Loader />}
            {!lasterAktiviteter && (
              <>
                {fields.length > 0 && (
                  <OverstyrAktivitetListe fields={fields} loading={loading} arbeidsgivere={arbeidsgivere} />
                )}
                {fields.length === 0 && <>Kunne ikke finne noen overstyrbare aktiviteter i den angitte perioden</>}
              </>
            )}
          </div>
        )}

        <div className={styles.overstyringBegrunnelse}>
          <Textarea
            {...register('begrunnelse')}
            label="Begrunnelse"
            disabled={loading}
            error={errors['begrunnelse']?.message}
          />
        </div>
        <div className={styles.overstyringKnapperad}>
          <Button variant="primary" size="small" disabled={deaktiverLeggTil} loading={loading}>
            {erNyOverstyring && <>Legg til overstyring</>}
            {!erNyOverstyring && <>Endre overstyring</>}
          </Button>
          <Button variant="secondary" size="small" onClick={handleAvbrytOverstyringForm} loading={loading}>
            Avbryt
          </Button>
        </div>
      </RhfForm>
    </div>
  );
};

export default OverstyringUttakForm;
