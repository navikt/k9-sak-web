import { TopplinjeAlerts } from './TopplinjeAlerts.js';
import type { Meta, StoryObj } from '@storybook/react';
import { makeFakeExtendedApiError, makeFakeK9SakValidationError } from '../../storybook/mocks/fakeExtendedApiError.js';
import { useState } from 'react';
import { action } from '@storybook/addon-actions';
import type { ErrorWithAlertInfo } from './AlertInfo.js';
import GeneralAsyncError from './GeneralAsyncError.js';

const meta = {
  title: 'gui/app/alerts/TopplinjeAlerts.tsx',
  component: TopplinjeAlerts,
  args: {
    onErrorDismiss: action('onErrorDismiss'),
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
  const [errors, setErrors] = useState<ErrorWithAlertInfo[]>(args.errors);
  const dismiss = (err: ErrorWithAlertInfo) => {
    setErrors(errors.filter(e => e.errorId !== err.errorId));
    args.onErrorDismiss(err);
  };
  return story({ args: { errors: errors, onErrorDismiss: dismiss } });
};

export const ValideringsFeil: Story = {
  args: {
    errors: [
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
    errors: [
      makeFakeK9SakValidationError({ body: { feilmelding: 'Her feila det i felt [test1]', type: 'VALIDERINGS_FEIL' } }),
      makeFakeExtendedApiError({ status: 500, body: { feilmelding: 'Noko feila på server' } }),
    ],
  },
  decorators: [withParentErrorStateMaintainer],
};

export const GenerellBakgrunnsfeil: Story = {
  args: {
    errors: [new GeneralAsyncError('Boom')],
  },
  decorators: [withParentErrorStateMaintainer],
};
