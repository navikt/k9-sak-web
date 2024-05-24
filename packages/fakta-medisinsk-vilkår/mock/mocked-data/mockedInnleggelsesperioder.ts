import LinkRel from '../../src/constants/LinkRel';

export default {
  perioder: [
    { fom: '2021-01-01', tom: '2021-01-15' },
    { fom: '2021-01-16', tom: '2021-01-20' },
    { fom: '2021-01-21', tom: '2021-01-30' },
  ],
  links: [
    {
      rel: LinkRel.ENDRE_INNLEGGELSESPERIODER,
      type: 'POST',
      href: '/mock/endre-innleggelsesperioder',
      requestPayload: {
        behandlingUuid: 'HER_ER_BEHANDLINGSID',
        versjon: null,
      },
    },
  ],
};
