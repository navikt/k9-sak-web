import { Button } from '@navikt/ds-react';
import type { BehandleKlageFormKaFormValues } from '../ka/BehandleKlageFormKaFormValues.js';
import { formValuesToSaveValues } from './formValuesToSaveValues.js';
import type { SaveKlageParams } from './SaveKlageParams.js';

interface TempsaveKlageButtonProps {
  formValues: BehandleKlageFormKaFormValues;
  saveKlage: (params: SaveKlageParams) => Promise<void>;
  aksjonspunktCode: string;
  readOnly: boolean;
  isSubmitting: boolean;
}

const TempsaveKlageButton = ({
  formValues,
  saveKlage,
  aksjonspunktCode,
  readOnly = false,
  isSubmitting,
}: TempsaveKlageButtonProps) => {
  const tempSave = (event: React.SyntheticEvent<HTMLButtonElement>) => {
    event.preventDefault();
    void saveKlage(formValuesToSaveValues(formValues, aksjonspunktCode));
  };

  return (
    <>
      {!readOnly && (
        <Button
          variant="secondary"
          size="small"
          type="button"
          onClick={event => tempSave(event)}
          loading={isSubmitting}
        >
          Lagre
        </Button>
      )}
    </>
  );
};

export default TempsaveKlageButton;
