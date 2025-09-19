import { ung_kodeverk_klage_KlageVurderingType } from '@k9-sak-web/backend/ungsak/generated/types.js';
import { Button } from '@navikt/ds-react';
import type { BehandleKlageFormKaFormValues } from '../ka/BehandleKlageFormKaFormValues';
import styles from './tempsaveAndPreviewKlageLink.module.css';

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
  saveKlage: (params: any) => Promise<void>;
  aksjonspunktCode: string;
  readOnly: boolean;
  previewCallback: (brevData: any) => void;
}

export const TempSaveAndPreviewKlageLink = ({
  formValues,
  saveKlage,
  aksjonspunktCode,
  readOnly,
  previewCallback,
}: OwnProps) => {
  const tempSave = () => {
    void saveKlage(transformValues(formValues, aksjonspunktCode)).then(() => {
      if (formValues.fritekstTilBrev) {
        previewCallback(getBrevData(formValues.fritekstTilBrev));
      }
    });
  };

  return (
    <div>
      {!readOnly && (
        <Button onClick={tempSave} className={styles.previewLink} data-testid="previewLink" variant="tertiary">
          Lagre og forhåndsvis brev
        </Button>
      )}
    </div>
  );
};

export default TempSaveAndPreviewKlageLink;
