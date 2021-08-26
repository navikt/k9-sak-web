import React from 'react';
import { action } from '@storybook/addon-actions';
import { boolean, object, withKnobs } from '@storybook/addon-knobs';

import { DokumentStatus, Behandling, Vilkar } from '@k9-sak-web/types';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import vilkarType from '@fpsak-frontend/kodeverk/src/vilkarType';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import SoknadsfristVilkarProsessIndex from '@k9-sak-web/prosess-vilkar-soknadsfrist';

import withReduxProvider from '../../decorators/withRedux';

const vilkarSoknadsfrist = [
  {
    vilkarType: { kode: vilkarType.SOKNADSFRISTVILKARET, kodeverk: 'test' },
    overstyrbar: true,
    perioder: [
      {
        vilkarStatus: { kode: vilkarUtfallType.IKKE_OPPFYLT, kodeverk: 'test' },
        vurdersIBehandlingen: true,
        periode: {
          fom: '2020-02-20',
          tom: '2020-02-25',
        },
      },
      {
        vilkarStatus: { kode: vilkarUtfallType.IKKE_OPPFYLT, kodeverk: 'test' },
        vurdersIBehandlingen: true,
        periode: {
          fom: '2020-02-26',
          tom: '2020-02-27',
        },
      },
      {
        vilkarStatus: { kode: vilkarUtfallType.OPPFYLT, kodeverk: 'test' },
        vurdersIBehandlingen: true,
        periode: {
          fom: '2020-02-28',
          tom: '2020-02-29',
        },
      },
    ],
  } as Vilkar,
];

const soknadsStatus = {
  dokumentStatus: [
    {
      type: 'SOKNAD',
      status: [
        {
          periode: { fom: '2020-02-20', tom: '2020-02-25' },
          status: { kode: vilkarUtfallType.IKKE_OPPFYLT, kodeverk: 'test' },
        },
      ],
      innsendingstidspunkt: '2020-06-01',
      journalpostId: '12345',
      avklarteOpplysninger: null,
      overstyrteOpplysninger: null,
    },
    {
      type: 'SOKNAD',
      status: [
        {
          periode: { fom: '2020-02-26', tom: '2020-02-27' },
          status: { kode: vilkarUtfallType.IKKE_OPPFYLT, kodeverk: 'test' },
        },
      ],
      innsendingstidspunkt: '2020-06-01',
      journalpostId: '23456',
      avklarteOpplysninger: null,
      overstyrteOpplysninger: null,
    },
  ] as DokumentStatus[],
};

export default {
  title: 'prosess/prosess-vilkar-soknadsfrist',
  component: SoknadsfristVilkarProsessIndex,
  decorators: [withKnobs, withReduxProvider],
};

export const visOverstyringspanelForSoknadsfrist = () => {
  const [erOverstyrt, toggleOverstyring] = React.useState(false);
  return (
    <SoknadsfristVilkarProsessIndex
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
      aksjonspunkter={[]}
      submitCallback={action('button-click')}
      overrideReadOnly={boolean('overrideReadOnly', false)}
      kanOverstyreAccess={object('kanOverstyreAccess', {
        isEnabled: true,
      })}
      toggleOverstyring={() => toggleOverstyring(!erOverstyrt)}
      erOverstyrt={erOverstyrt}
      soknadsfristStatus={soknadsStatus}
      panelTittelKode="Inngangsvilkar.Soknadsfrist"
      lovReferanse="§§ Dette er en lovreferanse"
      vilkar={vilkarSoknadsfrist}
      visAllePerioder
    />
  );
};

export const visOverstyringspanelForSoknadsfristUtenDokumenter = () => {
  const [erOverstyrt, toggleOverstyring] = React.useState(false);
  return (
    <SoknadsfristVilkarProsessIndex
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
      aksjonspunkter={[]}
      submitCallback={action('button-click')}
      overrideReadOnly={boolean('overrideReadOnly', false)}
      kanOverstyreAccess={object('kanOverstyreAccess', {
        isEnabled: true,
      })}
      toggleOverstyring={() => toggleOverstyring(!erOverstyrt)}
      erOverstyrt={erOverstyrt}
      soknadsfristStatus={{ dokumentStatus: [] }}
      panelTittelKode="Inngangsvilkar.Soknadsfrist"
      lovReferanse="§§ Dette er en lovreferanse"
      vilkar={vilkarSoknadsfrist}
      visAllePerioder
    />
  );
};
