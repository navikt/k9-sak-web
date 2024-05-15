import CheckboxFieldFormik from '@fpsak-frontend/form/src/CheckboxFieldFormik';
import TextAreaFormik from '@fpsak-frontend/form/src/TextAreaFormik';
import { useFeatureToggles } from '@fpsak-frontend/shared-components';
import { goToLos, goToSearch } from '@k9-sak-web/sak-app/src/app/paths';
import { MerknadFraLos } from '@k9-sak-web/types';
import { Alert, BodyShort, Button, ErrorMessage, Heading, Label, Modal, VStack } from '@navikt/ds-react';
import { Form, Formik, FormikProps } from 'formik';
import React, { useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import * as Yup from 'yup';
import Merknadkode from '../Merknadkode';
import styles from './markerBehandlingModal.module.css';

interface PureOwnProps {
  brukHastekøMarkering?: boolean;
  brukVanskeligKøMarkering?: boolean;
  lukkModal: () => void;
  markerBehandling: (values: any) => Promise<any>;
  behandlingUuid: string;
  merknaderFraLos: MerknadFraLos;
  erVeileder?: boolean;
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
  erVeileder,
}) => {
  const intl = useIntl();
  const [featureToggles] = useFeatureToggles();
  const [showIngenEndringerError, setShowIngenEndringerError] = useState(false);
  if (!brukHastekøMarkering && !brukVanskeligKøMarkering) {
    return null;
  }

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
    <Modal open onClose={lukkModal} aria-label="Modal for markering av behandling" portal width="38.375rem">
      <Modal.Header>
        <Heading as="h3" size="small">
          Marker behandling og send til egen kø
        </Heading>
      </Modal.Header>
      <Modal.Body>
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
              markerBehandling(transformedValues).then(() => {
                if (erVeileder) {
                  goToSearch();
                } else {
                  goToLos();
                }
              });
            } else {
              setShowIngenEndringerError(true);
            }
          }}
        >
          {formikProps => (
            <Form>
              {brukVanskeligKøMarkering && (
                <CheckboxFieldFormik name="markerSomVanskelig" label={{ id: 'MenyMarkerBehandling.VanskeligÅLøse' }} />
              )}
              {brukHastekøMarkering && (
                <VStack gap="4">
                  <Alert variant="warning">
                    Hastesaker skal følges opp fra Gosys inntil videre, og kan derfor ikke endres her.
                  </Alert>
                  <CheckboxFieldFormik
                    name="markerSomHastesak"
                    label={{ id: 'MenyMarkerBehandling.MarkerSomHastesak' }}
                    disabled={!featureToggles?.LOS_MARKER_BEHANDLING_SUBMIT}
                  />
                </VStack>
              )}
              {formikProps.values.markerSomVanskelig && (
                <>
                  <Label size="small" as="p" className={styles.aksjonspunktHeading}>
                    Aksjonspunkt:
                  </Label>
                  <BodyShort size="small">Beregning</BodyShort>
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
                    readOnly={!featureToggles?.LOS_MARKER_BEHANDLING_SUBMIT}
                  />
                </div>
              )}
              {showIngenEndringerError && (
                <ErrorMessage className={styles.errorMessage}>
                  {intl.formatMessage({ id: 'ValidationMessage.ManglendeEndringerError' })}
                </ErrorMessage>
              )}
              <div className={styles.buttonContainer}>
                <Button
                  variant="primary"
                  size="small"
                  disabled={!featureToggles?.LOS_MARKER_BEHANDLING_SUBMIT || formikProps.isSubmitting}
                  className={styles.submitButton}
                >
                  {erVeileder ? 'Lagre, gå til forsiden' : 'Lagre, gå til LOS'}
                </Button>
                <Button variant="secondary" size="small" onClick={lukkModal}>
                  Lukk
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};
export default MarkerBehandlingModal;
