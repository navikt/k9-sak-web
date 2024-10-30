import { HistorikkinnslagEndretFelt } from '@k9-sak-web/types';
import { BodyShort, Label } from '@navikt/ds-react';
import React, { ReactNode } from 'react';
import { FormattedMessage, injectIntl, IntlShape, WrappedComponentProps } from 'react-intl';
import { KodeverkNavnFraKodeFnType, KodeverkType } from '@k9-sak-web/lib/kodeverk/types';
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
      {historikkinnslagDeler.map((historikkinnslagDel, historikkinnslagDelIndex) => {
        const {
          skjermlenke,
          hendelse,
          resultat,
          endredeFelter,
          opplysninger,
          tema,
          aarsak,
          aarsakKodeverkType,
          begrunnelse,
          begrunnelseFritekst,
          begrunnelseKodeverkType,
        } = historikkinnslagDel;

        const begrunnelseTekst = begrunnelse
          ? kodeverkNavnFraKodeFn(
              begrunnelse,
              KodeverkType[begrunnelseKodeverkType] || KodeverkType.HISTORIKK_BEGRUNNELSE_TYPE,
            )
          : null;

        const aarsakTekst = begrunnelse
          ? kodeverkNavnFraKodeFn(
              begrunnelse,
              KodeverkType[aarsakKodeverkType] || KodeverkType.HISTORIKK_AVKLART_SOEKNADSPERIODE_TYPE,
            )
          : null;

        return (
          <div
            key={
              `historikkinnslagDel${historikkinnslagDelIndex}` // eslint-disable-line react/no-array-index-key
            }
          >
            {skjermlenke && (
              <Skjermlenke
                skjermlenke={skjermlenke}
                behandlingLocation={behandlingLocation}
                kodeverkNavnFraKodeFn={kodeverkNavnFraKodeFn}
                createLocationForSkjermlenke={createLocationForSkjermlenke}
              />
            )}

            {hendelse && (
              <Label size="small" as="p">
                {findHendelseText(hendelse, kodeverkNavnFraKodeFn)}
              </Label>
            )}

            {resultat && (
              <Label size="small" as="p">
                {findResultatText(resultat, intl, kodeverkNavnFraKodeFn)}
              </Label>
            )}

            {endredeFelter &&
              endredeFelter.map((endretFelt, i) => (
                <div key={`endredeFelter${i + 1}`}>{formatChangedField(endretFelt, intl, kodeverkNavnFraKodeFn)}</div>
              ))}

            {opplysninger &&
              opplysninger.map(opplysning => (
                <FormattedMessage
                  id={findIdForOpplysningCode(opplysning)}
                  values={{
                    antallBarn: opplysning.tilVerdi,
                    b: chunks => <b>{chunks}</b>,
                  }}
                />
              ))}
            {!!tema && tema.navnVerdi !== undefined && (
              <BodyShort size="small">({historikkinnslagDel.tema.navnVerdi})</BodyShort>
            )}
            {aarsak && <BodyShort size="small">{aarsakTekst}</BodyShort>}
            {begrunnelse && <BubbleText bodyText={begrunnelseTekst} />}
            {begrunnelseFritekst && <BubbleText bodyText={begrunnelseFritekst} />}
            {dokumentLinks &&
              dokumentLinks.map(dokumentLenke => (
                <HistorikkDokumentLenke
                  key={`${dokumentLenke.tag}@${dokumentLenke.url}`}
                  dokumentLenke={dokumentLenke}
                  saksnummer={saksnummer}
                />
              ))}
          </div>
        );
      })}
    </>
  );
};

export default injectIntl(HistorikkMalType7);
