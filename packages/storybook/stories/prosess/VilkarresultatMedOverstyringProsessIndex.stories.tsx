import aksjonspunktCode from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import VilkarresultatMedOverstyringProsessIndex from '@fpsak-frontend/prosess-vilkar-overstyring';
import { action } from '@storybook/addon-actions';
import { boolean, object, withKnobs } from '@storybook/addon-knobs';
import React from 'react';
import { Aksjonspunkt, Behandling, Vilkar } from '@k9-sak-web/types';
import withReduxProvider from '../../decorators/withRedux';

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
    vilkarType: vilkarType.OPPTJENINGSVILKARET,
    overstyrbar: true,
    perioder: [
      {
        vilkarStatus: vilkarUtfallType.OPPFYLT,
        periode: {
          fom: '2020-01-30',
          tom: '2020-02-29',
        },
      },
      {
        vilkarStatus: vilkarUtfallType.OPPFYLT,
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
    vilkarType: vilkarType.MEDLEMSKAPSVILKARET,
    overstyrbar: true,
    perioder: [
      {
        vilkarStatus: vilkarUtfallType.OPPFYLT,
      },
    ],
  } as Vilkar,
];

export default {
  title: 'prosess/prosess-vilkar-overstyring',
  component: VilkarresultatMedOverstyringProsessIndex,
  decorators: [withKnobs, withReduxProvider],
};

export const visOverstyringspanelForOpptjening = () => {
  const [erOverstyrt, toggleOverstyring] = React.useState(false);
  return (
    <VilkarresultatMedOverstyringProsessIndex
      behandling={
        {
          id: 1,
          versjon: 1,
          type: behandlingType.FORSTEGANGSSOKNAD,
        } as Behandling
      }
      medlemskap={{
        fom: '2019-01-01',
      }}
      aksjonspunkter={[]}
      submitCallback={action('button-click')}
      overrideReadOnly={boolean('overrideReadOnly', false)}
      kanOverstyreAccess={object('kanOverstyreAccess', {
        isEnabled: true,
      })}
      toggleOverstyring={() => toggleOverstyring(!erOverstyrt)}
      erOverstyrt={erOverstyrt}
      avslagsarsaker={avslagsarsaker}
      panelTittelKode="Inngangsvilkar.Opptjeningsvilkaret"
      lovReferanse="§§ Dette er en lovreferanse"
      overstyringApKode={aksjonspunktCode.OVERSTYRING_AV_OPPTJENINGSVILKARET}
      erMedlemskapsPanel={false}
      vilkar={vilkarOpptjening}
      visAllePerioder
    />
  );
};

export const visOverstyringspanelForMedlemskap = () => {
  const [erOverstyrt, toggleOverstyring] = React.useState(false);
  return (
    <VilkarresultatMedOverstyringProsessIndex
      behandling={
        {
          id: 1,
          versjon: 1,
          type: behandlingType.FORSTEGANGSSOKNAD,
        } as Behandling
      }
      medlemskap={{
        fom: '2019-01-01',
      }}
      aksjonspunkter={[]}
      submitCallback={action('button-click')}
      overrideReadOnly={boolean('overrideReadOnly', false)}
      kanOverstyreAccess={object('kanOverstyreAccess', {
        isEnabled: true,
      })}
      toggleOverstyring={() => toggleOverstyring(!erOverstyrt)}
      erOverstyrt={erOverstyrt}
      avslagsarsaker={avslagsarsaker}
      panelTittelKode="Inngangsvilkar.Medlemskapsvilkaret"
      lovReferanse="§§ Dette er en lovreferanse"
      overstyringApKode={aksjonspunktCode.OVERSTYR_MEDLEMSKAPSVILKAR}
      erMedlemskapsPanel
      vilkar={vilkarMedlemskap}
      visAllePerioder
    />
  );
};

export const visOverstyrtAksjonspunktSomErBekreftet = () => (
  <VilkarresultatMedOverstyringProsessIndex
    behandling={
      {
        id: 1,
        versjon: 1,
        type: behandlingType.FORSTEGANGSSOKNAD,
        behandlingsresultat: {
          avslagsarsak: 'AVSLAG_TEST_1',
        },
      } as Behandling
    }
    medlemskap={{
      fom: '2019-01-01',
    }}
    aksjonspunkter={
      [
        {
          definisjon: aksjonspunktCode.OVERSTYRING_AV_OPPTJENINGSVILKARET,
          status: aksjonspunktStatus.UTFORT,
          kanLoses: false,
          begrunnelse: 'Dette er en begrunnelse',
        },
      ] as Aksjonspunkt[]
    }
    submitCallback={action('button-click')}
    overrideReadOnly={boolean('overrideReadOnly', false)}
    kanOverstyreAccess={object('kanOverstyreAccess', {
      isEnabled: true,
    })}
    toggleOverstyring={action('button-click')}
    erOverstyrt={boolean('erOverstyrt', false)}
    avslagsarsaker={avslagsarsaker}
    panelTittelKode="Inngangsvilkar.Opptjeningsvilkaret"
    lovReferanse="§§ Dette er en lovreferanse"
    overstyringApKode={aksjonspunktCode.OVERSTYRING_AV_OPPTJENINGSVILKARET}
    erMedlemskapsPanel={false}
    vilkar={vilkarOpptjening}
    visAllePerioder
  />
);
