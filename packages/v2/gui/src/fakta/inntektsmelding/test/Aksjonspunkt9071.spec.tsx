import { composeStories } from '@storybook/react';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { aksjonspunkt9071Props } from '../mock/inntektsmeldingPropsMock';
import { alleErMottatt, manglerInntektsmelding } from '../mock/mockedKompletthetsdata';
import * as inntektsmeldingQueries from '../src/api/inntektsmeldingQueries';
import * as stories from '../src/stories/InntektsmeldingV2.stories';
import type { InntektsmeldingContainerProps } from '../src/ui/InntektsmeldingContainer';

describe('9071 - Mangler inntektsmelding', () => {
  const { Mangler9071, AlleInntektsmeldingerMottatt } = composeStories(stories);

  beforeEach(() => {
    vi.spyOn(inntektsmeldingQueries, 'useKompletthetsoversikt').mockReturnValue({
      data: manglerInntektsmelding,
    } as ReturnType<typeof inntektsmeldingQueries.useKompletthetsoversikt>);
  });

  test('Viser ikke knapp for å sende inn når beslutning ikke er valgt', async () => {
    // ARRANGE
    render(<Mangler9071 />);
    await waitFor(() => screen.getByText(/Når kan du gå videre uten inntektsmelding?/i));

    // ASSERT
    expect(
      screen.getByLabelText(/Nei, avslå på grunn av manglende opplysninger om inntekt etter §21-3/i),
    ).toBeDefined();
    expect(screen.queryByRole('button', { name: /Fortsett uten inntektsmelding/i })).toBeNull();
    expect(screen.queryByRole('button', { name: /Send purring med varsel om avslag/i })).toBeNull();
  });

  test('Viser riktig knapp når purring er valgt', async () => {
    // ARRANGE
    render(<Mangler9071 />);
    await waitFor(() => screen.getByText(/Når kan du gå videre uten inntektsmelding?/i));

    // ACT
    await act(async () => {
      await userEvent.click(
        screen.getByLabelText(/Nei, avslå på grunn av manglende opplysninger om inntekt etter §21-3/i),
      );
    });

    // ASSERT
    expect(screen.queryByRole('button', { name: /Fortsett uten inntektsmelding/i })).toBeNull();
    expect(screen.getByRole('button', { name: /Avslå Periode/i })).toBeDefined();
  });

  test('Må skrive begrunnelse når man har valgt A-inntekt', async () => {
    // ARRANGE
    render(<Mangler9071 />);
    await waitFor(() => screen.getByText(/Når kan du gå videre uten inntektsmelding?/i));

    // ACT
    await act(async () => {
      await userEvent.click(screen.getByText(/ja, bruk a-inntekt for sauefabrikk \(2\) og sauefabrikk \(1\)/i));
      await userEvent.click(screen.getByRole('button', { name: /Fortsett uten inntektsmelding/i }));
    });
    // ASSERT
    expect(screen.getByText('Du må fylle inn en verdi')).toBeDefined();
  });

  test('Kan sende purring med varsel om avslag', async () => {
    // ARRANGE
    const onClickSpy = vi.fn();
    const props: Partial<InntektsmeldingContainerProps> = {
      ...aksjonspunkt9071Props,
      submitCallback: onClickSpy,
    };
    render(<Mangler9071 {...props} />);

    await waitFor(() => screen.getByText(/Når kan du gå videre uten inntektsmelding?/i));

    // ACT
    await act(async () => {
      await userEvent.click(screen.getByText(/ja, bruk a-inntekt for sauefabrikk \(2\) og sauefabrikk \(1\)/i));
      await userEvent.type(screen.getByLabelText(/Begrunnelse/i), 'Inntektsmelding? LOL! Nei takk');
      await userEvent.click(screen.getByRole('button', { name: /Fortsett uten inntektsmelding/i }));
    });

    // ASSERT
    expect(onClickSpy).toHaveBeenCalledWith([
      {
        '@type': '9071',
        kode: '9071',
        begrunnelse: 'Inntektsmelding? LOL! Nei takk',
        perioder: [
          {
            begrunnelse: 'Inntektsmelding? LOL! Nei takk',
            periode: '2022-02-01/2022-02-16',
            fortsett: true,
            kode: '9071',
            vurdering: 'FORTSETT',
          },
        ],
      },
    ]);
  });

  test('Kan submitte begrunnelse når man har valgt A-inntekt', async () => {
    // ARRANGE
    const onClickSpy = vi.fn();
    const props: Partial<InntektsmeldingContainerProps> = {
      ...aksjonspunkt9071Props,
      submitCallback: onClickSpy,
    };
    render(<Mangler9071 {...props} />);

    await waitFor(() => screen.getByText(/Når kan du gå videre uten inntektsmelding?/i));

    // ACT
    await userEvent.click(screen.getByText(/ja, bruk a-inntekt for sauefabrikk \(2\) og sauefabrikk \(1\)/i));
    await userEvent.type(screen.getByLabelText(/Begrunnelse/i), 'Inntektsmelding? LOL! Nei takk');
    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: /Fortsett uten inntektsmelding/i }));
    });

    // ASSERT
    expect(onClickSpy).toHaveBeenCalledWith([
      {
        '@type': '9071',
        kode: '9071',
        begrunnelse: 'Inntektsmelding? LOL! Nei takk',
        perioder: [
          {
            begrunnelse: 'Inntektsmelding? LOL! Nei takk',
            periode: '2022-02-01/2022-02-16',
            fortsett: true,
            kode: '9071',
            vurdering: 'FORTSETT',
          },
        ],
      },
    ]);
  });

  test('Hvis det tidligere er blitt gjort en vurdering og behandlingen har hoppet tilbake må man kunne løse aksjonspunktet', async () => {
    // ARRANGE
    vi.spyOn(inntektsmeldingQueries, 'useKompletthetsoversikt').mockReturnValue({
      data: alleErMottatt,
    } as ReturnType<typeof inntektsmeldingQueries.useKompletthetsoversikt>);

    const onClickSpy = vi.fn();
    const props: Partial<InntektsmeldingContainerProps> = {
      ...aksjonspunkt9071Props,
      submitCallback: onClickSpy,
    };
    render(<AlleInntektsmeldingerMottatt {...props} />);

    await waitFor(() => screen.getByText(/Når kan du gå videre uten inntektsmelding?/i));

    // ACT
    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: /Send inn/i }));
    });

    // ASSERT
    expect(onClickSpy).toHaveBeenCalledWith([
      {
        '@type': '9071',
        kode: '9071',
        perioder: [],
      },
    ]);
  });
});
