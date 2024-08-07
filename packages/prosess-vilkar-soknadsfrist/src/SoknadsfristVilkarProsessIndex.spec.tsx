import { Behandling } from '@k9-sak-web/types';
import { composeStories } from '@storybook/react';
import { userEvent, waitFor } from '@storybook/test';
import { act, render, screen } from '@testing-library/react';
import React from 'react';
import SoknadsfristVilkarProsessIndex from './SoknadsfristVilkarProsessIndex';
import * as stories from './SoknadsfristVilkarProsessIndex.stories';

const { VisSoknadsfristAksjonspunkt5077 } = composeStories(stories);

const soknadsfristStatus = {
  dokumentStatus: [],
};

describe('<SoknadsfristVilkarForm>', () => {
  it('skal rendre tabs dersom bare en periode', () => {
    render(
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
        panelTittelKode="Søknadsfrist"
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
            vilkarType: {
              kode: 'test',
              kodeverk: 'test',
            },
          },
        ]}
        soknadsfristStatus={soknadsfristStatus}
        visAllePerioder={false}
      />,
    );
    expect(screen.getByText('Perioder')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '01.03.2020 - 01.04.2020' })).toBeInTheDocument();
  });

  it('skal rendre tabs med aksjonspunkt dersom bare en periode og statusperiode er inneholdt i vilkårsperiode', () => {
    render(
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
            aksjonspunktType: {
              kode: 'MANU',
              kodeverk: 'AKSJONSPUNKT_TYPE',
            },
            begrunnelse: 'begrunnelse',
            besluttersBegrunnelse: null,
            definisjon: {
              kode: '5077',
              kodeverk: 'AKSJONSPUNKT_DEF',
            },
            erAktivt: true,
            kanLoses: true,
            status: {
              kode: 'OPPR',
              kodeverk: 'AKSJONSPUNKT_STATUS',
            },
            toTrinnsBehandling: true,
            toTrinnsBehandlingGodkjent: null,
            vilkarType: {
              kode: 'FP_VK_3',
              kodeverk: 'VILKAR_TYPE',
            },
            vurderPaNyttArsaker: null,
          },
        ]}
        panelTittelKode="Søknadsfrist"
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
            vilkarType: {
              kode: 'test',
              kodeverk: 'test',
            },
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
                  status: {
                    kode: 'OPPFYLT',
                    kodeverk: 'VILKAR_UTFALL_TYPE',
                  },
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
    );
    expect(screen.getByText('Perioder')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '01.02.2023 - 01.04.2024 Aksjonspunkt' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Vilkåret er oppfylt for hele perioden' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Vilkåret er oppfylt for deler av perioden' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Vilkåret er ikke oppfylt for denne perioden' })).toBeInTheDocument();
  });

  it('skal formatere data ved innsending ved oppfylt vilkår', async () => {
    const lagre = vi.fn();
    render(<VisSoknadsfristAksjonspunkt5077 submitCallback={lagre} />);
    await act(async () => {
      await userEvent.click(screen.getByText('Vilkåret er oppfylt for hele perioden'));
      await userEvent.type(
        screen.getByLabelText('Vurder om det har vært fristavbrytende kontakt'),
        'Dette er en begrunnelse',
      );
      await userEvent.click(screen.getByText('Bekreft og gå videre'));
    });
    await waitFor(() => expect(lagre).toHaveBeenCalledTimes(1));
    expect(lagre).toHaveBeenNthCalledWith(1, [
      {
        avklarteKrav: [
          {
            begrunnelse: 'Dette er en begrunnelse',
            erVilkarOk: true,
            fraDato: '2021-04-27',
            godkjent: true,
            journalpostId: '510536417',
          },
        ],
        begrunnelse: 'Dette er en begrunnelse',
        erVilkarOk: true,
        kode: '5077',
        periode: {
          fom: '2021-04-28',
          tom: '2021-04-30',
        },
      },
    ]);
  });

  it('skal formatere data ved innsending ved delvis oppfylt vilkår', async () => {
    const lagre = vi.fn();
    render(<VisSoknadsfristAksjonspunkt5077 submitCallback={lagre} />);
    await act(async () => {
      await userEvent.click(screen.getByText('Vilkåret er oppfylt for deler av perioden'));
      await userEvent.type(
        screen.getByLabelText('Vurder om det har vært fristavbrytende kontakt'),
        'Dette er en begrunnelse',
      );
      await userEvent.type(screen.getByLabelText('Oppgi dato søknadsfristvilkåret er oppfylt fra'), '03.05.2021');
      await userEvent.click(screen.getByText('Bekreft og gå videre'));
    });
    await waitFor(() => expect(lagre).toHaveBeenCalledTimes(1));
    expect(lagre).toHaveBeenNthCalledWith(1, [
      {
        avklarteKrav: [
          {
            begrunnelse: 'Dette er en begrunnelse',
            erVilkarOk: true,
            fraDato: '2021-05-02',
            godkjent: true,
            journalpostId: '510536417',
          },
        ],
        begrunnelse: 'Dette er en begrunnelse',
        erVilkarOk: true,
        kode: '5077',
        periode: {
          fom: '2021-04-28',
          tom: '2021-04-30',
        },
      },
    ]);
  });

  it('skal formatere data ved innsending ved ikke oppfylt vilkår', async () => {
    const lagre = vi.fn();
    render(<VisSoknadsfristAksjonspunkt5077 submitCallback={lagre} />);
    await act(async () => {
      await userEvent.click(screen.getByLabelText('ikke', { exact: false }));
      await userEvent.type(
        screen.getByLabelText('Vurder om det har vært fristavbrytende kontakt'),
        'Dette er en begrunnelse',
      );
      await userEvent.click(screen.getByText('Bekreft og gå videre'));
    });
    await waitFor(() => expect(lagre).toHaveBeenCalledTimes(1));
    expect(lagre).toHaveBeenNthCalledWith(1, [
      {
        avklarteKrav: [
          {
            begrunnelse: 'Dette er en begrunnelse',
            erVilkarOk: false,
            fraDato: '2021-04-30',
            godkjent: false,
            journalpostId: '510536417',
          },
        ],
        begrunnelse: 'Dette er en begrunnelse',
        erVilkarOk: false,
        kode: '5077',
        periode: {
          fom: '2021-04-28',
          tom: '2021-04-30',
        },
      },
    ]);
  });
});
