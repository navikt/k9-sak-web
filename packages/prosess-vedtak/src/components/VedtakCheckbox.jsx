import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from '@navikt/ds-react';

const VedtakCheckbox = ({ readOnly, readOnlyHideEmpty, onChange, name, label, value, onBlur, error }) => (
  <div>
    <Checkbox
      key={name}
      name={name}
      onChange={onChange}
      onBlur={onBlur}
      readOnly={readOnly}
      readOnlyHideEmpty={readOnlyHideEmpty}
      value={value}
      error={error}
    >
      {label}
    </Checkbox>
  </div>
);

VedtakCheckbox.propTypes = {
  onChange: PropTypes.func,
  name: PropTypes.string.isRequired,
  readOnly: PropTypes.bool.isRequired,
  readOnlyHideEmpty: PropTypes.bool,
  label: PropTypes.string,
  value: PropTypes.bool,
  onBlur: PropTypes.func,
  error: PropTypes.string
};

VedtakCheckbox.defaultProps = {
  readOnlyHideEmpty: false,
};

export default VedtakCheckbox;
