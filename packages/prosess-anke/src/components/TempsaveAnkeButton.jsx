import { Button } from '@navikt/ds-react';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import klageVurderingType from '@fpsak-frontend/kodeverk/src/klageVurdering';

// TODO Her er det brukt kodeverk fra klage. Det er vel ikkje rett?
const transformValues = (values, aksjonspunktCode) => ({
  klageMedholdArsak:
    values.klageVurdering === klageVurderingType.MEDHOLD_I_KLAGE ||
    values.klageVurdering === klageVurderingType.OPPHEVE_YTELSESVEDTAK
      ? values.klageMedholdArsak
      : null,
  klageVurderingOmgjoer:
    values.klageVurdering === klageVurderingType.MEDHOLD_I_KLAGE ? values.klageVurderingOmgjoer : null,
  klageVurdering: values.klageVurdering,
  fritekstTilBrev: values.fritekstTilBrev,
  begrunnelse: values.begrunnelse,
  kode: aksjonspunktCode,
});

const TempsaveAnkeButton = ({ formValues, saveAnke, spinner = false, aksjonspunktCode, readOnly = false }) => {
  const tempSave = event => {
    event.preventDefault();
    saveAnke(transformValues(formValues, aksjonspunktCode));
  };

  return (
    <div>
      {!readOnly && (
        <Button
          variant="primary"
          size="small"
          type="button"
          loading={spinner}
          onClick={event => {
            tempSave(event);
          }}
        >
          <FormattedMessage id="Ankebehandling.TempSaveButton" />
        </Button>
      )}
    </div>
  );
};

export default TempsaveAnkeButton;
