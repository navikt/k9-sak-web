import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import { AksjonspunktHelpTextTemp, BorderBox, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { Aksjonspunkt, ArbeidsgiverOpplysningerPerId } from '@k9-sak-web/types';
import { Alert, Button, Table, Tag, Textarea } from '@navikt/ds-react';
import { Field, FieldArray, Form, Formik } from 'formik';
import React from 'react';
import { FormattedMessage, WrappedComponentProps, injectIntl } from 'react-intl';
import * as Yup from 'yup';
import { OverstyrInputBeregningDto } from '../types/OverstyrInputBeregningDto';
import { OverstyrInputForBeregningDto } from '../types/OverstyrInputForBeregningDto';
import OverstyrBeregningAktivitetForm from './OverstyrBeregningAktivitetForm';
import styles from './OverstyrBeregningFaktaForm.module.css';
import { formaterDatoString } from './utils';

interface Props {
  arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId;
  overstyrInputBeregning: OverstyrInputBeregningDto | OverstyrInputBeregningDto[];
  submitCallback: (SubmitCallback) => void;
  readOnly: boolean;
  submittable: boolean;
  aksjonspunkter: Aksjonspunkt[];
}

/**
 * OverstyrBeregningFaktaIndex
 */
const OverstyrBeregningFaktaForm = ({
  overstyrInputBeregning,
  arbeidsgiverOpplysningerPerId,
  submitCallback,
  readOnly,
  submittable,
  aksjonspunkter,
  intl,
}: Props & WrappedComponentProps) => {
  const validationSchema = Yup.object().shape({
    kode: Yup.string().required(),
    begrunnelse: Yup.string().required(intl.formatMessage({ id: 'OverstyrInputForm.BegrunnelseErPåkrevd' })),
    /*
     * Midlertidig deaktivere validering for dette for å teste valideringsfeil i prod
     */
    perioder: Yup.array().of(Yup.object()),
    // perioder: Yup.array().of(periodeSchema),
  });

  /**
   * @param firmaIdent Kan være enten orgnr eller aktørId
   * @returns utledet firmanavn fra arbeidsgiverOpplysningerPerId
   */
  const utledFirmaNavn = (firmaIdent: string) => {
    const firma = Object.values(arbeidsgiverOpplysningerPerId).find(
      arbeidsgiver => arbeidsgiver.identifikator === firmaIdent,
    );
    return firma
      ? `${firma.navn} (${firma.identifikator})`
      : intl.formatMessage({ id: 'OverstyrInputForm.UkjentFirma' });
  };

  const utledBegrunnelse = () =>
    aksjonspunkter.find(ap => ap.definisjon.kode === aksjonspunktCodes.OVERSTYR_BEREGNING_INPUT).begrunnelse || '';

  const erAksjonspunktÅpent = () =>
    isAksjonspunktOpen(
      aksjonspunkter.find(ap => ap.definisjon.kode === aksjonspunktCodes.OVERSTYR_BEREGNING_INPUT).status.kode,
    );

  const headerTextCodes = [
    'OverstyrInputForm.FirmaHeader',
    'OverstyrInputForm.InntektPrAar',
    'OverstyrInputForm.RefusjonPrAar',
    'OverstyrInputForm.StartdatoRefusjon',
    'OverstyrInputForm.OpphorRefusjon',
  ];

  /**
   * Formik liker ikke null i value feltene, null verdier kan forekomme fra backend.
   * "Oversetter" null verdier i skjemafeltene til en tom streng
   */
  const behandleOverstyrInputBeregning = (input: OverstyrInputBeregningDto[]): OverstyrInputBeregningDto[] =>
    input.map(periode => ({
      ...periode,
      aktivitetliste: periode.aktivitetliste.map(aktivitet => ({
        ...aktivitet,
        inntektPrAar: aktivitet.inntektPrAar || '',
        refusjonPrAar: aktivitet.refusjonPrAar || '',
        startdatoRefusjon: aktivitet.startdatoRefusjon || '',
        opphørRefusjon: aktivitet.opphørRefusjon || '',
        skalKunneEndreRefusjon: aktivitet.skalKunneEndreRefusjon !== false,
      })), // end of periode.aktivitetliste.map((aktivitet) => {})
    })); // end of periode objekt // end of input.map((periode) => {})

  const initialValues: OverstyrInputForBeregningDto = {
    kode: aksjonspunktCodes.OVERSTYR_BEREGNING_INPUT,
    begrunnelse: utledBegrunnelse(),
    perioder: behandleOverstyrInputBeregning(
      Array.isArray(overstyrInputBeregning) ? overstyrInputBeregning : [overstyrInputBeregning],
    ),
  };

  return (
    <div className={styles.container}>
      <VerticalSpacer thirtyTwoPx />
      <AksjonspunktHelpTextTemp isAksjonspunktOpen={erAksjonspunktÅpent()}>
        {[<FormattedMessage id="OverstyrInputForm.Aksjonspunkt" key="aksjonspunktText" />]}
      </AksjonspunktHelpTextTemp>
      <Formik
        initialValues={initialValues}
        onSubmit={values => {
          if (!readOnly && submittable) submitCallback([values]);
        }}
        validationSchema={validationSchema}
        validateOnBlur
        validateOnChange
        validateOnMount
      >
        {({ values, isValid, isSubmitting }) => (
          <Form>
            <FieldArray name="perioder">
              {() => (
                <>
                  {values.perioder.map((periode, periodeIndex) => {
                    const { skjaeringstidspunkt, aktivitetliste, harKategoriNæring, harKategoriFrilans } = periode;
                    return (
                      <div key={skjaeringstidspunkt}>
                        <BorderBox>
                          <Tag variant="info" className="skjaeringstidspunkt">
                            Skjæringstidspunkt: {formaterDatoString(skjaeringstidspunkt)}
                          </Tag>
                          {harKategoriNæring && (
                            <div>
                              <VerticalSpacer twentyPx />
                              <Tag variant="warning">
                                <FormattedMessage id="OverstyrInputForm.HarKategoriNæring" />
                              </Tag>
                            </div>
                          )}
                          {harKategoriFrilans && (
                            <div>
                              <VerticalSpacer twentyPx />
                              <Tag variant="warning">
                                <FormattedMessage id="OverstyrInputForm.HarKategoriFrilans" />
                              </Tag>
                            </div>
                          )}
                          <VerticalSpacer twentyPx />
                          {aktivitetliste.length > 0 && (
                            <FieldArray name={`perioder[${periodeIndex}].aktivitetliste`}>
                              {() => (
                                <Table zebraStripes>
                                  <Table.Header>
                                    <Table.Row shadeOnHover={false}>
                                      {headerTextCodes.map(text => (
                                        <Table.HeaderCell scope="col" key={text}>
                                          <FormattedMessage id={text} />
                                        </Table.HeaderCell>
                                      ))}
                                    </Table.Row>
                                  </Table.Header>
                                  <Table.Body>
                                    {aktivitetliste.map((aktivitet, aktivitetIndex) => {
                                      const { arbeidsgiverAktørId, arbeidsgiverOrgnr, skalKunneEndreRefusjon } =
                                        aktivitet;
                                      const firmaNavn = utledFirmaNavn(arbeidsgiverAktørId || arbeidsgiverOrgnr);
                                      return (
                                        <OverstyrBeregningAktivitetForm
                                          key={firmaNavn}
                                          periodeIndex={periodeIndex}
                                          aktivitetIndex={aktivitetIndex}
                                          firmaNavn={firmaNavn}
                                          skalKunneEndreRefusjon={skalKunneEndreRefusjon !== false}
                                          readOnly={readOnly}
                                        />
                                      );
                                    })}
                                  </Table.Body>
                                </Table>
                              )}
                            </FieldArray>
                          )}
                        </BorderBox>
                      </div>
                    );
                  })}
                </>
              )}
            </FieldArray>
            <VerticalSpacer sixteenPx />
            <Field name="begrunnelse">
              {({ field, meta }) => (
                <Textarea
                  id="begrunnelse"
                  label="Begrunnelse"
                  placeholder={intl.formatMessage({ id: 'OverstyrInputForm.Begrunnelse' })}
                  feil={meta.touched && meta.error ? meta.error : false}
                  value={field.value}
                  disabled={readOnly}
                  size="small"
                  {...field}
                />
              )}
            </Field>
            {(readOnly || !submittable) && (
              <>
                <VerticalSpacer sixteenPx />
                <Alert size="small" variant="warning">
                  <FormattedMessage id="OverstyrInputForm.KanIkkeBekreftes" />
                </Alert>
              </>
            )}
            <VerticalSpacer sixteenPx />
            <div className={styles.buttonBar}>
              <Button
                className={styles.button}
                loading={isSubmitting}
                disabled={readOnly || !submittable || !isValid}
                variant="primary"
                type="submit"
              >
                <FormattedMessage id="OverstyrInputForm.LagreAksjonspunkt" />
              </Button>
              <Button className={styles.button} disabled={isValid} variant="tertiary" type="submit">
                <FormattedMessage id="OverstyrInputForm.KontrollerSkjema" />
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default injectIntl(OverstyrBeregningFaktaForm);
