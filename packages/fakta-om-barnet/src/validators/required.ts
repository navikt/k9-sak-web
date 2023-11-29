export default function required(v: string | number): string | boolean {
  if (v === null || v === undefined || v === '') {
    return 'Du må oppgi en verdi';
  }
  return true;
}
