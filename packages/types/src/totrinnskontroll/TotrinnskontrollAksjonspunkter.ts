import { Aktivitet } from './Aktivitet';
import { ArbeidsforholdDto } from './ArbeidsforholdDto';
import { Uttak } from './Uttak';

export interface TotrinnskontrollAksjonspunkter {
  aksjonspunktKode: string;
  opptjeningAktiviteter: Aktivitet[];
  beregningDto: BeregningDto;
  besluttersBegrunnelse: string;
  totrinnskontrollGodkjent: boolean;
  vurderPaNyttArsaker: VurderPaNyttArsaker[];
  uttakPerioder: Uttak[];
  arbeidsforholdDtos: ArbeidsforholdDto[];
  skjermlenkeType: string;
  totrinnskontrollAksjonspunkter: TotrinnskontrollAksjonspunkter[];
  navn?: string;
}

interface FaktaOmBeregningTilfeller {
  kode: string;
}

export interface BeregningDto {
  fastsattVarigEndringNaering: boolean;
  faktaOmBeregningTilfeller: FaktaOmBeregningTilfeller[];
}

export interface VurderPaNyttArsaker {
  kode: string;
  navn: string;
}
