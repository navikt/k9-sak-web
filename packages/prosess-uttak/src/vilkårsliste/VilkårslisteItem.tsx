import * as React from 'react';
import { GreenCheckIconFilled, RedCrossIconFilled } from '@navikt/ft-plattform-komponenter';
import styles from './vilkårslisteItem.module.css';

import type { JSX } from 'react';

interface VilkårslisteItemProps {
  vilkår: string;
  erOppfylt: boolean;
}

const VilkårslisteItem = ({ vilkår, erOppfylt }: VilkårslisteItemProps): JSX.Element => (
  <li className={styles.item}>
    <div className={styles.item__text}>{`${vilkår}:`}</div>
    <div>
      {erOppfylt ? (
        <>
          <GreenCheckIconFilled />
          Oppfylt
        </>
      ) : (
        <>
          <RedCrossIconFilled />
          Ikke oppfylt
        </>
      )}
    </div>
  </li>
);

export default VilkårslisteItem;
