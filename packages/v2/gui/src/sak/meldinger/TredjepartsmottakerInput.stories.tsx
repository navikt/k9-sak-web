/* eslint-disable import/no-relative-packages */
import type {
  TredjepartsmottakerError,
  TredjepartsmottakerOrgnrInputProps,
  TredjepartsmottakerValue,
} from '@k9-sak-web/gui/sak/meldinger/TredjepartsmottakerInput.js';
import { Button, VStack } from '@navikt/ds-react';
import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';
import React, { useCallback, useState } from 'react';
import withMaxWidth from '@k9-sak-web/gui/storybook/decorators/withMaxWidth.js';
import { FakeMessagesBackendApi } from '@k9-sak-web/gui/storybook/mocks/FakeMessagesBackendApi.js';
import TredjepartsmottakerInput from './TredjepartsmottakerInput.js';

const meta: Meta<typeof TredjepartsmottakerInput> = {
  title: 'gui/sak/meldinger/TredjepartsmottakerInput.tsx',
  component: TredjepartsmottakerInput,
  decorators: [withMaxWidth(420)],
  argTypes: {
    onChange: {
      action: 'onChange',
    },
  },
};
export default meta;

const api = new FakeMessagesBackendApi();

export const Default: StoryObj<typeof TredjepartsmottakerInput> = {
  args: {
    show: true,
    api,
  },
  render: (args: TredjepartsmottakerOrgnrInputProps) => {
    const [showValidation, setShowError] = useState(false);
    const [value, setValue] = useState<TredjepartsmottakerValue | TredjepartsmottakerError | undefined>(undefined);
    const onChange = useCallback((v: TredjepartsmottakerValue | TredjepartsmottakerError | undefined) => {
      action('onChange')(v);
      setValue(v);
    }, []);
    const onSimulateSubmit = useCallback(() => {
      const valueStr = value && value.navn && value.organisasjonsnr ? `${value.navn} (${value.organisasjonsnr})` : '';
      action('onSimulateSubmit')(valueStr);
      setShowError(true);
    }, [value]);
    return (
      <VStack gap="4">
        <TredjepartsmottakerInput {...args} showValidation={showValidation} onChange={onChange} />
        <Button type="button" onClick={onSimulateSubmit}>
          Simulate submit
        </Button>
      </VStack>
    );
  },
};

export const EmptyRequiredError: StoryObj<typeof TredjepartsmottakerInput> = {
  args: {
    show: true,
    showValidation: true,
    required: true,
    api,
  },
};

export const NotFoundError: StoryObj<typeof TredjepartsmottakerInput> = {
  args: {
    show: true,
    showValidation: true,
    defaultValue: '000000000',
    api,
  },
};

export const InvalidInputError: StoryObj<typeof TredjepartsmottakerInput> = {
  args: {
    show: true,
    showValidation: true,
    defaultValue: 'aaabbbccc',
    api,
  },
};
