import React, { ReactNode } from 'react';
import { FormattedMessage, injectIntl, IntlShape, WrappedComponentProps } from 'react-intl';
import { Element, Normaltekst } from 'nav-frontend-typografi';

import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { HistorikkinnslagEndretFelt } from '@k9-sak-web/types';

import {
  findEndretFeltNavn,
  findEndretFeltVerdi,
  findHendelseText,
  findIdForOpplysningCode,
  findResultatText,
} from './felles/historikkUtils';
import BubbleText from './felles/bubbleText';
import HistorikkDokumentLenke from './felles/HistorikkDokumentLenke';
import HistorikkMal from '../HistorikkMalTsType';
import Skjermlenke from './felles/Skjermlenke';

const formatChangedField = (
  endretFelt: HistorikkinnslagEndretFelt,
  intl: IntlShape,
  getKodeverknavn: (kode: string, kodeverk: string) => string,
): ReactNode => {
  const fieldName = findEndretFeltNavn(endretFelt, intl);
  const sub1 = fieldName.substring(0, fieldName.lastIndexOf(';'));
  const sub2 = fieldName.substring(fieldName.lastIndexOf(';') + 1);
  const fromValue = findEndretFeltVerdi(endretFelt, endretFelt.fraVerdi, intl, getKodeverknavn);
  const toValue = findEndretFeltVerdi(endretFelt, endretFelt.tilVerdi, intl, getKodeverknavn);

  if (endretFelt.fraVerdi !== null) {
    return (
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
    );
  }
  return false;
};

const HistorikkMalType7 = ({
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
          {historikkinnslagDel.skjermlenke && (
            <Skjermlenke
              skjermlenke={historikkinnslagDel.skjermlenke}
              behandlingLocation={behandlingLocation}
              getKodeverknavn={getKodeverknavn}
              createLocationForSkjermlenke={createLocationForSkjermlenke}
            />
          )}

          {historikkinnslagDel.hendelse && (
            <Element>{findHendelseText(historikkinnslagDel.hendelse, getKodeverknavn)}</Element>
          )}

          {historikkinnslagDel.resultat && (
            <Element>{findResultatText(historikkinnslagDel.resultat, intl, getKodeverknavn)}</Element>
          )}

          {historikkinnslagDel.endredeFelter &&
            historikkinnslagDel.endredeFelter.map((endretFelt, i) => (
              <div key={`endredeFelter${i + 1}`}>{formatChangedField(endretFelt, intl, getKodeverknavn)}</div>
            ))}

          {historikkinnslagDel.opplysninger &&
            historikkinnslagDel.opplysninger.map(opplysning => (
              <FormattedMessage
                id={findIdForOpplysningCode(opplysning)}
                values={{
                  antallBarn: opplysning.tilVerdi,
                  b: chunks => <b>{chunks}</b>,
                }}
              />
            ))}
          {!!historikkinnslagDel.tema && historikkinnslagDel.tema.navnVerdi !== undefined && (
            <Normaltekst>({historikkinnslagDel.tema.navnVerdi})</Normaltekst>
          )}
          {historikkinnslagDel.aarsak && (
            <Normaltekst>{getKodeverknavn(historikkinnslagDel.aarsak, kodeverkTyper.VENT_AARSAK)}</Normaltekst>
          )}
          {historikkinnslagDel.begrunnelse && (
            <BubbleText
              bodyText={getKodeverknavn(historikkinnslagDel.begrunnelse, kodeverkTyper.HISTORIKK_BEGRUNNELSE_TYPE)}
            />
          )}
          {historikkinnslagDel.begrunnelseFritekst && <BubbleText bodyText={historikkinnslagDel.begrunnelseFritekst} />}
          {dokumentLinks &&
            dokumentLinks.map(dokumentLenke => (
              <HistorikkDokumentLenke
                key={`${dokumentLenke.tag}@${dokumentLenke.url}`}
                dokumentLenke={dokumentLenke}
                saksnummer={saksnummer}
              />
            ))}
        </div>
      ))}
    </>
  );
};

export default injectIntl(HistorikkMalType7);
