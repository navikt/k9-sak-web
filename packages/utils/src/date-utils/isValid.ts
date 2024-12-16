// eslint-disable-next-line no-restricted-globals
const isValid = (date: string) => !isNaN(new Date(date) as any);

export default isValid;
