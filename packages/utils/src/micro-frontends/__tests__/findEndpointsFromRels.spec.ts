import { SimpleLink } from '@k9-sak-web/types';
import { describe, expect, it } from 'vitest';
import { findEndpointsFromRels } from '../findEndpointsFromRels';

describe('findEndpointsFromRels', () => {
  const createMockLink = (rel: string, href: string): SimpleLink => ({
    rel,
    href,
  });

  const createMockLinks = (): SimpleLink[] => [
    createMockLink('self', '/api/behandling/123'),
    createMockLink('aksjonspunkter', '/api/behandling/123/aksjonspunkter'),
    createMockLink('vilkar', '/api/behandling/123/vilkar'),
    createMockLink('beregning', '/api/behandling/123/beregning'),
    createMockLink('dokument', '/api/behandling/123/dokument'),
  ];

  describe('basic functionality', () => {
    it('should map single rel to desired endpoint name', () => {
      const links = createMockLinks();
      const desiredRels = [{ rel: 'aksjonspunkter', desiredName: 'getAksjonspunkter' }];

      const result = findEndpointsFromRels<{ getAksjonspunkter: string }>(links, desiredRels);

      expect(result).toEqual({
        getAksjonspunkter: '/api/behandling/123/aksjonspunkter',
      });
    });

    it('should map multiple rels to desired endpoint names', () => {
      const links = createMockLinks();
      const desiredRels = [
        { rel: 'aksjonspunkter', desiredName: 'getAksjonspunkter' },
        { rel: 'vilkar', desiredName: 'getVilkar' },
        { rel: 'beregning', desiredName: 'getBeregning' },
      ];

      type ExpectedEndpoints = {
        getAksjonspunkter: string;
        getVilkar: string;
        getBeregning: string;
      };

      const result = findEndpointsFromRels<ExpectedEndpoints>(links, desiredRels);

      expect(result).toEqual({
        getAksjonspunkter: '/api/behandling/123/aksjonspunkter',
        getVilkar: '/api/behandling/123/vilkar',
        getBeregning: '/api/behandling/123/beregning',
      });
    });
  });

  describe('edge cases', () => {
    it('should handle empty links array', () => {
      const links: SimpleLink[] = [];
      const desiredRels = [{ rel: 'aksjonspunkter', desiredName: 'getAksjonspunkter' }];

      const result = findEndpointsFromRels(links, desiredRels);

      expect(result).toEqual({});
    });

    it('should handle empty desiredRels array', () => {
      const links = createMockLinks();
      const desiredRels: { rel: string; desiredName: string }[] = [];

      const result = findEndpointsFromRels(links, desiredRels);

      expect(result).toEqual({});
    });

    it('should skip missing rels without adding them to result', () => {
      const links = [
        createMockLink('self', '/api/behandling/123'),
        createMockLink('vilkar', '/api/behandling/123/vilkar'),
      ];

      const desiredRels = [
        { rel: 'self', desiredName: 'getSelf' },
        { rel: 'missing-rel', desiredName: 'getMissing' },
        { rel: 'vilkar', desiredName: 'getVilkar' },
        { rel: 'another-missing', desiredName: 'getAnotherMissing' },
      ];

      const result = findEndpointsFromRels(links, desiredRels);

      expect(result).toEqual({
        getSelf: '/api/behandling/123',
        getVilkar: '/api/behandling/123/vilkar',
      });
      expect(result).not.toHaveProperty('getMissing');
      expect(result).not.toHaveProperty('getAnotherMissing');
    });
  });
});
