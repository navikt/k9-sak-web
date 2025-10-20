type DokumentDataType = {
  FRITEKSTBREV?: {
    brødtekst?;
    overskrift?;
    inkluderKalender?;
  };
  REDIGERTBREV?: {
    originalHtml?: string;
    redigertHtml?: string;
    redigertMal?: string;
    inkluderKalender?: boolean;
  };
};

export { DokumentDataType };
