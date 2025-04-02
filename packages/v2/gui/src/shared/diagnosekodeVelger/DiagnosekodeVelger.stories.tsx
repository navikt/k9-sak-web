import DiagnosekodeVelger from './DiagnosekodeVelger.jsx';
import type { Meta, StoryObj } from '@storybook/react';
import { withFormProvider } from '../../storybook/decorators/withFormProvider.js';
import { expect, userEvent } from '@storybook/test';
import type { UseFormReturn } from 'react-hook-form';

const meta = {
  title: 'gui/shared/diagnosekodeVelger/DiagnosekodeVelger.tsx',
  component: DiagnosekodeVelger,
} satisfies Meta<typeof DiagnosekodeVelger>;

export default meta;

type Story = StoryObj<typeof meta>;

// Deklarerer datatypen DiagnosekodeVelger bruker i useForm
interface FormValues {
  diagnosekoder: string[];
}
const emptyFormProps = { defaultValues: { diagnosekoder: [] } };

const formProviderId = 'diagnosekodevelger';

export const Standard: Story = {
  args: {
    name: 'diagnosekoder',
  },
  decorators: withFormProvider<FormValues>(formProviderId, emptyFormProps),
  play: async ({ loaded }) => {
    // Hent ut react-hook-form context state satt til loaded av withFormProvider. Er ikkje typesikker, så må deklarere korrekt type sjølv.
    const {
      formState: { isValid, errors, isSubmitted },
      getValues,
    }: UseFormReturn<FormValues> = loaded[formProviderId];
    await expect(isValid).toBeFalsy();
    await expect(isSubmitted).toBeFalsy();
    await expect(errors).toEqual({});
    await expect(getValues()).toEqual(emptyFormProps.defaultValues);
  },
};

export const MedUtfylteDiagnosekoder: Story = {
  args: { ...Standard.args },
  decorators: withFormProvider(formProviderId, { defaultValues: { diagnosekoder: ['A001', 'b002'] } }),
  play: async ({ loaded, canvas, step }) => {
    const submitBtn = canvas.getByTestId(`${formProviderId}-Submit`);
    await step('Initiell state er ok', async () => {
      const {
        formState: { isValid, errors, isSubmitted },
        getValues,
      }: UseFormReturn<FormValues> = loaded[formProviderId];
      await expect(isValid).toBeTruthy();
      await expect(errors).toEqual({});
      await expect(isSubmitted).toBeFalsy();
      await expect(getValues()).toEqual({ diagnosekoder: ['A001', 'b002'] });
    });
    await step('Submit fungerer', async () => {
      await userEvent.click(submitBtn);
      const {
        formState: { isValid, errors, isSubmitted },
        getValues,
      }: UseFormReturn<FormValues> = loaded[formProviderId];
      await expect(isValid).toBeTruthy();
      await expect(errors).toEqual({});
      await expect(isSubmitted).toBeTruthy();
      await expect(getValues()).toEqual({ diagnosekoder: ['A001', 'b002'] });
    });
    await step('Fjern ein, legg til ein', async () => {
      const b002Chip = canvas.getByLabelText('B002', { exact: false });
      await userEvent.click(b002Chip);
      const searchInput = canvas.getByRole('combobox');
      await userEvent.type(searchInput, 'e010');
      const searchHit = canvas.getByText('E010');
      await userEvent.click(searchHit);
      await userEvent.click(submitBtn);
      const {
        formState: { isValid, errors, submitCount, isSubmitSuccessful },
        getValues,
      }: UseFormReturn<FormValues> = loaded[formProviderId];
      await expect(isValid).toBeTruthy();
      await expect(errors).toEqual({});
      await expect(submitCount).toBe(2);
      await expect(isSubmitSuccessful).toEqual(true);
      await expect(getValues()).toEqual({ diagnosekoder: ['A001', 'E010'] });
    });
  },
};

export const Valideringsfeil: Story = {
  args: { ...Standard.args },
  decorators: withFormProvider(formProviderId, emptyFormProps),
  play: async ({ loaded, canvas }) => {
    const submitBtn = canvas.getByTestId(`${formProviderId}-Submit`);
    await userEvent.click(submitBtn);
    const {
      formState: { isValid, errors, isSubmitted, isSubmitSuccessful },
      getValues,
    }: UseFormReturn<FormValues> = loaded[formProviderId];
    await expect(isValid).toBe(false);
    await expect(errors.diagnosekoder?.message).toEqual('Diagnosekode er påkrevd');
    await expect(isSubmitted).toBe(true);
    await expect(isSubmitSuccessful).toEqual(false);
    await expect(getValues()).toEqual({ diagnosekoder: [] });
    await expect(canvas.getByText('Diagnosekode er påkrevd')).toBeInTheDocument();
  },
};

export const IkkjeEksisterendeDiagnosekode: Story = {
  args: { ...Standard.args },
  decorators: withFormProvider(formProviderId, { defaultValues: { diagnosekoder: ['Å911'] } }),
  play: async ({ loaded, canvas }) => {
    const { getValues }: UseFormReturn<FormValues> = loaded[formProviderId];
    await expect(getValues()).toEqual({ diagnosekoder: ['Å911'] });
    const å911Chip = canvas.getByLabelText('Å911 - Ukjent', { exact: false });
    await expect(å911Chip).toBeInTheDocument();
  },
};
