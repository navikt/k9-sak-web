import React, { useContext, useState } from 'react';
import { FormProvider, useForm, useFieldArray } from 'react-hook-form';
import dayjs from 'dayjs';

import DatePicker from '@navikt/ds-react/esm/date/datepicker/DatePicker';
import { useRangeDatepicker } from '@navikt/ds-react/esm/date/hooks/useRangeDatepicker';
import { Alert, Button, Heading, Loader, TextField, Textarea } from '@navikt/ds-react';
import { Form } from '@navikt/ft-form-hooks';

import OverstyrAktivitetListe from './OverstyrAktivitetListe';
import ContainerContext from '../../context/ContainerContext';
import { useOverstyrUttak } from '../../context/OverstyrUttakContext';
import { formaterOverstyring, formaterOverstyringAktiviteter } from '../../../util/overstyringUtils';
import { OverstyrUttakFormFieldName } from '../../../constants/OverstyrUttakFormFieldName';
import { OverstyrUttakFormData } from '../../../types';
import { finnSisteSluttDatoFraPerioderTilVurdering, finnTidligsteStartDatoFraPerioderTilVurdering } from '../../../util/dateUtils';

import styles from './OverstyringUttakForm.css';

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
  const { handleOverstyringAksjonspunkt, perioderTilVurdering } = useContext(ContainerContext);
  const { lasterAktiviteter, hentAktuelleAktiviteter } = useOverstyrUttak();
  const [deaktiverLeggTil, setDeaktiverLeggTil] = useState<boolean>(true);

  const formMethods = useForm<OverstyrUttakFormData>({
    reValidateMode: 'onSubmit',
    defaultValues: overstyring || {
      [OverstyrUttakFormFieldName.FOM]: undefined,
      [OverstyrUttakFormFieldName.TOM]: undefined,
      [OverstyrUttakFormFieldName.UTTAKSGRAD]: 0,
      [OverstyrUttakFormFieldName.BEGRUNNELSE]: '',
      [OverstyrUttakFormFieldName.UTBETALINGSGRADER]: [],
    },
    mode: 'onChange',
  });

  const tidligesteStartDato = finnTidligsteStartDatoFraPerioderTilVurdering(perioderTilVurdering);
  const { control, setValue, watch, register } = formMethods;

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

  React.useEffect(() => {
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
            />
          </div>

          {lasterAktiviteter !== null && (
            <div className={styles.overstyringAktivitetListe}>
              {lasterAktiviteter && <Loader />}
              {!lasterAktiviteter && (
                <>
                  {fields.length > 0 && <OverstyrAktivitetListe fields={fields} loading={loading} />}
                  {fields.length === 0 && <>Kunne ikke finne noen aktiviteter i den angitte perioden</>}
                </>
              )}
            </div>
          )}

          <div className={styles.overstyringBegrunnelse}>
            <Textarea label="Begrunnelse" {...register(OverstyrUttakFormFieldName.BEGRUNNELSE)} disabled={loading} />
            <Alert inline variant="info">
              Overstyringen vil ikke være synlig i uttak før du har bekreftet overstyringen.
            </Alert>
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
