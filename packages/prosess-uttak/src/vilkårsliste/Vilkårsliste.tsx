import { Label } from '@navikt/ds-react';
import * as React from 'react';
import Utfall from '../constants/Utfall';
import VilkårslisteItem from './VilkårslisteItem';
import vilkårListe from './Vilkår';
import styles from './vilkårsliste.module.css';

import type { JSX } from 'react';
import {
  kodeverk_vilkår_VilkårType as VilkårType,
  kodeverk_vilkår_Utfall as VilkårUtfall,
} from '@k9-sak-web/backend/k9sak/generated';

type VilkårTypeMap = { [key in VilkårType]?: VilkårUtfall };

const erVilkårOppfylt = (vilkårkode: VilkårType, vilkår: VilkårTypeMap) => vilkår[vilkårkode] === Utfall.OPPFYLT;

const Vilkårsliste = ({ vilkår }: { vilkår: VilkårTypeMap }): JSX.Element => {
  return (
    <div className={styles.vilkårsliste}>
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
