import React from 'react';
import { expect } from 'chai';
import { PersonCard, Gender } from '@navikt/nap-person-card';

import { FlexContainer } from '@fpsak-frontend/shared-components';
import fagsakStatus from '@fpsak-frontend/kodeverk/src/fagsakStatus';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import navBrukerKjonn from '@fpsak-frontend/kodeverk/src/navBrukerKjonn';
import diskresjonskodeType from '@fpsak-frontend/kodeverk/src/diskresjonskodeType';
import opplysningAdresseType from '@fpsak-frontend/kodeverk/src/opplysningAdresseType';
import sivilstandType from '@fpsak-frontend/kodeverk/src/sivilstandType';
import region from '@fpsak-frontend/kodeverk/src/region';
import personstatusType from '@fpsak-frontend/kodeverk/src/personstatusType';
import relasjonsRolleType from '@fpsak-frontend/kodeverk/src/relasjonsRolleType';
import { intlMock } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';

import shallowWithIntl from '../../i18n';
import VisittkortPanel from './VisittkortPanel';

describe('<VisittkortPanel>', () => {
  const fagsak = {
    saksnummer: 123456,
    sakstype: {
      kode: fagsakYtelseType.FORELDREPENGER,
      kodeverk: 'SAKSTYPE',
    },
    relasjonsRolleType: {
      kode: relasjonsRolleType.MOR,
      kodeverk: 'RELASJONS_ROLLE_TYPE',
    },
    status: {
      kode: fagsakStatus.LOPENDE,
      kodeverk: 'STATUS',
    },
    barnFodt: '20120-01-01',
    person: {
      erDod: false,
      navn: 'Olga Utvikler',
      alder: 41,
      personnummer: '1234567',
      erKvinne: true,
      personstatusType: {
        kode: personstatusType.BOSATT,
        kodeverk: 'PERSONSTATUS_TYPE',
      },
    },
    opprettet: '20120-01-01',
    endret: '20120-01-01',
    antallBarn: 1,
    kanRevurderingOpprettes: false,
    skalBehandlesAvInfotrygd: false,
    dekningsgrad: 100,
  };

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

  it('skal vise enkelt visittkort når en ikke har personopplysninger', () => {
    const wrapper = shallowWithIntl(
      <VisittkortPanel.WrappedComponent
        intl={intlMock}
        fagsak={fagsak}
        alleKodeverk={{}}
        sprakkode={{ kode: 'NN', kodeverk: '' }}
        harTilbakekrevingVerge={false}
      />,
    );

    expect(wrapper.find(FlexContainer)).has.length(0);
    const visittkort = wrapper.find(PersonCard);
    expect(visittkort).has.length(1);
    expect(visittkort.prop('name')).is.eql(fagsak.person.navn);
    expect(visittkort.prop('fodselsnummer')).is.eql(fagsak.person.personnummer);
    expect(visittkort.prop('gender')).is.eql(Gender.female);
  });

  it('skal vise visittkort når en har harTilbakekrevingVerge', () => {
    const wrapper = shallowWithIntl(
      <VisittkortPanel.WrappedComponent
        intl={intlMock}
        fagsak={fagsak}
        alleKodeverk={{}}
        sprakkode={{ kode: 'NN', kodeverk: '' }}
        harTilbakekrevingVerge
      />,
    );

    expect(wrapper.find(FlexContainer)).has.length(0);
    const visittkort = wrapper.find(PersonCard);
    expect(visittkort).has.length(1);
    expect(visittkort.prop('name')).is.eql(fagsak.person.navn);
    expect(visittkort.prop('fodselsnummer')).is.eql(fagsak.person.personnummer);
    expect(visittkort.prop('gender')).is.eql(Gender.female);
  });

  it('skal vise visittkort når en har personopplysninger', () => {
    const wrapper = shallowWithIntl(
      <VisittkortPanel.WrappedComponent
        intl={intlMock}
        fagsak={fagsak}
        personopplysninger={personopplysningerSoker}
        alleKodeverk={{}}
        sprakkode={{ kode: 'NN', kodeverk: '' }}
        harTilbakekrevingVerge={false}
      />,
    );

    expect(wrapper.find(FlexContainer)).has.length(1);
    const visittkort = wrapper.find(PersonCard);
    expect(visittkort).has.length(1);
    expect(visittkort.prop('name')).is.eql(personopplysningerSoker.navn);
    expect(visittkort.prop('fodselsnummer')).is.eql(personopplysningerSoker.fnr);
    expect(visittkort.prop('gender')).is.eql(Gender.female);
  });
});
