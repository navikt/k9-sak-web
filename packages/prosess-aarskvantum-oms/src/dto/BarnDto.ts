export enum BarnType {
  VANLIG = 'VANLIG',
  FOSTERBARN = 'FOSTERBARN',
  UTENLANDSK_BARN = 'UTENLANDSK_BARN',
}

interface BarnDto {
  personIdent: string;
  fødselsdato?: string;
  dødsdato?: string;
  harSammeBosted: boolean;
  barnType: BarnType;
}

export default BarnDto;
