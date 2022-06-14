import React from 'react';
import { expect } from 'chai';

import personstatusType from '@fpsak-frontend/kodeverk/src/personstatusType';
import sivilstandType from '@fpsak-frontend/kodeverk/src/sivilstandType';
import opplysningAdresseType from '@fpsak-frontend/kodeverk/src/opplysningAdresseType';
import { Normaltekst } from 'nav-frontend-typografi';
import EtikettBase from 'nav-frontend-etiketter';
import { KodeverkMedNavn } from '@k9-sak-web/types';
import { BostedSokerView } from './BostedSokerView';
import shallowWithIntl, { intlMock } from '../../i18n';

import { BostedSokerPersonopplysninger } from '../BostedSokerFaktaIndex';

describe('<BostedsokerView>', () => {
  const soker = {
    navn: 'Espen Utvikler',
    adresser: [
      {
        adresseType: opplysningAdresseType.POSTADRESSE,
        adresselinje1: 'Vei 1',
        postNummer: '1000',
        poststed: 'Oslo',
      },
    ],
    sivilstand: sivilstandType.UGIFT,
    region: 'NORDEN',
    personstatus: 'BOSA',
    avklartPersonstatus: {
      overstyrtPersonstatus: personstatusType.BOSATT,
    },
  } as BostedSokerPersonopplysninger;

  const regionTypes = [
    {
      kode: 'NORDEN',
      navn: 'Norden',
    },
  ] as KodeverkMedNavn[];

  const sivilstandTypes = [
    {
      kode: sivilstandType.UGIFT,
      navn: 'Ugift',
    },
  ] as KodeverkMedNavn[];

  const personstatusTypes = [
    {
      kode: personstatusType.BOSATT,
      navn: 'Bosatt',
    },
    {
      kode: personstatusType.DOD,
      navn: 'Bosatt',
    },
  ] as KodeverkMedNavn[];

  it('vise navn', () => {
    const wrapper = shallowWithIntl(
      <BostedSokerView
        intl={intlMock}
        personopplysninger={soker}
        regionTypes={regionTypes}
        sivilstandTypes={sivilstandTypes}
        personstatusTypes={personstatusTypes}
        sokerTypeTextId="BostedSokerFaktaIndex.Soker"
      />,
    );

    expect(wrapper.find('Element').childAt(0).text()).to.eql('Espen Utvikler');
  });

  it('skal vise  adresse informasjon', () => {
    const wrapper = shallowWithIntl(
      <BostedSokerView
        intl={intlMock}
        personopplysninger={soker}
        regionTypes={regionTypes}
        sivilstandTypes={sivilstandTypes}
        personstatusTypes={personstatusTypes}
        sokerTypeTextId="BostedSokerFaktaIndex.Soker"
      />,
    );
    const adr = wrapper.find(Normaltekst);
    expect(adr).to.have.length(2);
    expect(adr.first().childAt(0).text()).to.eql('Vei 1, 1000 Oslo');
    expect(adr.last().childAt(0).text()).to.eql('-');
  });

  it('skal vise etiketter', () => {
    const wrapper = shallowWithIntl(
      <BostedSokerView
        intl={intlMock}
        personopplysninger={soker}
        regionTypes={regionTypes}
        sivilstandTypes={sivilstandTypes}
        personstatusTypes={personstatusTypes}
        sokerTypeTextId="BostedSokerFaktaIndex.Soker"
      />,
    );
    const etikettfokus = wrapper.find(EtikettBase);
    expect(etikettfokus).to.have.length(3);
    const personstatus = etikettfokus.at(0);
    expect(personstatus.prop('title')).to.equal('Personstatus');
    expect(personstatus.childAt(0).text()).to.equal('Bosatt');
    const sivilstand = etikettfokus.at(1);
    expect(sivilstand.prop('title')).to.equal('Sivilstand');
    expect(sivilstand.childAt(0).text()).to.equal('Ugift');
    const region = etikettfokus.at(2);
    expect(region.prop('title')).to.equal('Region');
    expect(region.childAt(0).text()).to.equal('Norden');
  });

  it('skal vise ukjent når personstatus ukjent', () => {
    soker.avklartPersonstatus = null;
    soker.personstatus = '-' as string;

    const wrapper = shallowWithIntl(
      <BostedSokerView
        intl={intlMock}
        personopplysninger={soker}
        regionTypes={regionTypes}
        sivilstandTypes={sivilstandTypes}
        personstatusTypes={personstatusTypes}
        sokerTypeTextId="BostedSokerFaktaIndex.Soker"
      />,
    );
    const etikettfokus = wrapper.find(EtikettBase);
    expect(etikettfokus).to.have.length(3);
    const personstatus = etikettfokus.at(0);
    expect(personstatus.prop('title')).to.equal('Personstatus');
    expect(personstatus.childAt(0).text()).to.equal('Ukjent');
    const sivilstand = etikettfokus.at(1);
    expect(sivilstand.prop('title')).to.equal('Sivilstand');
    expect(sivilstand.childAt(0).text()).to.equal('Ugift');
    const region = etikettfokus.at(2);
    expect(region.prop('title')).to.equal('Region');
    expect(region.childAt(0).text()).to.equal('Norden');
  });
});
