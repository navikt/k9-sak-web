import checkBlaIkonUrl from '@fpsak-frontend/assets/images/check_blue.svg';
import { BodyShort } from '@navikt/ds-react';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Image } from '../../index';
import styles from './blaBoksMedCheckmarkListe.module.css';

interface OwnProps {
  textIds: string[];
}

const BlaBoksMedCheckmarkListe = ({ textIds }: OwnProps) => (
  <div className={styles.container}>
    {textIds.map(id => (
      <div className={styles.rad}>
        <Image src={checkBlaIkonUrl} className={styles.checkBlaIkon} />
        <BodyShort size="small">
          <FormattedMessage id={id} />
        </BodyShort>
      </div>
    ))}
  </div>
);

export default BlaBoksMedCheckmarkListe;
