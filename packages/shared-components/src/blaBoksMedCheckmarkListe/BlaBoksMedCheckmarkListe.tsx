import React from 'react';
import checkBlaIkonUrl from "@fpsak-frontend/assets/images/check_blue.svg";
import { Normaltekst } from "nav-frontend-typografi";
import { FormattedMessage } from "react-intl";
import { Image } from "../../index";
import styles from './blaBoksMedCheckmarkListe.less';

interface OwnProps{
  textIds: string[];
}

const BlaBoksMedCheckmarkListe = ({textIds}: OwnProps) => (
  <div className={styles.container}>
    {textIds.map(id => (
      <div className={styles.rad}>
        <Image src={checkBlaIkonUrl} className={styles.checkBlaIkon}/>
        <Normaltekst>
          <FormattedMessage id={id} />
        </Normaltekst>
      </div>
    ))}
  </div>
);

export default BlaBoksMedCheckmarkListe;
