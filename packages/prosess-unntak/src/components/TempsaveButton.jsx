import { Button } from '@navikt/ds-react';
import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';

const transformValues = (values, aksjonspunktCode) => ({
  begrunnelse: values.begrunnelse,
  kode: aksjonspunktCode,
});

const TempsaveButton = ({ formValues, saveUnntak, spinner, aksjonspunktCode, readOnly }) => {
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

TempsaveButton.propTypes = {
  aksjonspunktCode: PropTypes.string.isRequired,
  formValues: PropTypes.shape().isRequired,
  saveUnntak: PropTypes.func.isRequired,
  spinner: PropTypes.bool,
  readOnly: PropTypes.bool,
};

TempsaveButton.defaultProps = {
  spinner: false,
  readOnly: false,
};

export default TempsaveButton;
