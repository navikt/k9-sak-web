import { ManglendeVedleggSoknad } from '@k9-sak-web/types';

interface UtvidetRettSoknad {
  begrunnelseForSenInnsending: string;
  manglendeVedlegg: ManglendeVedleggSoknad[];
  angittePersoner: AngittPerson[];
  mottattDato: string;
  oppgittStartdato: string;
  oppgittTilknytning: string;
  soknadsdato: string;
  spraakkode: {
    kode: string;
    kodeverk: string;
  };
  tilleggsopplysninger: string;
  søknadsperiode: {
    fom: string;
    tom: string;
  };
}

interface AngittPerson {
  navn: string;
  fødselsdato: string;
  rolle: string;
  situasjonKode: string;
  tilleggsopplysninger: string;
  aktørId: string;
  personIdent: string;
}

export default UtvidetRettSoknad;
