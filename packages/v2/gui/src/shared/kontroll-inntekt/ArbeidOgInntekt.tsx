import { aksjonspunktCodes } from '@k9-sak-web/backend/ungsak/kodeverk/AksjonspunktCodes.js';
import type { ArbeidsgiverOversiktDto } from '@k9-sak-web/backend/ungsak/kontrakt/arbeidsforhold/ArbeidsgiverOversiktDto.js';
import { BrukKontrollertInntektValg } from '@k9-sak-web/backend/ungsak/kontrakt/kontroll/BrukKontrollertInntektValg.js';
import type { KontrollerInntektPeriodeDto } from '@k9-sak-web/backend/ungsak/kontrakt/kontroll/KontrollerInntektPeriodeDto.js';
import { PeriodeStatus } from '@k9-sak-web/backend/ungsak/kontrakt/kontroll/PeriodeStatus.js';
import type { RapportertInntektDto } from '@k9-sak-web/backend/ungsak/kontrakt/kontroll/RapportertInntektDto.js';
import { CheckmarkCircleFillIcon, ExclamationmarkTriangleFillIcon } from '@navikt/aksel-icons';
import { Bleed, BodyShort, Box, HStack, Label, Table } from '@navikt/ds-react';
import { RhfForm } from '@navikt/ft-form-hooks';
import { parseCurrencyInput, removeSpacesFromNumber } from '@navikt/ft-utils';
import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { formatCurrencyWithKr } from '../../utils/formatters';
import PeriodLabel from '../periodLabel/PeriodLabel';
import { AksjonspunktArbeidOgInntekt } from './AksjonspunktArbeidOgInntekt';
import styles from './arbeidOgInntekt.module.css';
import { DetaljerOmInntekt } from './DetaljerOmInntekt';
import type { KontrollerInntektAksjonspunktSubmit } from './KontrollerInntektAksjonspunktSubmit';

const formaterInntekt = (inntekt: RapportertInntektDto) => {
  if (!inntekt || (inntekt.arbeidsinntekt === undefined && inntekt.ytelse === undefined)) {
    return '-';
  }
  return formatCurrencyWithKr((inntekt.arbeidsinntekt ?? 0) + (inntekt.ytelse ?? 0));
};

const formaterStatus = (status?: PeriodeStatus) => {
  if (status === PeriodeStatus.AVVIK) {
    return 'Avvik';
  }
  return 'Ingen avvik';
};

const buildInitialValues = (inntektKontrollperioder: Array<KontrollerInntektPeriodeDto>): Formvalues => {
  return {
    perioder:
      inntektKontrollperioder.map(periode => {
        return {
          fastsattInntekt: periode.fastsattInntekt != null ? `${parseCurrencyInput(periode.fastsattInntekt)}` : '',
          valg: periode.valg ?? '',
          begrunnelse: periode.begrunnelse ?? '',
          periode: periode.periode,
          harAvvik: periode.status === PeriodeStatus.AVVIK,
          erTilVurdering: !!periode.erTilVurdering,
        };
      }) || [],
  };
};

type Formvalues = {
  perioder: {
    fastsattInntekt: string;
    valg: BrukKontrollertInntektValg | '';
    begrunnelse: string;
    periode: KontrollerInntektPeriodeDto['periode'];
    harAvvik: boolean;
    erTilVurdering: boolean;
  }[];
};

interface ArbeidOgInntektProps {
  submitCallback: (data: KontrollerInntektAksjonspunktSubmit[]) => Promise<any>;
  inntektKontrollperioder: Array<KontrollerInntektPeriodeDto>;
  isReadOnly: boolean;
  arbeidsgivere: ArbeidsgiverOversiktDto | undefined;
}

export const ArbeidOgInntekt = ({
  submitCallback,
  inntektKontrollperioder,
  isReadOnly,
  arbeidsgivere,
}: ArbeidOgInntektProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formMethods = useForm<Formvalues>({
    defaultValues: buildInitialValues(inntektKontrollperioder),
  });

  const onSubmit = async (values: Formvalues) => {
    setIsSubmitting(true);
    const perioderMedAvvik = values.perioder.filter(
      (
        periode,
      ): periode is typeof periode & {
        periode: NonNullable<typeof periode.periode>;
        valg: BrukKontrollertInntektValg;
      } => periode.harAvvik && periode.erTilVurdering && periode.periode != null && periode.valg !== '',
    );
    try {
      await submitCallback([
        {
          kode: aksjonspunktCodes.KONTROLLER_INNTEKT,
          begrunnelse: perioderMedAvvik.map(periode => periode.begrunnelse).join(', '),
          perioder: perioderMedAvvik.map(periode => ({
            periode: periode.periode,
            fastsattInnntekt:
              periode.valg === BrukKontrollertInntektValg.MANUELT_FASTSATT
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
    <RhfForm<Formvalues> formMethods={formMethods} onSubmit={onSubmit}>
      <Box marginBlock="space-28 space-0" borderRadius="8" borderWidth="1" borderColor="neutral-subtle">
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
                <Label size="small">Rapportert av deltaker</Label>
              </Table.HeaderCell>
              <Table.HeaderCell scope="col" align="right">
                <Label size="small">Rapportert i A-ordningen</Label>
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
              const harAvvik = inntektKontrollPeriode?.status === PeriodeStatus.AVVIK;
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
                        periode={field.periode}
                        fieldIndex={index}
                        inntektKontrollPeriode={inntektKontrollPeriode}
                        arbeidsgivere={arbeidsgivere}
                      />
                    ) : (
                      <Bleed marginBlock="space-16 space-0">
                        <Box marginInline="space-8 space-0" padding="space-24">
                          <DetaljerOmInntekt
                            inntektKontrollPeriode={inntektKontrollPeriode}
                            arbeidsgivere={arbeidsgivere}
                          />
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
                    <HStack gap="space-8" align="center">
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
    </RhfForm>
  );
};
