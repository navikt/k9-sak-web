import {
  KontrollerInntektPeriodeDtoStatus,
  KontrollerInntektPeriodeDtoValg,
  type AksjonspunktDto,
  type KontrollerInntektDto,
  type RapportertInntektDto,
} from '@k9-sak-web/backend/ungsak/generated';
import { aksjonspunktCodes } from '@k9-sak-web/backend/ungsak/kodeverk/AksjonspunktCodes.js';
import { CheckmarkCircleFillIcon, ExclamationmarkTriangleFillIcon } from '@navikt/aksel-icons';
import { Bleed, BodyShort, Box, HStack, Label, Table } from '@navikt/ds-react';
import { Form } from '@navikt/ft-form-hooks';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import PeriodLabel from '../../shared/periodLabel/PeriodLabel';
import { formatCurrencyWithKr } from '../../utils/formatters';
import { AksjonspunktArbeidOgInntekt } from './AksjonspunktArbeidOgInntekt';
import styles from './arbeidOgInntekt.module.css';
import { DetaljerOmInntekt } from './DetaljerOmInntekt';

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formMethods = useForm<Formvalues>({
    defaultValues: buildInitialValues(inntektKontrollperioder, aksjonspunkt),
  });

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
              const harBrukerrapportertInntekt = inntekt.rapporterteInntekter?.bruker?.arbeidsinntekt != undefined;

              return (
                <Table.ExpandableRow
                  key={`${inntekt.periode?.fom}_${inntekt.periode?.tom}`}
                  content={
                    harAksjonspunkt ? (
                      <AksjonspunktArbeidOgInntekt
                        harBrukerrapportertInntekt={harBrukerrapportertInntekt}
                        isSubmitting={isSubmitting}
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
