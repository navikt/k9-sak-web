import { Kodeverk } from "./kodeverkTsType";

export interface OverlappendePeriode {
    ytelseType: Kodeverk;
    kilde: Kodeverk;
    overlappendePerioder: { fom: string; tom: string }[];
}
