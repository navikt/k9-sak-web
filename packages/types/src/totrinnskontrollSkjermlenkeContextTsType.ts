import TotrinnskontrollAksjonspunkt from './totrinnskontrollAksjonspunktTsType';

/** @deprecated Bruk generert type istaden */
export type TotrinnskontrollSkjermlenkeContext = Readonly<{
  skjermlenkeType: string;
  totrinnskontrollAksjonspunkter: TotrinnskontrollAksjonspunkt[];
}>;

export default TotrinnskontrollSkjermlenkeContext;
