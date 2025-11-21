import { Button } from '@navikt/ds-react';
import { useState } from 'react';
import type { BehandleKlageFormKaFormValues } from '../ka/BehandleKlageFormKaFormValues';
import { formValuesToSaveValues } from './formValuesToSaveValues.js';
import type { PreviewData } from './PreviewData.js';
import type { SaveKlageParams } from './SaveKlageParams';

const getBrevData = (tekst: string) => ({
  dokumentdata: { fritekst: tekst },
  dokumentMal: 'UTLED',
});

interface OwnProps {
  formValues: BehandleKlageFormKaFormValues;
  saveKlage: (params: SaveKlageParams) => Promise<void>;
  aksjonspunktCode: string;
  readOnly: boolean;
  previewCallback: (brevData: PreviewData) => Promise<void>;
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
    if (isFetchingPreview) return;

    setIsFetchingPreview(true);
    try {
      await saveKlage(formValuesToSaveValues(formValues, aksjonspunktCode));
      if (formValues.fritekstTilBrev) {
        await previewCallback(getBrevData(formValues.fritekstTilBrev));
      }
    } finally {
      setIsFetchingPreview(false);
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
