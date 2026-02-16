import type { KompletthetsVurderingDto as KompletthetsVurdering } from '@k9-sak-web/backend/k9sak/kontrakt/kompletthet/KompletthetsVurderingDto.js';
import { Status as InntektsmeldingStatus } from '@k9-sak-web/backend/k9sak/kontrakt/kompletthet/Status.js';

type BehandlingUuidOgVurdering = Readonly<{ behandlingUuid: string; vurdering: KompletthetsVurdering }>;

const behandlingUuidOgVurdering = (
  behandlingUuid: string,
  vurdering: KompletthetsVurdering,
): BehandlingUuidOgVurdering => ({ behandlingUuid, vurdering });

const ferdigvisning = behandlingUuidOgVurdering('1-1-1', {
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
});

export default ferdigvisning;

export const manglerInntektsmelding = behandlingUuidOgVurdering('1-1-2', {
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
});

export const manglerFlereInntektsmeldinger = behandlingUuidOgVurdering('1-1-3', {
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
});

export const ikkePaakrevdOgManglerInntektsmelding = behandlingUuidOgVurdering('1-1-4', {
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
});

export const ikkePaakrevd = behandlingUuidOgVurdering('1-1-5', {
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
});

export const alleErMottatt = behandlingUuidOgVurdering('1-1-6', {
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
});
