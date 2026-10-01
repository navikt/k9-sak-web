import { vilkårStatus, type VilkårStatus } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/VilkårStatus.js';
import type { VilkårType } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/VilkårType.js';
import { CheckmarkCircleFillIcon, XMarkOctagonFillIcon } from '@navikt/aksel-icons';
import { Label } from '@navikt/ds-react';
import type { JSX } from 'react';
import styles from './vilkårsliste.module.css';

const vilkårListe: { name: string; kode: VilkårType }[] = [
  {
    name: 'Medlemskap',
    kode: 'FP_VK_2', // Medlemskapsvilkåret
  },
  {
    name: 'Søknadsfrist',
    kode: 'FP_VK_3',
  },
  {
    name: 'Opptjening',
    kode: 'FP_VK_23', // Opptjeningsvilkåret
  },
  {
    name: 'Beregningsgrunnlag',
    kode: 'FP_VK_41', // Beregningsgrunnlagvilkår
  },
  {
    name: 'Omsorgen for',
    kode: 'K9_VK_1',
  },
  {
    name: 'Sykdom',
    kode: 'K9_VK_2_a', // medisinske vilkår for barn under 18 år
  },
  {
    name: 'Sykdom',
    kode: 'K9_VK_2_b', // medisinske vilkår for barn over 18 år
  },
  {
    name: 'Søkers alder',
    kode: 'K9_VK_3', // Aldersvilkåret
  },
  {
    name: 'Langvarig sykdom',
    kode: 'K9_VK_17', //  i opplæringspenger
  },
  {
    name: 'Nødvendig opplæring',
    kode: 'K9_VK_20', // Nødvendig opplæring for å ta vare på barnet
  },
  {
    name: 'Institusjon',
    kode: 'K9_VK_21', // Godkjent opplæringsinstitusjon
  },
];

type VilkårTypeMap = { [key in VilkårType]?: VilkårStatus };

const VilkårslisteItem = ({ vilkår, erOppfylt }: { vilkår: string; erOppfylt: boolean }): JSX.Element => (
  <li className={styles.item}>
    <div className={styles.itemText}>{`${vilkår}:`}</div>
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

const Vilkårsliste = ({ vilkår }: { vilkår: VilkårTypeMap }): JSX.Element => (
  <div className={styles.vilkårsliste}>
    <Label size="small" as="p">
      Vilkår
    </Label>
    <ul>
      {vilkårListe.map(
        v =>
          vilkår[v.kode] && (
            <VilkårslisteItem key={v.kode} vilkår={v.name} erOppfylt={vilkår[v.kode] === vilkårStatus.OPPFYLT} />
          ),
      )}
    </ul>
  </div>
);

export default Vilkårsliste;
