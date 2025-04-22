import { renderWithIntlAndReduxForm } from '@fpsak-frontend/utils-test/test-utils';
import { behandlingType } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/BehandlingType.js';
import { Behandling } from '@k9-sak-web/types';
import { screen } from '@testing-library/react';
import messages from '../i18n/nb_NO.json';
import VilkarresultatMedOverstyringProsessIndex from './VilkarresultatMedOverstyringProsessIndex';

describe('<VilkarresultatMedOverstyringForm>', () => {
  it('skal rendre tabs dersom bare en periode', () => {
    renderWithIntlAndReduxForm(
      <VilkarresultatMedOverstyringProsessIndex
        behandling={
          {
            id: 1,
            versjon: 1,
            type: {
              kode: behandlingType.FØRSTEGANGSSØKNAD,
              kodeverk: 'BEHANDLING_TYPE',
            },
          } as Behandling
        }
        medlemskap={{
          fom: '2020-05-05',
        }}
        kanOverstyreAccess={{
          isEnabled: true,
        }}
        toggleOverstyring={vi.fn()}
        submitCallback={vi.fn()}
        aksjonspunkter={[]}
        avslagsarsaker={[]}
        panelTittelKode="tittel"
        overstyringApKode=""
        lovReferanse=""
        erOverstyrt={false}
        overrideReadOnly={false}
        visPeriodisering={false}
        vilkar={[
          {
            perioder: [
              {
                periode: {
                  fom: '2020-03-01',
                  tom: '2020-04-01',
                },
                vilkarStatus: {
                  kode: 'test',
                  kodeverk: 'test',
                },
                avslagKode: 'test',
                vurderesIBehandlingen: true,
                merknadParametere: {
                  test: 'test',
                },
              },
            ],
            overstyrbar: true,
            relevanteInnvilgetMerknader: [],
            vilkarType: {
              kode: 'test',
              kodeverk: 'test',
            },
          },
        ]}
        visAllePerioder={false}
        erMedlemskapsPanel={false}
      />,
      { messages },
    );

    expect(screen.getByText('Perioder')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '01.03.2020 - 01.04.2020' })).toBeInTheDocument();
  });
});
