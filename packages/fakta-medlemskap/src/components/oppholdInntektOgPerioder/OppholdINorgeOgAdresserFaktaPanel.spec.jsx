import React from 'react';
import { expect } from 'chai';

import personstatusType from '@fpsak-frontend/kodeverk/src/personstatusType';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import opplysningAdresseType from '@fpsak-frontend/kodeverk/src/opplysningAdresseType';
import { Normaltekst } from 'nav-frontend-typografi';
import OppholdINorgeOgAdresserFaktaPanel from './OppholdINorgeOgAdresserFaktaPanel';
import shallowWithIntl, { intlMock } from '../../../i18n';

describe('<OppholdINorgeOgAdresserFaktaPanel>', () => {
  const opphold = {
    utlandsopphold: [
      {
        landNavn: 'SVERIGE',
        fom: '2017-07-20',
        tom: '2017-07-31',
      },
    ],
  };

  const foreldre = [
    {
      isApplicant: true,
      personopplysning: {
        navn: 'Espen Utvikler',
        adresser: [],
        personstatus: personstatusType.UTVANDRET,
      },
    },
    {
      isApplicant: false,
      personopplysning: {
        navn: 'Petra Tester',
        adresser: [],
        personstatus: personstatusType.UTVANDRET,
      },
    },
  ];

  it('skal vise info om opphold', () => {
    const wrapper = shallowWithIntl(
      <OppholdINorgeOgAdresserFaktaPanel.WrappedComponent
        intl={intlMock}
        readOnly={false}
        hasBosattAksjonspunkt={false}
        isBosattAksjonspunktClosed={false}
        opphold={opphold}
        foreldre={foreldre}
        alleKodeverk={{}}
        alleMerknaderFraBeslutter={{}}
      />,
    );
    const felter = wrapper.find(Normaltekst);
    expect(felter).to.have.length(2);
    expect(felter.first().childAt(0).text()).to.eql('Sverige');
  });

  it('skal rendre form som viser bosatt informasjon', () => {
    const wrapper = shallowWithIntl(
      <OppholdINorgeOgAdresserFaktaPanel.WrappedComponent
        intl={intlMock}
        readOnly={false}
        hasBosattAksjonspunkt={false}
        isBosattAksjonspunktClosed={false}
        opphold={opphold}
        foreldre={foreldre}
        alleKodeverk={{}}
        alleMerknaderFraBeslutter={{}}
      />,
    );
    const foreldreDivs = wrapper.find('div');
    expect(foreldreDivs).to.have.length(3);
  });

  it('skal rendre form som lar NAV-ansatt velge om barnet er ektefelles barn eller ei', () => {
    const toForeldre = [
      {
        isApplicant: true,
        personopplysning: {
          navn: 'Espen Utvikler',
          adresser: [],
          personstatus: personstatusType.UTVANDRET,
        },
      },
      {
        isApplicant: false,
        personopplysning: {
          navn: 'Petra Tester',
          adresser: [],
          personstatus: personstatusType.UTVANDRET,
        },
      },
    ];

    const wrapper = shallowWithIntl(
      <OppholdINorgeOgAdresserFaktaPanel.WrappedComponent
        intl={intlMock}
        readOnly={false}
        hasBosattAksjonspunkt
        isBosattAksjonspunktClosed={false}
        opphold={opphold}
        foreldre={toForeldre}
        alleKodeverk={{}}
        alleMerknaderFraBeslutter={{}}
      />,
    );

    const radioFields = wrapper.find('RadioOption');
    expect(radioFields).to.have.length(2);
    expect(radioFields.first().prop('label').id).to.eql('OppholdINorgeOgAdresserFaktaPanel.ResidingInNorway');
  });

  it('skal sette initielle verdier', () => {
    const periode = {
      aksjonspunkter: [aksjonspunktCodes.AVKLAR_OM_BRUKER_ER_BOSATT],
      bosattVurdering: true,
      personopplysninger: {
        navn: 'Espen Utvikler',
        personstatus: {
          personstatus: personstatusType.UTVANDRET,
        },
        avklartPersonstatus: {
          overstyrtPersonstatus: personstatusType.BOSATT,
        },
        adresser: [
          {
            adresselinje1: 'Vei 1',
            postNummer: '1000',
            poststed: 'Oslo',
            opplysningAdresseType: opplysningAdresseType.POSTADRESSE,
          },
        ],
        annenPart: {
          navn: 'Petra Tester',
          personstatus: {
            personstatus: personstatusType.UTVANDRET,
          },
          adresser: [
            {
              adresselinje1: 'Vei 2',
              postNummer: '2000',
              poststed: 'Stockholm',
              opplysningAdresseType: opplysningAdresseType.UTENLANDSK_POSTADRESSE,
            },
          ],
        },
      },
    };

    const aksjonspunkter = [
      {
        definisjon: aksjonspunktCodes.AVKLAR_OM_BRUKER_ER_BOSATT,
        status: aksjonspunktStatus.OPPRETTET,
      },
    ];
    const soknad = {
      oppgittTilknytning: opphold,
    };

    const initialValues = OppholdINorgeOgAdresserFaktaPanel.buildInitialValues(soknad, periode, aksjonspunkter);

    expect(initialValues).to.eql({
      foreldre: [
        {
          isApplicant: true,
          personopplysning: {
            navn: 'Espen Utvikler',
            personstatus: {
              personstatus: personstatusType.UTVANDRET,
            },
            avklartPersonstatus: {
              overstyrtPersonstatus: personstatusType.BOSATT,
            },
            adresser: [
              {
                adresselinje1: 'Vei 1',
                postNummer: '1000',
                poststed: 'Oslo',
                opplysningAdresseType: opplysningAdresseType.POSTADRESSE,
              },
            ],
            annenPart: {
              navn: 'Petra Tester',
              personstatus: {
                personstatus: personstatusType.UTVANDRET,
              },
              adresser: [
                {
                  adresselinje1: 'Vei 2',
                  postNummer: '2000',
                  poststed: 'Stockholm',
                  opplysningAdresseType: opplysningAdresseType.UTENLANDSK_POSTADRESSE,
                },
              ],
            },
          },
        },
        {
          isApplicant: false,
          personopplysning: {
            navn: 'Petra Tester',
            personstatus: {
              personstatus: personstatusType.UTVANDRET,
            },
            adresser: [
              {
                adresselinje1: 'Vei 2',
                postNummer: '2000',
                poststed: 'Stockholm',
                opplysningAdresseType: opplysningAdresseType.UTENLANDSK_POSTADRESSE,
              },
            ],
          },
        },
      ],
      bosattVurdering: true,
      hasBosattAksjonspunkt: true,
      isBosattAksjonspunktClosed: false,
      opphold: {
        utlandsopphold: [
          {
            landNavn: 'SVERIGE',
            fom: '2017-07-20',
            tom: '2017-07-31',
          },
        ],
      },
    });
  });
});
