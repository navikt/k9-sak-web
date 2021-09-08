import React from 'react';
import { EtikettInfo, EtikettAdvarsel, EtikettFokus } from 'nav-frontend-etiketter';

import navBrukerKjonn from '@fpsak-frontend/kodeverk/src/navBrukerKjonn';
import diskresjonskodeType from '@fpsak-frontend/kodeverk/src/diskresjonskodeType';
import opplysningAdresseType from '@fpsak-frontend/kodeverk/src/opplysningAdresseType';
import sivilstandType from '@fpsak-frontend/kodeverk/src/sivilstandType';
import region from '@fpsak-frontend/kodeverk/src/region';
import personstatusType from '@fpsak-frontend/kodeverk/src/personstatusType';
import { Tooltip } from '@fpsak-frontend/shared-components';

import shallowWithIntl, { intlMock } from '../../i18n/index';
import VisittkortLabels from './VisittkortLabels';

describe('<VisittkortLabels>', () => {
  const personopplysningerSoker = {
    fodselsdato: '1990-01-01',
    navBrukerKjonn: {
      kode: navBrukerKjonn.KVINNE,
      kodeverk: 'NAV_BRUKER_KJONN',
    },
    statsborgerskap: {
      kode: 'NORSK',
      kodeverk: 'STATSBORGERSKAP',
    },
    avklartPersonstatus: {
      orginalPersonstatus: {
        kode: personstatusType.BOSATT,
        kodeverk: 'PERSONSTATUS_TYPE',
      },
      overstyrtPersonstatus: {
        kode: personstatusType.BOSATT,
        kodeverk: 'PERSONSTATUS_TYPE',
      },
    },
    personstatus: {
      kode: personstatusType.BOSATT,
      kodeverk: 'PERSONSTATUS_TYPE',
    },
    diskresjonskode: {
      kode: diskresjonskodeType.KLIENT_ADRESSE,
      kodeverk: 'DISKRESJONSKODE_TYPE',
    },
    sivilstand: {
      kode: sivilstandType.SAMBOER,
      kodeverk: 'SIVILSTAND_TYPE',
    },
    aktoerId: '24sedfs32',
    navn: 'Olga Utvikler',
    adresser: [
      {
        adresseType: {
          kode: opplysningAdresseType.BOSTEDSADRESSE,
          kodeverk: 'ADRESSE_TYPE',
        },
        adresselinje1: 'Oslo',
      },
    ],
    fnr: '98773895',
    region: {
      kode: region.NORDEN,
      kodeverk: 'REGION',
    },
    barn: [],
  };

  it('skal ikke vise noen etiketter', () => {
    const wrapper = shallowWithIntl(
      <VisittkortLabels.WrappedComponent intl={intlMock} personopplysninger={personopplysningerSoker} />,
    );

    expect(wrapper.find(EtikettInfo)).toHaveLength(0);
  });

  it('skal vise etikett for dødsdato', () => {
    const wrapper = shallowWithIntl(
      <VisittkortLabels.WrappedComponent
        intl={intlMock}
        personopplysninger={{
          ...personopplysningerSoker,
          dodsdato: '2019-01-01',
        }}
      />,
    );

    expect(wrapper.find(EtikettInfo)).toHaveLength(1);
    const tooltip = wrapper.find(Tooltip);
    expect(tooltip).toHaveLength(1);
    expect(tooltip.prop('content')).toEqual('Personen er død');
  });

  it('skal vise etikett for kode 6', () => {
    const wrapper = shallowWithIntl(
      <VisittkortLabels.WrappedComponent
        intl={intlMock}
        personopplysninger={{
          ...personopplysningerSoker,
          diskresjonskode: {
            kode: diskresjonskodeType.KODE6,
            kodeverk: '',
          },
        }}
      />,
    );

    expect(wrapper.find(EtikettAdvarsel)).toHaveLength(1);
    const tooltip = wrapper.find(Tooltip);
    expect(tooltip).toHaveLength(1);
    expect(tooltip.prop('content')).toEqual('Personen har diskresjonsmerking kode 6');
  });

  it('skal vise etikett for kode 7', () => {
    const wrapper = shallowWithIntl(
      <VisittkortLabels.WrappedComponent
        intl={intlMock}
        personopplysninger={{
          ...personopplysningerSoker,
          diskresjonskode: {
            kode: diskresjonskodeType.KODE7,
            kodeverk: '',
          },
        }}
      />,
    );

    expect(wrapper.find(EtikettFokus)).toHaveLength(1);
    const tooltip = wrapper.find(Tooltip);
    expect(tooltip).toHaveLength(1);
    expect(tooltip.prop('content')).toEqual('Personen har diskresjonsmerking kode 7');
  });

  it('skal vise etikett for verge', () => {
    const wrapper = shallowWithIntl(
      <VisittkortLabels.WrappedComponent
        intl={intlMock}
        personopplysninger={{
          ...personopplysningerSoker,
          harVerge: true,
        }}
      />,
    );

    expect(wrapper.find(EtikettInfo)).toHaveLength(1);
    const tooltip = wrapper.find(Tooltip);
    expect(tooltip).toHaveLength(1);
    expect(tooltip.prop('content')).toEqual('Personen har verge');
  });

  it('skal vise etikett for søker under 18', () => {
    const wrapper = shallowWithIntl(
      <VisittkortLabels.WrappedComponent
        intl={intlMock}
        personopplysninger={{
          ...personopplysningerSoker,
          fodselsdato: '2019-01-01',
        }}
      />,
    );

    expect(wrapper.find(EtikettInfo)).toHaveLength(1);
    const tooltip = wrapper.find(Tooltip);
    expect(tooltip).toHaveLength(1);
    expect(tooltip.prop('content')).toEqual('Personen er under 18 år');
  });
});
