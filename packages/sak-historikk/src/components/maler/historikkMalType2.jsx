import React from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { Element } from 'nav-frontend-typografi';

import historikkinnslagDelPropType from '../../propTypes/historikkinnslagDelPropType';
import { findHendelseText, findResultatText } from './felles/historikkUtils';
import Skjermlenke from './felles/Skjermlenke';

const HistorikkMalType2 = ({
  historikkinnslagDeler,
  behandlingLocation,
  getKodeverknavn,
  createLocationForSkjermlenke,
}) => (
  <>
    <Skjermlenke
      skjermlenke={historikkinnslagDeler[0].skjermlenke}
      behandlingLocation={behandlingLocation}
      getKodeverknavn={getKodeverknavn}
      scrollUpOnClick
      createLocationForSkjermlenke={createLocationForSkjermlenke}
    />
    {historikkinnslagDeler[0].resultat && historikkinnslagDeler[0].hendelse && (
      <Element>
        {`${findHendelseText(historikkinnslagDeler[0].hendelse, getKodeverknavn)}: ${findResultatText(
          historikkinnslagDeler[0].resultat,
          useIntl(),
          getKodeverknavn,
        )}`}
      </Element>
    )}
    {!historikkinnslagDeler[0].resultat && historikkinnslagDeler[0].hendelse && (
      <Element>{findHendelseText(historikkinnslagDeler[0].hendelse, getKodeverknavn)}</Element>
    )}
  </>
);

HistorikkMalType2.propTypes = {
  historikkinnslagDeler: PropTypes.arrayOf(historikkinnslagDelPropType).isRequired,
  behandlingLocation: PropTypes.shape().isRequired,
  getKodeverknavn: PropTypes.func.isRequired,
  createLocationForSkjermlenke: PropTypes.func.isRequired,
};

export default HistorikkMalType2;
