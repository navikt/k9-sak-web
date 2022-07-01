import React from 'react';
import { PersonCard, Gender } from '@navikt/k9-react-components';

import { FlexContainer } from '@fpsak-frontend/shared-components';
import navBrukerKjonn from '@fpsak-frontend/kodeverk/src/navBrukerKjonn';
import diskresjonskodeType from '@fpsak-frontend/kodeverk/src/diskresjonskodeType';
import opplysningAdresseType from '@fpsak-frontend/kodeverk/src/opplysningAdresseType';
import sivilstandType from '@fpsak-frontend/kodeverk/src/sivilstandType';
import region from '@fpsak-frontend/kodeverk/src/region';
import personstatusType from '@fpsak-frontend/kodeverk/src/personstatusType';

import shallowWithIntl from '../../i18n/index';
import VisittkortPanel from './VisittkortPanel';

describe('<VisittkortPanel>', () => {
  const fagsakPerson = {
    erDod: false,
    navn: 'Olga Utvikler',
    alder: 41,
    personnummer: '1234567',
    erKvinne: true,
    personstatusType: personstatusType.BOSATT,
  };

  const personopplysningerSoker = {
    fodselsdato: '1990-01-01',
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

  it('skal vise enkelt visittkort når en ikke har personopplysninger', () => {
    const wrapper = shallowWithIntl(
      <VisittkortPanel
        fagsakPerson={fagsakPerson}
        alleKodeverk={{}}
        sprakkode={'NN'}
        relaterteFagsaker={null}
      />,
    );

    expect(wrapper.find(FlexContainer)).toHaveLength(0);
    const visittkort = wrapper.find(PersonCard);
    expect(visittkort).toHaveLength(1);
    expect(visittkort.prop('name')).toEqual(fagsakPerson.navn);
    expect(visittkort.prop('fodselsnummer')).toEqual(fagsakPerson.personnummer);
    expect(visittkort.prop('gender')).toEqual(Gender.female);
  });

  it('skal vise visittkort når en har harTilbakekrevingVerge', () => {
    const wrapper = shallowWithIntl(
      <VisittkortPanel
        fagsakPerson={fagsakPerson}
        alleKodeverk={{}}
        sprakkode={'NN'}
        harTilbakekrevingVerge
        relaterteFagsaker={null}
      />,
    );

    expect(wrapper.find(FlexContainer)).toHaveLength(0);
    const visittkort = wrapper.find(PersonCard);
    expect(visittkort).toHaveLength(1);
    expect(visittkort.prop('name')).toEqual(fagsakPerson.navn);
    expect(visittkort.prop('fodselsnummer')).toEqual(fagsakPerson.personnummer);
    expect(visittkort.prop('gender')).toEqual(Gender.female);
  });

  it('skal vise visittkort når en har personopplysninger', () => {
    const wrapper = shallowWithIntl(
      <VisittkortPanel
        fagsakPerson={fagsakPerson}
        personopplysninger={personopplysningerSoker}
        alleKodeverk={{}}
        sprakkode={'NN'}
        relaterteFagsaker={null}
      />,
    );

    expect(wrapper.find(FlexContainer)).toHaveLength(1);
    const visittkort = wrapper.find(PersonCard);
    expect(visittkort).toHaveLength(1);
    expect(visittkort.prop('name')).toEqual(personopplysningerSoker.navn);
    expect(visittkort.prop('fodselsnummer')).toEqual(personopplysningerSoker.fnr);
    expect(visittkort.prop('gender')).toEqual(Gender.female);
  });
});
