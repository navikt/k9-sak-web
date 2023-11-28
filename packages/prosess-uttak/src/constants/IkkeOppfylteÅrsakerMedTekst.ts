import Årsaker from './Årsaker';

const IkkeOppfylteÅrsakerMedTekst = [
  {
    årsak: Årsaker.LOVBESTEMT_FERIE,
    tekst: 'Årsak for 0 % uttak: Søker avvikler lovbestemt ferie',
  },
  {
    årsak: Årsaker.FOR_LAV_REST_PGA_ETABLERT_TILSYN,
    tekst: 'Årsak for 0 % uttaksgrad: Barnet er i tilsynsordning mer enn 80 %',
  },
  {
    årsak: Årsaker.FOR_LAV_REST_PGA_ANDRE_SØKERE,
    tekst: 'Årsak for 0 % uttaksgrad: Mindre enn 20 % pleiepenger tilgjengelig grunnet annen søkers uttak',
  },
  {
    årsak: Årsaker.FOR_LAV_REST_PGA_ETABLERT_TILSYN_OG_ANDRE_SØKERE,
    tekst:
      'Årsak for 0 % uttaksgrad: Mindre enn 20 % pleiepenger tilgjengelig grunnet annen søkers uttak og tid i tilsynsordning',
  },
  {
    årsak: Årsaker.FOR_LAV_TAPT_ARBEIDSTID,
    tekst:
      'Årsak for 0 % uttaksgrad: Tapt arbeidstid må være minst 20 %. Tapt arbeidstid regnes ut fra aktive arbeidsforhold, næringsaktivitet og frilansoppdrag.',
  },
  {
    årsak: Årsaker.FOR_LAV_ØNSKET_UTTAKSGRAD,
    tekst: 'Årsak for 0 % uttaksgrad: Uttaksgrad må være minst 20 %',
  },
  {
    årsak: Årsaker.FOR_MANGE_DAGER_UTENLANDSOPPHOLD,
    tekst: 'Årsak for avslag: Søker har mottatt pleiepenger i utlandet i 8 uker.',
  },
  {
    årsak: Årsaker.BARNETS_DØDSFALL,
    tekst: 'Årsak for avslag: Pleietrengende er død.',
  },
  {
    årsak: Årsaker.MAKS_DAGER_OVERSTEGET,
    tekst: 'Årsak for avslag: Søker har mottatt pleiepenger i 60 dager.',
  },
];

export default IkkeOppfylteÅrsakerMedTekst;
