import React from 'react';

import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';

import dokumentTypeId from '@fpsak-frontend/kodeverk/src/dokumentTypeId';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { Behandling, ManglendeVedleggSoknad, Soknad } from '@k9-sak-web/types';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { Table, TableRow } from '@fpsak-frontend/shared-components';
import {
  buildInitialValues,
  getSortedManglendeVedlegg,
  SokersOpplysningspliktFormImpl,
} from './SokersOpplysningspliktForm';
import shallowWithIntl, { intlMock } from '../../i18n';

describe('<SokersOpplysningspliktForm>', () => {
  const getKodeverknavn = () => undefined;

  it('skal vise tabell med manglende vedlegg', () => {
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

    const wrapper = shallowWithIntl(
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
        alleKodeverk={{}}
        originalErVilkarOk
      />,
    );

    const table = wrapper.find(Table);
    expect(table).toHaveLength(1);
    const rows = table.find(TableRow);
    expect(rows).toHaveLength(2);

    const columnsAtRow1 = rows.first().children();
    expect(columnsAtRow1).toHaveLength(2);
    expect(columnsAtRow1.first().childAt(0).text()).toEqual('Inntektsmelding');
    expect(columnsAtRow1.at(1).childAt(0).text()).toEqual('Statoil Asaavd Statoil Sokkelvirksomhet (973861778)');

    const columnsAtRow2 = rows.last().children();
    expect(columnsAtRow2).toHaveLength(2);
    expect(columnsAtRow2.first().childAt(0).text()).toEqual('terminbekreftelse');
    expect(columnsAtRow2.at(1).childAt(0)).toEqual({});
  });

  it('skal ikke vise tabell når ingen vedlegg mangler', () => {
    const manglendeVedlegg = [];
    const dokumentTypeIds = [];

    const wrapper = shallowWithIntl(
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
        alleKodeverk={{}}
        originalErVilkarOk
      />,
    );

    expect(wrapper.find(Table)).toHaveLength(0);
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
