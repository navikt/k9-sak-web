import TilstandStatus from '../src/types/TilstandStatus';
import { Kompletthet } from '../src/types/KompletthetResponse';

const ferdigvisning: Kompletthet = {
  tilstand: [
    {
      periode: '2022-02-01/2022-02-16',
      status: [
        {
          arbeidsgiver: { arbeidsgiver: '896929119', arbeidsforhold: '2' },
          status: 'FORTSETT_UTEN',
          journalpostId: '',
        },
        {
          arbeidsgiver: { arbeidsgiver: '896929119', arbeidsforhold: '1' },
          status: 'FORTSETT_UTEN',
          journalpostId: '',
        },
      ],
      vurdering: { kode: 'FORTSETT', beskrivelse: 'Kan beregnes på bakgrunn av opplysninger fra a-ordningen' },
      tilVurdering: true,
      begrunnelse: 'wwdwdwwqwdwqwqw',
    },
  ],
};

export default ferdigvisning;

export const manglerInntektsmelding: Kompletthet = {
  tilstand: [
    {
      periode: '2022-02-01/2022-02-16',
      status: [
        {
          arbeidsgiver: { arbeidsgiver: '896929119', arbeidsforhold: '2' },
          status: TilstandStatus.MANGLER,
          journalpostId: '',
        },
        {
          arbeidsgiver: { arbeidsgiver: '896929119', arbeidsforhold: '1' },
          status: TilstandStatus.MANGLER,
          journalpostId: '',
        },
      ],
      vurdering: {
        kode: '-',
        beskrivelse: 'Udefinert',
      },
      tilVurdering: true,
      begrunnelse: '',
    },
  ],
};

export const manglerFlereInntektsmeldinger: Kompletthet = {
  tilstand: [
    {
      periode: '2022-02-01/2022-02-16',
      status: [
        {
          arbeidsgiver: { arbeidsgiver: '896929119', arbeidsforhold: '2' },
          status: TilstandStatus.MANGLER,
          journalpostId: '',
        },
        {
          arbeidsgiver: { arbeidsgiver: '896929119', arbeidsforhold: '1' },
          status: TilstandStatus.MANGLER,
          journalpostId: '',
        },
      ],
      vurdering: {
        kode: '-',
        beskrivelse: 'Udefinert',
      },
      tilVurdering: true,
      begrunnelse: '',
    },
    {
      periode: '2022-03-01/2022-03-16',
      status: [
        {
          arbeidsgiver: { arbeidsgiver: '896929119', arbeidsforhold: '2' },
          status: TilstandStatus.MANGLER,
          journalpostId: '',
        },
        {
          arbeidsgiver: { arbeidsgiver: '896929119', arbeidsforhold: '1' },
          status: TilstandStatus.MANGLER,
          journalpostId: '',
        },
      ],
      vurdering: {
        kode: '-',
        beskrivelse: 'Udefinert',
      },
      tilVurdering: true,
      begrunnelse: '',
    },
  ],
};

export const ikkePaakrevdOgManglerInntektsmelding: Kompletthet = {
  tilstand: [
    {
      periode: '2022-02-01/2022-02-16',
      status: [
        {
          arbeidsgiver: { arbeidsgiver: '896929119', arbeidsforhold: '2' },
          status: TilstandStatus.MANGLER,
          journalpostId: '',
        },
        {
          arbeidsgiver: { arbeidsgiver: '896929119', arbeidsforhold: '1' },
          status: TilstandStatus.MANGLER,
          journalpostId: '',
        },
      ],
      vurdering: {
        kode: '-',
        beskrivelse: 'Udefinert',
      },
      tilVurdering: true,
      begrunnelse: '',
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
          journalpostId: '',
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
      begrunnelse: '',
    },
  ],
};

export const ikkePaakrevd: Kompletthet = {
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
          journalpostId: '',
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
      begrunnelse: '',
    },
  ],
};

export const alleErMottatt: Kompletthet = {
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
          journalpostId: '',
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
      begrunnelse: '',
    },
  ],
};
