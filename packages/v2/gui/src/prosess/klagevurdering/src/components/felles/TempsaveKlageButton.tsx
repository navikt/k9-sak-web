import { ung_kodeverk_klage_KlageVurderingType } from '@k9-sak-web/backend/ungsak/generated/types.js';
import { Button } from '@navikt/ds-react';
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
    void saveKlage(transformValues(formValues, aksjonspunktCode));
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
