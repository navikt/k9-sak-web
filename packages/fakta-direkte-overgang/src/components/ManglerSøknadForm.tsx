import React from 'react';
import { Field, Form, Formik } from 'formik';
import { FormattedMessage, WrappedComponentProps, injectIntl } from 'react-intl';
import * as Yup from 'yup';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import { AksjonspunktHelpTextTemp, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { Aksjonspunkt } from '@k9-sak-web/types';
import { BodyShort, Button, Textarea } from '@navikt/ds-react';
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
    begrunnelse: Yup.string().required(intl.formatMessage({ id: 'ManglerSøknadForm.BegrunnelseErPåkrevd' })),
  });

  const utledBegrunnelse = () =>
    aksjonspunkter.find(
      ap =>
        ap.definisjon === aksjonspunktCodes.MANGLER_KOMPLETT_SØKNAD ||
        ap.definisjon === aksjonspunktCodes.MANGLER_KOMPLETT_SØKNAD_ANNEN_PART,
    ).begrunnelse || '';

  const erAksjonspunktÅpent = () =>
    isAksjonspunktOpen(
      aksjonspunkter.find(
        ap =>
          ap.definisjon === aksjonspunktCodes.MANGLER_KOMPLETT_SØKNAD ||
          ap.definisjon === aksjonspunktCodes.MANGLER_KOMPLETT_SØKNAD_ANNEN_PART,
      ).status,
    );

  const manglerSøknadForPeriode = () =>
    aksjonspunkter.some(ap => ap.definisjon === aksjonspunktCodes.MANGLER_KOMPLETT_SØKNAD);
  const manglerSøknadAnnenPart = () =>
    aksjonspunkter.some(ap => ap.definisjon === aksjonspunktCodes.MANGLER_KOMPLETT_SØKNAD_ANNEN_PART);

  const initialValues: ManglerSøknadDto = {
    begrunnelse: utledBegrunnelse(),
  };

  return (
    <div className={styles.container}>
      <VerticalSpacer thirtyTwoPx />
      <AksjonspunktHelpTextTemp isAksjonspunktOpen={erAksjonspunktÅpent()}>
        {[<FormattedMessage id="HelpText.Aksjonspunkt" key="aksjonspunktText" />]}
      </AksjonspunktHelpTextTemp>
      <VerticalSpacer thirtyTwoPx />
      {manglerSøknadForPeriode() && (
        <AlertStripeAdvarsel>
          {' '}
          <FormattedMessage id="ManglerSøknadForm.ManglerKomplettSøknad" key="aksjonspunktText" />{' '}
        </AlertStripeAdvarsel>
      )}
      <VerticalSpacer thirtyTwoPx />
      {manglerSøknadAnnenPart() && (
        <AlertStripeAdvarsel>
          {' '}
          <FormattedMessage id="ManglerSøknadForm.ManglerKomplettSøknadAnnenPart" key="aksjonspunktText" />{' '}
        </AlertStripeAdvarsel>
      )}

      <VerticalSpacer thirtyTwoPx />
      <BodyShort size="small">
        {' '}
        <FormattedMessage id="ManglerSøknadForm.OppgiBegrunnelse" key="aksjonspunktText" />{' '}
      </BodyShort>

      <Formik
        initialValues={initialValues}
        onSubmit={values => {
          if (!readOnly && submittable)
            submitCallback(
              aksjonspunkter
                .filter(
                  ap =>
                    ap.definisjon === aksjonspunktCodes.MANGLER_KOMPLETT_SØKNAD ||
                    ap.definisjon === aksjonspunktCodes.MANGLER_KOMPLETT_SØKNAD_ANNEN_PART,
                )
                .map(ap => ({
                  kode: ap.definisjon,
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
                  placeholder={intl.formatMessage({ id: 'ManglerSøknadForm.Begrunnelse' })}
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
                className={styles.button}
                loading={isSubmitting}
                disabled={readOnly || !submittable || !isValid}
                variant="primary"
                type="submit"
              >
                <FormattedMessage id="ManglerSøknadForm.LagreAksjonspunkt" />
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default injectIntl(ManglerSøknadForm);
