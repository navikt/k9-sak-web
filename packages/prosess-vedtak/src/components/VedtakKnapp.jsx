import React from 'react';
import PropTypes from 'prop-types';

import { CheckboxField } from '@fpsak-frontend/form';

const VedtakKnapp = ({ readOnly, readOnlyHideEmpty, onChange, keyName, label, value }) => {
  console.log(value)
  return (
    <div>
      <CheckboxField
        key={keyName}
        name={keyName}
        label={{ id: label }}
        onChange={onChange}
        readOnly={readOnly}
        readOnlyHideEmpty={readOnlyHideEmpty}
        value={value}
      />
    </div>
  );
};

VedtakKnapp.propTypes = {
  onChange: PropTypes.func,
  keyName: PropTypes.string.isRequired,
  readOnly: PropTypes.bool.isRequired,
  readOnlyHideEmpty: PropTypes.bool,
  label: PropTypes.string,
  value: PropTypes.bool,
};

VedtakKnapp.defaultProps = {
  readOnlyHideEmpty: false,
};

export default VedtakKnapp;
