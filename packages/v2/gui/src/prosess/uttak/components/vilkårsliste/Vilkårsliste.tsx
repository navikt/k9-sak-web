import type { JSX } from 'react';
import { Label } from '@navikt/ds-react';
import { type VilkårType } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/VilkårType.js';
import { vilkårStatus, type VilkårStatus } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/VilkårStatus.js';
import VilkårslisteItem from './VilkårslisteItem.js';
import vilkårListe from './Vilkår.js';
import styles from './vilkårsliste.module.css';

type VilkårTypeMap = { [key in VilkårType]?: VilkårStatus };

const erVilkårOppfylt = (vilkårkode: VilkårType, vilkår: VilkårTypeMap) => vilkår[vilkårkode] === vilkårStatus.OPPFYLT;

const Vilkårsliste = ({ vilkår }: { vilkår: VilkårTypeMap }): JSX.Element => {
  return (
    <div className={styles['vilkårsliste']}>
      <Label size="small" as="p">
        Vilkår
      </Label>
      <ul>
        {vilkårListe.map(
          v =>
            vilkår[v.kode] && (
              <VilkårslisteItem key={v.kode} vilkår={v.name} erOppfylt={erVilkårOppfylt(v.kode, vilkår)} />
            ),
        )}
      </ul>
    </div>
  );
};

export default Vilkårsliste;
