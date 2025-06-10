import { Label } from '@navikt/ds-react';
import * as React from 'react';
import Utfall from '../constants/Utfall';
import VilkårslisteItem from './VilkårslisteItem';
import vilkårListe from './Vilkår';
import styles from './vilkårsliste.module.css';

import type { JSX } from 'react';
import { VilkårMedPerioderDtoVilkarType, VilkårPeriodeDtoVilkarStatus } from '@k9-sak-web/backend/k9sak/generated';

type VilkårType = { [key in VilkårMedPerioderDtoVilkarType]?: VilkårPeriodeDtoVilkarStatus };

const erVilkårOppfylt = (vilkårkode: VilkårMedPerioderDtoVilkarType, vilkår: VilkårType) =>
  vilkår[vilkårkode] === Utfall.OPPFYLT;

const Vilkårsliste = ({ vilkår }: { vilkår: VilkårType }): JSX.Element => {
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
