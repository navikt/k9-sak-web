import {rest} from 'msw'
// eslint-disable-next-line import/prefer-default-export
export const testHandlers = {
    navAnsatt: rest.get('/k9/sak/api/nav-ansatt', (req, res, ctx) => res(ctx.json({ navn: 'Bobby Binders' })))
};
