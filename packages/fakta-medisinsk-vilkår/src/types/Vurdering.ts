import { Period } from '@fpsak-frontend/utils';
import { k9_kodeverk_sykdom_Resultat } from '@navikt/k9-sak-typescript-client/types';
import Dokument from './Dokument';

export interface AnnenInformasjon {
  resterendeVurderingsperioder: Period[];
  perioderSomKanVurderes: Period[];
}

export interface Vurderingsversjon {
  endretAv: string;
  endretTidspunkt: string;
  versjon?: string;
  tekst: string;
  resultat: k9_kodeverk_sykdom_Resultat;
  perioder: Period[];
  dokumenter: Dokument[];
  manglerLegeerklæring?: boolean;
}

class Vurdering {
  id: string;

  type: string;

  versjoner: Vurderingsversjon[];

  annenInformasjon: AnnenInformasjon;

  erInnleggelsesperiode: boolean;

  constructor({
    id,
    type,
    versjoner,
    annenInformasjon: { resterendeVurderingsperioder, perioderSomKanVurderes },
    erInnleggelsesperiode,
  }: Vurdering) {
    this.id = id;
    this.type = type;
    this.erInnleggelsesperiode = erInnleggelsesperiode;

    this.versjoner = versjoner.map(vurderingsversjon => ({
      ...vurderingsversjon,
      perioder: vurderingsversjon.perioder.map(({ fom, tom }) => new Period(fom, tom)),
    }));

    this.annenInformasjon = {
      resterendeVurderingsperioder: resterendeVurderingsperioder.map(({ fom, tom }) => new Period(fom, tom)),
      perioderSomKanVurderes: perioderSomKanVurderes.map(({ fom, tom }) => new Period(fom, tom)),
    };
  }
}

export default Vurdering;
