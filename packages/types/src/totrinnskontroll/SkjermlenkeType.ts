// Kodeverk: skjermlenke attributet er egentlig et kodeverk, men har ikke fått 'kodeverk' attributtet fra backend, så det blir
// sendt som objekt med navn og kode. Vi har som mål å skrive om histirikkinnslag til noe simplere snart, så backend endrer ikke
// denne nå (fortsetter å sende som kodeverk-objekter uten kodeverk attributet fra backend inntill videre)
export interface SkjermlenkeTyper {
  kode: string;
  navn: string;
}

export default SkjermlenkeTyper;
