import { VilkarType, type VilkårType } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/VilkårType.js';
import type { VilkårStatus } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/VilkårStatus.js';
import { vilkårStatus } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/VilkårStatus.js';
import { CheckmarkCircleFillIcon, XMarkOctagonFillIcon } from '@navikt/aksel-icons';
import { Label } from '@navikt/ds-react';
import type { JSX } from 'react';
import styles from './vilkårsliste.module.css';

type VilkårTypeMap = { [key in VilkårType]?: VilkårStatus };

const vilkårListe = [
  {
    name: 'Medlemskap',
    kode: VilkarType.MEDLEMSKAPSVILKÅRET, // Medlemskapsvilkåret
  },
  {
    name: 'Søknadsfrist',
    kode: VilkarType.SØKNADSFRIST,
  },
  {
    name: 'Opptjening',
    kode: VilkarType.OPPTJENINGSVILKÅRET, // Opptjeningsvilkåret
  },
  {
    name: 'Beregningsgrunnlag',
    kode: VilkarType.BEREGNINGSGRUNNLAGVILKÅR, // Beregningsgrunnlagvilkår
  },
  {
    name: 'Omsorgen for',
    kode: VilkarType.OMSORGEN_FOR,
  },
  {
    name: 'Sykdom',
    kode: VilkarType.MEDISINSKEVILKÅR_UNDER_18_ÅR, // medisinske vilkår for barn under 18 år
  },
  {
    name: 'Sykdom',
    kode: VilkarType.MEDISINSKEVILKÅR_18_ÅR, // medisinske vilkår for barn over 18 år
  },
  {
    name: 'Søkers alder',
    kode: VilkarType.ALDERSVILKÅR, // Aldersvilkåret
  },
  {
    name: 'Langvarig sykdom',
    kode: VilkarType.LANGVARIG_SYKDOM, //  i opplæringspenger
  },
  {
    name: 'Nødvendig opplæring',
    kode: VilkarType.NØDVENDIG_OPPLÆRING, // Nødvendig opplæring for å ta vare på barnet
  },
  {
    name: 'Institusjon',
    kode: VilkarType.GODKJENT_OPPLÆRINGSINSTITUSJON, // Godkjent opplæringsinstitusjon
  },
];

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
