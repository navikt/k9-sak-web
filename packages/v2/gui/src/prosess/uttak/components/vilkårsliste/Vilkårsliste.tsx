import type { JSX } from 'react';
import { Label } from '@navikt/ds-react';
import type { VilkårType } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/VilkårType.js';
import { type VilkårStatus as VilkårUtfallType, vilkårStatus as VilkårUtfall } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/VilkårStatus.js';
import VilkårslisteItem from './VilkårslisteItem';
import vilkårListe from './Vilkår';
import styles from './vilkårsliste.module.css';

type VilkårTypeMap = { [key in VilkårType]?: VilkårUtfallType };

const erVilkårOppfylt = (vilkårkode: VilkårType, vilkår: VilkårTypeMap) => vilkår[vilkårkode] === VilkårUtfall.OPPFYLT;

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
