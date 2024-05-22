import aksjonspunktCode from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { Aksjonspunkt, Behandling, Vilkar } from '@k9-sak-web/types';
import { action } from '@storybook/addon-actions';
import React from 'react';
import VilkarresultatMedOverstyringProsessIndex from './VilkarresultatMedOverstyringProsessIndex';

const avslagsarsaker = [
  {
    kode: 'AVSLAG_TEST_1',
    navn: 'Dette er en avslagsårsak',
    kodeverk: '',
  },
  {
    kode: 'AVSLAG_TEST_2',
    navn: 'Dette er en annen avslagsårsak',
    kodeverk: '',
  },
];

const vilkarOpptjening = [
  {
    vilkarType: { kode: vilkarType.OPPTJENINGSVILKARET, kodeverk: 'test' },
    overstyrbar: true,
    perioder: [
      {
        vilkarStatus: { kode: vilkarUtfallType.OPPFYLT, kodeverk: 'test' },
        periode: {
          fom: '2020-01-30',
          tom: '2020-02-29',
        },
      },
      {
        vilkarStatus: { kode: vilkarUtfallType.OPPFYLT, kodeverk: 'test' },
        periode: {
          fom: '2020-01-30',
          tom: '2020-02-29',
        },
      },
    ],
  } as Vilkar,
];

const vilkarMedlemskap = [
  {
    vilkarType: { kode: vilkarType.MEDLEMSKAPSVILKARET, kodeverk: 'test' },
    overstyrbar: true,
    perioder: [
      {
        vilkarStatus: { kode: vilkarUtfallType.OPPFYLT, kodeverk: 'test' },
        periode: {
          fom: '2020-01-30',
          tom: '2020-02-29',
        },
      },
    ],
  } as Vilkar,
];

export default {
  title: 'prosess/prosess-vilkar-overstyring',
  component: VilkarresultatMedOverstyringProsessIndex,
};

export const visOverstyringspanelForOpptjening = args => {
  const [erOverstyrt, toggleOverstyring] = React.useState(false);
  return (
    <VilkarresultatMedOverstyringProsessIndex
      behandling={
        {
          id: 1,
          versjon: 1,
          type: {
            kode: behandlingType.FORSTEGANGSSOKNAD,
            kodeverk: '',
          },
        } as Behandling
      }
      medlemskap={{
        fom: '2019-01-01',
      }}
      aksjonspunkter={[]}
      submitCallback={action('button-click')}
      toggleOverstyring={() => toggleOverstyring(!erOverstyrt)}
      erOverstyrt={erOverstyrt}
      avslagsarsaker={avslagsarsaker}
      panelTittelKode="Inngangsvilkar.Opptjeningsvilkaret"
      lovReferanse="§§ Dette er en lovreferanse"
      overstyringApKode={aksjonspunktCode.OVERSTYRING_AV_OPPTJENINGSVILKARET}
      visPeriodisering={false}
      vilkar={vilkarOpptjening}
      visAllePerioder
      erMedlemskapsPanel={false}
      {...args}
    />
  );
};

visOverstyringspanelForOpptjening.args = {
  overrideReadOnly: false,
  kanOverstyreAccess: {
    isEnabled: true,
  },
};

export const visOverstyringspanelForMedlemskap = args => {
  const [erOverstyrt, toggleOverstyring] = React.useState(false);
  return (
    <VilkarresultatMedOverstyringProsessIndex
      behandling={
        {
          id: 1,
          versjon: 1,
          type: {
            kode: behandlingType.FORSTEGANGSSOKNAD,
            kodeverk: '',
          },
        } as Behandling
      }
      medlemskap={{
        fom: '2019-01-01',
      }}
      aksjonspunkter={[]}
      submitCallback={action('button-click')}
      toggleOverstyring={() => toggleOverstyring(!erOverstyrt)}
      erOverstyrt={erOverstyrt}
      avslagsarsaker={avslagsarsaker}
      panelTittelKode="Inngangsvilkar.Medlemskapsvilkaret"
      lovReferanse="§§ Dette er en lovreferanse"
      overstyringApKode={aksjonspunktCode.OVERSTYR_MEDLEMSKAPSVILKAR}
      visPeriodisering
      vilkar={vilkarMedlemskap}
      visAllePerioder
      erMedlemskapsPanel={false}
      {...args}
    />
  );
};

visOverstyringspanelForMedlemskap.args = {
  overrideReadOnly: false,
  kanOverstyreAccess: {
    isEnabled: true,
  },
};

export const visOverstyrtAksjonspunktSomErBekreftet = args => (
  <VilkarresultatMedOverstyringProsessIndex
    behandling={
      {
        id: 1,
        versjon: 1,
        type: {
          kode: behandlingType.FORSTEGANGSSOKNAD,
          kodeverk: '',
        },
        behandlingsresultat: {
          avslagsarsak: {
            kode: 'AVSLAG_TEST_1',
          },
        },
      } as Behandling
    }
    medlemskap={{
      fom: '2019-01-01',
    }}
    aksjonspunkter={
      [
        {
          definisjon: {
            kode: aksjonspunktCode.OVERSTYRING_AV_OPPTJENINGSVILKARET,
            kodeverk: '',
          },
          status: {
            kode: aksjonspunktStatus.UTFORT,
            kodeverk: '',
          },
          kanLoses: false,
          begrunnelse: 'Dette er en begrunnelse',
        },
      ] as Aksjonspunkt[]
    }
    submitCallback={action('button-click')}
    toggleOverstyring={action('button-click')}
    avslagsarsaker={avslagsarsaker}
    panelTittelKode="Inngangsvilkar.Opptjeningsvilkaret"
    lovReferanse="§§ Dette er en lovreferanse"
    overstyringApKode={aksjonspunktCode.OVERSTYRING_AV_OPPTJENINGSVILKARET}
    visPeriodisering={false}
    vilkar={vilkarOpptjening}
    visAllePerioder
    erMedlemskapsPanel={false}
    {...args}
  />
);

visOverstyrtAksjonspunktSomErBekreftet.args = {
  overrideReadOnly: false,
  kanOverstyreAccess: {
    isEnabled: true,
  },
  erOverstyrt: false,
};
