// eslint-disable-next-line import/prefer-default-export
export const validateAll = (validations, value) => {
  const errorList = validations.map(func => func(value)).find(Boolean);

  if (Array.isArray(errorList) && errorList.length) {
    return errorList[0];
  }
  return null;
};
