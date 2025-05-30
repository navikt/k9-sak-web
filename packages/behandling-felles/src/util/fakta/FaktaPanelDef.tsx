import { ReactNode } from 'react';

/**
 * Definerer en mal for fakta-paneler. Alle fakta-paneler må ha en url-kode, en tekst-kode og en komponent.
 */
abstract class FaktaPanelDef {
  /**
   * Kode som blir vist som query-param i URL. Denne koden skal defineres i @see faktaPanelCodes
   */
  public abstract getUrlKode(): string;

  /**
   * Kode som definerer tekst som skal vises i fakta-menyen
   */
  public abstract getTekstKode(): string;

  /**
   * Returnerer React-komponenten som definerer panelet
   * @param props Alle props som skal sendes med til komponenten.
   */
  public abstract getKomponent(props: any): ReactNode;

  /**
   * Aksjonspunktkoder som er koblet til panelet.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public getAksjonspunktKoder = (featureToggles?: any): string[] => [];

  /**
   * Data som komponent er avhengig av må defineres her slik at det kan hentes fra server
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public getEndepunkter = (featureToggles?: any): string[] => [];

  /**
   * Data som komponent er avhengig av må defineres her slik at det kan hentes fra server.
   * Forskjell fra getEndepunkter er at disse endepunktene alltid kalles på nytt ved åpning av panelet
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public getEndepunkterUtenCaching = (featureToggles?: any): string[] => [];

  /**
   * For å avgjøre om komponent skal vises brukes denne i @see skalVisePanel
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected getOverstyrVisningAvKomponent = (_data: any, featureToggles?: any): boolean => false;

  /**
   * Data som skal sendes med til komponent. Dette er data som frontend allerede har tilgang til (Trenger ikke hente på nytt)
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public getData = (_data: any): any => ({});

  /**
   * For å avgjøre om komponent skal vises sjekker en om det finnes aksjonspunkter for dette panelet. Det
   * er også mulig å legge til egen sjekk i @see getOverstyrVisningAvKomponent
   */
  public skalVisePanel = (apCodes: string[], data: any, featureToggles?: any): boolean =>
    this.getAksjonspunktKoder(featureToggles).some(a => apCodes.includes(a)) ||
    this.getOverstyrVisningAvKomponent(data, featureToggles);
}

export default FaktaPanelDef;
