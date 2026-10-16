import { BodyShort, Button, Modal } from '@navikt/ds-react';

interface Props {
  open: boolean;
  isPending: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export const OpphørForhåndsvarselModal = ({ open, isPending, onClose, onConfirm, onCancel }: Props) => (
  <Modal
    open={open}
    aria-label="Send forhåndsvarsel"
    onClose={onClose}
    header={{ heading: 'Send forhåndsvarsel', size: 'small' }}
  >
    <Modal.Body>
      <BodyShort size="small">
        Er du sikker på at du vil sende forhåndsvarsel? <br /> Dette kan ikke angres.
      </BodyShort>
    </Modal.Body>
    <Modal.Footer>
      <Button size="small" loading={isPending} onClick={onConfirm}>
        Send forhåndsvarsel
      </Button>
      <Button size="small" variant="secondary" type="button" onClick={onCancel}>
        Avbryt
      </Button>
    </Modal.Footer>
  </Modal>
);
