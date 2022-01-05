import React from 'react';
import checkBlaIkonUrl from "@fpsak-frontend/assets/images/check_blue.svg";
import {Normaltekst} from "nav-frontend-typografi";
import {FormattedMessage} from "react-intl";
import {Image} from "../../index";
import styles from './blaBoksMedCheckmark.less';

interface OwnProps{
  textId: string;
}

const BlaBoksMedCheckmark = ({textId}: OwnProps) => (
  <div className={styles.container}>
    <Image src={checkBlaIkonUrl} className={styles.checkBlaIkon}/>
    <Normaltekst>
      <FormattedMessage id={textId} />
    </Normaltekst>
  </div>
);

export default BlaBoksMedCheckmark;
