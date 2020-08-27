import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';

import { findEndretFeltNavn, findEndretFeltVerdi } from './felles/historikkUtils';
import historikkinnslagDelPropType from '../../propTypes/historikkinnslagDelPropType';
import HistorikkMalFelles7og8 from './HistorikkmalFelles7og8';

const HistorikkMalType7 = ({
  historikkinnslagDeler,
  behandlingLocation,
  dokumentLinks,
  saksNr,
  getKodeverknavn,
  createLocationForSkjermlenke,
}) => {
  const intl = useIntl();
  const formatChangedField = endretFelt => {
    const fieldName = findEndretFeltNavn(endretFelt, intl);
    const sub1 = fieldName.substring(0, fieldName.lastIndexOf(';'));
    const sub2 = fieldName.substring(fieldName.lastIndexOf(';') + 1);
    const fromValue = findEndretFeltVerdi(endretFelt, endretFelt.fraVerdi, intl, getKodeverknavn);
    const toValue = findEndretFeltVerdi(endretFelt, endretFelt.tilVerdi, intl, getKodeverknavn);

    if (endretFelt.fraVerdi !== null) {
      return (
        <div>
          <FormattedMessage
            id="Historikk.Template.7.ChangedFromTo"
            values={{
              sub1,
              sub2,
              fromValue,
              toValue,
              b: chunks => <b>{chunks}</b>,
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
      createLocationForSkjermlenke={createLocationForSkjermlenke}
    />
  );
};

HistorikkMalType7.propTypes = {
  historikkinnslagDeler: PropTypes.arrayOf(historikkinnslagDelPropType).isRequired,
  behandlingLocation: PropTypes.shape().isRequired,
  dokumentLinks: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  saksNr: PropTypes.number.isRequired,
  getKodeverknavn: PropTypes.func.isRequired,
  createLocationForSkjermlenke: PropTypes.func.isRequired,
};

export default HistorikkMalType7;
