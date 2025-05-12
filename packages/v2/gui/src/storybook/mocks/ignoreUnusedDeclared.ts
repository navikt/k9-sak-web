// This is used in test/mock code to ignore method arguments declared in real code but not needed in test/mock code.
// Should not be used in code actively used in the application.
export const ignoreUnusedDeclared = (v: unknown) => {
  console.info(`Ignoring unused declared variable: ${v}`);
};
