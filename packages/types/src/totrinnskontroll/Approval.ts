import TotrinnskontrollAksjonspunkter from './TotrinnskontrollAksjonspunkter';

export interface Approval {
  contextCode: string;
  skjermlenke: string;
  skjermlenkeNavn: string;
  aksjonspunkter: TotrinnskontrollAksjonspunkter[];
}

export default Approval;
