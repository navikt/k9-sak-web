import { buildPath, pathWithQueryParams, resolveParam } from './urlUtils.js';
import type { Path } from 'react-router';

describe('locationWithQueryParams', () => {
  it('should add given queryParams to given location', () => {
    const qp = {
      punkt: 'punkt1',
      fakta: 'fakta1',
      tab: 'tab1',
      stotte: 'stotte1',
      risiko: true,
    };
    const inp: Partial<Path> = {
      pathname: '/test',
      search: '',
    };
    const res = pathWithQueryParams(inp, qp);
    expect(res.pathname).toEqual(inp.pathname);
    expect(res.search).toEqual('punkt=punkt1&fakta=fakta1&tab=tab1&stotte=stotte1&risiko=true');
    expect(inp.search).toEqual('');
  });
  it('should overwrite existing queryParams with same name, and leave others', () => {
    const qp = {
      fakta: 'fakta2',
      tab: 'tab2',
    };
    const inp: Partial<Path> = {
      pathname: '/test',
      search: 'punkt=punkt1&fakta=fakta1&other=other1',
    };
    const res = pathWithQueryParams(inp, qp);
    expect(res.pathname).toEqual(inp.pathname);
    expect(res.search).toEqual('punkt=punkt1&fakta=fakta2&other=other1&tab=tab2');
    expect(inp.search).toEqual('punkt=punkt1&fakta=fakta1&other=other1');
  });
});

describe('resolveParam', () => {
  const params = {
    bbb: 'replacedB',
    ccc: 123,
    nummerId: 555,
  };
  const suite = [
    { segment: 'aaa', expected: 'aaa' },
    { segment: 'bbb', expected: 'bbb' },
    { segment: ':bbb', expected: 'replacedB' },
    { segment: ':ccc', expected: '123' },
    { segment: ':nummerId(\\d+)', expected: '555' },
    { segment: ':bbb(\\d+)', expected: ':bbb(\\d+)' },
    { segment: ':bbb(.+)', expected: 'replacedB' },
  ];

  it('should perform replacements on suite segments if params match', () => {
    const resolver = resolveParam(params);
    for (const testinput of suite) {
      const res = resolver(testinput.segment);
      expect(res).toEqual(testinput.expected);
    }
  });
});

describe('buildPath', () => {
  it('should build paths with segments replaced by params, preserving leading/trailing slash', () => {
    const params = {
      bbb: 'replacedB',
      ccc: 123,
    };
    const suite = [
      { path: '/aaa/bbb/', params, expected: '/aaa/bbb/' },
      { path: 'aaa/bbb/', params, expected: 'aaa/bbb/' },
      { path: 'aaa/bbb', params, expected: 'aaa/bbb' },
      { path: 'aaa/:bbb', params, expected: 'aaa/replacedB' },
      { path: '/aaa/:bbb//*', params, expected: '/aaa/replacedB/*' },
      { path: '/aaa/:ccc(\\d+)/:bbb', params, expected: '/aaa/123/replacedB' },
      { path: '/xxx/:yyy(\\d+)/:bbb', params, expected: '/xxx/:yyy(\\d+)/replacedB' },
      { path: ':ccc/', params, expected: '123/' },
    ];
    for (const testinput of suite) {
      expect(buildPath(testinput.path, testinput.params)).toEqual(testinput.expected);
    }
  });
});
