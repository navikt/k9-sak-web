// Generisk representasjon av kodeverk objekt der kilde (kode) er enum type. Spesifikk variant av dette er returnert i oppslags array med alle kodeverdier for gitt kodeverk.
type KodeverkObjektMedEnumKilde<Kilde extends string = string> = Readonly<{
  kilde: Kilde;
  kode: string;
  navn: string;
  kodeverk: string;
}>;

// Generisk representasjon av respons objektet med oppslagsverdier. Ein property for kvart kodeverk som skal kunne slåast opp.
// AlleKodeverdierSomObjektResponse frå k9-sak passer inn i denne. Tilsvarande for andre backends skal og passe inn.
type KodeverdierMedEnumKilde = {
  [prop: string]: Array<KodeverkObjektMedEnumKilde>;
};

// Flagg for å indikere at vi skal returnere undefined viss kodeverdi ikkje blir funne i gitt kodeverk.
export const OrUndefined = 'or undefined' as const;
export type OrUndefined = typeof OrUndefined | undefined;
// Returtype som blir undefined når 'or undefined' er satt, ellers ikkje undefined.
type PerhapsUndefined<OU extends OrUndefined> = OU extends 'or undefined' ? undefined : never;

// Kodeverdi type blir objekt typen for gitt kodeverk på gitt oppslagsobjekt type.
type Kodeverdi<O extends KodeverdierMedEnumKilde, P extends keyof O> = O[P][number];
// Kilde type blir enum typen for gitt kodeverk på gitt oppslagsobjekt type.
export type Kilde<O extends KodeverdierMedEnumKilde, P extends keyof O> = Kodeverdi<O, P>['kilde'];

// Denne brukast til å sikre at konkrete implementasjoner av GeneriskKodeverkoppslag har korrekte oppslagsmetoder for alle kodeverdier i gitt oppslagsobjekt type.
export type Kodeverkoppslag<O extends KodeverdierMedEnumKilde> = {
  readonly [Property in keyof O]: <U extends OrUndefined = undefined>(
    kode: Kilde<O, Property>,
    undefinedIfNotFound?: U,
  ) => Kodeverdi<O, Property> | PerhapsUndefined<U>;
};

// Konkrete oppslagsklasse for kvar oppslagsobjekt type (for ulike backends) bygger på denne.
// Alle implementasjoner skal og deklarerast til å implementere GeneriskNormaleKodeverdierKildeoppslag<O>
export abstract class GeneriskKodeverkoppslag<O extends KodeverdierMedEnumKilde> {
  #alleKodeverdier: O;

  constructor(alleKodeverdier: O) {
    this.#alleKodeverdier = alleKodeverdier;
  }

  /**
   * @param kodeverk (av type P som må vere ein property i alleKodeverdier objektet):  Bestemmer kva kodeverk vi skal slå opp i.
   * @param kode (av type K som må vere ein kilde enum verdi i gitt kodeverk): Seier kva kodeverdi som skal finnast i gitt kodeverk.
   * @param undefinedIfNotFound (av type UNF som må vere true eller undefined): Bestemmer om vi skal returnere undefined eller kaste feil viss kode ikkje blir funne i gitt kodeverk. Standardverdi er undefined, altså at det blir kasta feil. Når den er true endrast returtypen frå oppslaget til å potensielt vere undefined.
   */
  protected finnObjektFraKilde<
    P extends keyof O & string,
    K extends Kilde<O, P> & string,
    U extends OrUndefined,
    R extends Kodeverdi<O, P> | PerhapsUndefined<U>,
  >(kodeverk: P, kode: K, undefinedIfNotFound: U): R {
    const alleKodeverdier = this.#alleKodeverdier[kodeverk];
    if (alleKodeverdier != null) {
      const found = alleKodeverdier.find(v => v.kilde === kode);
      if (found != null || undefinedIfNotFound === OrUndefined) {
        // Må typecaste her, typescript klare ikkje forstå at R er oppfyllt av if statement over.
        // Ellers kunne vi ikkje ha parametereisert returtype (PerhapsUndefined)
        return found as R;
      } else {
        throw new Error(`Fant ikke kodeverdi for ${kodeverk} med kilde ${kode}`);
      }
    } else {
      throw new Error(
        `Fant ikke kodeverk ${kodeverk}. ${Object.keys(this.#alleKodeverdier).length} ulike kodeverkoppslag tilgjengelig.`,
      );
    }
  }
}
