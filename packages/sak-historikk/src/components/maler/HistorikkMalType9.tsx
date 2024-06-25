import React from 'react';
import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl';

import tilbakekrevingVidereBehandling from '@fpsak-frontend/kodeverk/src/tilbakekrevingVidereBehandling';
import { KodeverkType } from '@k9-sak-web/lib/types/KodeverkType.js';
import { HistorikkinnslagEndretFelt } from '@k9-sak-web/types';

import historikkinnslagType from '../../kodeverk/historikkinnslagType';
import HistorikkMal from '../HistorikkMalTsType';
import BubbleText from './felles/bubbleText';
import { findEndretFeltVerdi } from './felles/historikkUtils';
import Skjermlenke from './felles/Skjermlenke';

import styles from './historikkMalType.module.css';

const getSplitPeriods = (endredeFelter: HistorikkinnslagEndretFelt[]): string => {
  let text = '';
  endredeFelter.forEach((felt, index) => {
    if (index === endredeFelter.length - 1) {
      text += ` og ${felt.tilVerdi}`;
    } else if (index === endredeFelter.length - 2) {
      text += `${felt.tilVerdi} `;
    } else {
      text += `${felt.tilVerdi}, `;
    }
  });
  return text;
};

const HistorikkMalType9 = ({
  intl,
  historikkinnslag,
  behandlingLocation,
  kodeverkNavnFraKodeFn,
  createLocationForSkjermlenke,
}: HistorikkMal & WrappedComponentProps) => (
  <>
    {historikkinnslag.historikkinnslagDeler.map((historikkinnslagDel, historikkinnslagDelIndex) => (
      <div
        key={
          `historikkinnslagDel${historikkinnslagDelIndex}` // eslint-disable-line react/no-array-index-key
        }
      >
        <div>
          {historikkinnslagDel.skjermlenke && (
            <Skjermlenke
              skjermlenke={historikkinnslagDel.skjermlenke}
              behandlingLocation={behandlingLocation}
              kodeverkNavnFraKodeFn={kodeverkNavnFraKodeFn}
              createLocationForSkjermlenke={createLocationForSkjermlenke}
            />
          )}
          {historikkinnslagDel.endredeFelter && historikkinnslag.type === historikkinnslagType.OVST_UTTAK_SPLITT && (
            <FormattedMessage
              id="Historikk.Template.9"
              values={{
                opprinneligPeriode: historikkinnslagDel.endredeFelter[0].fraVerdi,
                numberOfPeriods: historikkinnslagDel.endredeFelter.length,
                splitPeriods: getSplitPeriods(historikkinnslagDel.endredeFelter),
                b: chunks => <b>{chunks}</b>,
                br: <br />,
              }}
            />
          )}

          {historikkinnslagDel.endredeFelter &&
            historikkinnslag.type === historikkinnslagType.FASTSATT_UTTAK_SPLITT && (
              <FormattedMessage
                id="Historikk.Template.9.ManuellVurdering"
                values={{
                  opprinneligPeriode: historikkinnslagDel.endredeFelter[0].fraVerdi,
                  numberOfPeriods: historikkinnslagDel.endredeFelter.length,
                  splitPeriods: getSplitPeriods(historikkinnslagDel.endredeFelter),
                  b: chunks => <b>{chunks}</b>,
                  br: <br />,
                }}
              />
            )}

          {historikkinnslag.type === historikkinnslagType.TILBAKEKR_VIDEREBEHANDLING &&
            historikkinnslagDel.endredeFelter &&
            historikkinnslagDel.endredeFelter
              .filter(endretFelt => endretFelt.tilVerdi !== tilbakekrevingVidereBehandling.TILBAKEKR_INNTREKK)
              .map((endretFelt, index) => (
                <div className={styles.tilbakekrevingTekst} key={`endretFelt${index + 1}`}>
                  <FormattedMessage
                    id="Historikk.Template.9.TilbakekrViderebehandling"
                    values={{
                      felt: kodeverkNavnFraKodeFn(endretFelt.endretFeltNavn, KodeverkType.HISTORIKK_ENDRET_FELT_TYPE),
                      verdi: findEndretFeltVerdi(endretFelt, endretFelt.tilVerdi, intl, kodeverkNavnFraKodeFn),
                      b: chunks => <b>{chunks}</b>,
                    }}
                  />
                </div>
              ))}
          {historikkinnslagDel.begrunnelse && (
            <BubbleText
              bodyText={kodeverkNavnFraKodeFn(historikkinnslagDel.begrunnelse, KodeverkType.HISTORIKK_BEGRUNNELSE_TYPE)}
            />
          )}
          {historikkinnslagDel.begrunnelseFritekst && <BubbleText bodyText={historikkinnslagDel.begrunnelseFritekst} />}
        </div>
      </div>
    ))}
  </>
);

export default injectIntl(HistorikkMalType9);
