const mockedOmsorgsperioder = {
  omsorgsperioder: [
    {
      periode: { fom: '2023-01-01', tom: '2023-06-30' },
      relasjon: 'MOR',
      relasjonsbeskrivelse: '',
      resultat: 'IKKE_VURDERT',
      resultatEtterAutomatikk: 'IKKE_VURDERT',
      begrunnelse: '',
      readOnly: false,
    },
    {
      periode: { fom: '2023-07-01', tom: '2023-12-31' },
      relasjon: 'FAR',
      relasjonsbeskrivelse: '',
      resultat: 'IKKE_VURDERT',
      resultatEtterAutomatikk: 'IKKE_VURDERT',
      begrunnelse: '',
      readOnly: false,
    },
  ],
  registrertSammeBosted: true,
  registrertForeldrerelasjon: true,
  tvingManuellVurdering: false,
};

export const mockedOmsorgsperioderVurdert = {
  omsorgsperioder: [
    {
      periode: { fom: '2023-01-01', tom: '2023-06-30' },
      relasjon: 'MOR',
      relasjonsbeskrivelse: '',
      resultat: 'OPPFYLT',
      resultatEtterAutomatikk: 'IKKE_VURDERT',
      begrunnelse: 'Bekreftet omsorgsrelasjon.',
      vurdertAv: 'Z123456',
      vurdertTidspunkt: '2023-07-01T10:00:00',
      readOnly: true,
    },
  ],
  registrertSammeBosted: true,
  registrertForeldrerelasjon: true,
  tvingManuellVurdering: false,
};

export default mockedOmsorgsperioder;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type _VenterPåSletting =
  import('@k9-sak-web/gui/featuretoggles/FeatureToggles.js').FeatureToggles['BRUK_OMSORGEN_FOR_V2'];
