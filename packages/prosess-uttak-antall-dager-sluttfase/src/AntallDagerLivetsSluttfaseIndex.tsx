import React from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';
import { VerticalSpacer } from "@fpsak-frontend/shared-components";
import Fremdriftslinje from '@k9-sak-web/fremdriftslinje';
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
  antallDagerInnvilgetForPleietrengendeHittil: number;
  antallDagerInnvilgetMedBehandlingen: number;
  maxAntallDager: number;
  sistePleiedag: string;
}

const AntallDagerLivetsSluttfaseIndex = ({
  antallDagerInnvilgetForPleietrengendeHittil,
  antallDagerInnvilgetMedBehandlingen,
  maxAntallDager,
  sistePleiedag
}: OwnProps) => (
  <RawIntlProvider value={intl}>
    <div className={styles.antallDagerLivetsSluttfaseIndexContainer}>
      <div className={styles.header}>
        <h2>{intl.formatMessage({id: 'Titel.UttakAvPleiepenger'})}</h2>
        <div className={styles.sistePleiedagBoks}>
          <p>
            {intl.formatMessage({id: 'Underskrift.SistePleiedag'}, {
              sistePleiedag,
              b: (...chunks) => <b>{chunks}</b>
            })}
          </p>
        </div>
      </div>
      <VerticalSpacer sixteenPx/>

      <Fremdriftslinje
        max={maxAntallDager}
        totalBreddeProsent={100}
        antallGrønnBar={antallDagerInnvilgetForPleietrengendeHittil}
        antallGulBar={antallDagerInnvilgetMedBehandlingen}
      />
      <VerticalSpacer fourPx/>
      <p>
        {intl.formatMessage({id: 'Underskrift.DagerInnvilget'}, {
          antallDagerInnvilget: antallDagerInnvilgetForPleietrengendeHittil,
          maksAntallDagerInnvilget: maxAntallDager,
          b: (...chunks) => <b>{chunks}</b>
        })}
      </p>
    </div>
  </RawIntlProvider>
);

export default AntallDagerLivetsSluttfaseIndex;
