import React from 'react';
import PropTypes from 'prop-types';
import { FormattedHTMLMessage, injectIntl } from 'react-intl';

import { findEndretFeltNavn, findEndretFeltVerdi } from './felles/historikkUtils';
import historikkinnslagDelPropType from '../../propTypes/historikkinnslagDelPropType';
import HistorikkMalFelles7og8 from './HistorikkmalFelles7og8';

const HistorikkMalType7 = ({
  historikkinnslagDeler,
  behandlingLocation,
  dokumentLinks,
  intl,
  saksNr,
  getKodeverknavn,
}) => {
  const formatChangedField = endretFelt => {
    const fieldName = findEndretFeltNavn(endretFelt, intl);
    const sub1 = fieldName.substring(0, fieldName.lastIndexOf(';'));
    const sub2 = fieldName.substring(fieldName.lastIndexOf(';') + 1);
    const fromValue = findEndretFeltVerdi(endretFelt, endretFelt.fraVerdi, intl);
    const toValue = findEndretFeltVerdi(endretFelt, endretFelt.tilVerdi, intl);

    if (endretFelt.fraVerdi !== null) {
      return (
        <div>
          <FormattedHTMLMessage
            id="Historikk.Template.7.ChangedFromTo"
            values={{
              sub1,
              sub2,
              fromValue,
              toValue,
            }}
          />
        </div>
      );
    }
    return null;
  };

  const formatBegrunnelse = begrunnelse => begrunnelse;

  return (
    <HistorikkMalFelles7og8
      historikkinnslagDeler={historikkinnslagDeler}
      behandlingLocation={behandlingLocation}
      dokumentLinks={dokumentLinks}
      saksNr={saksNr}
      intl={intl}
      getKodeverknavn={getKodeverknavn}
      formatChangedField={formatChangedField}
      formatBegrunnelse={formatBegrunnelse}
    />
  );
};

HistorikkMalType7.propTypes = {
  historikkinnslagDeler: PropTypes.arrayOf(historikkinnslagDelPropType).isRequired,
  behandlingLocation: PropTypes.shape().isRequired,
  dokumentLinks: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  intl: PropTypes.shape().isRequired,
  saksNr: PropTypes.number.isRequired,
  getKodeverknavn: PropTypes.func.isRequired,
};

export default injectIntl(HistorikkMalType7);
