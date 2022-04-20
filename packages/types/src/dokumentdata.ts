type LagreDokumentdataType = (params?: any, keepData?: boolean) => Promise<any>;
type DokumentDataType = { FRITEKSTBREV?: { brødtekst?; overskrift?; inkluderKalender?; } };

export { LagreDokumentdataType, DokumentDataType };
