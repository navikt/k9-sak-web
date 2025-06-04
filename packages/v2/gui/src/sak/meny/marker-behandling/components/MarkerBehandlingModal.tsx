import { MerknadEndretDtoMerknadKode } from '@k9-sak-web/backend/k9sak/generated';
import FeatureTogglesContext from '@k9-sak-web/gui/featuretoggles/FeatureTogglesContext.js';
import { goToLos, goToSearch } from '@k9-sak-web/lib/paths/paths.js';
import { Alert, Button, Heading, Modal, VStack } from '@navikt/ds-react';
import { CheckboxField, Form, TextAreaField } from '@navikt/ft-form-hooks';
import { hasValidText, maxLength, minLength, required } from '@navikt/ft-form-validators';
import React, { useContext } from 'react';
import { useForm, useFormState } from 'react-hook-form';
import type { MarkerBehandlingBackendApiType } from '../MarkerBehandlingBackendApiType';
import type { MerknaderFraLos } from '../MerknaderFraLos';
import styles from './markerBehandlingModal.module.css';

const minLength3 = minLength(3);
const maxLength100000 = maxLength(100000);

interface PureOwnProps {
  brukHastekøMarkering?: boolean;
  lukkModal: () => void;
  behandlingUuid: string;
  merknaderFraLos: MerknaderFraLos[];
  erVeileder?: boolean;
  api: MarkerBehandlingBackendApiType;
}

interface FormValues {
  markerSomHastesak: boolean;
  markerSomUtenlands: boolean;
  begrunnelse: string;
}

const MarkerBehandlingModal: React.FC<PureOwnProps> = ({
  brukHastekøMarkering,
  lukkModal,
  behandlingUuid,
  merknaderFraLos,
  erVeileder,
  api,
}) => {
  const buildInitialValues = (): FormValues => {
    if (merknaderFraLos) {
      return {
        markerSomHastesak: !!merknaderFraLos.some(
          merknad => merknad.merknadType.kode === MerknadEndretDtoMerknadKode.HASTESAK,
        ),
        markerSomUtenlands: !!merknaderFraLos.some(
          merknad => merknad.merknadType.kode === MerknadEndretDtoMerknadKode.UTENLANDSTILSNITT,
        ),
        begrunnelse: merknaderFraLos.find(merknad => merknad.fritekst)?.fritekst ?? '',
      };
    }
    return {
      markerSomHastesak: false,
      markerSomUtenlands: false,
      begrunnelse: '',
    };
  };

  const formMethods = useForm<FormValues>({ defaultValues: buildInitialValues() });
  const [markerSomUtenlands, markerSomHastesak] = formMethods.watch(['markerSomUtenlands', 'markerSomHastesak']);
  const featureToggles = useContext(FeatureTogglesContext);
  const formState = useFormState({ control: formMethods.control });

  const handleSubmit = async (values: FormValues) => {
    const queries = [];
    if (values.markerSomHastesak) {
      queries.push({
        behandlingUuid,
        fritekst: values.begrunnelse ?? '',
        merknadKode: MerknadEndretDtoMerknadKode.HASTESAK,
      });
    }
    if (values.markerSomUtenlands) {
      queries.push({
        behandlingUuid,
        fritekst: values.begrunnelse ?? '',
        merknadKode: MerknadEndretDtoMerknadKode.UTENLANDSTILSNITT,
      });
    }

    if (queries.length > 0) {
      await Promise.all(queries.map(query => api.markerBehandling(query))).then(() => {
        if (erVeileder) {
          goToSearch();
        } else {
          goToLos();
        }
      });
    }
  };

  if (!brukHastekøMarkering) {
    return null;
  }

  return (
    <Modal open onClose={lukkModal} aria-label="Modal for markering av behandling" portal width="38.375rem">
      <Modal.Header>
        <Heading as="h3" size="small">
          Marker behandling og send til egen kø
        </Heading>
      </Modal.Header>
      <Modal.Body>
        <Form<FormValues> formMethods={formMethods} onSubmit={handleSubmit}>
          {brukHastekøMarkering && (
            <VStack gap="4">
              <Alert variant="warning">
                Hastesaker skal følges opp fra Gosys inntil videre, og kan derfor ikke endres her.
              </Alert>
              <CheckboxField
                name="markerSomHastesak"
                label="Behandlingen er hastesak"
                disabled={!featureToggles.LOS_MARKER_BEHANDLING_SUBMIT}
                validate={[required]}
              />
            </VStack>
          )}
          <CheckboxField name="markerSomUtenlands" label="Behandlingen har utenlandstilsnitt" validate={[required]} />
          {(markerSomUtenlands || markerSomHastesak) && (
            <div className={styles.textareaContainer}>
              <TextAreaField
                className={styles.textArea}
                name="begrunnelse"
                label="Kommentar"
                validate={[required, minLength3, maxLength100000, hasValidText]}
                maxLength={100000}
                readOnly={!featureToggles.LOS_MARKER_BEHANDLING_SUBMIT}
              />
            </div>
          )}

          <div className={styles.buttonContainer}>
            <Button
              variant="primary"
              size="small"
              disabled={
                !featureToggles.LOS_MARKER_BEHANDLING_SUBMIT ||
                formState.isSubmitting ||
                (!markerSomUtenlands && !markerSomHastesak)
              }
            >
              {erVeileder ? 'Lagre, gå til forsiden' : 'Lagre, gå til LOS'}
            </Button>
            <Button variant="secondary" size="small" onClick={lukkModal}>
              Lukk
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};
export default MarkerBehandlingModal;
