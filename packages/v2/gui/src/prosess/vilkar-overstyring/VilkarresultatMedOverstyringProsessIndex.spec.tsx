import { behandlingType } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/BehandlingType.js';
import { render, screen } from '@testing-library/react';
import VilkarresultatMedOverstyringProsessIndex from './VilkarresultatMedOverstyringProsessIndex';

describe('<VilkarresultatMedOverstyringForm>', () => {
  it('skal rendre tabs dersom bare en periode', () => {
    render(
      <VilkarresultatMedOverstyringProsessIndex
        behandling={{
          id: 1,
          versjon: 1,
          type: behandlingType.FØRSTEGANGSSØKNAD,
          opprettet: '2020-01-01',
          sakstype: '-',
          status: 'OPPRE',
          uuid: 'testUuid',
        }}
        medlemskap={{
          fom: '2020-05-05',
        }}
        kanOverstyreAccess={{
          isEnabled: true,
        }}
        toggleOverstyring={vi.fn()}
        submitCallback={vi.fn()}
        aksjonspunkter={[]}
        panelTittel="tittel"
        overstyringApKode=""
        lovReferanse=""
        erOverstyrt={false}
        overrideReadOnly={false}
        visPeriodisering={false}
        featureToggles={{}}
        vilkar={[
          {
            perioder: [
              {
                periode: {
                  fom: '2020-03-01',
                  tom: '2020-04-01',
                },
                vilkarStatus: 'UDEFINERT',
                avslagKode: 'test',
                vurderesIBehandlingen: true,
                merknadParametere: {
                  test: 'test',
                },
              },
            ],
            overstyrbar: true,
            vilkarType: 'UDEFINERT',
          },
        ]}
        visAllePerioder={false}
        erMedlemskapsPanel={false}
      />,
    );

    expect(screen.getByText('Perioder')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '01.03.2020 - 01.04.2020' })).toBeInTheDocument();
  });
});
