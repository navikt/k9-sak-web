import { Field, Form, Formik } from 'formik';
import React from 'react';
import { FormattedMessage, WrappedComponentProps, injectIntl } from 'react-intl';
import * as Yup from 'yup';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import { AksjonspunktHelpTextTemp, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { Aksjonspunkt } from '@k9-sak-web/types';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import { Knapp } from 'nav-frontend-knapper';
import { Textarea } from 'nav-frontend-skjema';
import { Normaltekst } from 'nav-frontend-typografi';
import styles from './ManglerSøknadForm.css';

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
      <Normaltekst>
        {' '}
        <FormattedMessage id="ManglerSøknadForm.OppgiBegrunnelse" key="aksjonspunktText" />{' '}
      </Normaltekst>

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
                  placeholder={intl.formatMessage({ id: 'ManglerSøknadForm.Begrunnelse' })}
                  value={field.value}
                  disabled={readOnly}
                  {...field}
                />
              )}
            </Field>
            <VerticalSpacer sixteenPx />
            <div className={styles.buttonBar}>
              <Knapp
                className={styles.button}
                spinner={isSubmitting}
                disabled={readOnly || !submittable || !isValid}
                autoDisableVedSpinner
                type="hoved"
                htmlType="submit"
              >
                <FormattedMessage id="ManglerSøknadForm.LagreAksjonspunkt" />
              </Knapp>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default injectIntl(ManglerSøknadForm);
