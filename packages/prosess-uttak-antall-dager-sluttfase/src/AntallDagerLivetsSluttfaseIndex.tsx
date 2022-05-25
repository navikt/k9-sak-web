import React from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';
import { VerticalSpacer } from "@fpsak-frontend/shared-components";
import Fremdriftslinje from '@k9-sak-web/fremdriftslinje';
import KvoteInfo from '@k9-sak-web/behandling-pleiepenger-sluttfase/src/types/KvoteInfo';
import { visningsdato } from "@fpsak-frontend/utils";
import messages from '../i18n/nb_NO.json';

import styles from './antallDagerLivetsSluttfaseIndex.less';

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

const AntallDagerLivetsSluttfaseIndex = ({
  kvoteInfo
}: OwnProps) => {
  if (!kvoteInfo) {
    return null;
  }

  const maxAntallDager = 60;
  const antallDagerGjenstar = maxAntallDager - (kvoteInfo.totaltForbruktKvote);

  const gronneDager = () => {
    if (kvoteInfo.totaltForbruktKvote <= maxAntallDager) return kvoteInfo.totaltForbruktKvote;
    return 0;
  }

  const guleDager = () => {
    if (kvoteInfo.totaltForbruktKvote > maxAntallDager) return maxAntallDager;
    return 0;
  }

  return <RawIntlProvider value={intl}>
    <div className={styles.antallDagerLivetsSluttfaseIndexContainer}>
      <div className={styles.header}>
        <h2>{intl.formatMessage({ id: 'Titel.UttakAvPleiepenger' })}</h2>
        {kvoteInfo.maxDato && <div className={styles.sistePleiedagBoks}>
          <p>
            {intl.formatMessage({ id: 'Underskrift.SistePleiedag' }, {
              sistePleiedag: visningsdato(kvoteInfo.maxDato),
              b: (...chunks) => <b>{chunks}</b>
            })}
          </p>
        </div>}
      </div>
      <VerticalSpacer sixteenPx />

      <Fremdriftslinje
        max={maxAntallDager}
        totalBreddeProsent={100}
        antallGrønnBar={gronneDager()}
        antallGulBar={guleDager()}
      />
      <VerticalSpacer fourPx />
      <p>
        {!!kvoteInfo.totaltForbruktKvote && intl.formatMessage({ id: 'Underskrift.ForbruktKvote' }, {
          forbruktKvote: kvoteInfo.totaltForbruktKvote,
          maksAntallDager: maxAntallDager,
          b: (...chunks) => <b>{chunks}</b>
        })}

        {antallDagerGjenstar > 0 && intl.formatMessage({ id: 'Underskrift.AntallDagerGjenstar' }, {
          antallDagerGjenstar,
          b: (...chunks) => <b>{chunks}</b>
        })}
      </p>
    </div>
  </RawIntlProvider>
};

export default AntallDagerLivetsSluttfaseIndex;
