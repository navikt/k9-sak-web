enum ActionType {
    SJEKK_FOR_EKSISTERENDE_VURDERINGER_PÅBEGYNT = 'sjekkForEksisterendeVurderingerPåbegynt',
    LAGRING_AV_VURDERING_PÅBEGYNT = 'lagringAvVurderingPåbegynt',
    VURDERING_LAGRET = 'vurderingLagret',
    LAGRE_VURDERING_FEILET = 'lagreVurderingFeilet',
    LAGRING_AV_VURDERING_AVBRUTT = 'lagringAvVurderingAvbrutt',
    ADVAR_OM_EKSISTERENDE_VURDERINGER = 'advarOmEksisterendeVurderinger',
    HENT_DATA_TIL_VURDERING = 'hentDataTilVurdering',
    HENTET_DATA_TIL_VURDERING = 'hentetDataTilVurdering',
    HENT_DATA_TIL_VURDERING_HAR_FEILET = 'hentDataTilVurderingHarFeilet',
}

export default ActionType;
