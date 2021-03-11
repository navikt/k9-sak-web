import React from 'react';
import { shallowWithIntl } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import FagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import Seksjon from '@k9-sak-web/fakta-barn-og-overfoeringsdager/src/components/Seksjon';
import UtvidetRettBarnFakta from '../UtvidetRettBarnFakta/UtvidetRettBarnFakta';

describe('<UtvidetRettBarnFakta>', () => {
  it('skal rendre barn faktapanel korrekt for midlertidig alene', () => {
    const objektTilKomponent = {
      personopplysninger: {
        barn: [{ fnr: '123456' }],
        barnSoktFor: [],
      },
      fagsaksType: FagsakYtelseType.OMSORGSPENGER_MIDLERTIDIG_ALENE,
    };

    const wrapper = shallowWithIntl(<UtvidetRettBarnFakta {...objektTilKomponent} />);

    const elementerMedTypeOchText = (nodeType, tekst) =>
      wrapper.findWhere(node => node.name() === nodeType && node.text() === tekst);

    const overskrift = wrapper.find(Seksjon).prop('title').id;
    const fodselsnummer = elementerMedTypeOchText('span', objektTilKomponent.personopplysninger.barn[0].fnr);

    expect(overskrift).toBe('UtvidetRett.Barn.MidlertidigAlene.Titel');
    expect(fodselsnummer).toHaveLength(1);
  });

  it('skal rendre barn faktapanel korrekt for kronisk sykt barn', () => {
    const objektTilKomponent = {
      personopplysninger: {
        barn: [],
        barnSoktFor: [{ fnr: '101112' }],
      },
      fagsaksType: FagsakYtelseType.OMSORGSPENGER_KRONISK_SYKT_BARN,
    };

    const wrapper = shallowWithIntl(<UtvidetRettBarnFakta {...objektTilKomponent} />);

    const elementerMedTypeOchText = (nodeType, tekst) =>
      wrapper.findWhere(node => node.name() === nodeType && node.text() === tekst);

    const overskrift = wrapper.find(Seksjon).prop('title').id;
    const fodselsnummer = elementerMedTypeOchText('span', objektTilKomponent.personopplysninger.barnSoktFor[0].fnr);

    expect(overskrift).toBe('UtvidetRett.Barn.KroniskSyktBarn.Titel');
    expect(fodselsnummer).toHaveLength(1);
  });
});
