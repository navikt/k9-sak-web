export type OverstyrInputBeregningAktivitet = {
    arbeidsgiverOrgnr: string;
    arbeidsgiverAktørId: string | null;
    inntektPrAar: number | string | null;
    refusjonPrAar: number | string | null;
    startdatoRefusjon: string | null;
    opphørRefusjon: string | null;
    skalKunneEndreRefusjon: boolean | null;
};
