import { Period } from '@k9-sak-web/utils';
import Vurderingsresultat from './Vurderingsresultat';

class Omsorgsperiode {
  periode: Period;

  relasjon: string;

  relasjonsbeskrivelse?: string;

  resultat: Vurderingsresultat;

  resultatEtterAutomatikk: Vurderingsresultat;

  begrunnelse?: string;

  vurdertAv?: string;

  vurdertTidspunkt?: string;

  constructor({
    periode,
    resultatEtterAutomatikk,
    resultat,
    relasjonsbeskrivelse,
    begrunnelse,
    relasjon,
    vurdertAv,
    vurdertTidspunkt,
  }: Partial<Omsorgsperiode>) {
    this.periode = new Period(periode.fom, periode.tom);
    this.resultatEtterAutomatikk = resultatEtterAutomatikk;
    this.resultat = resultat;
    this.relasjonsbeskrivelse = relasjonsbeskrivelse;
    this.begrunnelse = begrunnelse;
    this.relasjon = relasjon ? relasjon[0].toUpperCase() + relasjon.slice(1).toLowerCase() : '';
    this.vurdertAv = vurdertAv;
    this.vurdertTidspunkt = vurdertTidspunkt;
  }

  erOppfylt(): boolean {
    return this.resultat === Vurderingsresultat.OPPFYLT || this.resultatEtterAutomatikk === Vurderingsresultat.OPPFYLT;
  }

  erIkkeOppfylt(): boolean {
    return (
      this.resultat === Vurderingsresultat.IKKE_OPPFYLT ||
      this.resultatEtterAutomatikk === Vurderingsresultat.IKKE_OPPFYLT
    );
  }

  erAutomatiskVurdert(): boolean {
    return (
      this.resultatEtterAutomatikk === Vurderingsresultat.OPPFYLT ||
      this.resultatEtterAutomatikk === Vurderingsresultat.IKKE_OPPFYLT
    );
  }

  erManueltVurdert(): boolean {
    return this.resultat === Vurderingsresultat.OPPFYLT || this.resultat === Vurderingsresultat.IKKE_OPPFYLT;
  }

  erVurdert(): boolean {
    return this.erManueltVurdert() || this.erAutomatiskVurdert();
  }

  manglerVurdering(): boolean {
    return (
      this.resultat === Vurderingsresultat.IKKE_VURDERT &&
      this.resultatEtterAutomatikk === Vurderingsresultat.IKKE_VURDERT
    );
  }

  hentResultat(): Vurderingsresultat {
    if (this.resultat === Vurderingsresultat.IKKE_VURDERT) {
      return this.resultatEtterAutomatikk;
    }
    if (this.resultatEtterAutomatikk === Vurderingsresultat.IKKE_VURDERT) {
      return this.resultat;
    }
    return this.resultat || this.resultatEtterAutomatikk;
  }
}

export default Omsorgsperiode;
