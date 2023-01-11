// tar inn array med valideringsfunksjoner og validerer verdien
// eslint-disable-next-line import/prefer-default-export
export const validateAll = (valideringsfunksjoner, value, returnString) => {
  const errorList = valideringsfunksjoner.map(func => func(value)).find(Boolean);
  if (Array.isArray(errorList) && errorList.length) {
    if (returnString) {
      return errorList.join(', ');
    }
    return Object.assign({}, ...errorList);
  }
  return undefined;
};
