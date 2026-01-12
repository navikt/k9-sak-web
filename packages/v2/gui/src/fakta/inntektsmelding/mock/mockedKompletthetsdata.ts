import TilstandStatus from '../src/types/TilstandStatus';

export default {
  tilstand: [
    {
      periode: '2022-02-01/2022-02-16',
      status: [
        {
          arbeidsgiver: { arbeidsgiver: '896929119', arbeidsforhold: '2' },
          status: 'FORTSETT_UTEN',
          journalpostId: null,
        },
        {
          arbeidsgiver: { arbeidsgiver: '896929119', arbeidsforhold: '1' },
          status: 'FORTSETT_UTEN',
          journalpostId: null,
        },
      ],
      vurdering: { kode: 'FORTSETT', beskrivelse: 'Kan beregnes på bakgrunn av opplysninger fra a-ordningen' },
      tilVurdering: true,
      begrunnelse: 'wwdwdwwqwdwqwqw',
    },
  ],
};

export const manglerInntektsmelding = {
  tilstand: [
    {
      periode: '2022-02-01/2022-02-16',
      status: [
        {
          arbeidsgiver: { arbeidsgiver: '896929119', arbeidsforhold: '2' },
          status: TilstandStatus.MANGLER,
          journalpostId: null,
        },
        {
          arbeidsgiver: { arbeidsgiver: '896929119', arbeidsforhold: '1' },
          status: TilstandStatus.MANGLER,
          journalpostId: null,
        },
      ],
      vurdering: {
        kode: '-',
        beskrivelse: 'Udefinert',
      },
      tilVurdering: true,
    },
  ],
};
export const manglerFlereInntektsmeldinger = {
  tilstand: [
    {
      periode: '2022-02-01/2022-02-16',
      status: [
        {
          arbeidsgiver: { arbeidsgiver: '896929119', arbeidsforhold: '2' },
          status: TilstandStatus.MANGLER,
          journalpostId: null,
        },
        {
          arbeidsgiver: { arbeidsgiver: '896929119', arbeidsforhold: '1' },
          status: TilstandStatus.MANGLER,
          journalpostId: null,
        },
      ],
      vurdering: {
        kode: '-',
        beskrivelse: 'Udefinert',
      },
      tilVurdering: true,
    },
    {
      periode: '2022-03-01/2022-03-16',
      status: [
        {
          arbeidsgiver: { arbeidsgiver: '896929119', arbeidsforhold: '2' },
          status: TilstandStatus.MANGLER,
          journalpostId: null,
        },
        {
          arbeidsgiver: { arbeidsgiver: '896929119', arbeidsforhold: '1' },
          status: TilstandStatus.MANGLER,
          journalpostId: null,
        },
      ],
      vurdering: {
        kode: '-',
        beskrivelse: 'Udefinert',
      },
      tilVurdering: true,
    },
  ],
};

export const ikkePaakrevdOgManglerInntektsmelding = {
  tilstand: [
    {
      periode: '2022-02-01/2022-02-16',
      status: [
        {
          arbeidsgiver: { arbeidsgiver: '896929119', arbeidsforhold: '2' },
          status: TilstandStatus.MANGLER,
          journalpostId: null,
        },
        {
          arbeidsgiver: { arbeidsgiver: '896929119', arbeidsforhold: '1' },
          status: TilstandStatus.MANGLER,
          journalpostId: null,
        },
      ],
      vurdering: {
        kode: '-',
        beskrivelse: 'Udefinert',
      },
      tilVurdering: true,
    },
    {
      periode: '2022-08-01/2022-08-04',
      status: [
        {
          arbeidsgiver: {
            arbeidsgiver: '896929119',
            arbeidsforhold: '2',
          },
          status: 'IKKE_PÅKREVD',
          journalpostId: null,
        },
        {
          arbeidsgiver: {
            arbeidsgiver: '972674818',
            arbeidsforhold: null,
          },
          status: 'MOTTATT',
          journalpostId: '573777857',
        },
      ],
      vurdering: {
        kode: '-',
        beskrivelse: 'Udefinert',
      },
      tilVurdering: true,
      begrunnelse: null,
    },
  ],
};

export const ikkePaakrevd = {
  tilstand: [
    {
      periode: '2022-08-01/2022-08-04',
      status: [
        {
          arbeidsgiver: {
            arbeidsgiver: '896929119',
            arbeidsforhold: '2',
          },
          status: 'IKKE_PÅKREVD',
          journalpostId: null,
        },
        {
          arbeidsgiver: {
            arbeidsgiver: '972674818',
            arbeidsforhold: null,
          },
          status: 'MOTTATT',
          journalpostId: '573777857',
        },
      ],
      vurdering: {
        kode: '-',
        beskrivelse: 'Udefinert',
      },
      tilVurdering: true,
      begrunnelse: null,
    },
  ],
};
export const alleErMottatt = {
  tilstand: [
    {
      periode: '2022-08-01/2022-08-04',
      status: [
        {
          arbeidsgiver: {
            arbeidsgiver: '896929119',
            arbeidsforhold: '2',
          },
          status: 'MOTTATT',
          journalpostId: null,
        },
        {
          arbeidsgiver: {
            arbeidsgiver: '972674818',
            arbeidsforhold: null,
          },
          status: 'MOTTATT',
          journalpostId: '573777857',
        },
      ],
      vurdering: {
        kode: '-',
        beskrivelse: 'Udefinert',
      },
      tilVurdering: true,
      begrunnelse: null,
    },
  ],
};
