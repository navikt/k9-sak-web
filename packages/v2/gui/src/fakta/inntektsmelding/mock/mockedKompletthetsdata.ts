import {
  k9_sak_kontrakt_kompletthet_Status as InntektsmeldingStatus,
  type k9_sak_kontrakt_kompletthet_KompletthetsVurderingDto as KompletthetsVurdering,
} from '@navikt/k9-sak-typescript-client/types';

const ferdigvisning: KompletthetsVurdering = {
  tilstand: [
    {
      periode: '2022-02-01/2022-02-16',
      status: [
        {
          arbeidsgiver: { arbeidsgiver: '896929119', arbeidsforhold: '2' },
          status: InntektsmeldingStatus.FORTSETT_UTEN,
          journalpostId: '',
        },
        {
          arbeidsgiver: { arbeidsgiver: '896929119', arbeidsforhold: '1' },
          status: InntektsmeldingStatus.FORTSETT_UTEN,
          journalpostId: '',
        },
      ],
      vurdering: 'KAN_FORTSETTE',
      tilVurdering: true,
      begrunnelse: 'wwdwdwwqwdwqwqw',
    },
  ],
};

export default ferdigvisning;

export const manglerInntektsmelding: KompletthetsVurdering = {
  tilstand: [
    {
      periode: '2022-02-01/2022-02-16',
      status: [
        {
          arbeidsgiver: { arbeidsgiver: '896929119', arbeidsforhold: '2' },
          status: InntektsmeldingStatus.MANGLER,
          journalpostId: '',
        },
        {
          arbeidsgiver: { arbeidsgiver: '896929119', arbeidsforhold: '1' },
          status: InntektsmeldingStatus.MANGLER,
          journalpostId: '',
        },
      ],
      vurdering: 'UDEFINERT',
      tilVurdering: true,
      begrunnelse: '',
    },
  ],
};

export const manglerFlereInntektsmeldinger: KompletthetsVurdering = {
  tilstand: [
    {
      periode: '2022-02-01/2022-02-16',
      status: [
        {
          arbeidsgiver: { arbeidsgiver: '896929119', arbeidsforhold: '2' },
          status: InntektsmeldingStatus.MANGLER,
          journalpostId: '',
        },
        {
          arbeidsgiver: { arbeidsgiver: '896929119', arbeidsforhold: '1' },
          status: InntektsmeldingStatus.MANGLER,
          journalpostId: '',
        },
      ],
      vurdering: 'UDEFINERT',
      tilVurdering: true,
      begrunnelse: '',
    },
    {
      periode: '2022-03-01/2022-03-16',
      status: [
        {
          arbeidsgiver: { arbeidsgiver: '896929119', arbeidsforhold: '2' },
          status: InntektsmeldingStatus.MANGLER,
          journalpostId: '',
        },
        {
          arbeidsgiver: { arbeidsgiver: '896929119', arbeidsforhold: '1' },
          status: InntektsmeldingStatus.MANGLER,
          journalpostId: '',
        },
      ],
      vurdering: 'UDEFINERT',
      tilVurdering: true,
      begrunnelse: '',
    },
  ],
};

export const ikkePaakrevdOgManglerInntektsmelding: KompletthetsVurdering = {
  tilstand: [
    {
      periode: '2022-02-01/2022-02-16',
      status: [
        {
          arbeidsgiver: { arbeidsgiver: '896929119', arbeidsforhold: '2' },
          status: InntektsmeldingStatus.MANGLER,
          journalpostId: '',
        },
        {
          arbeidsgiver: { arbeidsgiver: '896929119', arbeidsforhold: '1' },
          status: InntektsmeldingStatus.MANGLER,
          journalpostId: '',
        },
      ],
      vurdering: 'UDEFINERT',
      tilVurdering: true,
      begrunnelse: '',
    },
    {
      periode: '2022-08-01/2022-08-04',
      status: [
        {
          arbeidsgiver: { arbeidsgiver: '896929119', arbeidsforhold: '2' },
          status: InntektsmeldingStatus.IKKE_PÅKREVD,
          journalpostId: '',
        },
        {
          arbeidsgiver: { arbeidsgiver: '972674818', arbeidsforhold: '' },
          status: InntektsmeldingStatus.MOTTATT,
          journalpostId: '573777857',
        },
      ],
      vurdering: 'UDEFINERT',
      tilVurdering: true,
      begrunnelse: '',
    },
  ],
};

export const ikkePaakrevd: KompletthetsVurdering = {
  tilstand: [
    {
      periode: '2022-08-01/2022-08-04',
      status: [
        {
          arbeidsgiver: { arbeidsgiver: '896929119', arbeidsforhold: '2' },
          status: InntektsmeldingStatus.IKKE_PÅKREVD,
          journalpostId: '',
        },
        {
          arbeidsgiver: { arbeidsgiver: '972674818', arbeidsforhold: '' },
          status: InntektsmeldingStatus.MOTTATT,
          journalpostId: '573777857',
        },
      ],
      vurdering: 'UDEFINERT',
      tilVurdering: true,
      begrunnelse: '',
    },
  ],
};

export const alleErMottatt: KompletthetsVurdering = {
  tilstand: [
    {
      periode: '2022-08-01/2022-08-04',
      status: [
        {
          arbeidsgiver: { arbeidsgiver: '896929119', arbeidsforhold: '2' },
          status: InntektsmeldingStatus.MOTTATT,
          journalpostId: '',
        },
        {
          arbeidsgiver: { arbeidsgiver: '972674818', arbeidsforhold: '' },
          status: InntektsmeldingStatus.MOTTATT,
          journalpostId: '573777857',
        },
      ],
      vurdering: 'UDEFINERT',
      tilVurdering: true,
      begrunnelse: '',
    },
  ],
};
