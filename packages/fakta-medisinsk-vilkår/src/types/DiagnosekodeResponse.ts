import Link from './Link';

export interface DiagnosekodeResponse {
  diagnosekoder: string[];
  links?: Link[];
  behandlingUuid: string;
  versjon: string;
}
