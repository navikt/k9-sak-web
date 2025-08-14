import { k9_kodeverk_vilkår_VilkårType as VilkårType } from '@k9-sak-web/backend/k9sak/generated';

const vilkår = [
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
] as { name: string; kode: VilkårType }[];

export default vilkår;
