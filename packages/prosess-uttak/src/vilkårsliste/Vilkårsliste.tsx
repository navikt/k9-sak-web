import * as React from 'react';
import { Element } from 'nav-frontend-typografi';
import VilkårslisteItem from './VilkårslisteItem';
import styles from './vilkårsliste.module.css';
import Inngangsvilkår from '../types/Inngangsvilkår';
import vilkår from './Vilkår';
import Utfall from '../constants/Utfall';

interface VilkårslisteProps {
  inngangsvilkår: Inngangsvilkår;
}

const erVilkårOppfylt = (vilkårkode: string, inngangsvilkår: Inngangsvilkår) =>
  inngangsvilkår[vilkårkode] === Utfall.OPPFYLT;

const Vilkårsliste = ({ inngangsvilkår }: VilkårslisteProps): JSX.Element => (
  <div className={styles.vilkårsliste}>
    <Element>Vilkår</Element>
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
