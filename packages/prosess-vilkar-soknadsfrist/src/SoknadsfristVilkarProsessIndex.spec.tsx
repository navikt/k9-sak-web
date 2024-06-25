import React from 'react';
import { renderWithIntlAndReduxForm } from '@fpsak-frontend/utils-test/test-utils';
import { Behandling } from '@k9-sak-web/types';
import { screen } from '@testing-library/react';
import SoknadsfristVilkarProsessIndex from './SoknadsfristVilkarProsessIndex';
import messages from '../i18n/nb_NO.json';

const soknadsfristStatus = {
  dokumentStatus: [],
};

describe('<SoknadsfristVilkarForm>', () => {
  it('skal rendre tabs dersom bare en periode', () => {
    renderWithIntlAndReduxForm(
      <SoknadsfristVilkarProsessIndex
        behandling={
          {
            id: 1,
            versjon: 1,
          } as Behandling
        }
        kanOverstyreAccess={{
          isEnabled: true,
        }}
        toggleOverstyring={vi.fn()}
        submitCallback={vi.fn()}
        aksjonspunkter={[]}
        panelTittelKode="Inngangsvilkar.Soknadsfrist"
        erOverstyrt={false}
        overrideReadOnly={false}
        vilkar={[
          {
            perioder: [
              {
                periode: {
                  fom: '2020-03-01',
                  tom: '2020-04-01',
                },
                vilkarStatus: 'test',
                avslagKode: 'test',
                vurderesIBehandlingen: true,
                merknadParametere: {
                  test: 'test',
                },
              },
            ],
            overstyrbar: true,
            vilkarType: 'test',
          },
        ]}
        soknadsfristStatus={soknadsfristStatus}
        visAllePerioder={false}
      />,
      { messages },
    );
    expect(screen.getByText('Perioder')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '01.03.2020 - 01.04.2020' })).toBeInTheDocument();
  });

  it('skal rendre tabs med aksjonspunkt dersom bare en periode og statusperiode er inneholdt i vilkårsperiode', () => {
    renderWithIntlAndReduxForm(
      <SoknadsfristVilkarProsessIndex
        behandling={
          {
            id: 1,
            versjon: 1,
          } as Behandling
        }
        kanOverstyreAccess={{
          isEnabled: true,
        }}
        toggleOverstyring={vi.fn()}
        submitCallback={vi.fn()}
        aksjonspunkter={[
          {
            aksjonspunktType: 'MANU', // AKSJONSPUNKT_TYPE
            begrunnelse: 'begrunnelse',
            besluttersBegrunnelse: null,
            definisjon: '5077', // AKSJONSPUNKT_DEF
            erAktivt: true,
            kanLoses: true,
            status: 'OPPR', // AKSJONSPUNKT_STATUS
            toTrinnsBehandling: true,
            toTrinnsBehandlingGodkjent: null,
            vilkarType: 'FP_VK_3', // VILKAR_TYPE
            vurderPaNyttArsaker: null,
          },
        ]}
        panelTittelKode="Inngangsvilkar.Soknadsfrist"
        erOverstyrt={false}
        overrideReadOnly={false}
        vilkar={[
          {
            perioder: [
              {
                periode: {
                  fom: '2023-02-01',
                  tom: '2024-04-01',
                },
                vilkarStatus: 'test',
                avslagKode: 'test',
                vurderesIBehandlingen: true,
                merknadParametere: {
                  test: 'test',
                },
              },
            ],
            overstyrbar: true,
            vilkarType: 'test',
          },
        ]}
        soknadsfristStatus={{
          dokumentStatus: [
            {
              type: 'SØKNAD',
              status: [
                {
                  periode: {
                    fom: '2023-03-01',
                    tom: '2024-03-01',
                  },
                  status: 'OPPFYLT', // VILKAR_UTFALL_TYPE
                },
              ],
              innsendingstidspunkt: '2024-03-26T00:02:27.327',
              journalpostId: '61276020',
              avklarteOpplysninger: {
                godkjent: true,
                fraDato: '2023-02-28',
                begrunnelse: 'begrunnelse',
                opprettetAv: 'saksbeh',
                opprettetTidspunkt: '2024-06-12T12:32:06.901',
              },
              overstyrteOpplysninger: null,
            },
          ],
        }}
        visAllePerioder={false}
      />,
      { messages },
    );
    expect(screen.getByText('Perioder')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '01.02.2023 - 01.04.2024 Aksjonspunkt' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Vilkåret er oppfylt for hele perioden' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Vilkåret er oppfylt for deler av perioden' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Vilkåret er ikke oppfylt for denne perioden' })).toBeInTheDocument();
  });
});
