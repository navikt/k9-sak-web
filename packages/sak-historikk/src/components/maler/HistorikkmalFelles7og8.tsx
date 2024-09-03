import { BodyShort, Label } from '@navikt/ds-react';
import React from 'react';
import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl';
import { KodeverkType } from '@k9-sak-web/lib/kodeverk/types/KodeverkType.js';
import HistorikkMal from '../HistorikkMalTsType';
import BubbleText from './felles/bubbleText';
import HistorikkDokumentLenke from './felles/HistorikkDokumentLenke';
import { findHendelseText, findIdForOpplysningCode, findResultatText } from './felles/historikkUtils';
import Skjermlenke from './felles/Skjermlenke';

// TODO Kan denne slettast?
const HistorikkMalFelles7og8 = ({
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
          hendelse,
          resultat,
          endredeFelter,
          opplysninger,
          aarsak,
          begrunnelse,
          begrunnelseFritekst,
          aarsakKodeverkType,
        } = historikkinnslagDel;

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
            <Skjermlenke
              skjermlenke={historikkinnslagDel.skjermlenke}
              behandlingLocation={behandlingLocation}
              kodeverkNavnFraKodeFn={kodeverkNavnFraKodeFn}
              scrollUpOnClick={false}
              createLocationForSkjermlenke={createLocationForSkjermlenke}
            />

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
                <div key={`endredeFelter${i + 1}`}>{/* formatChangedField(endretFelt) */}</div>
              ))}

            {opplysninger &&
              opplysninger.map(opplysning => (
                <FormattedMessage
                  id={findIdForOpplysningCode(opplysning)}
                  values={{ antallBarn: opplysning.tilVerdi }}
                />
              ))}

            {aarsak && <BodyShort size="small">{aarsakTekst}</BodyShort>}
            {begrunnelse && <BubbleText bodyText="" />}
            {begrunnelseFritekst && <BubbleText bodyText={begrunnelseFritekst} />}
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
        );
      })}
    </>
  );
};

export default injectIntl(HistorikkMalFelles7og8);
