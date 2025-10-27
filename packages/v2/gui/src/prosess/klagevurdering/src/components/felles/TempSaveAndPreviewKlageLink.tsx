import { ung_kodeverk_klage_KlageVurderingType } from '@k9-sak-web/backend/ungsak/generated/types.js';
import { Button } from '@navikt/ds-react';
import { useState } from 'react';
import type { BehandleKlageFormKaFormValues } from '../ka/BehandleKlageFormKaFormValues';
import type { SaveKlageParams } from './SaveKlageParams';

const transformValues = (values: BehandleKlageFormKaFormValues, aksjonspunktCode: string) => ({
  klageMedholdArsak:
    values.klageVurdering === ung_kodeverk_klage_KlageVurderingType.MEDHOLD_I_KLAGE ||
    values.klageVurdering === ung_kodeverk_klage_KlageVurderingType.OPPHEVE_YTELSESVEDTAK
      ? values.klageMedholdArsak
      : null,
  klageVurderingOmgjoer:
    values.klageVurdering === ung_kodeverk_klage_KlageVurderingType.MEDHOLD_I_KLAGE
      ? values.klageVurderingOmgjoer
      : null,
  klageVurdering: values.klageVurdering,
  fritekstTilBrev: values.fritekstTilBrev,
  begrunnelse: values.begrunnelse,
  kode: aksjonspunktCode,
});

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
  const tempSave = () => {
    void saveKlage(transformValues(formValues, aksjonspunktCode)).then(() => {
      if (formValues.fritekstTilBrev) {
        setIsFetchingPreview(true);
        void previewCallback(getBrevData(formValues.fritekstTilBrev)).finally(() => {
          setIsFetchingPreview(false);
        });
      }
    });
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
