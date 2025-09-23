import type { JSX } from 'react';
import { Label } from '@navikt/ds-react';
import { UttaksperiodeInfoUtfall, VilkårMedPerioderDtoVilkarType } from '@k9-sak-web/backend/k9sak/generated';
import VilkårslisteItem from './VilkårslisteItem';
import vilkårListe from './Vilkår';
import type { UttaksperiodeBeriket } from '../../Uttak';
import styles from './vilkårsliste.module.css';

interface VilkårslisteProps {
  inngangsvilkår: UttaksperiodeBeriket['inngangsvilkår'];
}

const erVilkårOppfylt = (
  vilkårkode: VilkårMedPerioderDtoVilkarType,
  vilkår: UttaksperiodeBeriket['inngangsvilkår'] = {},
) => vilkår[vilkårkode] === UttaksperiodeInfoUtfall.OPPFYLT;

const Vilkårsliste = ({ inngangsvilkår = {} }: VilkårslisteProps): JSX.Element => {
  return (
    <div className={styles['vilkårsliste']}>
      <Label size="small" as="p">
        Vilkår
      </Label>
      <ul>
        {vilkårListe.map(
          v =>
            inngangsvilkår[v.kode] && (
              <VilkårslisteItem key={v.kode} vilkår={v.name} erOppfylt={erVilkårOppfylt(v.kode, inngangsvilkår)} />
            ),
        )}
      </ul>
    </div>
  );
};

export default Vilkårsliste;
