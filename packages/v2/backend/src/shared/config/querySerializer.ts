import { createQuerySerializer } from '@navikt/k9-sak-typescript-client/client/utils';

export const baseQuerySerializer = createQuerySerializer({
  object: {
    explode: false,
    style: 'deepObject',
  },
  array: {
    explode: true,
    style: 'form',
  },
});

const singlePropertyValueOrOriginal = (v: unknown): unknown => {
  let firstNonEmptyValue: unknown = null;
  if (v != null) {
    if (typeof v === 'object') {
      for (const value of Object.values(v)) {
        if (value != null && `${value}`.trim().length > 0) {
          if (firstNonEmptyValue == null) {
            firstNonEmptyValue = value;
          } else {
            // There is more than one non-empty property value in the object, return original
            return v;
          }
        }
      }
      // If we get there, there was exactly one property with non empty value, or no properties with values on them.
      // Should then return the single property value, or null so that the default single parameter value conversion
      // to object on server may work.
      // In case firstNonEmptyValue is an object, do a recursive call to extract any single value from tha object.
      if (typeof firstNonEmptyValue === 'object') {
        return singlePropertyValueOrOriginal(firstNonEmptyValue);
      }
      return firstNonEmptyValue;
    }
  }
  return v;
};

const simplifyQueryParamsObjectWithSingleProperty = (queryParams: object): Record<string, unknown> => {
  const ret: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(queryParams)) {
    ret[key] = singlePropertyValueOrOriginal(val);
  }
  return ret;
};

/**
 * Adds special support for serializing query parameters defined as objects.
 * <p>
 *   The backend server defines class based query arguments. The default behaviour is that the server deserializes incoming
 *   query parameter values to instances of the defined class by invoking a single value constructor on the class.
 * <p>
 *   The openapi definition though, is defined as an object with at least one property, since that is the (de)serialization definition.
 *   Therefore, there is a mismatch between what the generated typescript says should be the query argument type, and what
 *   will actually work when it reaches the server.
 * <p>
 *   To fix this mismatch, we here customize the normal query serializer of the generated typescript client, so that when
 *   the query argument is an object with a single property, the single property value is extracted before it is passed on
 *   to the normal query parameter serializer. This then works as long as there is just one property value. If there is more,
 *   we must either override with a custom query serializer on the client call, or create a custom "ParamConverter" on the server.
 */
export const defaultQuerySerializer = (query: unknown): string => {
  if (query != null && typeof query === 'object') {
    return baseQuerySerializer(simplifyQueryParamsObjectWithSingleProperty(query));
  } else {
    return baseQuerySerializer(query);
  }
};
