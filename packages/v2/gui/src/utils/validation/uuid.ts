// Enkel validering av at string er gyldig uuid.
export const validUuidString = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

export const isValidUuid = (str: string): boolean => validUuidString.test(str);
