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
  ReadMore,
  Textarea,
  VStack,
} from '@navikt/ds-react';
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
import { kanAksjonspunktRedigeres } from '../../../utils/aksjonspunkt';
import styles from './VurderOverlappendeSak.module.css';
import VurderOverlappendePeriodeForm from './VurderOverlappendePeriodeForm';
import { format } from 'date-fns';

export type PeriodeMedOverlappValgType = keyof typeof PeriodeMedOverlappValg;

interface Props {
  behandling: Pick<BehandlingDto, 'uuid' | 'id' | 'versjon' | 'status'>;
  aksjonspunkt: AksjonspunktDto;
  readOnly: boolean;
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

const VurderOverlappendeSak: FC<Props> = ({ behandling, aksjonspunkt, readOnly, api, oppdaterBehandling }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { uuid, id, versjon, status } = behandling;
  const [rediger, setRediger] = useState<boolean>(false);
  const sakAvsluttet = status === 'AVSLU';
  const kanRedigeres = kanAksjonspunktRedigeres(aksjonspunkt, status);

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
                ? schema
                    .required('Søkers uttaksgrad må fylles ut')
                    .min(1, 'Minimum 1%, bruk "Ingen uttak i perioden" for å sette uttaksgrad til 0.')
                    .max(100, 'Maks 100%')
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
            søkersUttaksgrad:
              periode.valg === PeriodeMedOverlappValg.INGEN_UTTAK_I_PERIODEN ? 0 : periode.søkersUttaksgrad,
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

  const toggleRediger = () => setRediger(!rediger);

  const saksbehandler =
    egneOverlappendeSaker?.perioderMedOverlapp.find(periode => periode.saksbehandler)?.saksbehandler || undefined;

  const vurdertTidspunkt =
    egneOverlappendeSaker?.perioderMedOverlapp.find(periode => periode.vurdertTidspunkt)?.vurdertTidspunkt || undefined;

  return (
    <VStack gap="4" className={`${styles['vurderOverlappendeSak']}`} flexGrow={'1'}>
      {!readOnly && (
        <Alert variant={'warning'}>
          <Heading spacing size="xsmall" level="3">
            Søker har overlappende perioder med en annen sak
          </Heading>
          <List size="small" className={styles['vurderOverlappendeSakApListe']} as="ol">
            <List.Item>Reserver den tilhørende saken</List.Item>
            <List.Item>
              Vurder om du må justere uttaket i en eller begge saker, for å unngå dobbelutbetaling. Vurder ut fra:
              <List size="small" className={`asdf ${styles['noOverlappendeMargin']}`}>
                <List.Item>Opplysninger fra bruker, vet vi hva han eller hun vil?</List.Item>
                <List.Item>Skal det være tilgjengelig uttak til andre på ett av barna?</List.Item>
                <List.Item>
                  Det vil ofte lønne seg å innvilge på den nyeste saken, mtp beregning og feriepenger.
                </List.Item>
                <List.Item>Er du usikker, må du kontakte bruker for avklaring.</List.Item>
              </List>
            </List.Item>
            <List.Item>
              Når du har vurdert uttak i denne saken, går du inn i den andre saken og vurderer uttaket for samme
              periode.
            </List.Item>
            <List.Item>
              Vil endring i uttak medføre unødig tilbakekrevingssak, slik at endringene bør gjelde fremover i tid?
            </List.Item>
          </List>
        </Alert>
      )}

      <Box className={`${styles['apContainer']} ${readOnly || !rediger ? styles['apReadOnly'] : styles['apActive']}`}>
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

                <ReadMore header="Hva betyr de ulike valgene?" size="small">
                  Her tar du valg for hvordan uttaket skal være i denne saken.
                  <List size="small">
                    <List.Item>
                      Ingen uttak i perioden: Dette valget medfører at du nuller ut uttaket i den overlappende perioden.
                      Velg dette hvis du ønsker at bruker skal få alt uttak/utbetaling i den andre saken.
                    </List.Item>
                    <List.Item>
                      Vanlig uttak i perioden: Ved å velge dette, bestemmer du at denne saken skal graderes som vanlig
                      ut fra informasjon om arbeidstid, inntekt, tilsyn osv. Du velger altså å la den gå sin gang, uten
                      å bli påvirket av den overlappende saken.
                    </List.Item>
                    <List.Item>
                      Tilpass uttaksgrad: Her kan du manuelt bestemme hvor mange prosent pleiepenger bruker skal få i
                      saken. Dette valget brukes unntaksvis, da det vil medføre at man må overstyre hver gang det kommer
                      en endring. Man må også være mer obs på hvilken uttaksgrad den andre saken har, spesielt hvis ikke
                      den også settes manuelt.
                    </List.Item>
                  </List>
                </ReadMore>

                {fields.map((field, index) => {
                  return (
                    <VurderOverlappendePeriodeForm
                      key={field.id}
                      index={index}
                      readOnly={readOnly || !rediger}
                      fields={fields}
                      replace={replace}
                    />
                  );
                })}

                <Textarea
                  label="Begrunnelse"
                  readOnly={readOnly || !rediger}
                  {...register('begrunnelse')}
                  error={errors.begrunnelse?.message}
                />
                {saksbehandler && <AssessedBy ident={saksbehandler} date={vurdertTidspunkt} />}
                {!sakAvsluttet && !readOnly && (
                  <>
                    {rediger && (
                      <>
                        <Alert inline variant="info">
                          Ny uttaksgrad vil ikke være synlig i uttak før du har bekreftet.
                        </Alert>

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
                      </>
                    )}
                    {kanRedigeres && !rediger && (
                      <HStack>
                        <Button size="small" variant="secondary" onClick={toggleRediger}>
                          Rediger
                        </Button>
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
