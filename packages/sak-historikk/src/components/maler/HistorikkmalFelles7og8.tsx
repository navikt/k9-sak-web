import React, { ReactElement } from 'react';
import { FormattedHTMLMessage, IntlFormatters } from 'react-intl';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import Kodeverk from '@fpsak-frontend/behandling-felles/src/types/kodeverkTsType';

import Skjermlenke from './felles/Skjermlenke';
import { findHendelseText, findIdForOpplysningCode, findResultatText } from './felles/historikkUtils';
import BubbleText from './felles/bubbleText';
import HistorikkDokumentLenke from './felles/HistorikkDokumentLenke';
import Dokumentlenke from './felles/Dokumentlenke';

interface EndretFelt {
  fraVerdi: string;
  tilVerdi: string;
}

interface HistorikkmalFelles7og8Props {
  historikkinnslagDeler: any; // TODO (ANDERS) bruk interface som kommer i master snart
  behandlingLocation: {
    pathname: string,
  };
  dokumentLinks: Dokumentlenke[];
  intl: IntlFormatters;
  saksNr: string;
  getKodeverknavn?: (kodeverkOjekt: Kodeverk, undertype?: string) => string;
  formatChangedField: (endretFelt: EndretFelt) => ReactElement;
  formatBegrunnelse: (begrunnelse: string) => string;
}

const HistorikkMalFelles7og8: React.FunctionComponent<HistorikkmalFelles7og8Props> = ({
  historikkinnslagDeler,
  behandlingLocation,
  dokumentLinks,
  intl,
  saksNr,
  getKodeverknavn,
  formatChangedField,
  formatBegrunnelse,
}) =>
  historikkinnslagDeler.map((historikkinnslagDel, historikkinnslagDelIndex) => (
    <div
      key={
        `historikkinnslagDel${historikkinnslagDelIndex}` // eslint-disable-line react/no-array-index-key
      }
    >
      <>
        <Skjermlenke
          skjermlenke={historikkinnslagDel.skjermlenke}
          behandlingLocation={behandlingLocation}
          getKodeverknavn={getKodeverknavn}
          scrollUpOnClick={false}
        />

        {historikkinnslagDel.hendelse && (
          <Element>{findHendelseText(historikkinnslagDel.hendelse, getKodeverknavn)}</Element>
        )}

        {historikkinnslagDel.resultat && (
          <Element>{findResultatText(historikkinnslagDel.resultat, intl, getKodeverknavn)}</Element>
        )}

        {historikkinnslagDel.endredeFelter &&
          historikkinnslagDel.endredeFelter.map((endretFelt, i) => (
            <div key={`endredeFelter${i + 1}`}>{formatChangedField(endretFelt)}</div>
          ))}

        {historikkinnslagDel.opplysninger &&
          historikkinnslagDel.opplysninger.map(opplysning => (
            <FormattedHTMLMessage
              id={findIdForOpplysningCode(opplysning)}
              values={{ antallBarn: opplysning.tilVerdi }}
            />
          ))}

        {historikkinnslagDel.aarsak && <Normaltekst>{getKodeverknavn(historikkinnslagDel.aarsak)}</Normaltekst>}
        {historikkinnslagDel.begrunnelse && (
          <BubbleText bodyText={formatBegrunnelse(historikkinnslagDel.begrunnelse)} />
        )}
        {historikkinnslagDel.begrunnelseFritekst && <BubbleText bodyText={historikkinnslagDel.begrunnelseFritekst} />}
        <div>
          {dokumentLinks &&
            dokumentLinks.map(dokumentLenke => (
              <HistorikkDokumentLenke
                key={`${dokumentLenke.tag}@${dokumentLenke.url}`}
                dokumentLenke={dokumentLenke}
                saksNr={saksNr}
              />
            ))}
        </div>
      </>
    </div>
  ));

export default HistorikkMalFelles7og8;
