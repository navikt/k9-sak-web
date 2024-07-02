import { isEmpty } from '@fpsak-frontend/utils/src/validation/validatorsHelper';
import { validateTextCharacters } from '@k9-sak-web/gui/utils/validation/validateTextCharacters.js';

type InputValue = string | number;

export function required(v: InputValue): string | true {
  if (v === null || v === undefined || v === '') {
    return 'Du må oppgi en verdi';
  }
  return true;
}

export const hasValidText = (text: string) => {
  if (text === undefined || text === null) {
    return null;
  }
  const { invalidCharacters } = validateTextCharacters(text);
  if (invalidCharacters?.length > 0) {
    const invalidCharacterString: string = invalidCharacters
      .map(invalidChar => invalidChar.replace(/[\t]/, 'Tabulatortegn'))
      .join('');
    return `Teksten inneholder følgende ugyldige tegn ${invalidCharacterString}`;
  }
  return true;
};

export const minLength = (length: number) => (text: string) =>
  isEmpty(text) || text.toString().trim().length >= length ? true : `Du må skrive flere enn ${length} tegn`;
export const maxLength = (length: number) => (text: string) =>
  isEmpty(text) || text.toString().trim().length <= length ? true : `Maksimalt antall tegn er ${length}`;
