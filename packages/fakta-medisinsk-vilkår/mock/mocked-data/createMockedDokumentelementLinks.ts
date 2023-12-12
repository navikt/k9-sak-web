import Link from '../../src/types/Link';
import LinkRel from '../../src/constants/LinkRel';

const createMockedDokumentelementLinks = (id: string): Link[] => [
  {
    rel: LinkRel.ENDRE_DOKUMENT,
    type: 'POST',
    href: `http://localhost:8082/mock/endre-dokument?dokumentId=${id}`,
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
