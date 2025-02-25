import { CheckmarkCircleFillIcon } from '@navikt/aksel-icons';
import { BodyShort, Box, Button, HGrid, Modal } from '@navikt/ds-react';
import { Form, SelectField, TextAreaField } from '@navikt/ft-form-hooks';
import { hasValidText, maxLength, required } from '@navikt/ft-form-validators';
import { useForm } from 'react-hook-form';
import styles from './endreBehandlendeEnhetModal.module.css';

const maxLength400 = maxLength(400);

interface EndreBehandlendeEnhetModalProps {
  lukkModal: () => void;
  behandlendeEnheter: {
    enhetId: string;
    enhetNavn: string;
  }[];
  gjeldendeBehandlendeEnhetId?: string;
  gjeldendeBehandlendeEnhetNavn?: string;
  onSubmit: (formValues: FormValues) => void;
}

export interface FormValues {
  nyEnhet: string;
  begrunnelse: string;
}

/**
 * EndreBehandlendeEnhetModal
 *
 * Presentasjonskomponent. Denne modalen vises når saksbehandler valger 'Bytt behandlende enhet'.
 * Ved å angi ny enhet og begrunnelse og trykke på 'OK' blir behandlende enhet endret.
 */
export const EndreBehandlendeEnhetModal = ({
  lukkModal,
  behandlendeEnheter,
  gjeldendeBehandlendeEnhetId,
  gjeldendeBehandlendeEnhetNavn,
  onSubmit,
}: EndreBehandlendeEnhetModalProps) => {
  const formMethods = useForm<FormValues>({
    defaultValues: {
      nyEnhet: '',
      begrunnelse: '',
    },
  });
  const [nyEnhet, begrunnelse] = formMethods.watch(['nyEnhet', 'begrunnelse']);
  const selectOptions = () =>
    [<option value="" disabled>{`${gjeldendeBehandlendeEnhetId} ${gjeldendeBehandlendeEnhetNavn}`}</option>].concat(
      behandlendeEnheter.map((enhet, index) => (
        <option value={`${index}`} key={enhet.enhetId}>
          {`${enhet.enhetId} ${enhet.enhetNavn}`}
        </option>
      )),
    );

  const handleSubmit = (formValues: FormValues) => {
    onSubmit(formValues);
  };
  return (
    <Modal className={styles.modal} open aria-label="Endre behandlende enhet" onClose={lukkModal}>
      <Form<FormValues> formMethods={formMethods} onSubmit={handleSubmit}>
        <Modal.Header closeButton={false}>
          <HGrid gap="1" columns={{ xs: '1fr 11fr' }}>
            <div className="relative">
              <CheckmarkCircleFillIcon
                fontSize={30}
                style={{ color: 'var(--a-surface-success)' }}
                aria-label="Endre enhet"
              />
              <div className={styles.divider} />
            </div>
            <div>
              <BodyShort size="small" className={styles.infotekstBeskrivelse}>
                Endre behandlende enhet for valgt behandling
              </BodyShort>
            </div>
          </HGrid>
        </Modal.Header>
        <Modal.Body>
          <HGrid gap="1" columns={{ xs: '1fr 5fr 6fr' }}>
            <div />
            <div>
              <SelectField name="nyEnhet" label="Ny enhet" validate={[required]} selectValues={selectOptions()} />
            </div>
          </HGrid>
          <HGrid gap="1" columns={{ xs: '1fr 8fr 3fr' }}>
            <div />
            <Box marginBlock="2 0">
              <TextAreaField
                name="begrunnelse"
                label="Begrunnelse"
                validate={[required, maxLength400, hasValidText]}
                maxLength={400}
              />
            </Box>
          </HGrid>
          <HGrid gap="1" columns={{ xs: '1fr 8fr 3fr' }}>
            <div />
            <Box marginBlock="4 0">
              <div className={styles.floatButtons}>
                <Button variant="primary" size="small" disabled={!(nyEnhet && begrunnelse)} type="submit">
                  OK
                </Button>
                <Button variant="secondary" type="button" size="small" onClick={lukkModal}>
                  Avbryt
                </Button>
              </div>
            </Box>
          </HGrid>
        </Modal.Body>
      </Form>
    </Modal>
  );
};

export default EndreBehandlendeEnhetModal;
