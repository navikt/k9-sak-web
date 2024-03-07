import { yupResolver } from '@hookform/resolvers/yup';
import dayjs from 'dayjs';
import React, { useContext, useEffect, useState } from 'react';
import { FormProvider, Resolver, useFieldArray, useForm } from 'react-hook-form';

import { Button, DatePicker, Heading, Loader, TextField, Textarea, useRangeDatepicker } from '@navikt/ds-react';
import { Form } from '@navikt/ft-form-hooks';

import { OverstyrUttakFormFieldName } from '../../../constants/OverstyrUttakFormFieldName';
import { OverstyrUttakFormData } from '../../../types';
import {
  finnSisteSluttDatoFraPerioderTilVurdering,
  finnTidligsteStartDatoFraPerioderTilVurdering,
} from '../../../util/dateUtils';
import {
  formaterOverstyring,
  formaterOverstyringAktiviteter,
  overstyrUttakFormValidationSchema,
} from '../../../util/overstyringUtils';
import ContainerContext from '../../context/ContainerContext';
import { useOverstyrUttak } from '../../context/OverstyrUttakContext';
import OverstyrAktivitetListe from './OverstyrAktivitetListe';

import styles from './overstyringUttakForm.module.css';

type OwnProps = {
  handleAvbrytOverstyringForm: () => void;
  overstyring?: OverstyrUttakFormData;
  loading: boolean;
  setLoading: (loading: boolean) => void;
};

const OverstyringUttakForm: React.FC<OwnProps> = ({
  handleAvbrytOverstyringForm,
  overstyring,
  loading,
  setLoading,
}) => {
  const erNyOverstyring = overstyring === undefined;
  const { handleOverstyringAksjonspunkt, perioderTilVurdering = [] } = useContext(ContainerContext);
  const { lasterAktiviteter, hentAktuelleAktiviteter } = useOverstyrUttak();
  const [deaktiverLeggTil, setDeaktiverLeggTil] = useState<boolean>(true);
  const resolver: Resolver<OverstyrUttakFormData, any> = yupResolver(overstyrUttakFormValidationSchema) as Resolver<
    any,
    any
  >;
  const formMethods = useForm<OverstyrUttakFormData>({
    reValidateMode: 'onBlur',
    defaultValues: overstyring || {
      [OverstyrUttakFormFieldName.FOM]: undefined,
      [OverstyrUttakFormFieldName.TOM]: undefined,
      [OverstyrUttakFormFieldName.UTTAKSGRAD]: undefined,
      [OverstyrUttakFormFieldName.BEGRUNNELSE]: '',
      [OverstyrUttakFormFieldName.UTBETALINGSGRADER]: [],
    },
    mode: 'onChange',
    resolver,
  });

  const tidligesteStartDato = finnTidligsteStartDatoFraPerioderTilVurdering(perioderTilVurdering);
  const {
    control,
    setValue,
    watch,
    register,
    formState: { errors },
  } = formMethods;

  const { fields, replace: replaceAktiviteter } = useFieldArray({
    control,
    name: OverstyrUttakFormFieldName.UTBETALINGSGRADER,
  });

  const { datepickerProps, toInputProps, fromInputProps } = useRangeDatepicker({
    onRangeChange: values => {
      setValue(OverstyrUttakFormFieldName.FOM, values.from);
      setValue(OverstyrUttakFormFieldName.TOM, values.to);
    },
    defaultSelected: erNyOverstyring
      ? undefined
      : { from: dayjs(overstyring.fom).toDate(), to: dayjs(overstyring.tom).toDate() },
    defaultMonth: dayjs(tidligesteStartDato).toDate(),
  });

  const watchFraDato = watch(OverstyrUttakFormFieldName.FOM, undefined);
  const watchTilDato = watch(OverstyrUttakFormFieldName.TOM, undefined);

  useEffect(() => {
    const handleHentAktuelleAktiviteter = async (fom: Date, tom: Date) => {
      const aktiviteter = await hentAktuelleAktiviteter(fom, tom);
      replaceAktiviteter(formaterOverstyringAktiviteter(aktiviteter));
    };

    if (watchFraDato && watchTilDato) {
      handleHentAktuelleAktiviteter(watchFraDato, watchTilDato);
      setDeaktiverLeggTil(false);
    }
  }, [watchFraDato, watchTilDato]);

  const disabledDays = [
    date => dayjs(date).isBefore(tidligesteStartDato),
    date => dayjs(date).isAfter(finnSisteSluttDatoFraPerioderTilVurdering(perioderTilVurdering)),
  ];

  const handleSubmit = (values: OverstyrUttakFormData) => {
    setLoading(true);
    handleOverstyringAksjonspunkt({
      gåVidere: false,
      erVilkarOk: false,
      periode: { fom: '', tom: '' }, // MÅ legge til denne inntill videre, hack, for å komme rundt validering i backend
      lagreEllerOppdater: [{ ...formaterOverstyring(values) }],
      slett: [],
    });
    setLoading(false);
  };

  return (
    <div className={styles.overstyringSkjemaWrapper}>
      <Heading size="xsmall">Overstyr periode</Heading>
      <FormProvider {...formMethods}>
        <Form onSubmit={handleSubmit} formMethods={formMethods}>
          <div className={styles.overstyringDatoOgUttaksgrad}>
            <DatePicker {...datepickerProps} disabled={disabledDays}>
              <div className={styles.overstyringDatoVelger}>
                <DatePicker.Input {...fromInputProps} label="Fra og med" size="small" disabled={loading} />
                <DatePicker.Input {...toInputProps} label="Til og med" size="small" disabled={loading} />
              </div>
            </DatePicker>
            <TextField
              {...register(OverstyrUttakFormFieldName.UTTAKSGRAD)}
              label="Ny uttaksgrad (%)"
              size="small"
              htmlSize={3}
              maxLength={3}
              min={0}
              max={100}
              type="number"
              disabled={loading}
              error={errors[OverstyrUttakFormFieldName.UTTAKSGRAD]?.message}
            />
          </div>

          {lasterAktiviteter !== null && (
            <div className={styles.overstyringAktivitetListe}>
              {lasterAktiviteter && <Loader />}
              {!lasterAktiviteter && (
                <>
                  {fields.length > 0 && <OverstyrAktivitetListe fields={fields} loading={loading} />}
                  {fields.length === 0 && <>Kunne ikke finne noen overstyrbare aktiviteter i den angitte perioden</>}
                </>
              )}
            </div>
          )}

          <div className={styles.overstyringBegrunnelse}>
            <Textarea
              {...register(OverstyrUttakFormFieldName.BEGRUNNELSE)}
              label="Begrunnelse"
              disabled={loading}
              error={errors[OverstyrUttakFormFieldName.BEGRUNNELSE]?.message}
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
        </Form>
      </FormProvider>
    </div>
  );
};

export default OverstyringUttakForm;
