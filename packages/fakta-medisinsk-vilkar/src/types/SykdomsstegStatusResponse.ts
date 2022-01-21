interface SykdomsstegStatusResponse {
    kanLøseAksjonspunkt: boolean;
    harDataSomIkkeHarBlittTattMedIBehandling: boolean;
    harUklassifiserteDokumenter: boolean;
    manglerDiagnosekode: boolean;
    manglerGodkjentLegeerklæring: boolean;
    manglerVurderingAvKontinuerligTilsynOgPleie: boolean;
    manglerVurderingAvToOmsorgspersoner: boolean;
    nyttDokumentHarIkkekontrollertEksisterendeVurderinger: boolean;
}

export default SykdomsstegStatusResponse;
