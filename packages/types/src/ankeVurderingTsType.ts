import Kodeverk from './kodeverkTsType';

export type AnkeVurdering = Readonly<{
  ankeVurderingResultat?: {
    ankeVurdering?: Kodeverk;
    ankeVurderingOmgjoer?: Kodeverk;
    ankeOmgjoerArsak?: Kodeverk;
    trygderettVurdering?: Kodeverk;
    trygderettVurderingOmgjoer?: Kodeverk;
    trygderettOmgjoerArsak?: Kodeverk;
    begrunnelse: string;
    paAnketBehandlingId?: number;
    erAnkerIkkePart: boolean;
    erIkkeKonkret: boolean;
    erFristIkkeOverholdt: boolean;
    erIkkeSignert: boolean;
    erSubsidiartRealitetsbehandles: boolean;
    fritekstTilBrev?: string;
    merknadKommentar?: string;
    erMerknaderMottatt?: boolean;
    avsluttBehandling?: boolean;
  };
}>;

export default AnkeVurdering;
