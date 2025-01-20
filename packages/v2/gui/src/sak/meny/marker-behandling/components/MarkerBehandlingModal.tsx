import FeatureTogglesContext from '@k9-sak-web/gui/utils/featureToggles/FeatureTogglesContext.js';
import { goToLos, goToSearch } from '@k9-sak-web/lib/paths/paths.js';
import { Alert, BodyShort, Button, Heading, Label, Modal, VStack } from '@navikt/ds-react';
import { CheckboxField, Form, TextAreaField } from '@navikt/ft-form-hooks';
import { hasValidText, maxLength, minLength, required } from '@navikt/ft-form-validators';
import React, { useContext } from 'react';
import { useForm, useFormState } from 'react-hook-form';
import Merknadkode from '../Merknadkode';
import type { MerknadDto } from '../types/MerknadDto';
import styles from './markerBehandlingModal.module.css';

const minLength3 = minLength(3);
const maxLength100000 = maxLength(100000);

interface PureOwnProps {
  brukHastekøMarkering?: boolean;
  brukVanskeligKøMarkering?: boolean;
  lukkModal: () => void;
  markerBehandling: (values: any) => Promise<any>;
  behandlingUuid: string;
  merknaderFraLos: MerknadDto;
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
  const buildInitialValues = (): FormValues => {
    if (merknaderFraLos) {
      return {
        markerSomHastesak: !!merknaderFraLos.merknadKoder?.includes(Merknadkode.HASTESAK),
        markerSomVanskelig: !!merknaderFraLos.merknadKoder?.includes(Merknadkode.VANSKELIG_SAK),
        begrunnelse: merknaderFraLos.fritekst ?? '',
      };
    }
    return {
      markerSomHastesak: false,
      markerSomVanskelig: false,
      begrunnelse: '',
    };
  };

  const formMethods = useForm<FormValues>({ defaultValues: buildInitialValues() });
  const [markerSomVanskelig, markerSomHastesak] = formMethods.watch(['markerSomVanskelig', 'markerSomHastesak']);
  const featureToggles = useContext(FeatureTogglesContext);
  const formState = useFormState({ control: formMethods.control });

  const handleSubmit = (values: FormValues) => {
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
  };

  if (!brukHastekøMarkering && !brukVanskeligKøMarkering) {
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
          {brukVanskeligKøMarkering && (
            <CheckboxField name="markerSomVanskelig" label="Behandlingen er vanskelig å løse" validate={[required]} />
          )}
          {brukHastekøMarkering && (
            <VStack gap="4">
              <Alert variant="warning">
                Hastesaker skal følges opp fra Gosys inntil videre, og kan derfor ikke endres her.
              </Alert>
              <CheckboxField
                name="markerSomHastesak"
                label="Behandlingen er hastesak"
                disabled={!featureToggles?.['LOS_MARKER_BEHANDLING_SUBMIT']}
                validate={[required]}
              />
            </VStack>
          )}
          {markerSomVanskelig && (
            <>
              <Label size="small" as="p" className={styles.aksjonspunktHeading}>
                Aksjonspunkt:
              </Label>
              <BodyShort size="small">Beregning</BodyShort>
            </>
          )}
          {(markerSomVanskelig || markerSomHastesak) && (
            <div className={styles.textareaContainer}>
              <TextAreaField
                className={styles.textArea}
                name="begrunnelse"
                label="Kommentar"
                validate={[required, minLength3, maxLength100000, hasValidText]}
                maxLength={100000}
                readOnly={!featureToggles?.['LOS_MARKER_BEHANDLING_SUBMIT']}
              />
            </div>
          )}

          <div className={styles.buttonContainer}>
            <Button
              variant="primary"
              size="small"
              disabled={
                !featureToggles?.['LOS_MARKER_BEHANDLING_SUBMIT'] ||
                formState.isSubmitting ||
                (!markerSomVanskelig && !markerSomHastesak)
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
