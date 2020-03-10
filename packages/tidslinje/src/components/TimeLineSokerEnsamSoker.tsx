import React, { FunctionComponent } from 'react';
import { Row } from 'nav-frontend-grid';

import navBrukerKjonn from '@fpsak-frontend/kodeverk/src/navBrukerKjonn';
import { Image } from '@fpsak-frontend/shared-components';
import urlMann from '@fpsak-frontend/assets/images/mann.svg';

import urlKvinne from '@fpsak-frontend/assets/images/kvinne.svg';
import Kjønnkode from '@k9-sak-web/types/src/Kjønnkode';
import { useIntl } from 'react-intl';
import styles from './timeLineSokerEnsamSoker.less';

/**
 * TimeLineSoker
 *
 * Presentationskomponent. Viser korrekt ikon for soker/medsoker
 */

const isKvinne = kode => kode === navBrukerKjonn.KVINNE;

const TimeLineSokerEnsamSoker: FunctionComponent<{ hovedsokerKjonnKode: Kjønnkode }> = ({ hovedsokerKjonnKode }) => {
  const intl = useIntl();
  return (
    <div className={styles.timelineSokerContatinerEnsamSoker}>
      <Row>
        <Image
          className={styles.iconMedsoker}
          src={isKvinne(hovedsokerKjonnKode) ? urlKvinne : urlMann}
          alt={intl.formatMessage({ id: 'Person.ImageText' })}
          title={intl.formatMessage({ id: isKvinne(hovedsokerKjonnKode) ? 'Person.Woman' : 'Person.Man' })}
        />
      </Row>
    </div>
  );
};

export default TimeLineSokerEnsamSoker;
