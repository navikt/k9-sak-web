import React from 'react';
import { shallowWithIntl } from '@fpsak-frontend/utils-test/intl-enzyme-test-helper';
import FagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import FaktaBarnIndex from '@k9-sak-web/fakta-barn-oms';
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

    const wrapper = shallowWithIntl(<UtvidetRettBarnFakta {...objektTilKomponent} />);

    const faktaBarnIndex = wrapper.find(FaktaBarnIndex);
    expect(faktaBarnIndex).toHaveLength(1);
  });
});
