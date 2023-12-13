import LinkRel from '../../src/constants/LinkRel';

export default {
  diagnosekoder: ['A001', 'B04'],
  links: [
    {
      rel: LinkRel.ENDRE_DIAGNOSEKODER,
      type: 'POST',
      href: 'http://localhost:8082/mock/endre-diagnosekoder',
      behandlingUuid: 'HER_ER_BEHANDLINGSID',
      versjon: null,
    },
  ],
};
