import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router';
// import HeaderWithErrorPanel from './HeaderWithErrorPanel';

// Skipper denne testen da det feiler på noe internt i pakken @navikt/familie-endringslogg
describe.skip('<HeaderWithErrorPanel>', () => {
  // it('skal sjekke at navn blir vist', () => {
  //   render(
  //     <MemoryRouter>
  //       <HeaderWithErrorPanel
  //         navAnsattName="Per"
  //         removeErrorMessage={() => undefined}
  //         setSiteHeight={() => undefined}
  //         getPathToFplos={() => undefined}
  //         getPathToK9Punsj={() => undefined}
  //         ainntektPath="test"
  //         aaregPath="test"
  //       />
  //     </MemoryRouter>,
  //   );
  //   expect(screen.getByText('Pleiepenger, omsorgspenger og frisinn')).toBeInTheDocument();
  // });
});
