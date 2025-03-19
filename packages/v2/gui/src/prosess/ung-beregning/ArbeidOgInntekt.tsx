import { CheckmarkCircleFillIcon, ExclamationmarkTriangleFillIcon, PersonIcon } from '@navikt/aksel-icons';
import { Bleed, BodyLong, Box, Button, Heading, HStack, Table, VStack } from '@navikt/ds-react';
import { Form, InputField, RadioGroupPanel, TextAreaField } from '@navikt/ft-form-hooks';
import { minLength, required } from '@navikt/ft-form-validators';
import { useForm } from 'react-hook-form';
import styles from './arbeidOgInntekt.module.css';

const dummyData = [
  {
    status: 'Ingen avvik',
    arbeidsforhold: 'Bedrift AS',
    periode: `${new Date().toLocaleDateString('no')} - ${new Date().toLocaleDateString('no')}`,
    rapportertDeltager: '0 kr',
    rapportertInntekt: '0 kr',
  },
  {
    status: 'Avvik',
    arbeidsforhold: 'Bedrift 2 AS',
    periode: `${new Date().toLocaleDateString('no')} - ${new Date().toLocaleDateString('no')}`,
    rapportertDeltager: '0 kr',
    rapportertInntekt: '0 kr',
  },
];

type Formvalues = {
  inntektArbeid: string;
  inntektYtelse: string;
  inntektRadio: 'deltager' | 'a-inntekt' | 'fastsett-belop' | '';
  begrunnelse: string;
};

interface ArbeidOgInntektProps {
  submitCallback: (data: unknown) => void;
}

export const ArbeidOgInntekt = ({ submitCallback }: ArbeidOgInntektProps) => {
  const formMethods = useForm<Formvalues>({
    defaultValues: {
      inntektArbeid: '',
      inntektYtelse: '',
      inntektRadio: '',
      begrunnelse: '',
    },
  });
  const inntektRadio = formMethods.watch('inntektRadio');

  const onSubmit = (values: Formvalues) => {
    let payload;
    if (values.inntektRadio === 'fastsett-belop') {
      payload = {
        inntektArbeid: values.inntektArbeid,
        inntektYtelse: values.inntektYtelse,
        begrunnelse: values.begrunnelse,
      };
    } else {
      payload = {
        inntektRadio: values.inntektRadio,
        begrunnelse: values.begrunnelse,
      };
    }
    submitCallback(payload);
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
                { value: 'deltager', label: 'Rapportert inntekt fra deltager' },
                { value: 'a-inntekt', label: 'Rapportert inntekt fra A-inntekt' },
                { value: 'fastsett-belop', label: 'Fastsett beløp' },
              ]}
            />
            {inntektRadio === 'fastsett-belop' && (
              <VStack gap="4">
                <InputField
                  name="inntektArbeid"
                  label="Inntekt fra arbeid"
                  type="text"
                  validate={[required]}
                  htmlSize={7}
                  size="small"
                />
                <InputField
                  name="inntektYtelse"
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
                Status
              </Table.HeaderCell>
              <Table.HeaderCell scope="col">Arbeidsforhold</Table.HeaderCell>
              <Table.HeaderCell scope="col">Periode</Table.HeaderCell>
              <Table.HeaderCell scope="col" align="right">
                Rapportert av deltager
              </Table.HeaderCell>
              <Table.HeaderCell scope="col" align="right">
                Rapportert i A-inntekt
              </Table.HeaderCell>
              <Table.HeaderCell />
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {dummyData.map((data, index) => {
              const isLastRow = index === dummyData.length - 1;
              const hasAvvik = data.status === 'Avvik';
              return (
                <Table.ExpandableRow
                  key={index}
                  content={hasAvvik ? getAksjonspunkt() : null}
                  togglePlacement="right"
                  className={isLastRow ? styles.lastRow : ''}
                  expandOnRowClick
                  expansionDisabled={!hasAvvik}
                >
                  <Table.DataCell className={styles.firstDataCell}>
                    <HStack gap="2">
                      {hasAvvik ? (
                        <ExclamationmarkTriangleFillIcon fontSize="1.5rem" className={styles.exclamationmarkIcon} />
                      ) : (
                        <CheckmarkCircleFillIcon fontSize={24} className={styles.checkmarkIcon} />
                      )}
                      {data.status}
                    </HStack>
                  </Table.DataCell>
                  <Table.DataCell>{data.arbeidsforhold}</Table.DataCell>
                  <Table.DataCell>{data.periode}</Table.DataCell>
                  <Table.DataCell align="right">{data.rapportertDeltager}</Table.DataCell>
                  <Table.DataCell align="right">{data.rapportertInntekt}</Table.DataCell>
                </Table.ExpandableRow>
              );
            })}
          </Table.Body>
        </Table>
      </Box>
    </Form>
  );
};
