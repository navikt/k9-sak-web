import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { Element } from 'nav-frontend-typografi';

import { findHendelseText, findResultatText } from './felles/historikkUtils';
import HistorikkMal from '../HistorikkMalTsType';
import Skjermlenke from './felles/Skjermlenke';

const HistorikkMalType2 = ({
  intl,
  historikkinnslag,
  behandlingLocation,
  getKodeverknavn,
  createLocationForSkjermlenke,
}: HistorikkMal & WrappedComponentProps) => {
  const { historikkinnslagDeler } = historikkinnslag;
  return (
    <>
      {historikkinnslagDeler[0].skjermlenke && (
        <Skjermlenke
          skjermlenke={historikkinnslagDeler[0].skjermlenke}
          behandlingLocation={behandlingLocation}
          getKodeverknavn={getKodeverknavn}
          scrollUpOnClick
          createLocationForSkjermlenke={createLocationForSkjermlenke}
        />
      )}
      {historikkinnslagDeler[0].resultat && historikkinnslagDeler[0].hendelse && (
        <Element className="snakkeboble-panel__tekst">
          {`${findHendelseText(historikkinnslagDeler[0].hendelse, getKodeverknavn)}:` +
            ` ${findResultatText(historikkinnslagDeler[0].resultat, intl, getKodeverknavn)}`}
        </Element>
      )}
      {!historikkinnslagDeler[0].resultat && historikkinnslagDeler[0].hendelse && (
        <Element className="snakkeboble-panel__tekst">
          {findHendelseText(historikkinnslagDeler[0].hendelse, getKodeverknavn)}
        </Element>
      )}
    </>
  );
};

export default injectIntl(HistorikkMalType2);
