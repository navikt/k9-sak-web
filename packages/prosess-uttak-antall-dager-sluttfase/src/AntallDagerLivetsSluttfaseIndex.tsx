import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { visningsdato } from '@fpsak-frontend/utils';
import KvoteInfo from '@k9-sak-web/behandling-pleiepenger-sluttfase/src/types/KvoteInfo';
import Fremdriftslinje from '@k9-sak-web/fremdriftslinje';
import React from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';
import messages from '../i18n/nb_NO.json';

import styles from './antallDagerLivetsSluttfaseIndex.css';

const cache = createIntlCache();

const intl = createIntl(
  {
    locale: 'nb-NO',
    messages,
  },
  cache,
);

interface OwnProps {
  kvoteInfo: KvoteInfo;
}

const AntallDagerLivetsSluttfaseIndex = ({ kvoteInfo }: OwnProps) => {
  if (!kvoteInfo) {
    return null;
  }

  const maxAntallDager = 60;
  const antallDagerGjenstar = maxAntallDager - kvoteInfo.totaltForbruktKvote;

  /*
   * Når totalt antall forbrukte dager er 60 eller mindre, vises de som grønn pølse
   * Om totalt antall forbrukte dager er over 60, vises de som oransje/gul pølse
   * */
  const antallForbrukteDagerInnenforKvote =
    kvoteInfo.totaltForbruktKvote <= maxAntallDager ? kvoteInfo.totaltForbruktKvote : 0;
  const antallFrobrukteDagerVedOverforbruk = kvoteInfo.totaltForbruktKvote > maxAntallDager ? maxAntallDager : 0;

  return (
    <RawIntlProvider value={intl}>
      <div className={styles.antallDagerLivetsSluttfaseIndexContainer}>
        <div className={styles.header}>
          <h2>{intl.formatMessage({ id: 'Titel.UttakAvPleiepenger' })}</h2>
          {kvoteInfo.maxDato && (
            <div className={styles.sistePleiedagBoks}>
              <p>
                {intl.formatMessage(
                  { id: 'Underskrift.SistePleiedag' },
                  {
                    sistePleiedag: visningsdato(kvoteInfo.maxDato),
                    b: (...chunks) => <b>{chunks}</b>,
                  },
                )}
              </p>
            </div>
          )}
        </div>
        <VerticalSpacer sixteenPx />

        <Fremdriftslinje
          max={maxAntallDager}
          totalBreddeProsent={100}
          antallGrønnBar={antallForbrukteDagerInnenforKvote}
          antallGulBar={antallFrobrukteDagerVedOverforbruk}
        />
        <VerticalSpacer fourPx />
        <p>
          {!!kvoteInfo.totaltForbruktKvote &&
            intl.formatMessage(
              { id: 'Underskrift.ForbruktKvote' },
              {
                forbruktKvote: kvoteInfo.totaltForbruktKvote,
                maksAntallDager: maxAntallDager,
                b: (...chunks) => <b>{chunks}</b>,
              },
            )}

          {antallDagerGjenstar > 0 &&
            intl.formatMessage(
              { id: 'Underskrift.AntallDagerGjenstar' },
              {
                antallDagerGjenstar,
                b: (...chunks) => <b>{chunks}</b>,
              },
            )}
        </p>
      </div>
    </RawIntlProvider>
  );
};

export default AntallDagerLivetsSluttfaseIndex;
