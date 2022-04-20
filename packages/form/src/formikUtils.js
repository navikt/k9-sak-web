// tar inn array med valideringsfunksjoner og validerer verdien
// eslint-disable-next-line import/prefer-default-export
export const validateAll = (valideringsfunksjoner, value) => {
  const errorList = valideringsfunksjoner.map(func => func(value)).find(Boolean);

  if (Array.isArray(errorList) && errorList.length) {
    return Object.assign({}, ...errorList);
  }
  return null;
};
