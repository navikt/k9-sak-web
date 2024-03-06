import FagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import { renderWithIntl } from '@fpsak-frontend/utils-test/test-utils';
import { screen } from '@testing-library/react';
import React from 'react';
import UtvidetRettBarnFakta from '../UtvidetRettBarnFakta/UtvidetRettBarnFakta';

describe('<UtvidetRettBarnFakta>', () => {
  it('skal rendre barn faktapanel korrekt for midlertidig alene', () => {
    const objektTilKomponent = {
      personopplysninger: {
        barn: [{ fnr: '123456', fodselsdato: '2019-04-13' }],
        barnSoktFor: [],
      },
      fagsaksType: FagsakYtelseType.OMSORGSPENGER_MIDLERTIDIG_ALENE,
      rammevedtak: [],
    };

    renderWithIntl(<UtvidetRettBarnFakta {...objektTilKomponent} />);

    expect(screen.getByRole('heading', { name: 'Barn' })).toBeInTheDocument();
  });
});
