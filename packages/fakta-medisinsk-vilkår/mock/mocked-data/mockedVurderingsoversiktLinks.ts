import LinkRel from '../../src/constants/LinkRel';
import Link from '../../src/types/Link';
import { mockUrlPrepend } from '../constants';

const links: Link[] = [
  {
    rel: LinkRel.OPPRETT_VURDERING,
    type: 'POST',
    href: `${mockUrlPrepend}/mock/opprett-vurdering`,
    versjon: null,
    requestPayload: {
      behandlingUuid: 'HER_ER_BEHANDLINGSID',
    },
  },
  {
    rel: LinkRel.DATA_TIL_VURDERING,
    type: 'GET',
    href: `${mockUrlPrepend}/mock/data-til-vurdering`,
    versjon: null,
  },
];

export default links;
