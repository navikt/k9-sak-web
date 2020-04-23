interface Arbeidsforhold {
  type: string, // TODO: hvilke typer har vi her? vil de bestemme når de andre typene er satt?
  organisasjonsnummer?: string,
  aktørId?: string,
  arbeidsforholdId?: string
}

export default Arbeidsforhold;
