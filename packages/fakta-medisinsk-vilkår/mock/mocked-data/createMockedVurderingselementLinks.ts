import LinkRel from '../../src/constants/LinkRel';
import Link from '../../src/types/Link';
import { mockUrlPrepend } from '../constants';

function createMockedVurderingselementLinks(id): Link[] {
  return [
    {
      rel: LinkRel.HENT_VURDERING,
      type: 'GET',
      href: `${mockUrlPrepend}/mock/vurdering?sykdomVurderingId=${id}`,
      versjon: null,
    },
    {
      rel: LinkRel.ENDRE_VURDERING,
      type: 'POST',
      href: `${mockUrlPrepend}/mock/endre-vurdering?sykdomVurderingId=${id}`,
      versjon: null,
      requestPayload: {
        behandlingUuid: '123',
      },
    },
  ];
}

export default createMockedVurderingselementLinks;
