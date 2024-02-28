import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import opplysningAdresseType from '@fpsak-frontend/kodeverk/src/opplysningAdresseType';
import personstatusType from '@fpsak-frontend/kodeverk/src/personstatusType';
import { intlMock } from '@fpsak-frontend/utils-test/intl-test-helper';
import { renderWithIntlAndReduxForm } from '@fpsak-frontend/utils-test/test-utils';
import { screen } from '@testing-library/react';
import React from 'react';
import messages from '../../../i18n/nb_NO.json';
import OppholdINorgeOgAdresserFaktaPanel from './OppholdINorgeOgAdresserFaktaPanel';

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
        personstatus: {
          kode: 'UTVA',
          navn: 'Utvandret',
        },
      },
    },
    {
      isApplicant: false,
      personopplysning: {
        navn: 'Petra Tester',
        adresser: [],
        personstatus: {
          kode: 'UTVA',
          navn: 'Utvandret',
        },
      },
    },
  ];

  const alleKodeverk = {
    PersonstatusType: [
      {
        kode: 'UREG',
        navn: 'Uregistrert person',
        kodeverk: 'PERSONSTATUS_TYPE',
      },
      {
        kode: 'ABNR',
        navn: 'Aktivt BOSTNR',
        kodeverk: 'PERSONSTATUS_TYPE',
      },
      {
        kode: 'UTVA',
        navn: 'Utvandret',
        kodeverk: 'PERSONSTATUS_TYPE',
      },
      {
        kode: 'DØDD',
        navn: 'Dødd',
        kodeverk: 'PERSONSTATUS_TYPE',
      },
      {
        kode: 'DØD',
        navn: 'Død',
        kodeverk: 'PERSONSTATUS_TYPE',
      },
      {
        kode: 'FØDR',
        navn: 'Fødselregistrert',
        kodeverk: 'PERSONSTATUS_TYPE',
      },
      {
        kode: 'BOSA',
        navn: 'Bosatt',
        kodeverk: 'PERSONSTATUS_TYPE',
      },
      {
        kode: 'ADNR',
        navn: 'Aktivt D-nummer',
        kodeverk: 'PERSONSTATUS_TYPE',
      },
      {
        kode: 'FOSV',
        navn: 'Forsvunnet/savnet',
        kodeverk: 'PERSONSTATUS_TYPE',
      },
      {
        kode: 'UFUL',
        navn: 'Ufullstendig fødselsnr',
        kodeverk: 'PERSONSTATUS_TYPE',
      },
      {
        kode: 'UTAN',
        navn: 'Utgått person annullert tilgang Fnr',
        kodeverk: 'PERSONSTATUS_TYPE',
      },
      {
        kode: 'UTPE',
        navn: 'Utgått person',
        kodeverk: 'PERSONSTATUS_TYPE',
      },
    ],
  };

  it('skal vise info om opphold', () => {
    renderWithIntlAndReduxForm(
      <OppholdINorgeOgAdresserFaktaPanel.WrappedComponent
        intl={intlMock}
        readOnly={false}
        hasBosattAksjonspunkt={false}
        isBosattAksjonspunktClosed={false}
        opphold={opphold}
        foreldre={foreldre}
        alleKodeverk={alleKodeverk}
        alleMerknaderFraBeslutter={{}}
      />,
      { messages },
    );
    expect(screen.getByText('Opphold utenfor Norge')).toBeInTheDocument();
    expect(screen.getByText('Sverige')).toBeInTheDocument();
  });

  it('skal rendre form som viser bosatt informasjon', () => {
    renderWithIntlAndReduxForm(
      <OppholdINorgeOgAdresserFaktaPanel.WrappedComponent
        intl={intlMock}
        readOnly={false}
        hasBosattAksjonspunkt={false}
        isBosattAksjonspunktClosed={false}
        opphold={opphold}
        foreldre={foreldre}
        alleKodeverk={alleKodeverk}
        alleMerknaderFraBeslutter={{}}
      />,
      { messages },
    );

    expect(screen.getByText('Espen Utvikler')).toBeInTheDocument();
    expect(screen.getByText('Petra Tester')).toBeInTheDocument();
  });

  it('skal rendre form som lar NAV-ansatt velge om barnet er ektefelles barn eller ei', () => {
    const toForeldre = [
      {
        isApplicant: true,
        personopplysning: {
          navn: 'Espen Utvikler',
          adresser: [],
          personstatus: {
            kode: 'UTVA',
            navn: 'Utvandret',
          },
        },
      },
      {
        isApplicant: false,
        personopplysning: {
          navn: 'Petra Tester',
          adresser: [],
          personstatus: {
            kode: 'UTVA',
            navn: 'Utvandret',
          },
        },
      },
    ];

    renderWithIntlAndReduxForm(
      <OppholdINorgeOgAdresserFaktaPanel.WrappedComponent
        intl={intlMock}
        readOnly={false}
        hasBosattAksjonspunkt
        isBosattAksjonspunktClosed={false}
        opphold={opphold}
        foreldre={toForeldre}
        alleKodeverk={alleKodeverk}
        alleMerknaderFraBeslutter={{}}
      />,
      { messages },
    );

    expect(screen.getByRole('radio', { name: 'Søker er bosatt i Norge' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Søker er ikke bosatt i Norge' })).toBeInTheDocument();
  });

  it('skal sette initielle verdier', () => {
    const periode = {
      aksjonspunkter: [aksjonspunktCodes.AVKLAR_OM_BRUKER_ER_BOSATT],
      bosattVurdering: true,
      personopplysninger: {
        navn: 'Espen Utvikler',
        personstatus: {
          personstatus: {
            kode: 'UTVANDRET',
            navn: 'Utvandret',
          },
        },
        avklartPersonstatus: {
          overstyrtPersonstatus: {
            kode: personstatusType.BOSATT,
            navn: 'Bosatt',
          },
        },
        adresser: [
          {
            adresselinje1: 'Vei 1',
            postNummer: '1000',
            poststed: 'Oslo',
            opplysningAdresseType: {
              kode: opplysningAdresseType.POSTADRESSE,
              navn: 'Bostedsadresse',
            },
          },
        ],
        annenPart: {
          navn: 'Petra Tester',
          personstatus: {
            personstatus: {
              kode: 'UTVANDRET',
              navn: 'Utvandret',
            },
          },
          adresser: [
            {
              adresselinje1: 'Vei 2',
              postNummer: '2000',
              poststed: 'Stockholm',
              opplysningAdresseType: {
                kode: opplysningAdresseType.UTENLANDSK_POSTADRESSE,
                navn: 'Bostedsadresse',
              },
            },
          ],
        },
      },
    };

    const aksjonspunkter = [
      {
        definisjon: {
          kode: aksjonspunktCodes.AVKLAR_OM_BRUKER_ER_BOSATT,
        },
        status: {
          kode: aksjonspunktStatus.OPPRETTET,
        },
      },
    ];
    const soknad = {
      oppgittTilknytning: opphold,
    };

    const initialValues = OppholdINorgeOgAdresserFaktaPanel.buildInitialValues(soknad, periode, aksjonspunkter);

    expect(initialValues).toStrictEqual({
      foreldre: [
        {
          isApplicant: true,
          personopplysning: {
            navn: 'Espen Utvikler',
            personstatus: {
              personstatus: {
                kode: 'UTVANDRET',
                navn: 'Utvandret',
              },
            },
            avklartPersonstatus: {
              overstyrtPersonstatus: {
                kode: personstatusType.BOSATT,
                navn: 'Bosatt',
              },
            },
            adresser: [
              {
                adresselinje1: 'Vei 1',
                postNummer: '1000',
                poststed: 'Oslo',
                opplysningAdresseType: {
                  kode: opplysningAdresseType.POSTADRESSE,
                  navn: 'Bostedsadresse',
                },
              },
            ],
            annenPart: {
              navn: 'Petra Tester',
              personstatus: {
                personstatus: {
                  kode: 'UTVANDRET',
                  navn: 'Utvandret',
                },
              },
              adresser: [
                {
                  adresselinje1: 'Vei 2',
                  postNummer: '2000',
                  poststed: 'Stockholm',
                  opplysningAdresseType: {
                    kode: opplysningAdresseType.UTENLANDSK_POSTADRESSE,
                    navn: 'Bostedsadresse',
                  },
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
              personstatus: {
                kode: 'UTVANDRET',
                navn: 'Utvandret',
              },
            },
            adresser: [
              {
                adresselinje1: 'Vei 2',
                postNummer: '2000',
                poststed: 'Stockholm',
                opplysningAdresseType: {
                  kode: opplysningAdresseType.UTENLANDSK_POSTADRESSE,
                  navn: 'Bostedsadresse',
                },
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
