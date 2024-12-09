import { buildPath, formatQueryString, parseQueryString } from './urlUtils';

describe('Url-utils', () => {
  describe('formatQueryString', () => {
    it('should format query string correctly with valid parameters', () => {
      const queryParams = { param1: 'value1', param2: 'value2' };
      const result = formatQueryString(queryParams);
      expect(result).toBe('?param1=value1&param2=value2');
    });

    it('should filter out undefined, null, and empty values', () => {
      const queryParams = { param1: 'value1', param2: undefined, param3: null, param4: '' };
      const result = formatQueryString(queryParams);
      expect(result).toBe('?param1=value1');
    });

    it('should URL-encode values', () => {
      const queryParams = { param1: 'value 1', param2: 'value&2' };
      const result = formatQueryString(queryParams);
      expect(result).toBe('?param1=value+1&param2=value%262');
    });

    it('should replace URL-encoded spaces with plus', () => {
      const queryParams = { param1: 'value 1' };
      const result = formatQueryString(queryParams);
      expect(result).toBe('?param1=value+1');
    });
  });

  describe('parseQueryString', () => {
    it('skal parse url parameter', () => {
      const queryString = '?errormessage=Det+finnes+ingen+sak+med+denne+referansen%3A+266';
      expect(parseQueryString(queryString)).toEqual({ errormessage: 'Det finnes ingen sak med denne referansen: 266' });
    });

    it('skal parse to url parametere', () => {
      const queryString = '?errormessage=Det+finnes+ingen+sak+med+denne+referansen%3A+266&message=Dette+er+en+test';
      expect(parseQueryString(queryString)).toEqual({
        errormessage: 'Det finnes ingen sak med denne referansen: 266',
        message: 'Dette er en test',
      });
    });
  });

  describe('buildPath', () => {
    it('skal bygge path fra route', () => {
      const route = '/test/:param/bar/:bar(\\d+)/:optionalParam?/:requiredParam/:baz([a-z]{2})/:qux([a-z]{2})?';
      const params = {
        param: 'foo', // valid
        bar: '1', // valid
        baz: '1', // invalid, does not match regex - required, parameter definition should be included instead
        qux: '1', // invalid, does not match regex - optional, should be omitted
      };

      const path = buildPath(route, params);

      expect(path).toEqual('/test/foo/bar/1/:requiredParam/:baz([a-z]{2})');

      const relativeRoute = 'hei/paa/:hvem';

      const relativePath = buildPath(relativeRoute, { hvem: 'deg' });

      expect(relativePath).toEqual('hei/paa/deg');
    });

    it('should handle optional parameters correctly', () => {
      const path = '/path/:param1/:param2?';
      const params = { param1: 'value1' };
      const result = buildPath(path, params);
      expect(result).toBe('/path/value1');
    });

    it('should handle parameters with patterns correctly', () => {
      const path = '/path/:param1(\\d+)/:param2';
      const params = { param1: '123', param2: 'value2' };
      const result = buildPath(path, params);
      expect(result).toBe('/path/123/value2');
    });

    it('should return the original segment if parameter is not provided', () => {
      const path = '/path/:param1/:param2';
      const params = { param1: 'value1' };
      const result = buildPath(path, params);
      expect(result).toBe('/path/value1/:param2');
    });
  });
});
