import { Button } from '@navikt/ds-react';
import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import klageVurderingType from '@fpsak-frontend/kodeverk/src/klageVurdering';

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

const TempsaveKlageButton = ({ formValues, saveKlage, spinner, aksjonspunktCode, readOnly }) => {
  const tempSave = event => {
    event.preventDefault();
    saveKlage(transformValues(formValues, aksjonspunktCode));
  };

  return (
    <div>
      {!readOnly && (
        <Button variant="primary" size="small" type="button" loading={spinner} onClick={event => tempSave(event)}>
          <FormattedMessage id="Klage.ResolveKlage.TempSaveButton" />
        </Button>
      )}
    </div>
  );
};

TempsaveKlageButton.propTypes = {
  aksjonspunktCode: PropTypes.string.isRequired,
  formValues: PropTypes.shape().isRequired,
  saveKlage: PropTypes.func.isRequired,
  spinner: PropTypes.bool,
  readOnly: PropTypes.bool,
};

TempsaveKlageButton.defaultProps = {
  spinner: false,
  readOnly: false,
};

export default TempsaveKlageButton;
