import { renderWithReactQueryClient } from '@k9-sak-web/gui/utils/test-helpers/reactQueryUtils.js';
import { composeStories, StoryFn } from '@storybook/react';
import { screen, userEvent } from '@storybook/test';
import { act } from '@testing-library/react';
import MedlemskapFaktaIndex from './MedlemskapFaktaIndex';
import * as stories from './MedlemskapFaktaIndex.stories';

describe('MedlemskapFaktaIndex', () => {
  const { VisAksjonspunktForAlleAndreMedlemskapsaksjonspunkter } = composeStories(stories) as {
    [key: string]: StoryFn<Partial<typeof MedlemskapFaktaIndex>>;
  };
  it('skal formatere data ved innsending', async () => {
    const onClickSpy = vi.fn();
    const props = { submitCallback: onClickSpy };
    renderWithReactQueryClient(<VisAksjonspunktForAlleAndreMedlemskapsaksjonspunkter {...props} />);
    await act(async () => {
      expect(screen.getByText('Skogvegen 3, 4353 Klepp Stasjon')).toBeInTheDocument();
      await userEvent.click(screen.getByRole('radio', { name: 'Periode med medlemskap' }));
      await userEvent.type(screen.getByRole('textbox', { name: 'Begrunn endringene' }), 'Dette er en begrunnelse');
      expect(screen.getByRole('button', { name: 'Oppdater' })).not.toBeDisabled();
      await userEvent.click(screen.getByRole('button', { name: 'Oppdater' }));
    });
    await act(async () => {
      await userEvent.click(screen.getByText('07.11.2018'));
    });

    await act(async () => {
      expect(screen.queryByText('Skogvegen 3, 4353 Klepp Stasjon')).not.toBeInTheDocument();
      await userEvent.click(screen.getByRole('radio', { name: 'Periode med unntak fra medlemskap' }));
      await userEvent.type(screen.getByRole('textbox', { name: 'Begrunn endringene' }), 'Dette er en begrunnelse');
      expect(screen.getByRole('button', { name: 'Oppdater' })).not.toBeDisabled();
      await userEvent.click(screen.getByRole('button', { name: 'Oppdater' }));
    });

    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: 'Bekreft og fortsett' }));
    });
    expect(onClickSpy).toHaveBeenCalledWith([
      {
        bekreftedePerioder: [],
        kode: '5020',
      },
      {
        bekreftedePerioder: [
          {
            aksjonspunkter: ['5021'],
            begrunnelse: 'Dette er en begrunnelse',
            erEosBorger: null,
            lovligOppholdVurdering: null,
            medlemskapManuellVurderingType: {
              kode: 'UNNTAK',
            },
            oppholdsrettVurdering: null,
            vurderingsdato: '2018-11-07',
          },
          {
            aksjonspunkter: ['5021'],
            begrunnelse: 'Dette er en begrunnelse',
            erEosBorger: null,
            lovligOppholdVurdering: null,
            medlemskapManuellVurderingType: {
              kode: 'MEDLEM',
            },
            oppholdsrettVurdering: null,
            vurderingsdato: '2019-11-07',
          },
        ],
        kode: '5053',
      },
      {
        bekreftedePerioder: [
          {
            aksjonspunkter: ['5021'],
            begrunnelse: 'Dette er en begrunnelse',
            erEosBorger: null,
            lovligOppholdVurdering: null,
            medlemskapManuellVurderingType: {
              kode: 'UNNTAK',
            },
            oppholdsrettVurdering: null,
            vurderingsdato: '2018-11-07',
          },
          {
            aksjonspunkter: ['5021'],
            begrunnelse: 'Dette er en begrunnelse',
            erEosBorger: null,
            lovligOppholdVurdering: null,
            medlemskapManuellVurderingType: {
              kode: 'MEDLEM',
            },
            oppholdsrettVurdering: null,
            vurderingsdato: '2019-11-07',
          },
        ],
        kode: '5021',
      },
      {
        bekreftedePerioder: [],
        kode: '5023',
      },
    ]);
  });
});
