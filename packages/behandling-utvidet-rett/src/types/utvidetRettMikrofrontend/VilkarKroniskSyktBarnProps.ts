export interface VilkarKroniskSyktBarnProps {
  lesemodus?: boolean;
  legeerklaeringsinfo: Legeerklaeringsinfo;
  losAksjonspunkt: (harDokumentasjon, harSammenheng, begrunnelse) => void;
}

interface Legeerklaeringsinfo {
  harDokumentasjon: boolean;
  harSammenheng: boolean;
  begrunnelse: string;
}
