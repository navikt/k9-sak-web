import { Button } from '@navikt/ds-react';
import { useState } from 'react';
import type { BehandleKlageFormKaFormValues } from '../ka/BehandleKlageFormKaFormValues';
import type { SaveKlageParams } from './SaveKlageParams';
import { formValuesToSaveValues } from './formValuesToSaveValues.js';

const getBrevData = (tekst: string) => ({
  dokumentdata: tekst && { fritekst: tekst },
  dokumentMal: 'UTLED',
});

interface OwnProps {
  formValues: BehandleKlageFormKaFormValues;
  saveKlage: (params: SaveKlageParams) => Promise<void>;
  aksjonspunktCode: string;
  readOnly: boolean;
  previewCallback: (brevData: any) => Promise<void>;
}

export const TempSaveAndPreviewKlageLink = ({
  formValues,
  saveKlage,
  aksjonspunktCode,
  readOnly,
  previewCallback,
}: OwnProps) => {
  const [isFetchingPreview, setIsFetchingPreview] = useState(false);
  const tempSave = async () => {
    await saveKlage(formValuesToSaveValues(formValues, aksjonspunktCode));
    if (formValues.fritekstTilBrev) {
      setIsFetchingPreview(true);
      try {
        await previewCallback(getBrevData(formValues.fritekstTilBrev));
      } finally {
        setIsFetchingPreview(false);
      }
    }
  };

  return (
    <div>
      {!readOnly && (
        <Button
          onClick={tempSave}
          data-testid="previewLink"
          variant="tertiary"
          size="small"
          type="button"
          loading={isFetchingPreview}
        >
          Lagre og forhåndsvis brev
        </Button>
      )}
    </div>
  );
};
