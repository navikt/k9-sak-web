import LinkRel from '../../src/constants/LinkRel';
import Link from '../../src/types/Link';

const createMockedDokumentelementLinks = (id: string): Link[] => [
  {
    rel: LinkRel.ENDRE_DOKUMENT,
    type: 'POST',
    href: `/mock/endre-dokument?dokumentId=${id}`,
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
