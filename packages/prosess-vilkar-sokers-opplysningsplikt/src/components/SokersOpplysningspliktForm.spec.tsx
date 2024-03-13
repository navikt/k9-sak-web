import React from 'react';
import { screen } from '@testing-library/react';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import dokumentTypeId from '@fpsak-frontend/kodeverk/src/dokumentTypeId';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { renderWithIntlAndReduxForm } from '@fpsak-frontend/utils-test/test-utils';
import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/redux-form-test-helper';
import { Behandling, ManglendeVedleggSoknad, Soknad } from '@k9-sak-web/types';
import { K9sakApiKeys, requestApi } from '@k9-sak-web/sak-app/src/data/k9sakApi';
import alleKodeverk from '@k9-sak-web/lib/kodeverk/mocks/alleKodeverkV2.json';

import { intlMock } from '../../i18n';
import messages from '../../i18n/nb_NO.json';
import {
  SokersOpplysningspliktFormImpl,
  buildInitialValues,
  getSortedManglendeVedlegg,
} from './SokersOpplysningspliktForm';

describe('<SokersOpplysningspliktForm>', () => {
  const getKodeverknavn = () => undefined;

  it('skal vise tabell med manglende vedlegg', () => {
    requestApi.mock(K9sakApiKeys.KODEVERK, alleKodeverk);
    const manglendeVedlegg = [
      {
        dokumentType: dokumentTypeId.INNTEKTSMELDING,
        arbeidsgiver: {
          organisasjonsnummer: '973861778',
          navn: 'Statoil Asaavd Statoil Sokkelvirksomhet',
        },
        brukerHarSagtAtIkkeKommer: false,
      },
      {
        dokumentType: dokumentTypeId.DOKUMENTASJON_AV_TERMIN_ELLER_FØDSEL,
        arbeidsgiver: null,
        brukerHarSagtAtIkkeKommer: null,
      },
    ] as ManglendeVedleggSoknad[];

    const dokumentTypeIds = [
      {
        kode: dokumentTypeId.INNTEKTSMELDING,
        navn: 'Inntektsmelding',
        kodeverk: '',
      },
      {
        kode: dokumentTypeId.DOKUMENTASJON_AV_TERMIN_ELLER_FØDSEL,
        navn: 'terminbekreftelse',
        kodeverk: '',
      },
    ];

    renderWithIntlAndReduxForm(
      <SokersOpplysningspliktFormImpl
        {...reduxFormPropsMock}
        intl={intlMock}
        readOnly={false}
        readOnlySubmitButton={false}
        behandlingsresultat={{} as Behandling['behandlingsresultat']}
        hasSoknad
        erVilkarOk={undefined}
        hasAksjonspunkt
        manglendeVedlegg={manglendeVedlegg}
        dokumentTypeIds={dokumentTypeIds}
        inntektsmeldingerSomIkkeKommer={undefined}
        getKodeverknavn={getKodeverknavn}
        behandlingId={1}
        behandlingVersjon={1}
        soknad={{} as Soknad}
        aksjonspunkter={[]}
        status="test"
        submitCallback={() => undefined}
        originalErVilkarOk
      />,
      { messages },
    );

    expect(screen.getAllByRole('table').length).toBe(1);
    expect(screen.getByText('Inntektsmelding')).toBeInTheDocument();
    expect(screen.getByText('Statoil Asaavd Statoil Sokkelvirksomhet (973861778)')).toBeInTheDocument();
    expect(screen.getByText('terminbekreftelse')).toBeInTheDocument();
    expect(screen.getByText('Manglende opplysninger, foreslå avslag')).toBeInTheDocument();
  });

  it('skal ikke vise tabell når ingen vedlegg mangler', () => {
    requestApi.mock(K9sakApiKeys.KODEVERK, alleKodeverk);
    const manglendeVedlegg = [];
    const dokumentTypeIds = [];

    renderWithIntlAndReduxForm(
      <SokersOpplysningspliktFormImpl
        {...reduxFormPropsMock}
        intl={intlMock}
        readOnly={false}
        readOnlySubmitButton={false}
        behandlingsresultat={{} as Behandling['behandlingsresultat']}
        hasSoknad
        erVilkarOk={undefined}
        hasAksjonspunkt
        manglendeVedlegg={manglendeVedlegg}
        dokumentTypeIds={dokumentTypeIds}
        inntektsmeldingerSomIkkeKommer={undefined}
        getKodeverknavn={getKodeverknavn}
        behandlingId={1}
        behandlingVersjon={1}
        soknad={{} as Soknad}
        aksjonspunkter={[]}
        status="test"
        submitCallback={() => undefined}
        originalErVilkarOk
      />,
      { messages },
    );

    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  describe('selectors', () => {
    it('skal sortere manglende vedlegg', () => {
      const manglendeVedlegg = [
        {
          dokumentType: dokumentTypeId.DOKUMENTASJON_AV_TERMIN_ELLER_FØDSEL,
          arbeidsgiver: null,
          brukerHarSagtAtIkkeKommer: null,
        },
        {
          dokumentType: dokumentTypeId.INNTEKTSMELDING,
          arbeidsgiver: {
            organisasjonsnummer: '973861778',
          },
          brukerHarSagtAtIkkeKommer: false,
        },
      ] as ManglendeVedleggSoknad[];

      const smv = getSortedManglendeVedlegg.resultFunc({
        manglendeVedlegg,
      } as Soknad);

      expect(smv).toEqual([manglendeVedlegg[1], manglendeVedlegg[0]]);
    });

    it('skal sette opp formens initielle verdier', () => {
      const manglendeVedlegg = [
        {
          dokumentType: dokumentTypeId.INNTEKTSMELDING,
          arbeidsgiver: {
            organisasjonsnummer: '973861778',
          },
          brukerHarSagtAtIkkeKommer: false,
        },
      ] as ManglendeVedleggSoknad[];
      const aksjonspunkter = [];

      const intitialValues = buildInitialValues.resultFunc(
        manglendeVedlegg,
        true,
        vilkarUtfallType.OPPFYLT,
        aksjonspunkter,
      );

      expect(intitialValues).toEqual({
        aksjonspunktKode: aksjonspunktCodes.SOKERS_OPPLYSNINGSPLIKT_OVST,
        begrunnelse: '',
        erVilkarOk: true,
        hasAksjonspunkt: false,
        inntektsmeldingerSomIkkeKommer: {
          org_973861778: false,
        },
      });
    });
  });
});
