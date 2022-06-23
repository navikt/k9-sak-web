import CheckboxFieldFormik from '@fpsak-frontend/form/src/CheckboxFieldFormik';
import TextAreaFormik from '@fpsak-frontend/form/src/TextAreaFormik';
import { goToLos } from '@k9-sak-web/sak-app/src/app/paths';
import { MerknadFraLos } from '@k9-sak-web/types';
import { Button, ErrorMessage, Modal } from '@navikt/ds-react';
import { Form, Formik, FormikProps } from 'formik';
import { CheckboxGruppe } from 'nav-frontend-skjema';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import React, { useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import * as Yup from 'yup';
import Merknadkode from '../Merknadkode';
import styles from './markerBehandlingModal.less';

interface PureOwnProps {
  brukHastekøMarkering?: boolean;
  brukVanskeligKøMarkering?: boolean;
  lukkModal: () => void;
  markerBehandling: (values: any) => Promise<any>;
  behandlingUuid: string;
  merknaderFraLos: MerknadFraLos;
}

interface FormValues {
  markerSomHastesak: boolean;
  markerSomVanskelig: boolean;
  begrunnelse: string;
}

const MarkerBehandlingModal: React.FC<PureOwnProps> = ({
  brukHastekøMarkering,
  brukVanskeligKøMarkering,
  lukkModal,
  markerBehandling,
  behandlingUuid,
  merknaderFraLos,
}) => {
  const intl = useIntl();
  const [showIngenEndringerError, setShowIngenEndringerError] = useState(false);
  if (!brukHastekøMarkering && !brukVanskeligKøMarkering) {
    return null;
  }
  Modal.setAppElement(document.body);
  const MarkerBehandlingSchema = Yup.object().shape({
    markerSomHastesak: brukHastekøMarkering ? Yup.boolean() : undefined,
    markerSomVanskelig: brukVanskeligKøMarkering ? Yup.boolean() : undefined,
    begrunnelse: Yup.string().when(['markerSomHastesak', 'markerSomVanskelig'], {
      is: (markerSomHastesak, markerSomVanskelig) => markerSomHastesak === true || markerSomVanskelig === true,
      then: Yup.string()
        .required({ id: 'ValidationMessage.NotEmpty' })
        .min(3, { id: 'ValidationMessage.Min3Char' })
        .max(100000, { id: 'ValidationMessage.Max100000Char' }),
    }),
  });
  const formRef = useRef<FormikProps<FormValues>>();

  const buildInitialValues = (): FormValues => {
    if (merknaderFraLos) {
      return {
        markerSomHastesak: merknaderFraLos.merknadKoder?.includes(Merknadkode.HASTESAK),
        markerSomVanskelig: merknaderFraLos.merknadKoder?.includes(Merknadkode.VANSKELIG_SAK),
        begrunnelse: merknaderFraLos.fritekst,
      };
    }
    return {
      markerSomHastesak: false,
      markerSomVanskelig: false,
      begrunnelse: '',
    };
  };

  const formHasChanges = () => {
    const initialValues = buildInitialValues();
    const formKeys = Object.keys(initialValues);
    let hasChanges = false;
    if (formRef && formRef.current && formRef.current.values) {
      formKeys.forEach(key => {
        const inkluderBegrunnelse =
          key === 'begrunnelse' &&
          (formRef.current.values.markerSomHastesak || formRef.current.values.markerSomVanskelig);

        if (key !== 'begrunnelse' || inkluderBegrunnelse) {
          if (formRef.current.values[key] !== initialValues[key] && !hasChanges) {
            hasChanges = true;
          }
        }
      });
    }
    return hasChanges;
  };

  return (
    <Modal
      className={styles.modal}
      open
      closeButton
      onClose={lukkModal}
      shouldCloseOnOverlayClick={false}
      aria-label="Modal for markering av behandling"
    >
      <h3 className={`${styles.tittel} typo-systemtittel`}>Marker behandling og send til egen kø</h3>
      <Formik
        innerRef={formRef}
        initialValues={buildInitialValues()}
        validationSchema={MarkerBehandlingSchema}
        onSubmit={(values, actions) => {
          actions.setSubmitting(false);
          if (formHasChanges()) {
            setShowIngenEndringerError(false);
            const getMerknadKode = () => {
              if (values.markerSomHastesak) {
                return [Merknadkode.HASTESAK];
              }
              if (values.markerSomVanskelig) {
                return [Merknadkode.VANSKELIG_SAK];
              }
              return [];
            };
            const transformedValues = {
              behandlingUuid,
              fritekst: values.markerSomHastesak || values.markerSomVanskelig ? values.begrunnelse : undefined,
              merknadKoder: getMerknadKode(),
            };
            markerBehandling(transformedValues).then(() => goToLos());
          } else {
            setShowIngenEndringerError(true);
          }
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
            {showIngenEndringerError && (
              <ErrorMessage className={styles.errorMessage}>
                {intl.formatMessage({ id: 'ValidationMessage.ManglendeEndringerError' })}
              </ErrorMessage>
            )}
            <div className={styles.buttonContainer}>
              <Button variant="primary" size="small" className={styles.submitButton}>
                Lagre, gå til LOS
              </Button>
              <Button variant="secondary" size="small" onClick={lukkModal}>
                Lukk
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};
export default MarkerBehandlingModal;
