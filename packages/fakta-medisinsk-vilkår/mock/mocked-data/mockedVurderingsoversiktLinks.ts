import LinkRel from '../../src/constants/LinkRel';
import Link from '../../src/types/Link';

const links: Link[] = [
  {
    rel: LinkRel.OPPRETT_VURDERING,
    type: 'POST',
    href: '/mock/opprett-vurdering',
    versjon: null,
    requestPayload: {
      behandlingUuid: 'HER_ER_BEHANDLINGSID',
    },
  },
  {
    rel: LinkRel.DATA_TIL_VURDERING,
    type: 'GET',
    href: '/mock/data-til-vurdering',
    versjon: null,
  },
];

export default links;
