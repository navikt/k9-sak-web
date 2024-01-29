/* eslint-disable import/no-mutable-exports */

// Alle handlers som ligger direkte i dette arrayet vil gjelde
// selv om k9-sak-web startes uten env spesielle env-variabler.
// Requesten treffer handlerne i stedet for eventuelle eksisterende APIer
// f.eks hvis vi har handlere til alle APIene vi bruker her, vil vi aldri treffe den faktiske backenden når vi kjører opp lokalt.
// Derfor burde nok ting kun legges i dette arrayet midlertidig
const handlers = [];

// if (process.env.MSW_MODE === 'test') {
//   handlers = handlers.concat(Object.values(testHandlers));
// }

export default handlers;
