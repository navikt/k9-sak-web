interface Overføring {
  retning: 'inn' | 'ut';
  type: 'vanlig' | 'korona';
  antallDager: number;
  avsender?: string;
  mottaker?: string;
}

export default Overføring;
