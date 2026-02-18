import type { Decorator } from '@storybook/react';
import { FakeTilkjentYtelseBackendApi } from '../mocks/FakeTilkjentYtelseBackendApi.js';
import type { FeriepengerPrÅr } from '../../prosess/tilkjent-ytelse/components/feriepenger/FeriepengerPanel.js';
import { MedFlereOpptjeningsår } from '../../prosess/tilkjent-ytelse/components/feriepenger/FeriepengerPanel.stories.js';
import { TilkjentYtelseApiContext } from '../../prosess/tilkjent-ytelse/api/TilkjentYtelseApiContext.js';

export const withFakeTilkjentYtelseBackend =
  (feriepengerPrÅr?: FeriepengerPrÅr): Decorator =>
  Story => {
    const fakeTilkjentYtelseBackend = new FakeTilkjentYtelseBackendApi(
      feriepengerPrÅr ?? MedFlereOpptjeningsår.args.feriepengerPrÅr,
    );
    return (
      <TilkjentYtelseApiContext value={fakeTilkjentYtelseBackend}>
        <Story />
      </TilkjentYtelseApiContext>
    );
  };
