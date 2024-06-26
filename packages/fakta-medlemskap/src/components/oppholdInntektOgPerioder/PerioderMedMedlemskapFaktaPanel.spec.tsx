import React from 'react';
import { screen } from '@testing-library/react';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import { renderWithIntlAndReduxForm } from '@fpsak-frontend/utils-test/test-utils';
import { BehandlingType } from '@k9-sak-web/lib/types/BehandlingType.js';
import { KodeverkProvider } from '@k9-sak-web/gui/kodeverk/index.js';
import alleKodeverkV2 from '@k9-sak-web/lib/kodeverk/mocks/alleKodeverkV2.json';
import PerioderMedMedlemskapFaktaPanel from './PerioderMedMedlemskapFaktaPanel';

import messages from '../../../i18n/nb_NO.json';

describe('<PerioderMedMedlemskapFaktaPanel>', () => {
  it('skal vise periode og manuelle-vurderingstyper i form', () => {
    const periods = [
      {
        fom: '2016-01-15',
        tom: '2016-10-15',
        dekning: 'FULL',
        status: 'FORELOPIG',
        beslutningsdato: '2016-10-16',
      },
    ];
    const manuelleVurderingstyper = [
      {
        kode: 'test1',
        navn: 'navn1',
      },
      {
        kode: 'test2',
        navn: 'navn2',
      },
    ];

    renderWithIntlAndReduxForm(
      <KodeverkProvider
        behandlingType={BehandlingType.FORSTEGANGSSOKNAD}
        kodeverk={alleKodeverkV2}
        klageKodeverk={alleKodeverkV2}
        tilbakeKodeverk={alleKodeverkV2}
      >
        <PerioderMedMedlemskapFaktaPanel.WrappedComponent
          hasPeriodeAksjonspunkt
          isPeriodAksjonspunktClosed={false}
          fixedMedlemskapPerioder={periods}
          readOnly={false}
          vurderingTypes={manuelleVurderingstyper}
          alleMerknaderFraBeslutter={{}}
        />
      </KodeverkProvider>,
      { messages },
    );

    expect(screen.getByText('Full')).toBeInTheDocument();
    expect(screen.getByText('Foreløpig')).toBeInTheDocument();
    expect(screen.getByText('15.01.2016-15.10.2016')).toBeInTheDocument();
    expect(screen.getAllByRole('radio', { name: /navn/i }).length).toBe(2);
  });

  it('skal vise fødselsdato når en har dette', () => {
    const periods = [
      {
        fom: '2016-01-15',
        tom: '2016-10-15',
        dekning: 'Full',
        status: 'Foreløpig',
        beslutningsdato: '2016-10-16',
      },
    ];

    renderWithIntlAndReduxForm(
      <PerioderMedMedlemskapFaktaPanel.WrappedComponent
        hasPeriodeAksjonspunkt
        isPeriodAksjonspunktClosed={false}
        fixedMedlemskapPerioder={periods}
        readOnly={false}
        fodselsdato="2016-10-16"
        vurderingTypes={[]}
        alleMerknaderFraBeslutter={{}}
      />,
      { messages },
    );

    expect(screen.getByText('Fødselsdato: 16.10.2016')).toBeInTheDocument();
  });

  it('skal vise tabell med medlemskapsperioder', () => {
    const perioder = [
      {
        fom: '2017-08-01',
        tom: '2017-08-31',
        dekning: 'Full',
        status: 'Foreløpig',
        beslutningsdato: '2017-06-01',
      },
    ];

    renderWithIntlAndReduxForm(
      <PerioderMedMedlemskapFaktaPanel.WrappedComponent
        hasPeriodeAksjonspunkt
        isPeriodAksjonspunktClosed={false}
        readOnly={false}
        fixedMedlemskapPerioder={perioder}
        vurderingTypes={[]}
        alleMerknaderFraBeslutter={{}}
      />,
      { messages },
    );

    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('skal ikke vise tabell når det ikke finnes medlemskapsperioder', () => {
    const medlemskapPerioder = [];

    renderWithIntlAndReduxForm(
      <PerioderMedMedlemskapFaktaPanel.WrappedComponent
        hasPeriodeAksjonspunkt
        isPeriodAksjonspunktClosed={false}
        fixedMedlemskapPerioder={medlemskapPerioder}
        readOnly={false}
        vurderingTypes={[]}
        alleMerknaderFraBeslutter={{}}
      />,
      { messages },
    );

    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  it('skal sette opp initielle verdier og sorterte perioder etter periodestart', () => {
    const periode = {
      aksjonspunkter: [aksjonspunktCodes.AVKLAR_OM_BRUKER_HAR_GYLDIG_PERIODE],
      medlemskapManuellVurderingType: 'manuellType',
      medlemskapPerioder: [
        {
          fom: '2016-01-15',
          tom: '2016-10-15',
          dekningType: {
            navn: 'testdekning',
          },
          medlemskapType: {
            navn: 'testStatus',
          },
          beslutningsdato: '2016-10-16',
        },
        {
          fom: '2017-01-15',
          tom: '2017-10-15',
          dekningType: {
            navn: 'testdekning2017',
          },
          medlemskapType: {
            navn: 'testStatus2017',
          },
          beslutningsdato: '2017-10-16',
        },
      ],
    };
    const medlemskapPerioder = [
      {
        fom: '2016-01-15',
        tom: '2016-10-15',
        dekningType: 'FTL_2_9_1_b',
        medlemskapType: 'ENDELIG',
        beslutningsdato: '2016-10-16',
      },
      {
        fom: '2017-01-15',
        tom: '2017-10-15',
        dekningType: 'FTL_2_6',
        medlemskapType: 'FORELOPIG',
        beslutningsdato: '2017-10-16',
      },
    ];

    const soknad = {
      fodselsdatoer: {
        1: '2017-10-15',
      },
    };

    const aksjonspunkter = [
      {
        definisjon: aksjonspunktCodes.AVKLAR_OM_BRUKER_HAR_GYLDIG_PERIODE,
        status: aksjonspunktStatus.OPPRETTET,
      },
    ];

    const initialValues = PerioderMedMedlemskapFaktaPanel.buildInitialValues(
      periode,
      medlemskapPerioder,
      soknad,
      aksjonspunkter,
    );

    expect(initialValues).toStrictEqual({
      fixedMedlemskapPerioder: [
        {
          fom: '2016-01-15',
          tom: '2016-10-15',
          dekning: 'FTL_2_9_1_b',
          status: 'ENDELIG',
          beslutningsdato: '2016-10-16',
        },
        {
          fom: '2017-01-15',
          tom: '2017-10-15',
          dekning: 'FTL_2_6',
          status: 'FORELOPIG',
          beslutningsdato: '2017-10-16',
        },
      ],
      isPeriodAksjonspunktClosed: false,
      medlemskapManuellVurderingType: 'manuellType',
      fodselsdato: '2017-10-15',
      hasPeriodeAksjonspunkt: true,
    });
  });
});
