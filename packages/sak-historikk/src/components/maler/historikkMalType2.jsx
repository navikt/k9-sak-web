import React from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { Element } from 'nav-frontend-typografi';

import historikkinnslagDelPropType from '../../propTypes/historikkinnslagDelPropType';
import { findHendelseText, findResultatText } from './felles/historikkUtils';
import Skjermlenke from './felles/Skjermlenke';

const HistorikkMalType2 = ({ historikkinnslagDeler, behandlingLocation, getKodeverknavn }) => (
  <>
    <Skjermlenke
      skjermlenke={historikkinnslagDeler[0].skjermlenke}
      behandlingLocation={behandlingLocation}
      getKodeverknavn={getKodeverknavn}
      scrollUpOnClick
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
};

export default HistorikkMalType2;

/*

URL:
 http://[HOSTNAME]<:PORT>/#[/fagsak/FAGSAK_ID]</behandling/[BEHANDLING_ID]></punkt/[PUNKT_NAVN]></fakta/[FAKTA_NAVN]></SIDOPANEL_NAVN>

 PUNKT_NAVN: default | beregningsresultat | vedtak | vilkår-type navn uten norske tegn
 FAKTA_NAVN: default | tilleggsopplysninger | vilkår-type navn uten norske tegn ("-" er separator hvis flere)
 SIDOPANEL_NAVN: historikk, meldinger, etc

 */
