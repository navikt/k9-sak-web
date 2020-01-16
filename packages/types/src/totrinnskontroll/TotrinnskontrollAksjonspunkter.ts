interface TotrinnskontrollAksjonspunkter {
  aksjonspunktKode: string;
  opptjeningAktiviteter: any[];
  beregningDto: BeregningDto;
  besluttersBegrunnelse: string;
  totrinnskontrollGodkjent: boolean;
  vurderPaNyttArsaker: VurderPaNyttArsaker[];
  uttakPerioder: any[];
  arbeidforholdDtos: any[];
  skjermlenkeType: string;
  totrinnskontrollAksjonspunkter: TotrinnskontrollAksjonspunkter[];
}

export interface BeregningDto {
  fastsattVarigEndringNaering: boolean;
  faktaOmBeregningTilfeller: { kode: string }[];
}

export interface VurderPaNyttArsaker {
  kode: string;
  navn: string;
}

export default TotrinnskontrollAksjonspunkter;
