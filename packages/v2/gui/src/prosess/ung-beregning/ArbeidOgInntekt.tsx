import {
  KontrollerInntektPeriodeDtoStatus,
  KontrollerInntektPeriodeDtoValg,
  type KontrollerInntektPeriodeDto,
  type RapportertInntektDto,
} from '@k9-sak-web/backend/ungsak/generated';
import { aksjonspunktCodes } from '@k9-sak-web/backend/ungsak/kodeverk/AksjonspunktCodes.js';
import { CheckmarkCircleFillIcon, ExclamationmarkTriangleFillIcon } from '@navikt/aksel-icons';
import { Bleed, BodyShort, Box, HStack, Label, Table } from '@navikt/ds-react';
import { Form } from '@navikt/ft-form-hooks';
import { removeSpacesFromNumber } from '@navikt/ft-utils';
import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import PeriodLabel from '../../shared/periodLabel/PeriodLabel';
import { formatCurrencyWithKr } from '../../utils/formatters';
import { AksjonspunktArbeidOgInntekt } from './AksjonspunktArbeidOgInntekt';
import styles from './arbeidOgInntekt.module.css';
import { DetaljerOmInntekt } from './DetaljerOmInntekt';

const formaterInntekt = (inntekt: RapportertInntektDto) => {
  if (!inntekt || (!inntekt.arbeidsinntekt && !inntekt.ytelse)) {
    return '-';
  }
  return formatCurrencyWithKr((inntekt.arbeidsinntekt ?? 0) + (inntekt.ytelse ?? 0));
};

const formaterStatus = (status?: KontrollerInntektPeriodeDtoStatus) => {
  if (status === KontrollerInntektPeriodeDtoStatus.AVVIK) {
    return 'Avvik';
  }
  return 'Ingen avvik';
};

const buildInitialValues = (inntektKontrollperioder: Array<KontrollerInntektPeriodeDto>): Formvalues => {
  return {
    perioder:
      inntektKontrollperioder
        ?.filter(periode => periode.erTilVurdering)
        .map(periode => {
          return {
            fastsattInntekt: periode.fastsattInntekt != null ? `${periode.fastsattInntekt}` : '',
            valg: periode.valg ?? '',
            begrunnelse: periode.begrunnelse ?? '',
            periode: periode.periode,
          };
        }) || [],
  };
};

type Formvalues = {
  perioder: {
    fastsattInntekt: string;
    valg: KontrollerInntektPeriodeDtoValg | '';
    begrunnelse: string;
    periode: KontrollerInntektPeriodeDto['periode'];
  }[];
};

interface ArbeidOgInntektProps {
  submitCallback: (data: unknown) => Promise<any>;
  inntektKontrollperioder: Array<KontrollerInntektPeriodeDto>;
  isReadOnly: boolean;
}

export const ArbeidOgInntekt = ({ submitCallback, inntektKontrollperioder, isReadOnly }: ArbeidOgInntektProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formMethods = useForm<Formvalues>({
    defaultValues: buildInitialValues(inntektKontrollperioder),
  });

  const onSubmit = async (values: Formvalues) => {
    setIsSubmitting(true);
    try {
      await submitCallback([
        {
          kode: aksjonspunktCodes.KONTROLLER_INNTEKT,
          begrunnelse: values.perioder.map(periode => periode.begrunnelse).join(', '),
          perioder: values.perioder.map(periode => ({
            periode: periode.periode,
            fastsattInnntekt:
              periode.valg === KontrollerInntektPeriodeDtoValg.MANUELT_FASTSATT
                ? removeSpacesFromNumber(periode.fastsattInntekt)
                : undefined,
            valg: periode.valg,
            begrunnelse: periode.begrunnelse,
          })),
        },
      ]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const { fields } = useFieldArray({
    control: formMethods.control,
    name: 'perioder',
  });

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
            {fields?.map((field, index) => {
              const inntektKontrollPeriode = inntektKontrollperioder.find(
                i => i.periode?.fom === field.periode?.fom && i.periode?.tom === field.periode?.tom,
              );
              const isLastRow = index === fields.length - 1;
              const harAvvik = inntektKontrollPeriode?.status === KontrollerInntektPeriodeDtoStatus.AVVIK;
              const harAksjonspunkt = inntektKontrollPeriode?.erTilVurdering && harAvvik;
              const harBrukerrapportertInntekt =
                inntektKontrollPeriode?.rapporterteInntekter?.bruker?.arbeidsinntekt != undefined;

              return (
                <Table.ExpandableRow
                  key={field.id}
                  content={
                    harAksjonspunkt ? (
                      <AksjonspunktArbeidOgInntekt
                        harBrukerrapportertInntekt={harBrukerrapportertInntekt}
                        isSubmitting={isSubmitting}
                        isReadOnly={isReadOnly}
                        uttalelseFraBruker={inntektKontrollPeriode.uttalelseFraBruker}
                        periode={field.periode}
                        fieldIndex={index}
                      />
                    ) : (
                      <Bleed marginBlock="4 0">
                        <Box marginInline="2 0" padding="6" background="bg-default">
                          <DetaljerOmInntekt />
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
                      <BodyShort size="small">{formaterStatus(inntektKontrollPeriode?.status)}</BodyShort>
                    </HStack>
                  </Table.DataCell>
                  <Table.DataCell>
                    {inntektKontrollPeriode?.periode && (
                      <BodyShort size="small">
                        <PeriodLabel
                          dateStringFom={inntektKontrollPeriode?.periode?.fom}
                          dateStringTom={inntektKontrollPeriode?.periode?.tom}
                        />
                      </BodyShort>
                    )}
                  </Table.DataCell>
                  <Table.DataCell align="right">
                    <BodyShort size="small">
                      {inntektKontrollPeriode?.rapporterteInntekter?.bruker &&
                        formaterInntekt(inntektKontrollPeriode.rapporterteInntekter?.bruker)}
                    </BodyShort>
                  </Table.DataCell>
                  <Table.DataCell align="right">
                    <BodyShort size="small">
                      {inntektKontrollPeriode?.rapporterteInntekter?.register?.oppsummertRegister &&
                        formaterInntekt(inntektKontrollPeriode.rapporterteInntekter.register.oppsummertRegister)}
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
