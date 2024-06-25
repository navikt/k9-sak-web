import { HistorikkinnslagEndretFelt } from '@k9-sak-web/types';
import { BodyShort, Label } from '@navikt/ds-react';
import React, { ReactNode } from 'react';
import { FormattedMessage, injectIntl, IntlShape, WrappedComponentProps } from 'react-intl';
import { KodeverkNavnFraKodeFnType, KodeverkType } from '@k9-sak-web/lib/types/index.js';
import HistorikkMal from '../HistorikkMalTsType';
import BubbleText from './felles/bubbleText';
import HistorikkDokumentLenke from './felles/HistorikkDokumentLenke';
import {
  findEndretFeltNavn,
  findEndretFeltVerdi,
  findHendelseText,
  findIdForOpplysningCode,
  findResultatText,
} from './felles/historikkUtils';
import Skjermlenke from './felles/Skjermlenke';

const formatChangedField = (
  endretFelt: HistorikkinnslagEndretFelt,
  intl: IntlShape,
  kodeverkNavnFraKodeFn: KodeverkNavnFraKodeFnType,
): ReactNode => {
  const fieldName = findEndretFeltNavn(endretFelt, intl);
  const sub1 = fieldName.substring(0, fieldName.lastIndexOf(';'));
  const sub2 = fieldName.substring(fieldName.lastIndexOf(';') + 1);
  const fromValue = findEndretFeltVerdi(endretFelt, endretFelt.fraVerdi, intl, kodeverkNavnFraKodeFn);
  const toValue = findEndretFeltVerdi(endretFelt, endretFelt.tilVerdi, intl, kodeverkNavnFraKodeFn);

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
  kodeverkNavnFraKodeFn,
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
              kodeverkNavnFraKodeFn={kodeverkNavnFraKodeFn}
              createLocationForSkjermlenke={createLocationForSkjermlenke}
            />
          )}

          {historikkinnslagDel.hendelse && (
            <Label size="small" as="p">
              {findHendelseText(historikkinnslagDel.hendelse, kodeverkNavnFraKodeFn)}
            </Label>
          )}

          {historikkinnslagDel.resultat && (
            <Label size="small" as="p">
              {findResultatText(historikkinnslagDel.resultat, intl, kodeverkNavnFraKodeFn)}
            </Label>
          )}

          {historikkinnslagDel.endredeFelter &&
            historikkinnslagDel.endredeFelter.map((endretFelt, i) => (
              <div key={`endredeFelter${i + 1}`}>{formatChangedField(endretFelt, intl, kodeverkNavnFraKodeFn)}</div>
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
            <BodyShort size="small">({historikkinnslagDel.tema.navnVerdi})</BodyShort>
          )}
          {historikkinnslagDel.aarsak && (
            <BodyShort size="small">
              {kodeverkNavnFraKodeFn(historikkinnslagDel.aarsak, KodeverkType.VENT_AARSAK)}
            </BodyShort>
          )}
          {historikkinnslagDel.begrunnelse && (
            <BubbleText
              bodyText={kodeverkNavnFraKodeFn(historikkinnslagDel.begrunnelse, KodeverkType.HISTORIKK_BEGRUNNELSE_TYPE)}
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
