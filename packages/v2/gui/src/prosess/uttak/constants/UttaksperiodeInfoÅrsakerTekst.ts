import { UttaksperiodeInfoÅrsaker } from '@k9-sak-web/backend/k9sak/generated';

/*
 * Disse tekstene lå hardkodet som constants i pakken for prosess-uttak før. Det virker ikke som disse er tilgjengelige via kodeverk
 * eller andre steder.
 */

type UttaksperiodeInfoÅrsakerTekstType = {
  årsak: UttaksperiodeInfoÅrsaker;
  tekst: string;
};

// Fra BarnetsDødsfallÅrsakerMedTekst.ts
export const BarnetsDødsfallÅrsakerMedTekst = [
  {
    årsak: UttaksperiodeInfoÅrsaker.OPPFYLT_PGA_BARNETS_DØDSFALL,
    tekst:
      '100 % pleiepenger innvilget i 30 dager (6 uker) som følge av barnets dødsfall. Perioden graderes bare mot eventuelt arbeid.',
  },
  {
    årsak: UttaksperiodeInfoÅrsaker.OPPFYLT_PGA_BARNETS_DØDSFALL_6_UKER,
    tekst:
      '100 % pleiepenger innvilget i 30 dager (6 uker) som følge av barnets dødsfall. Perioden graderes bare mot eventuelt arbeid.',
  },
  {
    årsak: UttaksperiodeInfoÅrsaker.OPPFYLT_PGA_BARNETS_DØDSFALL_12_UKER,
    tekst:
      '100 % pleiepenger innvilget i 3 måneder som følge av barnets dødsfall. Perioden graderes bare mot eventuelt arbeid.',
  },
];

// Fra IkkeOppfylteÅrsakerMedTekst.ts
export const IkkeOppfylteÅrsakerMedTekst: UttaksperiodeInfoÅrsakerTekstType[] = [
  {
    årsak: UttaksperiodeInfoÅrsaker.LOVBESTEMT_FERIE,
    tekst: 'Årsak for 0 % uttak: Søker avvikler lovbestemt ferie',
  },
  {
    årsak: UttaksperiodeInfoÅrsaker.FOR_LAV_REST_PGA_ETABLERT_TILSYN,
    tekst: 'Årsak for 0 % uttaksgrad: Barnet er i tilsynsordning mer enn 80 %',
  },
  {
    årsak: UttaksperiodeInfoÅrsaker.FOR_LAV_REST_PGA_ANDRE_SØKERE,
    tekst: 'Årsak for 0 % uttaksgrad: Mindre enn 20 % pleiepenger tilgjengelig grunnet annen søkers uttak',
  },
  {
    årsak: UttaksperiodeInfoÅrsaker.FOR_LAV_REST_PGA_ETABLERT_TILSYN_OG_ANDRE_SØKERE,
    tekst:
      'Årsak for 0 % uttaksgrad: Mindre enn 20 % pleiepenger tilgjengelig grunnet annen søkers uttak og tid i tilsynsordning',
  },
  {
    årsak: UttaksperiodeInfoÅrsaker.FOR_LAV_TAPT_ARBEIDSTID,
    tekst:
      'Årsak for 0 % uttaksgrad: Tapt arbeidstid må være minst 20 %. Tapt arbeidstid regnes ut fra aktive arbeidsforhold, næringsaktivitet og frilansoppdrag.',
  },
  {
    årsak: UttaksperiodeInfoÅrsaker.FOR_LAV_ØNSKET_UTTAKSGRAD,
    tekst: 'Årsak for 0 % uttaksgrad: Uttaksgrad må være minst 20 %',
  },
  {
    årsak: UttaksperiodeInfoÅrsaker.FOR_MANGE_DAGER_UTENLANDSOPPHOLD,
    tekst: 'Årsak for avslag: Søker har mottatt ytelse i utlandet i 8 uker.',
  },
  {
    årsak: UttaksperiodeInfoÅrsaker.BARNETS_DØDSFALL,
    tekst: 'Årsak for avslag: Pleietrengende er død.',
  },
  {
    årsak: UttaksperiodeInfoÅrsaker.MAKS_DAGER_OVERSTEGET,
    tekst: 'Årsak for avslag: Søker har mottatt pleiepenger i 60 dager.',
  },
];
