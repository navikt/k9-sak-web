import React from 'react';
import { withKnobs } from '@storybook/addon-knobs';
import UttakProsessIndex from '@fpsak-frontend/prosess-uttak/src/UttakProsessIndex';
import { uttaksplaner, behandlingPersonMap } from '@fpsak-frontend/prosess-uttak/src/components/dto/testdata';

export default {
  title: 'prosess/prosess-pleiepenger-uttak',
  component: UttakProsessIndex,
  decorators: [withKnobs],
};

export const uttak = () => <UttakProsessIndex uttaksplaner={uttaksplaner} behandlingPersonMap={behandlingPersonMap} />;
