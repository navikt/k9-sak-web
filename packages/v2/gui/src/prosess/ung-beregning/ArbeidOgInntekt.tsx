import {
  KontrollerInntektPeriodeDtoStatus,
  KontrollerInntektPeriodeDtoValg,
  type KontrollerInntektDto,
  type RapportertInntektDto,
} from '@k9-sak-web/backend/ungsak/generated';
import { aksjonspunktCodes } from '@k9-sak-web/backend/ungsak/kodeverk/AksjonspunktCodes.js';
import { CheckmarkCircleFillIcon, ExclamationmarkTriangleFillIcon, PersonIcon } from '@navikt/aksel-icons';
import { Bleed, BodyLong, BodyShort, Box, Button, Heading, HStack, Label, Table, VStack } from '@navikt/ds-react';
import { Form, InputField, RadioGroupPanel, TextAreaField } from '@navikt/ft-form-hooks';
import { minLength, required } from '@navikt/ft-form-validators';
import { useForm } from 'react-hook-form';
import PeriodLabel from '../../shared/periodLabel/PeriodLabel';
import { formatCurrencyWithKr } from '../../utils/formatters';
import styles from './arbeidOgInntekt.module.css';

const formaterInntekt = (inntekt: RapportertInntektDto) => {
  return formatCurrencyWithKr((inntekt.arbeidsinntekt ?? 0) + (inntekt.ytelse ?? 0));
};

const formaterStatus = (status?: KontrollerInntektPeriodeDtoStatus) => {
  if (status === KontrollerInntektPeriodeDtoStatus.AVVIK) {
    return 'Avvik';
  }
  return 'Ingen avvik';
};

type Formvalues = {
  fastsattArbeidsinntekt: string;
  fastsattYtelse: string;
  inntektRadio: KontrollerInntektPeriodeDtoValg | '';
  begrunnelse: string;
};

interface ArbeidOgInntektProps {
  submitCallback: (data: unknown) => void;
  inntektKontrollperioder: KontrollerInntektDto['kontrollperioder'];
}

export const ArbeidOgInntekt = ({ submitCallback, inntektKontrollperioder }: ArbeidOgInntektProps) => {
  const formMethods = useForm<Formvalues>({
    defaultValues: {
      fastsattArbeidsinntekt: '',
      fastsattYtelse: '',
      inntektRadio: '',
      begrunnelse: '',
    },
  });
  const inntektRadio = formMethods.watch('inntektRadio');

  const onSubmit = (values: Formvalues) => {
    const payload = {
      inntektRadio: values.inntektRadio,
      begrunnelse: values.begrunnelse,
      ...(values.inntektRadio === KontrollerInntektPeriodeDtoValg.MANUELT_FASTSATT && {
        fastsattArbeidsinntekt: values.fastsattArbeidsinntekt,
        fastsattYtelse: values.fastsattYtelse,
      }),
    };
    submitCallback({
      kode: aksjonspunktCodes.KONTROLLER_INNTEKT,
      kontrollerInntekt: payload,
    });
  };

  const getAksjonspunkt = () => (
    <Bleed marginBlock="4 0">
      <Box
        marginInline="2 0"
        padding="6"
        background="surface-subtle"
        borderColor="border-warning"
        borderWidth="0 0 0 4"
        borderRadius="0 medium medium 0"
      >
        <VStack gap="6">
          <HStack gap="2" wrap={false}>
            <PersonIcon title="Deltager" fontSize="1.5rem" className={styles.personIcon} />
            <VStack gap="2">
              <Heading size="xsmall" as="h3">
                Beskrivelse fra deltaker for avvik i perioden 01.02.2025 - 28.02.2025
              </Heading>
              <Box maxWidth="75ch">
                <BodyLong size="small">
                  Jeg fikk forskuttert litt lønn av arbeidsgiver denne måneden fordi jeg har hatt økonomiske
                  utfordringer, så jeg rapporterte bare det jeg egentlig skulle fått utbetalt. Det var ikke meningen å
                  oppgi feil, bare å holde det riktig for denne måneden!
                </BodyLong>
              </Box>
            </VStack>
          </HStack>
          <Box borderColor="border-default" borderWidth="0 0 1 0" />
          <VStack gap="2">
            <RadioGroupPanel
              name="inntektRadio"
              label="Hvilken inntekt skal benyttes?"
              validate={[required]}
              radios={[
                {
                  value: KontrollerInntektPeriodeDtoValg.BRUK_BRUKERS_INNTEKT,
                  label: 'Rapportert inntekt fra deltager',
                },
                {
                  value: KontrollerInntektPeriodeDtoValg.BRUK_REGISTER_INNTEKT,
                  label: 'Rapportert inntekt fra A-inntekt',
                },
                { value: KontrollerInntektPeriodeDtoValg.MANUELT_FASTSATT, label: 'Fastsett beløp' },
              ]}
            />
            {inntektRadio === KontrollerInntektPeriodeDtoValg.MANUELT_FASTSATT && (
              <VStack gap="4">
                <InputField
                  name="fastsattArbeidsinntekt"
                  label="Inntekt fra arbeid"
                  type="text"
                  validate={[required]}
                  htmlSize={7}
                  size="small"
                />
                <InputField
                  name="fastsattYtelse"
                  label="Inntekt fra ytelse"
                  type="text"
                  validate={[required]}
                  htmlSize={7}
                  size="small"
                />
              </VStack>
            )}
          </VStack>
          <Box maxWidth="70ch">
            <TextAreaField
              name="begrunnelse"
              label="Begrunnelse"
              validate={[required, minLength(3)]}
              maxLength={1500}
            />
          </Box>
          <HStack gap="2">
            <Button size="small" variant="primary" type="submit">
              Bekreft og fortsett
            </Button>
            <Button size="small" variant="secondary">
              Avbryt
            </Button>
          </HStack>
        </VStack>
      </Box>
    </Bleed>
  );

  return (
    <Form<Formvalues> formMethods={formMethods} onSubmit={onSubmit}>
      <Box marginBlock="7 0" borderRadius="large" borderWidth="1" borderColor="border-divider">
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell scope="col" className={styles.firstHeaderCell}>
                <Label size="small">Status</Label>
              </Table.HeaderCell>
              <Table.HeaderCell scope="col">
                <Label size="small">Periode</Label>
              </Table.HeaderCell>
              <Table.HeaderCell scope="col" align="right">
                <Label size="small">Rapportert av deltager</Label>
              </Table.HeaderCell>
              <Table.HeaderCell scope="col" align="right">
                <Label size="small">Rapportert i A-inntekt</Label>
              </Table.HeaderCell>
              <Table.HeaderCell />
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {inntektKontrollperioder?.map((inntekt, index) => {
              const isLastRow = index === inntektKontrollperioder.length - 1;
              const harAksjonspunkt = inntekt.erTilVurdering;
              const harAvvik = inntekt.status === KontrollerInntektPeriodeDtoStatus.AVVIK;

              return (
                <Table.ExpandableRow
                  key={`${inntekt.periode?.fom}_${inntekt.periode?.tom}`}
                  content={harAksjonspunkt ? getAksjonspunkt() : null}
                  togglePlacement="right"
                  className={isLastRow ? styles.lastRow : ''}
                  expandOnRowClick
                  expansionDisabled={!harAksjonspunkt}
                >
                  <Table.DataCell className={styles.firstDataCell}>
                    <HStack gap="2" align="center">
                      {harAvvik ? (
                        <ExclamationmarkTriangleFillIcon fontSize="1.5rem" className={styles.exclamationmarkIcon} />
                      ) : (
                        <CheckmarkCircleFillIcon fontSize={24} className={styles.checkmarkIcon} />
                      )}
                      <BodyShort size="small">{formaterStatus(inntekt.status)}</BodyShort>
                    </HStack>
                  </Table.DataCell>
                  <Table.DataCell>
                    {inntekt.periode && (
                      <BodyShort size="small">
                        <PeriodLabel dateStringFom={inntekt.periode?.fom} dateStringTom={inntekt.periode?.tom} />
                      </BodyShort>
                    )}
                  </Table.DataCell>
                  <Table.DataCell align="right">
                    <BodyShort size="small">
                      {inntekt.rapporterteInntekter?.bruker && formaterInntekt(inntekt.rapporterteInntekter?.bruker)}
                    </BodyShort>
                  </Table.DataCell>
                  <Table.DataCell align="right">
                    <BodyShort size="small">
                      {inntekt.rapporterteInntekter?.register &&
                        formaterInntekt(inntekt.rapporterteInntekter?.register)}
                    </BodyShort>
                  </Table.DataCell>
                </Table.ExpandableRow>
              );
            })}
          </Table.Body>
        </Table>
      </Box>
    </Form>
  );
};
