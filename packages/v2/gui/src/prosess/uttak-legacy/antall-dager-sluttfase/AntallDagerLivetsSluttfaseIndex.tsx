// LEGACY-UTTAK: Slettes når feature toggle NYTT_UTTAK_PANEL fjernes. Ikke endre.
import type KvoteInfo from './KvoteInfo';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';
import messages from './nb_NO';

import styles from './antallDagerLivetsSluttfaseIndex.module.css';
import Fremdriftslinje from './Fremdriftslinje';
import { formatDate } from '@k9-sak-web/gui/utils/formatters.js';

const cache = createIntlCache();

const intl = createIntl(
  {
    locale: 'nb-NO',
    messages,
  },
  cache,
);

interface OwnProps {
  kvoteInfo?: KvoteInfo;
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
                    sistePleiedag: formatDate(kvoteInfo.maxDato),
                    b: (...chunks) => <b>{chunks}</b>,
                  },
                )}
              </p>
            </div>
          )}
        </div>
        <div style={{ height: 16 }} />

        <Fremdriftslinje
          max={maxAntallDager}
          totalBreddeProsent={100}
          antallGrønnBar={antallForbrukteDagerInnenforKvote}
          antallGulBar={antallFrobrukteDagerVedOverforbruk}
        />
        <div style={{ height: 4 }} />
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
