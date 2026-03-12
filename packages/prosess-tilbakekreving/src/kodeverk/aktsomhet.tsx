enum Aktsomhet {
  FORSETT = 'FORSETT',
  GROVT_UAKTSOM = 'GROVT_UAKTSOM',
  SIMPEL_UAKTSOM = 'SIMPEL_UAKTSOM',
}

export const AKTSOMHET_REKKEFØLGE = [
  Aktsomhet.SIMPEL_UAKTSOM,
  Aktsomhet.GROVT_UAKTSOM,
  Aktsomhet.FORSETT,
];

export default Aktsomhet;
