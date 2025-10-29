import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import KvoteInfo from '@k9-sak-web/behandling-pleiepenger-sluttfase/src/types/KvoteInfo';
import messages from '../i18n/nb_NO.json';

import { formatDate } from '@k9-sak-web/lib/dateUtils/dateUtils.js';
import styles from './antallDagerLivetsSluttfaseIndex.module.css';
import Fremdriftslinje from './Fremdriftslinje';

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
          <div className={styles.antallDagerLivetsSluttfaseIndexContainer}>
        <div className={styles.header}>
          <h2>{"Uttak av pleiepenger"}</h2>
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
      </div>  );
};

export default AntallDagerLivetsSluttfaseIndex;
