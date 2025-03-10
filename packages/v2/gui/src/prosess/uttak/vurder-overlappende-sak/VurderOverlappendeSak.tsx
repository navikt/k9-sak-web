import React, { useEffect, useState, type FC } from 'react';

import * as yup from 'yup';
import { useQuery } from '@tanstack/react-query';
import { useFieldArray, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Alert, BodyShort, Box, Button, Heading, HStack, List, Loader, Textarea, VStack } from '@navikt/ds-react';
import { Form } from '@navikt/ft-form-hooks';
import { AssessedBy } from '@navikt/ft-plattform-komponenter';
import { formatPeriod } from '@k9-sak-web/lib/dateUtils/dateUtils.js';
import {
  PeriodeMedOverlappValg,
  type AksjonspunktDto,
  type BehandlingDto,
  type BekreftData,
  type EgneOverlappendeSakerDto,
} from '@k9-sak-web/backend/k9sak/generated';
import type { ObjectSchema } from 'yup';
import type { BehandlingUttakBackendApiType } from '../BehandlingUttakBackendApiType';
import { erAksjonspunktReadOnly, kanAksjonspunktRedigeres } from '../../../utils/aksjonspunkt';
import styles from './VurderOverlappendeSak.module.css';
import VurderOverlappendePeriodeForm from './VurderOverlappendePeriodeForm';
import { format } from 'date-fns';

export type PeriodeMedOverlappValgType = keyof typeof PeriodeMedOverlappValg;

interface Props {
  behandling: Pick<BehandlingDto, 'uuid' | 'id' | 'versjon' | 'status'>;
  aksjonspunkt: AksjonspunktDto;
  api: BehandlingUttakBackendApiType;
  oppdaterBehandling: () => void;
}

export interface VurderOverlappendeSakFormData {
  begrunnelse: string;
  perioder: {
    periode: { fom: string; tom: string };
    søkersUttaksgrad?: number;
    saksnummer: string[];
    valg: PeriodeMedOverlappValg;
    endretAutomatisk?: boolean;
  }[];
}

export type BekreftVurderOverlappendeSakerAksjonspunktRequest = BekreftData['requestBody'] & {
  bekreftedeAksjonspunktDtoer: Array<{
    '@type': string;
    kode: string | null | undefined;
    perioder: Array<{
      valg: PeriodeMedOverlappValg;
      begrunnelse: string;
      periode: { fom: string; tom: string };
      søkersUttaksgrad?: number;
    }>;
  }>;
};

const VurderOverlappendeSak: FC<Props> = ({ behandling, aksjonspunkt, api, oppdaterBehandling }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { uuid, id, versjon, status } = behandling;
  const [readOnly, setReadOnly] = useState<boolean>(erAksjonspunktReadOnly(aksjonspunkt));
  const [rediger, setRediger] = useState<boolean>(false);
  const sakAvsluttet = status === 'AVSLU';
  const [originaleOverlappendePerioder, setOriginaleOverlappendePerioder] = useState<{ fom: string; tom: string }[]>(
    [],
  );

  const {
    data: egneOverlappendeSaker,
    isLoading: overlappendeIsLoading,
    isSuccess: overlappendeSuccess,
    isError: overlappendeIsError,
  } = useQuery<EgneOverlappendeSakerDto>({
    queryKey: ['overlappende', uuid],
    queryFn: async () => await api.getEgneOverlappendeSaker(uuid),
  });

  const vurderOverlappendeSakFormSchema: ObjectSchema<VurderOverlappendeSakFormData> = yup.object({
    begrunnelse: yup
      .string()
      .min(3, 'Du må skrive minst tre tegn')
      .max(2000, 'Maks 2000 tegn tillatt.')
      .required('Begrunnelse må fylles ut'),
    perioder: yup
      .array(
        yup.object({
          periode: yup.object({ fom: yup.string().required(), tom: yup.string().required() }),
          valg: yup.mixed<PeriodeMedOverlappValgType>().required('Valg må fylles ut'),
          søkersUttaksgrad: yup
            .number()
            // Handter tal tasta inn med , som desimalteikn:
            .transform((v, origV) =>
              Number.isNaN(v) && typeof origV === 'string' ? Number(origV.replace(',', '.')) : v,
            )
            // Vi vil ha undefined istadenfor NaN
            .transform(v => (Number.isNaN(v) ? undefined : v))

            .when('valg', (valg, schema) => {
              return valg.includes(PeriodeMedOverlappValg.JUSTERT_GRAD)
                ? schema.required('Søkers uttaksgrad må fylles ut').min(0, 'Minimum 0%').max(100, 'Maks 100%')
                : schema.notRequired();
            }),
          saksnummer: yup.array(yup.string().required()).required(),
        }),
      )
      .required(),
  });

  const formMethods = useForm<VurderOverlappendeSakFormData>({
    resolver: yupResolver(vurderOverlappendeSakFormSchema),
    defaultValues: {
      perioder: [],
    },
  });

  const {
    reset,
    control,
    register,
    formState: { errors },
  } = formMethods;
  const { fields, replace } = useFieldArray({ control, name: 'perioder' });

  useEffect(() => {
    const buildInitialValues = (data: EgneOverlappendeSakerDto | undefined) => {
      return {
        begrunnelse: aksjonspunkt?.begrunnelse || '',
        perioder:
          data?.perioderMedOverlapp.map(periode => {
            return {
              valg: periode.valg,
              periode: { fom: periode.periode.fom || '', tom: periode.periode.tom || '' },
              søkersUttaksgrad: periode.fastsattUttaksgrad ?? undefined,
              saksnummer: periode.saksnummer.map(saksNr => saksNr || ''),
              endretAutomatisk: false,
            };
          }) || [],
      };
    };

    if (overlappendeSuccess && egneOverlappendeSaker) {
      const newValues = buildInitialValues(egneOverlappendeSaker);
      setOriginaleOverlappendePerioder(egneOverlappendeSaker.perioderMedOverlapp.map(periode => periode.periode));
      reset(newValues);
    }
  }, [overlappendeSuccess, egneOverlappendeSaker, reset, aksjonspunkt?.begrunnelse]);

  const submit = async (data: VurderOverlappendeSakFormData) => {
    setLoading(true);
    const requestBody: BekreftVurderOverlappendeSakerAksjonspunktRequest = {
      behandlingId: `${id}`,
      behandlingVersjon: versjon,
      bekreftedeAksjonspunktDtoer: [
        {
          '@type': aksjonspunkt.definisjon || '',
          kode: aksjonspunkt.definisjon,
          begrunnelse: data.begrunnelse,
          perioder: data.perioder.map(periode => ({
            valg: periode.valg,
            begrunnelse: data.begrunnelse,
            periode: {
              fom: format(new Date(periode.periode.fom), 'yyyy-MM-dd') || '',
              tom: format(new Date(periode.periode.tom), 'yyyy-MM-dd') || '',
            },
            søkersUttaksgrad: periode.søkersUttaksgrad,
          })),
        },
      ],
    };
    await api.bekreftAksjonspunkt(requestBody);
    setLoading(false);
    oppdaterBehandling();
  };

  if (overlappendeIsError) {
    return <Alert variant="error">Noe gikk galt, vennligst prøv igjen senere</Alert>;
  }

  const toggleRediger = () => {
    setReadOnly(!readOnly);
    setRediger(!rediger);
  };

  const saksbehandler =
    egneOverlappendeSaker?.perioderMedOverlapp.find(periode => periode.saksbehandler)?.saksbehandler || undefined;

  const vurdertTidspunkt =
    egneOverlappendeSaker?.perioderMedOverlapp.find(periode => periode.vurdertTidspunkt)?.vurdertTidspunkt || undefined;

  return (
    <VStack gap="4" className={`${styles['vurderOverlappendeSak']}`} flexGrow={'1'}>
      {!readOnly && (
        <Alert variant={'warning'}>
          <Heading spacing size="xsmall" level="3">
            Vurder overlappende perioder med annen sak
          </Heading>
          <BodyShort>
            Søker har overlappende perioder i uttak med annen sak. Fordel uttaksgrad i begge saker, så den totale
            uttaksgraden ikke overstiger 100 %.
          </BodyShort>
        </Alert>
      )}

      <Box className={`${styles['apContainer']} ${readOnly ? styles['apReadOnly'] : styles['apActive']}`}>
        <Form formMethods={formMethods} onSubmit={submit}>
          <VStack gap="5">
            <Heading size="xsmall">Uttaksgrad for overlappende perioder</Heading>
            {overlappendeIsLoading && <Loader size="large" />}
            {overlappendeSuccess && (
              <>
                <Alert variant="info">
                  Perioder som overlapper med sak:
                  {egneOverlappendeSaker?.perioderMedOverlapp.map(periodeMedOverlapp => {
                    const {
                      periode: { fom, tom },
                      saksnummer,
                    } = periodeMedOverlapp;
                    return (
                      <React.Fragment key={`${fom}-${tom}-${saksnummer.toString()}`}>
                        <List as="ul" size="small">
                          <List.Item>
                            <BodyShort as="span">
                              {formatPeriod(fom || '', tom || '')} (
                              {saksnummer.length == 0 && <>Overlapper ikke lenger annen sak</>}
                              {saksnummer.length > 0 &&
                                saksnummer.map((sakNr, index) => (
                                  <React.Fragment key={`${fom}-${tom}-${sakNr}-link`}>
                                    {index > 0 && ', '}
                                    <a href={`/k9/web/fagsak/${sakNr}`} target="_blank">
                                      {sakNr}
                                    </a>
                                  </React.Fragment>
                                ))}
                              )
                            </BodyShort>
                          </List.Item>
                        </List>
                      </React.Fragment>
                    );
                  })}
                </Alert>

                {fields.map((field, index) => {
                  return (
                    <VurderOverlappendePeriodeForm
                      key={field.id}
                      index={index}
                      originaleOverlappendePerioder={originaleOverlappendePerioder}
                      readOnly={readOnly}
                      fields={fields}
                      replace={replace}
                    />
                  );
                })}

                <Textarea
                  label="Begrunnelse"
                  readOnly={readOnly}
                  {...register('begrunnelse')}
                  error={errors.begrunnelse?.message}
                />
                {saksbehandler && <AssessedBy ident={saksbehandler} date={vurdertTidspunkt} />}
                {!sakAvsluttet && (
                  <>
                    {!readOnly && (
                      <Alert inline variant="info">
                        Ny uttaksgrad vil ikke være synlig i uttak før du har bekreftet.
                      </Alert>
                    )}
                    {readOnly && kanAksjonspunktRedigeres(aksjonspunkt, status) && (
                      <HStack>
                        <Button size="small" variant="secondary" onClick={toggleRediger}>
                          Rediger
                        </Button>
                      </HStack>
                    )}
                    {!readOnly && (
                      <HStack gap="4">
                        <Button type="submit" size="small" disabled={readOnly} loading={loading}>
                          Bekreft og fortsett
                        </Button>
                        {rediger && (
                          <Button size="small" variant="secondary" onClick={toggleRediger}>
                            Avbryt
                          </Button>
                        )}
                      </HStack>
                    )}
                  </>
                )}
              </>
            )}
          </VStack>
        </Form>
      </Box>
    </VStack>
  );
};

export default VurderOverlappendeSak;
