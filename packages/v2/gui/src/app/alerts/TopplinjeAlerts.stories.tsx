import { TopplinjeAlerts } from './TopplinjeAlerts.js';
import type { Meta, StoryObj } from '@storybook/react';
import { makeFakeExtendedApiError, makeFakeK9SakValidationError } from '../../storybook/mocks/fakeExtendedApiError.js';
import type { ExtendedApiError } from '@k9-sak-web/backend/shared/instrumentation/ExtendedApiError.js';
import { useState } from 'react';
import { action } from '@storybook/addon-actions';

const meta = {
  title: 'gui/app/alerts/TopplinjeAlerts.tsx',
  component: TopplinjeAlerts,
  args: {
    onApiErrorDismiss: action('onApiErrorDismiss'),
  },
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof TopplinjeAlerts>;

export default meta;

type Story = StoryObj<typeof meta>;
type StoryDecorator = Story['decorators'];

// Simulerer at parent komponent held på error state for denne komponent
const withParentErrorStateMaintainer: StoryDecorator = (story, { args }) => {
  const [apiErrors, setApiErrors] = useState<ExtendedApiError[]>(args.apiErrors);
  const dismiss = (err: ExtendedApiError) => {
    setApiErrors(apiErrors.filter(e => e.randomId !== err.randomId));
    args.onApiErrorDismiss(err);
  };
  return story({ args: { apiErrors, onApiErrorDismiss: dismiss } });
};

export const ValideringsFeil: Story = {
  args: {
    apiErrors: [
      makeFakeK9SakValidationError({
        body: {
          feilmelding:
            'Det oppstod en valideringsfeil på felt [fritekst]. Vennligst kontroller at alle feltverdier er korrekte.',
          type: 'VALIDERINGS_FEIL',
        },
      }),
    ],
  },
  decorators: [withParentErrorStateMaintainer],
};

export const FleireApiFeil: Story = {
  args: {
    apiErrors: [
      makeFakeK9SakValidationError({ body: { feilmelding: 'Her feila det i felt [test1]', type: 'VALIDERINGS_FEIL' } }),
      makeFakeExtendedApiError({ status: 500, body: { feilmelding: 'Noko feila på server' } }),
    ],
  },
  decorators: [withParentErrorStateMaintainer],
};
