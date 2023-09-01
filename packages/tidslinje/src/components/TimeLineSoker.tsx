import { Row } from 'nav-frontend-grid';
import React from 'react';

import urlKvinne from '@fpsak-frontend/assets/images/kvinne.svg';
import urlMann from '@fpsak-frontend/assets/images/mann.svg';
import urlUkjent from '@fpsak-frontend/assets/images/ukjent.svg';
import navBrukerKjonn from '@fpsak-frontend/kodeverk/src/navBrukerKjonn';
import { Image } from '@fpsak-frontend/shared-components';
import Kjønnkode from '@k9-sak-web/types/src/Kjønnkode';
import { useIntl } from 'react-intl';
import styles from './timeLineSoker.css';

/**
 * TimeLineSoker
 *
 * Presentationskomponent. Viser korrekt ikon for soker/medsoker
 */

interface TimeLineSokerProps {
  hovedsokerKjonnKode: Kjønnkode;
  medsokerKjonnKode: Kjønnkode;
}

const getKjønn = kode => {
  switch (kode) {
    case navBrukerKjonn.KVINNE:
      return { src: urlKvinne, title: 'Person.Woman' };
    case navBrukerKjonn.MANN:
      return { src: urlMann, title: 'Person.Man' };
    case navBrukerKjonn.UDEFINERT:
      return { src: urlUkjent, title: 'Person.Unknown' };
    default:
      return { src: urlUkjent, title: 'Person.Unknown' };
  }
};

const TimeLineSoker = ({ hovedsokerKjonnKode, medsokerKjonnKode }: TimeLineSokerProps) => {
  const intl = useIntl();
  return (
    <div className={styles.timelineSokerContatiner}>
      <Row>
        <Image
          className={styles.iconHovedsoker}
          src={getKjønn(hovedsokerKjonnKode).src}
          alt={intl.formatMessage({ id: 'Person.ImageText' })}
          tooltip={intl.formatMessage({ id: getKjønn(hovedsokerKjonnKode).title })}
        />
      </Row>
      <Row>
        <Image
          className={styles.iconMedsoker}
          src={getKjønn(medsokerKjonnKode).src}
          alt={intl.formatMessage({ id: 'Person.ImageText' })}
          tooltip={intl.formatMessage({ id: getKjønn(medsokerKjonnKode).title })}
        />
      </Row>
    </div>
  );
};

export default TimeLineSoker;
