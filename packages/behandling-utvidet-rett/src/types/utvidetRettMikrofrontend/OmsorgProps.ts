export interface OmsorgProps {
  behandlingsid: string;
  stiTilEndepunkt: string;
  prosesstype: Prosesstype;
  lesemodus?: boolean;
}

export enum Prosesstype {
  KRONISK_SYKT_BARN = 'KRONISK_SYKT_BARN',
  MIDLERTIDIG_ALENE = 'MIDLERTIDIG_ALENE',
}
