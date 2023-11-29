import Link from '../../src/types/Link';
import LinkRel from '../../src/constants/LinkRel';

function createMockedVurderingselementLinks(id): Link[] {
  return [
    {
      rel: LinkRel.HENT_VURDERING,
      type: 'GET',
      href: `http://localhost:8082/mock/vurdering?sykdomVurderingId=${id}`,
      versjon: null,
    },
    {
      rel: LinkRel.ENDRE_VURDERING,
      type: 'POST',
      href: `http://localhost:8082/mock/endre-vurdering?sykdomVurderingId=${id}`,
      versjon: null,
      requestPayload: {
        behandlingUuid: '123',
      },
    },
  ];
}

export default createMockedVurderingselementLinks;
