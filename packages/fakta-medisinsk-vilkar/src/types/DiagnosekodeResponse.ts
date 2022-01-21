import Diagnosekode from './Diagnosekode';
import Link from './Link';

export interface DiagnosekodeResponse {
    diagnosekoder: Diagnosekode[];
    links?: Link[];
    behandlingUuid: string;
    versjon: string;
}
