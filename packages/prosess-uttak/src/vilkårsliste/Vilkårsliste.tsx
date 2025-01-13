import { Label } from '@navikt/ds-react';
import * as React from 'react';
import Utfall from '../constants/Utfall';
import Inngangsvilkår from '../types/Inngangsvilkår';
import vilkår from './Vilkår';
import VilkårslisteItem from './VilkårslisteItem';
import styles from './vilkårsliste.module.css';

interface VilkårslisteProps {
  inngangsvilkår: Inngangsvilkår;
}

const erVilkårOppfylt = (vilkårkode: string, inngangsvilkår: Inngangsvilkår) =>
  inngangsvilkår[vilkårkode] === Utfall.OPPFYLT;

const Vilkårsliste = ({ inngangsvilkår }: VilkårslisteProps): JSX.Element => (
  <div className={styles.vilkårsliste}>
    <Label size="small" as="p">
      Vilkår
    </Label>
    <ul>
      {vilkår.map(
        v =>
          inngangsvilkår[v.kode] && (
            <VilkårslisteItem key={v.kode} vilkår={v.name} erOppfylt={erVilkårOppfylt(v.kode, inngangsvilkår)} />
          ),
      )}
    </ul>
  </div>
);

export default Vilkårsliste;
