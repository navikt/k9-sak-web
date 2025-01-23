import React, { useEffect, useState, type FC } from 'react';
import * as yup from 'yup';
import { useQuery } from '@tanstack/react-query';
import { useFieldArray, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Alert,
  BodyShort,
  Box,
  Button,
  Heading,
  HStack,
  List,
  Loader,
  Textarea,
  TextField,
  VStack,
} from '@navikt/ds-react';
import { Form, NumberField, TextAreaField } from '@navikt/ft-form-hooks';
import { AssessedBy } from '@navikt/ft-plattform-komponenter';
import { hasValidInteger, maxLength, minLength, required } from '@navikt/ft-form-validators';
import { formatPeriod } from '@k9-sak-web/lib/dateUtils/dateUtils.js';
import type {
  AksjonspunktDto,
  BehandlingDto,
  BekreftData,
  EgneOverlappendeSakerDto,
} from '@k9-sak-web/backend/k9sak/generated';
import type { BehandlingUttakBackendApiType } from '../BehandlingUttakBackendApiType';
import { erAksjonspunktReadOnly, kanAksjonspunktRedigeres } from '../../../utils/aksjonspunkt';

import styles from './VurderOverlappendeSak.module.css';
import type { ObjectSchema } from 'yup';

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
    søkersUttaksgrad: number;
    saksnummer: string[];
  }[];
}

export type BekreftVurderOverlappendeSakerAksjonspunktRequest = BekreftData['requestBody'] & {
  bekreftedeAksjonspunktDtoer: Array<{
    '@type': string;
    kode: string | null | undefined;
    perioder: Array<{
      begrunnelse: string;
      periode: { fom: string; tom: string };
      søkersUttaksgrad: number | undefined;
    }>;
  }>;
};

const VurderOverlappendeSak: FC<Props> = ({ behandling, aksjonspunkt, api, oppdaterBehandling }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { uuid, id, versjon, status } = behandling;
  const [readOnly, setReadOnly] = useState<boolean>(erAksjonspunktReadOnly(aksjonspunkt));
  const [rediger, setRediger] = useState<boolean>(false);
  const sakAvsluttet = status === 'AVSLU';

  const buildInitialValues = (data: EgneOverlappendeSakerDto | undefined) => {
    return {
      begrunnelse: aksjonspunkt?.begrunnelse || '',
      perioder:
        data?.perioderMedOverlapp.map(periode => ({
          periode: { fom: periode.periode.fom || '', tom: periode.periode.tom || '' },
          søkersUttaksgrad: periode.fastsattUttaksgrad ?? undefined,
          saksnummer: periode.saksnummer.map(saksNr => saksNr || ''),
        })) || [],
    };
  };

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
    begrunnelse: yup.string().required(),
    perioder: yup
      .array(
        yup.object({
          periode: yup.object({ fom: yup.string().required(), tom: yup.string().required() }),
          søkersUttaksgrad: yup
            .number()
            .transform(v => (Number.isNaN(v) ? undefined : v))
            .required(),
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

  const { reset, control, register } = formMethods;
  const { fields } = useFieldArray({ control, name: 'perioder' });

  useEffect(() => {
    if (overlappendeSuccess && egneOverlappendeSaker) {
      const newValues = buildInitialValues(egneOverlappendeSaker);
      reset(newValues);
    }
  }, [overlappendeSuccess, egneOverlappendeSaker, reset]);

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
            begrunnelse: data.begrunnelse,
            periode: { fom: periode.periode.fom || '', tom: periode.periode.tom || '' },
            søkersUttaksgrad: periode.søkersUttaksgrad,
          })),
        },
      ],
    };
    api.bekreftAksjonspunkt(requestBody).then(() => {
      setLoading(false);
      oppdaterBehandling();
    });
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
                      <React.Fragment key={`${fom}-${tom}-${saksnummer}`}>
                        <List as="ul" size="small">
                          <List.Item>
                            <BodyShort as="span">
                              {formatPeriod(fom || '', tom || '')} (
                              {saksnummer.map(sakNr => (
                                <a key={`${fom}-${tom}-${sakNr}-link`} href={`/k9/web/fagsak/${sakNr}`} target="_blank">
                                  {sakNr}
                                </a>
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
                  const {
                    periode: { fom, tom },
                    saksnummer,
                  } = field;
                  return (
                    <div key={`${fom}-${tom}-${saksnummer}`}>
                      {readOnly ? (
                        <TextField
                          label={`Sett uttaksgrad i prosent for perioden ${formatPeriod(fom || '', tom || '')}`}
                          size="small"
                          className={styles['uttaksgradField']}
                          readOnly
                          {...register(`perioder.${index}.søkersUttaksgrad`)}
                        />
                      ) : (
                        <NumberField
                          label={`Sett uttaksgrad i prosent for perioden ${formatPeriod(fom || '', tom || '')}`}
                          name={`perioder.${index}.søkersUttaksgrad`}
                          validate={[required, hasValidInteger, minLength(1), maxLength(3)]}
                          className={styles['uttaksgradField']}
                          readOnly={readOnly}
                        />
                      )}
                    </div>
                  );
                })}
                {readOnly ? (
                  <Textarea label="Begrunnelse" readOnly {...register('begrunnelse')} />
                ) : (
                  <TextAreaField
                    name="begrunnelse"
                    label="Begrunnelse"
                    validate={[required, maxLength(2000), minLength(3)]}
                    readOnly={readOnly}
                  />
                )}

                {saksbehandler && <AssessedBy ident={saksbehandler} date={vurdertTidspunkt} />}

                {!sakAvsluttet && (
                  <>
                    {!readOnly && (
                      <Alert inline variant="info">
                        Ny uttaksgrad vil ikke være synlig i uttak før du har bekreftet.
                      </Alert>
                    )}
                    {readOnly && kanAksjonspunktRedigeres(aksjonspunkt, { status }) && (
                      <HStack>
                        <Button size="small" variant="secondary" onClick={toggleRediger}>
                          Rediger
                        </Button>
                      </HStack>
                    )}
                    {!readOnly && (
                      <HStack gap="4">
                        <Button size="small" disabled={readOnly} loading={loading}>
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
