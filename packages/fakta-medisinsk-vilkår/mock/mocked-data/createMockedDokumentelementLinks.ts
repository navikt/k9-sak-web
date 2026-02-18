import LinkRel from '../../src/constants/LinkRel';
import Link from '../../src/types/Link';
import { mockUrlPrepend } from '../constants';

const createMockedDokumentelementLinks = (id: string): Link[] => [
  {
    rel: LinkRel.ENDRE_DOKUMENT,
    type: 'POST',
    href: `${mockUrlPrepend}/mock/endre-dokument?dokumentId=${id}`,
    versjon: null,
  },
  {
    rel: LinkRel.DOKUMENT_INNHOLD,
    type: 'GET',
    href: `#`,
    versjon: null,
  },
];

export default createMockedDokumentelementLinks;
