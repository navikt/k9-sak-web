import React from 'react';
import { EtikettInfo } from 'nav-frontend-etiketter';

import { FlexColumn, FlexRow, Tooltip } from '@fpsak-frontend/shared-components';
import navBrukerKjonn from '@fpsak-frontend/kodeverk/src/navBrukerKjonn';
import diskresjonskodeType from '@fpsak-frontend/kodeverk/src/diskresjonskodeType';
import opplysningAdresseType from '@fpsak-frontend/kodeverk/src/opplysningAdresseType';
import sivilstandType from '@fpsak-frontend/kodeverk/src/sivilstandType';
import region from '@fpsak-frontend/kodeverk/src/region';
import personstatusType from '@fpsak-frontend/kodeverk/src/personstatusType';

import shallowWithIntl, { intlMock } from '../../i18n/index';

import VisittkortDetaljerPopup from './VisittkortDetaljerPopup';

describe('<VisittkortDetaljerPopup>', () => {
  const personopplysningerSoker = {
    navBrukerKjonn: navBrukerKjonn.KVINNE,
    statsborgerskap: 'NORSK',
    avklartPersonstatus: {
      orginalPersonstatus: personstatusType.BOSATT,
      overstyrtPersonstatus: personstatusType.BOSATT,
    },
    personstatus: personstatusType.BOSATT,
    diskresjonskode: diskresjonskodeType.KLIENT_ADRESSE,
    sivilstand: sivilstandType.SAMBOER,
    aktoerId: '24sedfs32',
    navn: 'Olga Utvikler',
    adresser: [
      {
        adresseType: opplysningAdresseType.BOSTEDSADRESSE,
        adresselinje1: 'Oslo',
      },
    ],
    fnr: '98773895',
    region: region.NORDEN,
    barn: [],
  };

  it('skal vise etiketter', () => {
    const wrapper = shallowWithIntl(
      <VisittkortDetaljerPopup.WrappedComponent
        intl={intlMock}
        personopplysninger={personopplysningerSoker}
        alleKodeverk={{}}
        sprakkode="NN"
      />,
    );

    expect(wrapper.find(EtikettInfo)).toHaveLength(4);
    const tooltips = wrapper.find(Tooltip);
    expect(tooltips).toHaveLength(4);
    expect(tooltips.at(0).prop('content')).toEqual('Statsborgerskap');
    expect(tooltips.at(1).prop('content')).toEqual('Personstatus');
    expect(tooltips.at(2).prop('content')).toEqual('Sivilstand');
    expect(tooltips.at(3).prop('content')).toEqual('Foretrukket språk');
  });

  it('skal vise adresser', () => {
    const wrapper = shallowWithIntl(
      <VisittkortDetaljerPopup.WrappedComponent
        intl={intlMock}
        personopplysninger={personopplysningerSoker}
        alleKodeverk={{}}
        sprakkode="NN"
      />,
    );

    const rader = wrapper.find(FlexRow);
    expect(rader).toHaveLength(5);
    const kolonne2ForRad2 = rader.at(1).find(FlexColumn).at(1);
    expect(kolonne2ForRad2.childAt(0).childAt(0).text()).toEqual('Oslo,');
  });
});
