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
import HistorikkDokumentLenke from './felles/HistorikkDokumentLenke';
import BubbleText from './felles/bubbleText';
import HistorikkMal from '../HistorikkMalTsType';
import Skjermlenke from './felles/Skjermlenke';

const formatChangedField = (
  endretFelt: HistorikkinnslagEndretFelt,
  intl: IntlShape,
  getKodeverknavn: (kode: string, kodeverk: string) => string,
): ReactNode => {
  const fieldName = findEndretFeltNavn(endretFelt, intl);
  const fromValue = findEndretFeltVerdi(endretFelt, endretFelt.fraVerdi, intl, getKodeverknavn);
  const toValue = findEndretFeltVerdi(endretFelt, endretFelt.tilVerdi, intl, getKodeverknavn);

  if (endretFelt.fraVerdi !== null) {
    return (
      <FormattedMessage
        id="Historikk.Template.8.ChangedFromTo"
        values={{
          fieldName,
          fromValue,
          toValue,
          b: chunks => <b>{chunks}</b>,
        }}
      />
    );
  }
  return (
    <FormattedMessage
      id="Historikk.Template.8.LagtTil"
      values={{
        fieldName,
        value: toValue,
        b: chunks => <b>{chunks}</b>,
      }}
    />
  );
};

const HistorikkMalType8 = ({
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
                values={{ antallBarn: opplysning.tilVerdi, b: chunks => <b>{chunks}</b> }}
              />
            ))}

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

export default injectIntl(HistorikkMalType8);
