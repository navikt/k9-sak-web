import { renderWithIntl } from '@fpsak-frontend/utils-test/test-utils';
import { screen } from '@testing-library/react';
import React from 'react';
import { KodeverkProvider } from '@k9-sak-web/gui/kodeverk/index.js';
import { BehandlingType } from '@k9-sak-web/lib/types/BehandlingType.js';
import alleKodeverkV2 from '@k9-sak-web/lib/kodeverk/mocks/alleKodeverkV2.json';
import messages from '../../i18n/nb_NO.json';
import BehandlingPickerItemContent from './BehandlingPickerItemContentOld';

describe('<BehandlingPickerItemContent>', () => {
  it('skal rendre komponent', () => {
    renderWithIntl(
      <BehandlingPickerItemContent
        withChevronDown
        withChevronUp
        behandlingTypeKode="BT-002"
        behandlingTypeNavn="Foreldrepenger"
        opprettetDato="2018-01-02"
        behandlingsstatus="Opprettet"
        erGjeldendeVedtak={false}
      />,
      { messages },
    );

    expect(screen.getAllByText('Opprettet').length).toBeGreaterThan(0);
    expect(screen.getByText(/2018/g)).toBeInTheDocument();
  });

  it('skal vise avsluttet dato når denne finnes', () => {
    renderWithIntl(
      <BehandlingPickerItemContent
        withChevronDown
        withChevronUp
        behandlingTypeKode="BT-002"
        behandlingTypeNavn="Foreldrepenger"
        opprettetDato="2018-01-02"
        avsluttetDato="2018-05-01"
        behandlingsstatus="Opprettet"
        erGjeldendeVedtak={false}
      />,
      { messages },
    );

    expect(screen.getAllByText('Opprettet').length).toBeGreaterThan(0);
    expect(screen.getByText('Avsluttet')).toBeInTheDocument();
    expect(screen.getAllByText(/2018/g).length).toBeGreaterThan(0);
  });

  it('skal vise årsak for revurdering', () => {
    const førsteÅrsak = {
      behandlingArsakType: 'RE-MF',
      erAutomatiskRevurdering: false,
      manueltOpprettet: false,
    };
    renderWithIntl(
      <KodeverkProvider
        behandlingType={BehandlingType.FORSTEGANGSSOKNAD}
        kodeverk={alleKodeverkV2}
        klageKodeverk={{}}
        tilbakeKodeverk={{}}
      >
        <BehandlingPickerItemContent
          withChevronDown
          withChevronUp
          behandlingTypeKode="BT-004"
          behandlingTypeNavn="Foreldrepenger"
          opprettetDato="2018-01-01"
          avsluttetDato="2018-05-01"
          behandlingsstatus="Opprettet"
          førsteÅrsak={førsteÅrsak}
          erGjeldendeVedtak={false}
        />
      </KodeverkProvider>,
      { messages },
    );

    expect(screen.getByText('Manglende informasjon om fødsel i folkeregisteret')).toBeInTheDocument();
  });
});
