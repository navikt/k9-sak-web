import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import { AksjonspunktHelpText, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { Aksjonspunkt } from '@k9-sak-web/types';
import { Alert, BodyShort, Button, Textarea } from '@navikt/ds-react';
import { Field, Form, Formik } from 'formik';
import React from 'react';
import * as Yup from 'yup';
import styles from './ManglerSøknadForm.module.css';

interface Props {
  submitCallback: (SubmitCallback) => void;
  readOnly: boolean;
  submittable: boolean;
  aksjonspunkter: Aksjonspunkt[];
}

export type BehandlingIdDto = {
  id: string;
};

export type ManglerSøknadDto = {
  begrunnelse: string;
};

/**
 * ManglerSøknadForm
 */
const ManglerSøknadForm = ({
  submitCallback,
  readOnly,
  submittable,
  aksjonspunkter,
  intl,
}: Props & WrappedComponentProps) => {
  const validationSchema = Yup.object().shape({
    begrunnelse: Yup.string().required("Begrunnelse er påkrevd."),
  });

  const utledBegrunnelse = () =>
    aksjonspunkter.find(
      ap =>
        ap.definisjon.kode === aksjonspunktCodes.MANGLER_KOMPLETT_SØKNAD ||
        ap.definisjon.kode === aksjonspunktCodes.MANGLER_KOMPLETT_SØKNAD_ANNEN_PART,
    ).begrunnelse || '';

  const erAksjonspunktÅpent = () =>
    isAksjonspunktOpen(
      aksjonspunkter.find(
        ap =>
          ap.definisjon.kode === aksjonspunktCodes.MANGLER_KOMPLETT_SØKNAD ||
          ap.definisjon.kode === aksjonspunktCodes.MANGLER_KOMPLETT_SØKNAD_ANNEN_PART,
      ).status.kode,
    );

  const manglerSøknadForPeriode = () =>
    aksjonspunkter.some(ap => ap.definisjon.kode === aksjonspunktCodes.MANGLER_KOMPLETT_SØKNAD);
  const manglerSøknadAnnenPart = () =>
    aksjonspunkter.some(ap => ap.definisjon.kode === aksjonspunktCodes.MANGLER_KOMPLETT_SØKNAD_ANNEN_PART);

  const initialValues: ManglerSøknadDto = {
    begrunnelse: utledBegrunnelse(),
  };

  return (
    <div className={styles.container}>
      <VerticalSpacer thirtyTwoPx />
      <AksjonspunktHelpText isAksjonspunktOpen={erAksjonspunktÅpent()}>
        Vurder om søker er berettiget til direkte overgang fra pleiepenger til opplæringspenger
      </AksjonspunktHelpText>
      <VerticalSpacer thirtyTwoPx />
      {manglerSøknadForPeriode() && (
        <Alert size="small" variant="warning">
          {' '}
          Det mangler komplett søknad for perioden det er søkt om direkte overgang til{' '}
        </Alert>
      )}
      <VerticalSpacer thirtyTwoPx />
      {manglerSøknadAnnenPart() && (
        <Alert size="small" variant="warning">
          {' '}
          Det mangler komplett søknad for perioden annen part har søkt om direkte overgang fra{' '}
        </Alert>
      )}

      <VerticalSpacer thirtyTwoPx />
      <BodyShort size="small">
        {' '}
        Oppgi begrunnelse for direkte overgang{' '}
      </BodyShort>

      <Formik
        initialValues={initialValues}
        onSubmit={values => {
          if (!readOnly && submittable)
            submitCallback(
              aksjonspunkter
                .filter(
                  ap =>
                    ap.definisjon.kode === aksjonspunktCodes.MANGLER_KOMPLETT_SØKNAD ||
                    ap.definisjon.kode === aksjonspunktCodes.MANGLER_KOMPLETT_SØKNAD_ANNEN_PART,
                )
                .map(ap => ({
                  kode: ap.definisjon.kode,
                  begrunnelse: values.begrunnelse,
                })),
            );
        }}
        validationSchema={validationSchema}
        validateOnBlur
        validateOnChange
        validateOnMount
      >
        {({ isValid, isSubmitting }) => (
          <Form>
            <VerticalSpacer sixteenPx />
            <Field name="begrunnelse">
              {({ field }) => (
                <Textarea
                  id="begrunnelse"
                  label="Begrunnelse"
                  placeholder={"Begrunnelse"}
                  value={field.value}
                  disabled={readOnly}
                  size="small"
                  {...field}
                />
              )}
            </Field>
            <VerticalSpacer sixteenPx />
            <div className={styles.buttonBar}>
              <Button
                size="small"
                className={styles.button}
                loading={isSubmitting}
                disabled={readOnly || !submittable || !isValid}
                variant="primary"
                type="submit"
              >
                Bekreft og fortsett
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default injectIntl(ManglerSøknadForm);
