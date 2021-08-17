import TotrinnskontrollAksjonspunkter from './TotrinnskontrollAksjonspunkter';

interface Approval {
  contextCode: string;
  skjermlenke: string;
  skjermlenkeNavn: string;
  aksjonspunkter: TotrinnskontrollAksjonspunkter[];
}

export default Approval;
