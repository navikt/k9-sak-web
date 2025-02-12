import { composeStories } from '@storybook/react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import * as stories from './FordelBeregningsgrunnlagFaktaIndex.stories';

const { TilkommetAktivitet, TilkommetAktivitetMedForlengelse, TilkommetAktiviteTreLikePerioderHelgMellomAlle } =
  composeStories(stories);

window.ResizeObserver =
  window.ResizeObserver ||
  vi.fn().mockImplementation(() => ({
    disconnect: vi.fn(),
    observe: vi.fn(),
    unobserve: vi.fn(),
  }));

it('skal kunne løse aksjonspunkt for tilkommet aktivitet', async () => {
  const lagre = vi.fn();
  render(<TilkommetAktivitet submitCallback={lagre} />);
  expect(screen.getByText('Søker har et nytt arbeidsforhold i AA-registeret')).toBeInTheDocument();
  expect(
    screen.getByText('Har søker inntekt fra Arbeidsgiveren (999999997)...123 som reduserer søkers inntektstap?'),
  ).toBeInTheDocument();
  expect(screen.getByText('Årsinntekt')).toBeInTheDocument();
  await userEvent.click(screen.getByLabelText('Ja'));
  await userEvent.type(screen.getByLabelText('Begrunnelse'), 'En saklig begrunnelse');
  await userEvent.click(screen.getByRole('button', { name: 'Bekreft og fortsett' }));
  await waitFor(() => expect(lagre).toHaveBeenCalledTimes(1));
  expect(lagre).toHaveBeenCalledWith({
    begrunnelse: 'En saklig begrunnelse',
    grunnlag: [
      {
        periode: {
          fom: '2022-11-08',
          tom: '2022-11-08',
        },
        begrunnelse: 'En saklig begrunnelse',
        tilkomneInntektsforhold: [
          {
            fom: '2022-11-09',
            tom: '9999-12-31',
            tilkomneInntektsforhold: [
              {
                aktivitetStatus: 'AT',
                arbeidsforholdId: '123',
                arbeidsgiverId: '999999997',
                bruttoInntektPrÅr: 480000,
                skalRedusereUtbetaling: true,
              },
            ],
          },
        ],
      },
    ],
    kode: 'VURDER_NYTT_INNTKTSFRHLD',
  });
});

it('skal kunne løse aksjonspunkt for tilkommet aktivitet med forlengelse', async () => {
  const lagre = vi.fn();
  render(<TilkommetAktivitetMedForlengelse submitCallback={lagre} />);
  expect(screen.getByText('Søker har et nytt arbeidsforhold i AA-registeret')).toBeInTheDocument();

  expect(screen.getByText('09.11.2022 - 15.11.2022')).toBeInTheDocument();
  await userEvent.click(screen.getByText('09.11.2022 - 15.11.2022'));

  expect(screen.getAllByText('Årsinntekt')).toHaveLength(2);
  expect(screen.getAllByText('450 000 kr')).toHaveLength(2);

  expect(screen.getByText('Reduserer inntektstap')).toBeInTheDocument();

  expect(screen.getAllByText('Arbeidsgiveren (999999997)...123')).toHaveLength(2);
  expect(screen.getAllByText('Nei')).toHaveLength(3);

  expect(screen.getAllByText('Nav Troms og Finnmark (974652293)...456')).toHaveLength(2);
  expect(screen.getAllByText('Ja')).toHaveLength(3);

  expect(screen.getByText('300 000 kr')).toBeInTheDocument();
  expect(screen.getByText('16.11.2022 - 20.11.2022')).toBeInTheDocument();
  expect(
    screen.getByText('Har søker inntekt fra Arbeidsgiveren (999999997)...123 som reduserer søkers inntektstap?'),
  ).toBeInTheDocument();
  const neiLabels = screen.getAllByLabelText('Nei');
  if (neiLabels[0]) {
    await userEvent.click(neiLabels[0]);
  }

  expect(
    screen.getByText('Har søker inntekt fra Nav Troms og Finnmark (974652293)...456 som reduserer søkers inntektstap?'),
  ).toBeInTheDocument();

  const jaLabels = screen.getAllByLabelText('Ja');
  if (jaLabels[1]) {
    await userEvent.click(jaLabels[1]);
  }
  expect(screen.getByLabelText('Fastsett årsinntekt')).toBeInTheDocument();

  await userEvent.type(screen.getByLabelText('Fastsett årsinntekt'), '1349');
  await userEvent.type(screen.getByLabelText('Begrunnelse'), 'En saklig begrunnelse');
  await userEvent.click(screen.getByRole('button', { name: 'Bekreft og fortsett' }));
  await waitFor(() => expect(lagre).toHaveBeenCalledTimes(1));
  expect(lagre).toHaveBeenCalledWith({
    begrunnelse: 'En saklig begrunnelse',
    grunnlag: [
      {
        periode: {
          fom: '2022-11-08',
          tom: '2022-11-20',
        },
        begrunnelse: 'En saklig begrunnelse',
        tilkomneInntektsforhold: [
          {
            fom: '2022-11-16',
            tom: '2022-11-20',
            tilkomneInntektsforhold: [
              {
                aktivitetStatus: 'AT',
                arbeidsforholdId: '123',
                arbeidsgiverId: '999999997',
                bruttoInntektPrÅr: undefined,
                skalRedusereUtbetaling: false,
              },
              {
                aktivitetStatus: 'AT',
                arbeidsforholdId: '456',
                arbeidsgiverId: '974652293',
                bruttoInntektPrÅr: 1349,
                skalRedusereUtbetaling: true,
              },
            ],
          },
        ],
      },
    ],
    kode: 'VURDER_NYTT_INNTKTSFRHLD',
  });
});

it('skal kunne løse aksjonspunkt for tilkommet i revurdering og legge til nye perioder', async () => {
  const lagre = vi.fn();
  render(<TilkommetAktiviteTreLikePerioderHelgMellomAlle submitCallback={lagre} />);
  expect(screen.getByText('Søker har et nytt arbeidsforhold i AA-registeret')).toBeInTheDocument();

  expect(screen.getByText('10.04.2023 - 28.04.2023')).toBeInTheDocument();
  expect(screen.getByText('Del opp periode')).toBeInTheDocument();

  await userEvent.click(screen.getByText('Del opp periode'));
  expect(screen.getByText('Hvilken periode ønsker du å dele opp?')).toBeInTheDocument();
  expect(screen.getAllByText('Del opp periode')[2]?.closest('button')).toBeDisabled();

  expect(await screen.queryByText('Opprett ny vurdering fra')).not.toBeInTheDocument();
  await userEvent.selectOptions(
    screen.getByLabelText('Hvilken periode ønsker du å dele opp?'),
    '10.04.2023 - 28.04.2023',
  );
  expect(screen.getAllByText('Del opp periode')[2]?.closest('button')).toBeDisabled();
  expect(screen.getByText('Opprett ny vurdering fra')).toBeInTheDocument();

  await userEvent.click(screen.getByLabelText('Åpne datovelger'));
  await userEvent.click(screen.getByText('18'));
  expect(await screen.getAllByText('Del opp periode')[2]?.closest('button')).toBeEnabled();
  expect(screen.getByText('Nye perioder til vurdering:')).toBeInTheDocument();
  expect(screen.getByText('10.04.2023 - 17.04.2023')).toBeInTheDocument();
  expect(screen.getByText('18.04.2023 - 28.04.2023')).toBeInTheDocument();
  const delOppPeriodeButtons = screen.getAllByRole('button', { name: 'Del opp periode' });
  if (delOppPeriodeButtons[1]) {
    await userEvent.click(delOppPeriodeButtons[1]);
  }
  expect(await screen.findByText('10.04.2023 - 17.04.2023')).toBeInTheDocument();
  expect(screen.getByText('18.04.2023 - 28.04.2023')).toBeInTheDocument();

  expect(screen.getAllByText('Ja')).toHaveLength(4);
  expect(screen.getAllByText('Nei')).toHaveLength(4);

  const neiLabels = screen.getAllByLabelText('Nei');
  // 10.04.2023 - 17.04.2023
  if (neiLabels[0] && neiLabels[1]) {
    await userEvent.click(neiLabels[0]);
    await userEvent.click(neiLabels[1]);
  }

  const jaLabels = screen.getAllByLabelText('Ja');
  // 18.04.2023 - 28.04.2023
  if (jaLabels[2] && jaLabels[3]) {
    await userEvent.click(jaLabels[2]);
    await userEvent.click(jaLabels[3]);
  }
  expect(screen.getAllByLabelText('Fastsett årsinntekt')).toHaveLength(2);

  const fastsettAarsinntektElements = screen.getAllByLabelText('Fastsett årsinntekt');
  if (fastsettAarsinntektElements[0]) {
    await userEvent.type(fastsettAarsinntektElements[0], '200000');
  }
  if (fastsettAarsinntektElements[1]) {
    await userEvent.type(fastsettAarsinntektElements[1], '350000');
  }

  // Begrunnelse og submit
  await userEvent.type(screen.getByLabelText('Begrunnelse for alle perioder'), 'En saklig begrunnelse');
  await userEvent.click(screen.getByRole('button', { name: 'Bekreft og fortsett' }));

  await waitFor(() => expect(lagre).toHaveBeenCalledTimes(1));
  expect(lagre).toHaveBeenCalledWith({
    begrunnelse: 'En saklig begrunnelse',
    grunnlag: [
      {
        periode: {
          fom: '2023-04-10',
          tom: '2023-04-28',
        },
        begrunnelse: 'En saklig begrunnelse',
        tilkomneInntektsforhold: [
          {
            fom: '2023-04-10',
            tom: '2023-04-14',
            tilkomneInntektsforhold: [
              {
                aktivitetStatus: 'AT',
                arbeidsforholdId: '123',
                arbeidsgiverId: '999999997',
                bruttoInntektPrÅr: undefined,
                skalRedusereUtbetaling: false,
              },
            ],
          },
          {
            fom: '2023-04-17',
            tom: '2023-04-17',
            tilkomneInntektsforhold: [
              {
                aktivitetStatus: 'AT',
                arbeidsforholdId: '123',
                arbeidsgiverId: '999999997',
                bruttoInntektPrÅr: undefined,
                skalRedusereUtbetaling: false,
              },
            ],
          },
          {
            fom: '2023-04-18',
            tom: '2023-04-21',
            tilkomneInntektsforhold: [
              {
                aktivitetStatus: 'AT',
                arbeidsforholdId: '123',
                arbeidsgiverId: '999999997',
                bruttoInntektPrÅr: 200000,
                skalRedusereUtbetaling: true,
              },
            ],
          },
          {
            fom: '2023-04-24',
            tom: '2023-04-28',
            tilkomneInntektsforhold: [
              {
                aktivitetStatus: 'AT',
                arbeidsforholdId: '123',
                arbeidsgiverId: '999999997',
                bruttoInntektPrÅr: 200000,
                skalRedusereUtbetaling: true,
              },
              {
                aktivitetStatus: 'AT',
                arbeidsforholdId: '456',
                arbeidsgiverId: '974652293',
                bruttoInntektPrÅr: 350000,
                skalRedusereUtbetaling: true,
              },
            ],
          },
        ],
      },
    ],
    kode: 'VURDER_NYTT_INNTKTSFRHLD',
  });
});
