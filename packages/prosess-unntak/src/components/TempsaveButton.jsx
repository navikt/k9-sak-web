import React from 'react';
import { Knapp } from 'nav-frontend-knapper';
import PropTypes from 'prop-types';
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
        <Knapp mini htmlType="button" spinner={spinner} onClick={event => tempSave(event)}>
          <FormattedMessage id="Unntak.TempSaveButton" />
        </Knapp>
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
