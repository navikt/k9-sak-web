import styles from './vilkårslisteItem.module.css';

import { CheckmarkCircleFillIcon, XMarkOctagonFillIcon } from '@navikt/aksel-icons';
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
          <CheckmarkCircleFillIcon fontSize={24} style={{ color: 'var(--a-surface-success)' }} />
          Oppfylt
        </>
      ) : (
        <>
          <XMarkOctagonFillIcon fontSize={24} style={{ color: 'var(--a-surface-danger)' }} />
          Ikke oppfylt
        </>
      )}
    </div>
  </li>
);

export default VilkårslisteItem;
