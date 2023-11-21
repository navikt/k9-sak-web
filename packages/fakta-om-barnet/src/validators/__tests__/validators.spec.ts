import required from '../required';

test('required', () => {
  const feilmelding = 'Du må oppgi en verdi';

  expect(required('dette skal fungere')).toBe(true);
  expect(required(null)).toBe(feilmelding);
  expect(required(undefined)).toBe(feilmelding);
  expect(required('')).toBe(feilmelding);
});
