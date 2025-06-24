import React, { useEffect, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import dayjs from 'dayjs';
import { FormProvider, type Resolver, useFieldArray, useForm } from 'react-hook-form';
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
import { Form } from '@navikt/ft-form-hooks';
// import ContainerContext from '../../context/ContainerContext';
// import { useOverstyrUttak } from '../../context/OverstyrUttakContext';
import OverstyrAktivitetListe from './OverstyrAktivitetListe';

import styles from './overstyringUttakForm.module.css';
import { OverstyrUttakFormFieldName } from '../constants/OverstyrUttakFormFieldName';
import {
  finnSisteSluttDatoFraPerioderTilVurdering,
  finnTidligsteStartDatoFraPerioderTilVurdering,
  formaterOverstyring,
  formaterOverstyringAktiviteter,
  overstyrUttakFormValidationSchema,
} from '../utils/overstyringUtils';
import type { OverstyrUttakFormData } from '../types/OverstyrUttakFormData';
import type BehandlingUttakBackendClient from '../BehandlingUttakBackendClient';
import type { BehandlingDto } from '@k9-sak-web/backend/k9sak/generated';
import { useQuery } from '@tanstack/react-query';

type OwnProps = {
  behandling: Pick<BehandlingDto, 'uuid' | 'versjon'>;
  handleAvbrytOverstyringForm: () => void;
  overstyring?: OverstyrUttakFormData;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  perioderTilVurdering?: string[];
  api: BehandlingUttakBackendClient;
};

const OverstyringUttakForm: React.FC<OwnProps> = ({
  behandling,
  handleAvbrytOverstyringForm,
  overstyring,
  loading,
  setLoading,
  perioderTilVurdering,
  api,
}) => {
  const erNyOverstyring = overstyring === undefined;
  // const { handleOverstyringAksjonspunkt, perioderTilVurdering = [] } = useContext(ContainerContext);
  // const { lasterAktiviteter, hentAktuelleAktiviteter } = useOverstyrUttak();
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
  const tidligsteStartDato = finnTidligsteStartDatoFraPerioderTilVurdering(perioderTilVurdering ?? []);
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
      if (values) {
        setValue(OverstyrUttakFormFieldName.FOM, values.from);
        setValue(OverstyrUttakFormFieldName.TOM, values.to);
      }
    },
    defaultSelected: erNyOverstyring
      ? undefined
      : { from: dayjs(overstyring.fom).toDate(), to: dayjs(overstyring.tom).toDate() },
    defaultMonth: dayjs(tidligsteStartDato).toDate(),
  });

  const watchFraDato = watch(OverstyrUttakFormFieldName.FOM, undefined);
  const watchTilDato = watch(OverstyrUttakFormFieldName.TOM, undefined);

  const {
    data: arbeidsgivere,
    isLoading: lasterAktiviteter,
    // isError: overstyrteError,
  } = useQuery({
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

      return aktuelleAktiviteter.arbeidsgiverOversikt.arbeidsgivere || [];
    },
  });

  // useEffect(() => {
  //   const handleHentAktuelleAktiviteter = async (fom: Date, tom: Date) => {
  //     // const aktiviteter = await hentAktuelleAktiviteter(fom, tom);
  //     const {
  //       data: aktiviteter,
  //       isLoading: lasterAktiviteter,
  //       // isError: overstyrteError,
  //     } = useQuery({
  //       queryKey: ['overstyrte', behandling.uuid,],
  //       queryFn: () =>
  //         api.hentAktuelleAktiviteter(
  //           behandling.uuid,
  //           dayjs(fom).format('YYYY-MM-DD'),
  //           dayjs(tom).format('YYYY-MM-DD'),
  //         ),
  //     });
  //     replaceAktiviteter(formaterOverstyringAktiviteter(aktiviteter));
  //   };

  //   if (watchFraDato && watchTilDato) {
  //     void handleHentAktuelleAktiviteter(watchFraDato, watchTilDato);
  //     setDeaktiverLeggTil(false);
  //   }
  // }, [replaceAktiviteter, watchFraDato, watchTilDato]);

  const disabledDays: DatePickerProps['disabled'] = [
    date => dayjs(date).isBefore(tidligsteStartDato),
    date => dayjs(date).isAfter(finnSisteSluttDatoFraPerioderTilVurdering(perioderTilVurdering)),
  ];

  const handleSubmit = (values: OverstyrUttakFormData) => {
    setLoading(true);
    // handleOverstyringAksjonspunkt({
    //   gåVidere: false,
    //   erVilkarOk: false,
    //   periode: { fom: '', tom: '' }, // MÅ legge til denne inntill videre, hack, for å komme rundt validering i backend
    //   lagreEllerOppdater: [{ ...formaterOverstyring(values) }],
    //   slett: [],
    // });
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
