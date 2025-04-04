import {
  KontrollerInntektPeriodeDtoStatus,
  KontrollerInntektPeriodeDtoValg,
  type AksjonspunktDto,
  type KontrollerInntektDto,
  type RapportertInntektDto,
} from '@k9-sak-web/backend/ungsak/generated';
import { aksjonspunktCodes } from '@k9-sak-web/backend/ungsak/kodeverk/AksjonspunktCodes.js';
import { getPathToAinntekt } from '@k9-sak-web/lib/paths/paths.js';
import {
  CheckmarkCircleFillIcon,
  ExclamationmarkTriangleFillIcon,
  ExternalLinkIcon,
  PersonFillIcon,
} from '@navikt/aksel-icons';
import {
  Bleed,
  BodyLong,
  BodyShort,
  Box,
  Button,
  Heading,
  HGrid,
  HStack,
  Label,
  Table,
  VStack,
} from '@navikt/ds-react';
import { Form, InputField, RadioGroupPanel, TextAreaField } from '@navikt/ft-form-hooks';
import { maxLength, maxValue, minLength, minValue, required } from '@navikt/ft-form-validators';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation } from 'react-router';
import PeriodLabel from '../../shared/periodLabel/PeriodLabel';
import { formatCurrencyWithKr } from '../../utils/formatters';
import styles from './arbeidOgInntekt.module.css';

const Inntekt = ({
  title,
  details,
  sumLabel,
  sumValue,
}: {
  title: string;
  details: { label: string; value: string }[];
  sumLabel: string;
  sumValue: string;
}) => (
  <VStack gap="3">
    <Heading size="xsmall" level="3">
      {title}
    </Heading>
    {details.map((detail, index) => (
      <HStack justify="space-between" key={index}>
        <BodyShort size="small">{detail.label}</BodyShort>
        <BodyShort size="small" weight="semibold">
          {detail.value}
        </BodyShort>
      </HStack>
    ))}
    <Box borderColor="border-default" borderWidth="0 0 1 0" />
    <HStack justify="space-between" align="center">
      <BodyShort size="small" className={styles.sumLabel} weight="semibold">
        {sumLabel}
      </BodyShort>
      <div className={styles.sum}>
        <BodyShort size="small">{sumValue}</BodyShort>
      </div>
    </HStack>
  </VStack>
);

interface DetaljerOmInntektProps {
  location: {
    pathname: string;
  };
}

const DetaljerOmInntekt = ({ location }: DetaljerOmInntektProps) => (
  <VStack gap="8">
    <Bleed marginBlock="0 2" asChild>
      <HStack justify="space-between" align="baseline">
        <Heading size="small" level="2">
          Detaljer om rapportert inntekt
        </Heading>
        <Button
          as="a"
          variant="secondary"
          size="small"
          icon={<ExternalLinkIcon fontSize="1.5rem" />}
          iconPosition="right"
          href={getPathToAinntekt(location.pathname)}
          target="_blank"
        >
          Åpne A-inntekt
        </Button>
      </HStack>
    </Bleed>
    <HGrid gap="9" columns={2}>
      <Inntekt
        title="Inntekt rapport av deltager"
        details={[
          { label: 'Samlet arbeidsinntekt', value: formatCurrencyWithKr(9999) },
          { label: 'Ytelse', value: formatCurrencyWithKr(9999) },
        ]}
        sumLabel="Sum inntekt fra deltager"
        sumValue={formatCurrencyWithKr(9999)}
      />
      <Inntekt
        title="Inntekt rapportert i A-inntekt"
        details={[
          { label: 'Bedrift 1', value: formatCurrencyWithKr(9999) },
          { label: 'Bedrift 2', value: formatCurrencyWithKr(9999) },
          { label: 'Ytelse 123', value: formatCurrencyWithKr(9999) },
        ]}
        sumLabel="Sum inntekt fra A-inntekt"
        sumValue={formatCurrencyWithKr(9999)}
      />
    </HGrid>
  </VStack>
);

const formaterInntekt = (inntekt: RapportertInntektDto) => {
  if (!inntekt || (!inntekt.arbeidsinntekt && !inntekt.ytelse)) {
    return '';
  }
  return formatCurrencyWithKr((inntekt.arbeidsinntekt ?? 0) + (inntekt.ytelse ?? 0));
};

const formaterStatus = (status?: KontrollerInntektPeriodeDtoStatus) => {
  if (status === KontrollerInntektPeriodeDtoStatus.AVVIK) {
    return 'Avvik';
  }
  return 'Ingen avvik';
};

const buildInitialValues = (
  inntektKontrollperioder: KontrollerInntektDto['kontrollperioder'],
  aksjonspunkt: AksjonspunktDto | undefined,
) => {
  const vurdertPeriode = inntektKontrollperioder?.find(
    periode => periode.erTilVurdering && periode.status === KontrollerInntektPeriodeDtoStatus.AVVIK && periode.valg,
  );
  if (vurdertPeriode) {
    return {
      fastsattArbeidsinntekt: vurdertPeriode.fastsattArbeidsinntekt ? `${vurdertPeriode.fastsattArbeidsinntekt}` : '',
      fastsattYtelse: vurdertPeriode.fastsattYtelse ? `${vurdertPeriode.fastsattYtelse}` : '',
      valg: (vurdertPeriode.valg as KontrollerInntektPeriodeDtoValg) ?? '',
      begrunnelse: aksjonspunkt?.begrunnelse ?? '',
    };
  }
  return {
    fastsattArbeidsinntekt: '',
    fastsattYtelse: '',
    valg: '' as const,
    begrunnelse: '',
  };
};

type Formvalues = {
  fastsattArbeidsinntekt: string;
  fastsattYtelse: string;
  valg: KontrollerInntektPeriodeDtoValg | '';
  begrunnelse: string;
};

interface ArbeidOgInntektProps {
  submitCallback: (data: unknown) => Promise<any>;
  inntektKontrollperioder: KontrollerInntektDto['kontrollperioder'];
  aksjonspunkt: AksjonspunktDto | undefined;
}

export const ArbeidOgInntekt = ({ submitCallback, inntektKontrollperioder, aksjonspunkt }: ArbeidOgInntektProps) => {
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formMethods = useForm<Formvalues>({
    defaultValues: buildInitialValues(inntektKontrollperioder, aksjonspunkt),
  });
  const valg = formMethods.watch('valg');

  const onSubmit = async (values: Formvalues) => {
    const periodeTilVurdering = inntektKontrollperioder?.find(periode => periode.erTilVurdering);
    setIsSubmitting(true);
    try {
      await submitCallback([
        {
          kode: aksjonspunktCodes.KONTROLLER_INNTEKT,
          begrunnelse: values.begrunnelse,
          perioder: [
            {
              periode: periodeTilVurdering?.periode,
              inntekt:
                values.valg === KontrollerInntektPeriodeDtoValg.MANUELT_FASTSATT
                  ? {
                      fastsattArbeidsinntekt: values.fastsattArbeidsinntekt,
                      fastsattYtelse: values.fastsattYtelse,
                    }
                  : null,
              valg: values.valg,
            },
          ],
        },
      ]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const Aksjonspunkt = ({ harBrukerrapportertInntekt }: { harBrukerrapportertInntekt: boolean }) => (
    <Bleed marginBlock="4 0">
      <Box
        marginInline="2 0"
        padding="6"
        borderColor="border-warning"
        borderWidth="0 0 0 4"
        borderRadius="0 medium medium 0"
        style={{ background: '#F5F6F7' }} // TODO: Bytt til token var(--ax-bg-neutral-soft) når tilgjengelig (neste versjon av Aksel)
      >
        <VStack gap="8">
          <DetaljerOmInntekt location={location} />
          {/** TODO: Bytt til token var(--ax-bg-info-moderate-hover) når tilgjengelig (neste versjon av Aksel) */}
          <Box borderRadius="medium" padding="4" style={{ background: '#D7E6F0' }}>
            <HStack gap="2" wrap={false}>
              <PersonFillIcon title="Deltager" fontSize="1.5rem" className={styles.personIcon} />

              <VStack gap="2">
                <Heading size="xsmall" as="h3">
                  Beskrivelse fra deltaker for avvik i perioden xx.xx.xxxx - xx.xx.xxxx
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
          </Box>
          <VStack gap="6">
            <Box maxWidth="70ch">
              <TextAreaField
                name="begrunnelse"
                label="Vurder hvilken inntekt som skal gi reduksjon i perioden"
                validate={[required, minLength(3), maxLength(1500)]}
                maxLength={1500}
              />
            </Box>
            <VStack gap="2">
              <RadioGroupPanel
                name="valg"
                label="Hvilken inntekt skal benyttes?"
                validate={[required]}
                radios={[
                  ...(harBrukerrapportertInntekt
                    ? [
                        {
                          value: KontrollerInntektPeriodeDtoValg.BRUK_BRUKERS_INNTEKT,
                          label: 'Rapportert inntekt fra deltager',
                        },
                      ]
                    : []),
                  {
                    value: KontrollerInntektPeriodeDtoValg.BRUK_REGISTER_INNTEKT,
                    label: 'Rapportert inntekt fra A-inntekt',
                  },
                  { value: KontrollerInntektPeriodeDtoValg.MANUELT_FASTSATT, label: 'Fastsett beløp' },
                ]}
              />
              {valg === KontrollerInntektPeriodeDtoValg.MANUELT_FASTSATT && (
                <VStack gap="4">
                  <InputField
                    name="fastsattArbeidsinntekt"
                    label="Inntekt fra arbeid"
                    type="text"
                    validate={[required, minValue(0), maxValue(1000000)]}
                    htmlSize={7}
                    size="small"
                  />
                  <InputField
                    name="fastsattYtelse"
                    label="Inntekt fra ytelse"
                    type="text"
                    validate={[required, minValue(0), maxValue(1000000)]}
                    htmlSize={7}
                    size="small"
                  />
                </VStack>
              )}
            </VStack>
            <HStack gap="2">
              <Button size="small" variant="primary" type="submit" loading={isSubmitting}>
                Bekreft og fortsett
              </Button>
              <Button size="small" variant="secondary" loading={isSubmitting}>
                Avbryt
              </Button>
            </HStack>
          </VStack>
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
              const harAvvik = inntekt.status === KontrollerInntektPeriodeDtoStatus.AVVIK;
              const harAksjonspunkt = inntekt.erTilVurdering && harAvvik;
              const harBrukerrapportertInntekt = inntekt.rapporterteInntekter?.bruker?.arbeidsinntekt !== undefined;

              return (
                <Table.ExpandableRow
                  key={`${inntekt.periode?.fom}_${inntekt.periode?.tom}`}
                  content={
                    harAksjonspunkt ? (
                      <Aksjonspunkt harBrukerrapportertInntekt={harBrukerrapportertInntekt} />
                    ) : (
                      <Bleed marginBlock="4 0">
                        <Box marginInline="2 0" padding="6" background="bg-default">
                          <DetaljerOmInntekt location={location} />
                        </Box>
                      </Bleed>
                    )
                  }
                  togglePlacement="right"
                  className={isLastRow ? styles.lastRow : ''}
                  expandOnRowClick
                  defaultOpen={harAksjonspunkt}
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
