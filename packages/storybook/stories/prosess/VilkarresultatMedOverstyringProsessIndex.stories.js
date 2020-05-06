import aksjonspunktCode from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import VilkarresultatMedOverstyringProsessIndex from '@fpsak-frontend/prosess-vilkar-overstyring';
import { action } from '@storybook/addon-actions';
import { boolean, object, withKnobs } from '@storybook/addon-knobs';
import React from 'react';
import withReduxProvider from '../../decorators/withRedux';

const avslagsarsaker = [
  {
    kode: 'AVSLAG_TEST_1',
    navn: 'Dette er en avslagsårsak',
  },
  {
    kode: 'AVSLAG_TEST_2',
    navn: 'Dette er en annen avslagsårsak',
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
  },
];

const vilkarMedlemskap = [
  {
    vilkarType: { kode: vilkarType.MEDLEMSKAPSVILKARET, kodeverk: 'test' },
    overstyrbar: true,
    perioder: [
      {
        vilkarStatus: { kode: vilkarUtfallType.OPPFYLT, kodeverk: 'test' },
      },
    ],
  },
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
      behandling={{
        id: 1,
        versjon: 1,
        type: {
          kode: behandlingType.FORSTEGANGSSOKNAD,
        },
      }}
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
      status={vilkarUtfallType.OPPFYLT}
      panelTittelKode="Inngangsvilkar.Opptjeningsvilkaret"
      lovReferanse="§§ Dette er en lovreferanse"
      overstyringApKode={aksjonspunktCode.OVERSTYRING_AV_OPPTJENINGSVILKARET}
      erMedlemskapsPanel={false}
      vilkar={vilkarOpptjening}
    />
  );
};

export const visOverstyringspanelForMedlemskap = () => {
  const [erOverstyrt, toggleOverstyring] = React.useState(false);
  return (
    <VilkarresultatMedOverstyringProsessIndex
      behandling={{
        id: 1,
        versjon: 1,
        type: {
          kode: behandlingType.FORSTEGANGSSOKNAD,
        },
      }}
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
      status={vilkarUtfallType.OPPFYLT}
      panelTittelKode="Inngangsvilkar.Medlemskapsvilkaret"
      lovReferanse="§§ Dette er en lovreferanse"
      overstyringApKode={aksjonspunktCode.OVERSTYR_MEDLEMSKAPSVILKAR}
      erMedlemskapsPanel
      vilkar={vilkarMedlemskap}
    />
  );
};

export const visOverstyrtAksjonspunktSomErBekreftet = () => (
  <VilkarresultatMedOverstyringProsessIndex
    behandling={{
      id: 1,
      versjon: 1,
      type: {
        kode: behandlingType.FORSTEGANGSSOKNAD,
      },
      behandlingsresultat: {
        avslagsarsak: {
          kode: 'AVSLAG_TEST_1',
        },
      },
    }}
    medlemskap={{
      fom: '2019-01-01',
    }}
    aksjonspunkter={[
      {
        definisjon: {
          kode: aksjonspunktCode.OVERSTYRING_AV_OPPTJENINGSVILKARET,
        },
        status: {
          kode: aksjonspunktStatus.UTFORT,
        },
        kanLoses: false,
        begrunnelse: 'Dette er en begrunnelse',
      },
    ]}
    submitCallback={action('button-click')}
    overrideReadOnly={boolean('overrideReadOnly', false)}
    kanOverstyreAccess={object('kanOverstyreAccess', {
      isEnabled: true,
    })}
    toggleOverstyring={action('button-click')}
    erOverstyrt={boolean('erOverstyrt', false)}
    avslagsarsaker={avslagsarsaker}
    status={vilkarUtfallType.IKKE_OPPFYLT}
    panelTittelKode="Inngangsvilkar.Opptjeningsvilkaret"
    lovReferanse="§§ Dette er en lovreferanse"
    overstyringApKode={aksjonspunktCode.OVERSTYRING_AV_OPPTJENINGSVILKARET}
    erMedlemskapsPanel={false}
    vilkar={vilkarOpptjening}
  />
);
