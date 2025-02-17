import { renderWithIntl } from '@fpsak-frontend/utils-test/test-utils';
import { screen } from '@testing-library/react';
import React from 'react';
import UtvidetRettBarnFakta from '../UtvidetRettBarnFakta/UtvidetRettBarnFakta';
import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';

describe('<UtvidetRettBarnFakta>', () => {
  it('skal rendre barn faktapanel korrekt for midlertidig alene', () => {
    const objektTilKomponent = {
      personopplysninger: {
        barn: [{ fnr: '123456', fodselsdato: '2019-04-13' }],
        barnSoktFor: [],
      },
      fagsaksType: fagsakYtelsesType.OMSORGSPENGER_MA,
      rammevedtak: [],
    };

    renderWithIntl(<UtvidetRettBarnFakta {...objektTilKomponent} />);

    expect(screen.getByRole('heading', { name: 'Barn' })).toBeInTheDocument();
  });
});
