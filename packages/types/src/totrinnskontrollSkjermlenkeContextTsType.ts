import TotrinnskontrollAksjonspunkt from './totrinnskontrollAksjonspunktTsType';

export type TotrinnskontrollSkjermlenkeContext = Readonly<{
  skjermlenkeType: string;
  totrinnskontrollAksjonspunkter: TotrinnskontrollAksjonspunkt[];
}>;

export default TotrinnskontrollSkjermlenkeContext;
