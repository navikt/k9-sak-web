import { BodyShort, Label } from '@navikt/ds-react';
import React from 'react';
import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl';
import { KodeverkType } from '@k9-sak-web/lib/types/KodeverkType.js';
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
      {historikkinnslagDeler.map((historikkinnslagDel, historikkinnslagDelIndex) => (
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
              <div key={`endredeFelter${i + 1}`}>{/* formatChangedField(endretFelt) */}</div>
            ))}

          {historikkinnslagDel.opplysninger &&
            historikkinnslagDel.opplysninger.map(opplysning => (
              <FormattedMessage id={findIdForOpplysningCode(opplysning)} values={{ antallBarn: opplysning.tilVerdi }} />
            ))}

          {historikkinnslagDel.aarsak && (
            <BodyShort size="small">
              {kodeverkNavnFraKodeFn(historikkinnslagDel.aarsak, KodeverkType.HISTORIKK_AVKLART_SOEKNADSPERIODE_TYPE)}
            </BodyShort>
          )}
          {historikkinnslagDel.begrunnelse && <BubbleText bodyText="" />}
          {historikkinnslagDel.begrunnelseFritekst && <BubbleText bodyText={historikkinnslagDel.begrunnelseFritekst} />}
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
