import { Button } from '@navikt/ds-react';
import React from 'react';
import { FormattedMessage } from 'react-intl';

const transformValues = (values, aksjonspunktCode) => ({
  begrunnelse: values.begrunnelse,
  kode: aksjonspunktCode,
});

const TempsaveButton = ({ formValues, saveUnntak, spinner = false, aksjonspunktCode, readOnly = false }) => {
  const tempSave = event => {
    event.preventDefault();
    saveUnntak(transformValues(formValues, aksjonspunktCode));
  };

  return (
    <div>
      {!readOnly && (
        <Button variant="secondary" size="small" type="button" loading={spinner} onClick={event => tempSave(event)}>
          <FormattedMessage id="Unntak.TempSaveButton" />
        </Button>
      )}
    </div>
  );
};

export default TempsaveButton;
