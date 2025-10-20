import { OverstyrInputBeregningDto } from "./OverstyrInputBeregningDto";

type BehandlingIdDto = {
    id: string;
};

export type OverstyrInputForBeregningDto = {
    kode: string;
    begrunnelse: string;
    perioder: OverstyrInputBeregningDto[];
}
