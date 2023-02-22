import { ReactNode } from 'react';
import { Dayjs } from 'dayjs';

export interface EnkelPeriode {
  /**
   * Startdato for perioden, mao. periodens høyre kant.
   */
  fom: Date;
  /**
   * Sluttdato for perioden, mao. periodens venstre kant.
   */
  tom: Date;
}

export interface Periode extends EnkelPeriode {
  /**
   * Brukes for å style/fargesette periodeknappene og indikerer status for perioden.
   */
  status: PeriodStatus;
  /**
   * Brukes for å unikt identifisere perioden, f.eks. om du ønsker å identifisere
   * perioden du klikker på med `onSelectPeriod`-funksjonen.
   */
  id?: string;
  /**
   * Gjør at periodeknappen ikke kaller `onSelectPeriod` når den klikkes.
   */
  disabled?: boolean;
  /**
   * Legges på periodeknappen og kan brukes for å stilsette knappen, f.eks. om
   * man ønsker forskjellige ikoner på knappene for å visuelt identifisere
   * forskjellige typer periods.
   */
  className?: string;
  /**
   * Bestemmer om perioden skal markeres som aktiv.
   */
  active?: boolean;
  /**
   * Dersom perioden har hoverLabel satt, vises en tooltip med hoverLabel-innholdet på hover over periodeknappen
   */
  hoverLabel?: ReactNode;
  /**
   * Indikerer om det skal rendres en blå markering over perioden.
   */
  infoPin?: boolean;
  radLabel?: string;
}

export interface Pin {
  /**
   * Dato objektet gjelder for og datoen den skal plasseres på i tidslinja.
   */
  date: Date;
  /**
   * Innhold som rendres ved hover.
   */
  render?: ReactNode;
  /**
   * Kan sette klassenavn for css-styling
   */
  classname?: string;
}

export type Etikett = AxisLabel;

export type PeriodStatus =
  | 'suksess'
  | 'suksessRevurder'
  | 'suksessDelvis'
  | 'advarsel'
  | 'feil'
  | 'feilRevurder'
  | 'inaktiv'
  | 'ukjent';
export type Tidslinjeskala = number;
export type Percentage = number;

export interface Positioned {
  horizontalPosition: number;
  direction: 'left' | 'right';
}

export interface PositionedPeriod extends Positioned {
  start: Dayjs;
  endInclusive: Dayjs;
  id: string;
  width: number;
  status: PeriodStatus;
  active?: boolean;
  cropped?: 'left' | 'right' | 'both';
  disabled?: boolean;
  className?: string;
  hoverLabel?: ReactNode;
  infoPin?: boolean;
  radLabel?: string;
}

export interface Spatial {
  width: number;
}

export interface AxisLabel extends Positioned, Spatial {
  label: string;
  date: Date;
}

export interface InternalSimpleTimeline {
  id: string;
  periods: PositionedPeriod[];
  radLabel: string;
  radClassname: string;
  onClick?: () => void;
  emptyRowClassname?: string;
}
