import TotrinnskontrollAksjonspunkt from './totrinnskontrollAksjonspunktTsType';

type TotrinnskontrollSkjermlenkeContext = Readonly<{
  skjermlenkeType: string;
  totrinnskontrollAksjonspunkter: TotrinnskontrollAksjonspunkt[];
}>;

export default TotrinnskontrollSkjermlenkeContext;
