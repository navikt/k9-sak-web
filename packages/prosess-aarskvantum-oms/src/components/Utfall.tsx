import advarsel from '@fpsak-frontend/assets/images/advarsel_ny.svg';
import avslått from '@fpsak-frontend/assets/images/avslaatt_valgt.svg';
import innvilget from '@fpsak-frontend/assets/images/innvilget_valgt.svg';
import { Image } from '@fpsak-frontend/shared-components';
import { UtfallEnum, Utfalltype } from '@k9-sak-web/types';
import React from 'react';
import styles from './aktivitetTabell.module.css';

type UtfallProps = {
  utfall: Utfalltype;
  textId?: string;
};

// Helper function to get utfall text
const getUtfallText = (utfall: Utfalltype, customTextId?: string): string => {
  if (customTextId) {
    // For custom text IDs, would need lookup - for now return ID
    return customTextId;
  }
  const utfallTexts: Record<string, string> = {
    'INNVILGET': 'Innvilget',
    'AVSLÅTT': 'Avslått',
    'UAVKLART': 'Ikke vurdert',
  };
  return utfallTexts[utfall] || utfall;
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
    {getUtfallText(utfall, textId)}
  </div>
);

export default Utfall;
