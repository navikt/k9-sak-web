import { addLegacySerializerOption, legacySerializerOptionConfig } from './axiosHttpUtils';

describe('axiosHttpUtils addLegacySerializerOption', () => {
  it('should return set legacy config if nothing is passed in', () => {
    expect(addLegacySerializerOption()).toEqual(legacySerializerOptionConfig);
    expect(addLegacySerializerOption(undefined)).toEqual(legacySerializerOptionConfig);
  });
  it('should return merged headers if a config with headers is passed in', () => {
    expect(addLegacySerializerOption({ headers: { 'X-Something': 'value' } })).toEqual({
      headers: { 'X-Something': 'value', 'X-Json-Serializer-Option': 'kodeverdi-objekt' },
    });
  });
  it('should return config with serializer option added if config without headers is passed in', () => {
    const data = { some: 'data' };
    expect(addLegacySerializerOption({ data })).toEqual({
      data,
      headers: { 'X-Json-Serializer-Option': 'kodeverdi-objekt' },
    });
  });
});
