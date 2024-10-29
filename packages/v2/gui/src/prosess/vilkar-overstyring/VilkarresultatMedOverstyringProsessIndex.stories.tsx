import { behandlingStatus, merknad, sakstype, vilkarType } from '@k9-sak-web/backend/k9sak/generated';
import { aksjonspunktkodeDefinisjonType } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktkodeDefinisjon.js';
import { aksjonspunktStatus } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktStatus.js';
import { behandlingType } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/BehandlingType.js';
import { vilkårStatus } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/VilkårStatus.js';
import { action } from '@storybook/addon-actions';
import type { Meta } from '@storybook/react';
import React from 'react';
import VilkarresultatMedOverstyringProsessIndex from './VilkarresultatMedOverstyringProsessIndex';

const vilkarOpptjening = [
  {
    vilkarType: vilkarType.OPPTJENINGSVILKÅRET,
    overstyrbar: true,
    perioder: [
      {
        vilkarStatus: vilkårStatus.OPPFYLT,
        merknad: merknad['VM_7847_B'],
        periode: {
          fom: '2020-01-30',
          tom: '2020-02-29',
        },
      },
      {
        vilkarStatus: vilkårStatus.OPPFYLT,
        merknad: merknad['UDEFINERT'],
        periode: {
          fom: '2020-03-01',
          tom: '2020-03-31',
        },
      },
    ],
  },
];

const vilkarMedlemskap = [
  {
    vilkarType: vilkarType.MEDLEMSKAPSVILKÅRET,
    overstyrbar: true,
    perioder: [
      {
        vilkarStatus: vilkårStatus.OPPFYLT,
        periode: {
          fom: '2020-01-30',
          tom: '2020-02-29',
        },
      },
    ],
  },
];

const meta = {
  title: 'gui/prosess/prosess-vilkar-overstyring/VilkarresultatMedOverstyringProsessIndex.tsx',
  component: VilkarresultatMedOverstyringProsessIndex,
} satisfies Meta<typeof VilkarresultatMedOverstyringProsessIndex>;

export default meta;

const behandling = {
  id: 1,
  versjon: 1,
  type: behandlingType.FØRSTEGANGSSØKNAD,
  opprettet: '2020-01-01',
  sakstype: sakstype['_'],
  status: behandlingStatus['OPPRE'],
  uuid: 'testUuid',
};

export const visOverstyringspanelForOpptjening = () => {
  const [erOverstyrt, toggleOverstyring] = React.useState(false);
  return (
    <VilkarresultatMedOverstyringProsessIndex
      behandling={behandling}
      medlemskap={{
        fom: '2019-01-01',
      }}
      aksjonspunkter={[]}
      submitCallback={action('button-click')}
      toggleOverstyring={() => toggleOverstyring(!erOverstyrt)}
      erOverstyrt={erOverstyrt}
      panelTittelKode="Opptjening"
      lovReferanse="§§ Dette er en lovreferanse"
      overstyringApKode={aksjonspunktkodeDefinisjonType.OVERSTYRING_AV_OPPTJENINGSVILKARET}
      visPeriodisering={true}
      vilkar={vilkarOpptjening}
      visAllePerioder
      erMedlemskapsPanel={false}
      overrideReadOnly={false}
      kanOverstyreAccess={{
        isEnabled: true,
      }}
      featureToggles={{}}
    />
  );
};

export const visOverstyringspanelForMedlemskap = () => {
  const [erOverstyrt, toggleOverstyring] = React.useState(false);
  return (
    <VilkarresultatMedOverstyringProsessIndex
      behandling={behandling}
      medlemskap={{
        fom: '2019-01-01',
      }}
      aksjonspunkter={[]}
      submitCallback={action('button-click')}
      toggleOverstyring={() => toggleOverstyring(!erOverstyrt)}
      erOverstyrt={erOverstyrt}
      panelTittelKode="Medlemskap"
      lovReferanse="§§ Dette er en lovreferanse"
      overstyringApKode={aksjonspunktkodeDefinisjonType.OVERSTYR_MEDLEMSKAPSVILKAR}
      visPeriodisering
      vilkar={vilkarMedlemskap}
      visAllePerioder
      erMedlemskapsPanel={false}
      overrideReadOnly={false}
      kanOverstyreAccess={{
        isEnabled: true,
      }}
      featureToggles={{}}
    />
  );
};

export const visOverstyrtAksjonspunktSomErBekreftet = () => {
  const [erOverstyrt, toggleOverstyring] = React.useState(false);
  return (
    <VilkarresultatMedOverstyringProsessIndex
      behandling={{
        ...behandling,
      }}
      medlemskap={{
        fom: '2019-01-01',
      }}
      aksjonspunkter={[
        {
          definisjon: aksjonspunktkodeDefinisjonType.OVERSTYRING_AV_OPPTJENINGSVILKARET,
          status: aksjonspunktStatus.UTFORT,
          kanLoses: false,
          begrunnelse: 'Dette er en begrunnelse',
        },
      ]}
      submitCallback={action('button-click')}
      toggleOverstyring={() => toggleOverstyring(!erOverstyrt)}
      panelTittelKode="Opptjening"
      lovReferanse="§§ Dette er en lovreferanse"
      overstyringApKode={aksjonspunktkodeDefinisjonType.OVERSTYRING_AV_OPPTJENINGSVILKARET}
      visPeriodisering={false}
      vilkar={vilkarOpptjening}
      visAllePerioder
      erMedlemskapsPanel={false}
      overrideReadOnly={false}
      kanOverstyreAccess={{
        isEnabled: true,
      }}
      erOverstyrt={false}
      featureToggles={{}}
    />
  );
};
