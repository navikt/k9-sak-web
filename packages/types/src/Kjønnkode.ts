function stringEnum<T extends { [index: string]: U }, U extends string>(x: T) {
  return x;
}
const KjønnkodeEnum = stringEnum({
  KVINNE: 'K',
  MANN: 'M',
  UDEFINERT: '-',
});
type Kjønnkode = typeof KjønnkodeEnum[keyof typeof KjønnkodeEnum];

export default Kjønnkode;
