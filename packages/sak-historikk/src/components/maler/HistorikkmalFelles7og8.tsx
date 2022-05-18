import React from 'react';
import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl';
import { Element, Normaltekst } from 'nav-frontend-typografi';

import Skjermlenke from './felles/Skjermlenke';
import { findHendelseText, findIdForOpplysningCode, findResultatText } from './felles/historikkUtils';
import BubbleText from './felles/bubbleText';
import HistorikkDokumentLenke from './felles/HistorikkDokumentLenke';
import HistorikkMal from '../HistorikkMalTsType';

// TODO Kan denne slettast?
const HistorikkMalFelles7og8 = ({
  intl,
  historikkinnslag,
  behandlingLocation,
  getKodeverknavn,
  createLocationForSkjermlenke,
  saksnummer,
}: HistorikkMal & WrappedComponentProps) => {
  const { historikkinnslagDeler, dokumentLinks } = historikkinnslag;
  return (
    <>
      {historikkinnslagDeler.map((historikkinnslagDel, historikkinnslagDelIndex) => (
        <div
          key={
            `historikkinnslagDel${historikkinnslagDelIndex}` // eslint-disable-line react/no-array-index-key
          }
        >
          <Skjermlenke
            skjermlenke={historikkinnslagDel.skjermlenke}
            behandlingLocation={behandlingLocation}
            getKodeverknavn={getKodeverknavn}
            scrollUpOnClick={false}
            createLocationForSkjermlenke={createLocationForSkjermlenke}
          />

          {historikkinnslagDel.hendelse && (
            <Element>{findHendelseText(historikkinnslagDel.hendelse, getKodeverknavn)}</Element>
          )}

          {historikkinnslagDel.resultat && (
            <Element>{findResultatText(historikkinnslagDel.resultat, intl, getKodeverknavn)}</Element>
          )}

          {historikkinnslagDel.endredeFelter &&
            historikkinnslagDel.endredeFelter.map((endretFelt, i) => (
              <div key={`endredeFelter${i + 1}`}>{/* formatChangedField(endretFelt) */}</div>
            ))}

          {historikkinnslagDel.opplysninger &&
            historikkinnslagDel.opplysninger.map(opplysning => (
              <FormattedMessage
                id={findIdForOpplysningCode(opplysning)}
                values={{ antallBarn: opplysning.tilVerdi }}
              />
            ))}

          {historikkinnslagDel.aarsak && <Normaltekst>{getKodeverknavn(historikkinnslagDel.aarsak)}</Normaltekst>}
          {historikkinnslagDel.begrunnelse && <BubbleText bodyText="" />}
          {historikkinnslagDel.begrunnelseFritekst && (
            <BubbleText bodyText={historikkinnslagDel.begrunnelseFritekst} />
          )}
          <div>
            {dokumentLinks &&
              dokumentLinks.map(dokumentLenke => (
                <HistorikkDokumentLenke
                  key={`${dokumentLenke.tag}@${dokumentLenke.url}`}
                  dokumentLenke={dokumentLenke}
                  saksnummer={saksnummer}
                />
              ))}
          </div>
        </div>
      ))}
    </>
  );
};

export default injectIntl(HistorikkMalFelles7og8);
