// Mock data med alle beredskapsperioder ferdig vurdert (ingen IKKE_VURDERT)
export default {
  etablertTilsynPerioder: [
    { periode: { fom: '2022-08-17', tom: '2022-08-17' }, tidPerDag: 'PT3H', kilde: 'SØKER' },
    { periode: { fom: '2022-08-18', tom: '2022-08-19' }, tidPerDag: 'PT5H', kilde: 'SØKER' },
  ],
  smortEtablertTilsynPerioder: [
    { periode: { fom: '2022-08-18', tom: '2022-08-19' }, tidPerDag: 'PT5H' },
  ],
  nattevåk: {
    beskrivelser: [
      {
        periode: {
          fom: '2021-08-20',
          tom: '2021-08-25',
        },
        tekst: 'More text',
        mottattDato: '2021-08-20',
        kilde: 'ANDRE',
      },
    ],
    vurderinger: [
      {
        id: 0,
        periode: {
          fom: '2021-05-11',
          tom: '2021-05-11',
        },
        begrunnelse: 'string',
        resultat: 'OPPFYLT',
        kilde: 'SØKER',
      },
    ],
  },
  beredskap: {
    beskrivelser: [
      {
        periode: {
          fom: '2021-05-11',
          tom: '2021-05-11',
        },
        tekst: 'string',
        mottattDato: '2021-05-11',
        kilde: 'SØKER',
      },
    ],
    vurderinger: [
      {
        id: 0,
        periode: {
          fom: '2021-05-11',
          tom: '2021-05-11',
        },
        begrunnelse: 'Beredskap er vurdert og oppfylt',
        resultat: 'OPPFYLT',
        kilde: 'SØKER',
      },
      {
        id: 1,
        periode: {
          fom: '2021-06-11',
          tom: '2021-06-11',
        },
        begrunnelse: 'Beredskap er vurdert og ikke oppfylt',
        resultat: 'IKKE_OPPFYLT',
        kilde: 'ANNEN_PART',
      },
    ],
  },
};
