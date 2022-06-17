import CheckboxFieldFormik from '@fpsak-frontend/form/src/CheckboxFieldFormik';
import TextAreaFormik from '@fpsak-frontend/form/src/TextAreaFormik';
import { goToLos } from '@k9-sak-web/sak-app/src/app/paths';
import { Modal } from '@navikt/ds-react';
import { Form, Formik } from 'formik';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { CheckboxGruppe } from 'nav-frontend-skjema';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import React from 'react';
import { useIntl } from 'react-intl';
import * as Yup from 'yup';
import styles from './markerBehandlingModal.less';

interface PureOwnProps {
  brukHastekøMarkering?: boolean;
  brukVanskeligKøMarkering?: boolean;
  lukkModal: () => void;
  markerBehandling: (values: any) => Promise<any>;
  behandlingUuid: string;
}

const MarkerBehandlingModal: React.FC<PureOwnProps> = ({
  brukHastekøMarkering,
  brukVanskeligKøMarkering,
  lukkModal,
  markerBehandling,
  behandlingUuid,
}) => {
  const intl = useIntl();
  if (!brukHastekøMarkering && !brukVanskeligKøMarkering) {
    return null;
  }

  const MarkerBehandlingSchema = Yup.object().shape({
    markerSomHastesak: brukHastekøMarkering
      ? Yup.boolean().required('ValidationMessage.MustBeChecked').oneOf([true], 'ValidationMessage.MustBeChecked')
      : undefined,
    markerSomVanskelig: brukVanskeligKøMarkering
      ? Yup.boolean().required('ValidationMessage.MustBeChecked').oneOf([true], 'ValidationMessage.MustBeChecked')
      : undefined,
    begrunnelse: Yup.string()
      .required({ id: 'ValidationMessage.NotEmpty' })
      .min(3, { id: 'ValidationMessage.Min3Char' })
      .max(100000, { id: 'ValidationMessage.Max100000Char' }),
  });

  return (
    <Modal className={styles.modal} open closeButton onClose={lukkModal} shouldCloseOnOverlayClick={false}>
      <h3 className={`${styles.tittel} typo-systemtittel`}>Marker behandling og send til egen kø</h3>
      <Formik
        initialValues={{ markerSomHastesak: false, markerSomVanskelig: false, begrunnelse: '' }}
        validationSchema={MarkerBehandlingSchema}
        onSubmit={(values, actions) => {
          actions.setSubmitting(false);
          const transformedValues = {
            behandlingUuid,
            fritekst: values.begrunnelse,
            merknadKoder: brukHastekøMarkering ? ['HASTESAK'] : [],
          };
          markerBehandling(transformedValues).then(() => goToLos());
        }}
      >
        {formikProps => (
          <Form>
            {brukVanskeligKøMarkering && (
              <CheckboxGruppe
                feil={
                  formikProps.errors.markerSomVanskelig
                    ? intl.formatMessage({ id: formikProps.errors.markerSomVanskelig })
                    : false
                }
              >
                <CheckboxFieldFormik name="markerSomVanskelig" label={{ id: 'MenyMarkerBehandling.VanskeligÅLøse' }} />
              </CheckboxGruppe>
            )}
            {brukHastekøMarkering && (
              <CheckboxGruppe
                feil={
                  formikProps.errors.markerSomHastesak
                    ? intl.formatMessage({ id: formikProps.errors.markerSomHastesak })
                    : false
                }
              >
                <CheckboxFieldFormik
                  name="markerSomHastesak"
                  label={{ id: 'MenyMarkerBehandling.MarkerSomHastesak' }}
                />
              </CheckboxGruppe>
            )}
            {formikProps.values.markerSomVanskelig && (
              <>
                <Element className={styles.aksjonspunktHeading}>Aksjonspunkt:</Element>
                <Normaltekst>Beregning</Normaltekst>
              </>
            )}
            {(formikProps.values.markerSomVanskelig || formikProps.values.markerSomHastesak) && (
              <div className={styles.textareaContainer}>
                <TextAreaFormik
                  textareaClass={styles.textArea}
                  name="begrunnelse"
                  label={intl.formatMessage({ id: 'MenyMarkerBehandling.Kommentar' })}
                  validate={[]}
                  maxLength={100000}
                />
              </div>
            )}
            <div className={styles.buttonContainer}>
              <Hovedknapp className={styles.submitButton}>Lagre, gå til LOS</Hovedknapp>
              <Knapp onClick={lukkModal}>Lukk</Knapp>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};
export default MarkerBehandlingModal;
