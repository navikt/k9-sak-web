// Create a unique symbol just to create a unique type that is not exported, so that compilation of external code that
// use safeObjectMerge function must fail when it should fail.
const incompatibleObjectMerge: unique symbol = Symbol('Incompatible object merge');
// @ts-expect-error Ignore unused symbol, we need it to create unique type
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const x: boolean = incompatibleObjectMerge; // Deliberately set to wrong type to get ts error also in legacy ts-check.
// If compilation fails and reports that returned type from safeObjectMerge was this type, it means that the input
// to safeObjectMerge had invalid values.
type IncompatibleMerge = Readonly<typeof incompatibleObjectMerge>;

// Represents a constant object input
type T = Readonly<Record<string, string | number | boolean>>;
// If T1 and T2 has incompatible property values, they become TI so mark the incompatible property with IncompatibleMerge symbol type
type TI = Readonly<Record<string, string | number | boolean | IncompatibleMerge>>;

/**
 * Compares all property values of T1 and T2 records.
 * <p>
 *   If e.g. property key "a" exists in both T1 and T2, and the values of the property are not equal, the type of the
 *   property value becomes IncompatibleMerge to signal this to the compiler.
 */
type AssertSameValues<T1 extends TI, T2 extends T> = {
  [K in keyof (T1 & T2)]: K extends keyof T1 & keyof T2 // For all properties that are both in T1 and T2:
    ? T1[K] extends IncompatibleMerge // T1 input has a property marked as Incompatible merge, continue resolving to it regardless of T2
      ? IncompatibleMerge
      : T1[K] extends T2[K] // T1 has same value as T2 for current property
        ? T2[K] extends T1[K] // T2 has same value as T1 for current property
          ? T1[K] // Property values equal, so doesn't matter which one we use, but will use T1 value
          : IncompatibleMerge // T2 property value not equal T1, set property value to IncompatibleMerge symbol type to signal this.
        : IncompatibleMerge // T1 property value not equal T2, set property value to IncompatibleMerge symbol type to signal this.
    : (T1 & T2)[K]; // All properties not in both T1 and T2 are returned directly
};

// Used on top level merge result so that if the result has one or more properties that has IncompatibleMerge value type,
// the entire result becomes IncompatibleMerge, to ensure that compilation fails.
type HoisIncompatibleMerge<R extends TI> = R extends T ? R : IncompatibleMerge;

/**
 * Used to get a compile time check that two or more constant object types given in TArr has the same values for
 * all properties that has the same property key.
 * <p>
 *   The purpose of this is to check that multiple enums, generated from different backend code bases, are safe to combine
 *   into one common enum type by merging the objects.
 * <p>
 *   It is safe to do so if alle properties of the same property name has the same value.
 */
type AssertSamePropValuesForSameKeys<T1 extends TI, TArr extends readonly T[]> = TArr extends readonly [
  infer T2 extends T,
  ...infer TRest extends readonly T[],
]
  ? AssertSamePropValuesForSameKeys<AssertSameValues<T1, T2>, TRest> // Fortsett rekursivt med rest
  : TArr extends readonly [infer T2 extends T]
    ? AssertSameValues<T1, T2>
    : T1;

// A type to check if an object's properties are literal types (as with 'as const')
// If not, it resolves to an error message type, causing a compile-time error.
type RequireConst<T> = T extends object
  ? {
      [K in keyof T]: T[K] extends string | number | boolean | symbol
        ? string extends T[K]
          ? 'Error: properties must be literal types. Use "as const".'
          : number extends T[K]
            ? 'Error: properties must be literal types. Use "as const".'
            : boolean extends T[K]
              ? 'Error: properties must be literal types. Use "as const".'
              : symbol extends T[K]
                ? 'Error: properties must be literal types. Use "as const".'
                : T[K]
        : T[K];
    }
  : T;

/**
 * Use safeConstCombine to merge a variable number of constant objects (e.g. generated enums) together, and get a compile
 * time check that all the merged objects, for the same property keys has the exact same values.
 * <p>
 *   This is used when combining generated enum constants from various backends into one shared constant that has all values,
 *   but ensures that for the same property key, all the combined enums has the same value.
 * <p>
 *   Without this one risks that the last object overwrites a previous property value without it being detected.
 * <p>
 *   This is a compile time check only. At runtime, it just merges together given objects without checking any actual values.
 */
export function safeConstCombine<const T1 extends TI, const TArr extends readonly T[]>(
  t1: RequireConst<T1>,
  ...objects: { [I in keyof TArr]: RequireConst<TArr[I]> } & TArr
): HoisIncompatibleMerge<AssertSamePropValuesForSameKeys<T1, TArr>> {
  return objects.reduce((acc, obj) => ({ ...acc, ...obj }), t1) as HoisIncompatibleMerge<
    AssertSamePropValuesForSameKeys<T1, TArr>
  >;
}
