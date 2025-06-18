import React from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { BodyShort, Box, Table, Tag, VStack } from '@navikt/ds-react';

import { VurdertAv } from '@k9-sak-web/gui/shared/vurdert-av/VurdertAv.js';
import { TextAreaField } from '@navikt/ft-form-hooks';
import { required } from '@navikt/ft-form-validators';
import { BeløpLabel, EditedIcon, PeriodLabel } from '@navikt/ft-ui-komponenter';

import { type TilkommetAktivitetFormValues } from '../../types/FordelBeregningsgrunnlagPanelValues';
import { SubmitButton } from '../felles/SubmitButton';
import { getAktivitetNavnFraInnteksforhold } from './TilkommetAktivitetUtils';
import { TilkommetInntektsforholdField } from './TilkommetInntektsforholdField';

import type { ArbeidsgiverOpplysningerPerId } from '../../types/ArbeidsgiverOpplysninger';
import type { BeregningAvklaringsbehov } from '../../types/BeregningAvklaringsbehov';
import type { VurderInntektsforholdPeriode } from '../../types/BeregningsgrunnlagFordeling';
import styles from './tilkommetAktivitet.module.css';

type Props = {
  formName: string;
  vurderInntektsforholdPeriode: VurderInntektsforholdPeriode;
  formFieldIndex: number;
  periodeFieldIndex: number;
  readOnly: boolean;
  submittable: boolean;
  arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId;
  erAksjonspunktÅpent: boolean;
  skalViseBegrunnelse: boolean;
  avklaringsbehov?: BeregningAvklaringsbehov;
};

const erDefinert = (tall?: number) => !!tall && +tall > 0;

export function getPeriodeIdentikator(vurderInntektsforholdPeriode: VurderInntektsforholdPeriode) {
  return `${vurderInntektsforholdPeriode.fom}_${vurderInntektsforholdPeriode.tom}`;
}

export const TilkommetAktivitetField = ({
  formName,
  vurderInntektsforholdPeriode,
  formFieldIndex,
  periodeFieldIndex,
  readOnly,
  erAksjonspunktÅpent,
  submittable,
  arbeidsgiverOpplysningerPerId,
  skalViseBegrunnelse,
  avklaringsbehov,
}: Props) => {
  const { control, formState } = useFormContext<TilkommetAktivitetFormValues>();
  const { fields } = useFieldArray({
    control,
    name: `VURDER_TILKOMMET_AKTIVITET_FORM.${formFieldIndex}.perioder.${periodeFieldIndex}.inntektsforhold`,
  });

  const harInntektsforholdMedÅrsinntekt = vurderInntektsforholdPeriode.inntektsforholdListe.some(
    inntektsforhold =>
      erDefinert(inntektsforhold.bruttoInntektPrÅr) || erDefinert(inntektsforhold.inntektFraInntektsmeldingPrÅr),
  );
  const harInntektsforholdMedPeriode = vurderInntektsforholdPeriode.inntektsforholdListe.some(
    inntektsforhold => !!inntektsforhold.periode,
  );

  const headerTexts = [
    'Aktivitet',
    harInntektsforholdMedÅrsinntekt ? 'Årsinntekt' : ' ',
    harInntektsforholdMedPeriode ? 'Inntektsperiode' : ' ',
  ];

  const getInntektsforholdTableRows = (inntektsforholdPeriode: VurderInntektsforholdPeriode): React.ReactElement[] => {
    const tableRows: React.ReactElement[] = [];
    const { inntektsforholdListe } = inntektsforholdPeriode;
    inntektsforholdListe.forEach(inntektsforhold => {
      const harBruttoInntekt = erDefinert(inntektsforhold.bruttoInntektPrÅr);
      const harInntektsmelding = erDefinert(inntektsforhold.inntektFraInntektsmeldingPrÅr);

      tableRows.push(
        <Table.Row key={inntektsforhold.arbeidsgiverId || inntektsforhold.aktivitetStatus}>
          <Table.DataCell>
            <BodyShort size="small">
              {getAktivitetNavnFraInnteksforhold(inntektsforhold, arbeidsgiverOpplysningerPerId)}
            </BodyShort>
          </Table.DataCell>
          {(harBruttoInntekt || harInntektsmelding || harInntektsforholdMedPeriode) && (
            <Table.DataCell className={styles.inntektColumn}>
              <BodyShort size="small">
                {harBruttoInntekt && !harInntektsmelding && (
                  <>
                    <BeløpLabel beløp={inntektsforhold.bruttoInntektPrÅr ?? 0} kr />
                    <EditedIcon />
                  </>
                )}
                {harInntektsmelding && (
                  <>
                    <BeløpLabel beløp={inntektsforhold.inntektFraInntektsmeldingPrÅr ?? 0} kr />
                    <Tag className={styles.inntektsmeldingTag} variant="neutral" size="xsmall">
                      IM
                    </Tag>
                  </>
                )}
              </BodyShort>
            </Table.DataCell>
          )}
          {inntektsforhold.periode && (
            <Table.DataCell>
              <BodyShort size="small">
                <PeriodLabel dateStringFom={inntektsforhold.periode.fom} dateStringTom={inntektsforhold.periode.tom} />
              </BodyShort>
            </Table.DataCell>
          )}
        </Table.Row>,
      );
    });
    return tableRows;
  };
  return (
    <VStack gap="4">
      <div className={styles.aktivitetContainer}>
        <Table size="small" className={styles.aktivitetTable}>
          <Table.Header>
            <Table.Row>
              {headerTexts.map(text => (
                <Table.HeaderCell scope="col" key={text}>
                  {text}
                </Table.HeaderCell>
              ))}
            </Table.Row>
          </Table.Header>
          <Table.Body>{getInntektsforholdTableRows(vurderInntektsforholdPeriode)}</Table.Body>
        </Table>
      </div>
      <div className={erAksjonspunktÅpent ? styles.aksjonspunktContainer : ''}>
        {fields.map((field, index) => (
          <div key={field.id}>
            <Box marginBlock={index < vurderInntektsforholdPeriode.inntektsforholdListe.length - 1 ? '0 10' : '0'}>
              <TilkommetInntektsforholdField
                key={field.id}
                formName={formName}
                formFieldIndex={formFieldIndex}
                periodeFieldIndex={periodeFieldIndex}
                inntektsforholdFieldIndex={index}
                field={field}
                readOnly={readOnly}
                arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
              />
            </Box>
          </div>
        ))}
        {skalViseBegrunnelse && (
          <>
            <VStack gap="4">
              <Box marginBlock="10 0">
                <TextAreaField
                  name={`${formName}.${formFieldIndex}.begrunnelse`}
                  label="Begrunnelse"
                  readOnly={readOnly}
                  validate={[required]}
                />
              </Box>
              <VurdertAv ident={avklaringsbehov?.vurdertAv} date={avklaringsbehov?.vurdertTidspunkt} />
              <div>
                <SubmitButton
                  isSubmittable={submittable}
                  isReadOnly={readOnly}
                  isSubmitting={formState.isSubmitting}
                  isDirty={formState.isDirty}
                />
              </div>
            </VStack>
          </>
        )}
      </div>
    </VStack>
  );
};
