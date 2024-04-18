import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import { AksjonspunktHelpText, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { Aksjonspunkt } from '@k9-sak-web/types';
import { Alert, BodyShort, Button, Textarea } from '@navikt/ds-react';
import { Field, Form, Formik } from 'formik';
import React from 'react';
import { FormattedMessage, WrappedComponentProps, injectIntl } from 'react-intl';
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
      <AksjonspunktHelpText isAksjonspunktOpen={erAksjonspunktÅpent()}>
        {[<FormattedMessage id="HelpText.Aksjonspunkt" key="aksjonspunktText" />]}
      </AksjonspunktHelpText>
      <VerticalSpacer thirtyTwoPx />
      {manglerSøknadForPeriode() && (
        <Alert size="small" variant="warning">
          {' '}
          <FormattedMessage id="ManglerSøknadForm.ManglerKomplettSøknad" key="aksjonspunktText" />{' '}
        </Alert>
      )}
      <VerticalSpacer thirtyTwoPx />
      {manglerSøknadAnnenPart() && (
        <Alert size="small" variant="warning">
          {' '}
          <FormattedMessage id="ManglerSøknadForm.ManglerKomplettSøknadAnnenPart" key="aksjonspunktText" />{' '}
        </Alert>
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
