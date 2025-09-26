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
          <CheckmarkCircleFillIcon fontSize={24} style={{ color: 'var(--ax-bg-success-strong)' }} />
          Oppfylt
        </>
      ) : (
        <>
          <XMarkOctagonFillIcon fontSize={24} style={{ color: 'var(--ax-bg-danger-strong)' }} />
          Ikke oppfylt
        </>
      )}
    </div>
  </li>
);

export default VilkårslisteItem;
