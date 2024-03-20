import { Label } from '@navikt/ds-react';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';

import HistorikkMal from '../HistorikkMalTsType';
import { findHendelseText, findResultatText } from './felles/historikkUtils';
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
        <Label size="small" as="p" className="snakkeboble-panel__tekst">
          {`${findHendelseText(historikkinnslagDeler[0].hendelse, getKodeverknavn)}:` +
            ` ${findResultatText(historikkinnslagDeler[0].resultat, intl, getKodeverknavn)}`}
        </Label>
      )}
      {!historikkinnslagDeler[0].resultat && historikkinnslagDeler[0].hendelse && (
        <Label size="small" as="p" className="snakkeboble-panel__tekst">
          {findHendelseText(historikkinnslagDeler[0].hendelse, getKodeverknavn)}
        </Label>
      )}
    </>
  );
};

export default injectIntl(HistorikkMalType2);
