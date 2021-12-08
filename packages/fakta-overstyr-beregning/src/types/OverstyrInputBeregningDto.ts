import { OverstyrInputBeregningAktivitet } from "./OverstyrInputBeregningAktivitet";

export type OverstyrInputBeregningDto = {
    skjaeringstidspunkt: string;
    aktivitetliste: OverstyrInputBeregningAktivitet[];
};