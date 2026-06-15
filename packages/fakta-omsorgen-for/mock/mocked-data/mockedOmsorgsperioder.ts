const mockedOmsorgsperioder = {
  omsorgsperioder: [
    {
      periode: { fom: '2023-01-01', tom: '2023-06-30' },
      relasjon: 'MOR',
      relasjonsbeskrivelse: '',
      resultat: 'IKKE_VURDERT',
      resultatEtterAutomatikk: 'IKKE_VURDERT',
      begrunnelse: '',
    },
    {
      periode: { fom: '2023-07-01', tom: '2023-12-31' },
      relasjon: 'FAR',
      relasjonsbeskrivelse: '',
      resultat: 'IKKE_VURDERT',
      resultatEtterAutomatikk: 'IKKE_VURDERT',
      begrunnelse: '',
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
    },
  ],
  registrertSammeBosted: true,
  registrertForeldrerelasjon: true,
  tvingManuellVurdering: false,
};

export default mockedOmsorgsperioder;
