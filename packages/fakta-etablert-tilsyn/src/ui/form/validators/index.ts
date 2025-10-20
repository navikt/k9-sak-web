export function required(v: any) {
  if (v === null || v === undefined || v === '') {
    return 'Du må oppgi en verdi';
  }
  return true;
}
