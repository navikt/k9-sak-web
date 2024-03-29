import advarsel from '@fpsak-frontend/assets/images/advarsel_ny.svg';
import avslått from '@fpsak-frontend/assets/images/avslaatt_valgt.svg';
import innvilget from '@fpsak-frontend/assets/images/innvilget_valgt.svg';
import { Image } from '@fpsak-frontend/shared-components';
import { UtfallEnum, Utfalltype } from '@k9-sak-web/types';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import styles from './aktivitetTabell.module.css';

type UtfallProps = {
  utfall: Utfalltype;
  textId?: string;
};

const utfallSymbolMap = {
  [UtfallEnum.INNVILGET]: innvilget,
  [UtfallEnum.AVSLÅTT]: avslått,
  [UtfallEnum.UAVKLART]: advarsel,
};

const Utfall = ({ utfall, textId }: UtfallProps) => (
  <div>
    <span className={styles.utfallsikon}>
      <Image src={utfallSymbolMap[utfall]} />
    </span>
    <FormattedMessage id={textId || `Uttaksplan.Utfall.${utfall}`} />
  </div>
);

export default Utfall;
