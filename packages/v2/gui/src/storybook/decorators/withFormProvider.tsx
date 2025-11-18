import type { Decorator } from '@storybook/react';
import { FormProvider, useForm, type FieldValues, type UseFormProps } from 'react-hook-form';
import { action } from 'storybook/actions';

export const withFormProvider =
  <TFieldValues extends FieldValues = FieldValues, TContext = any>(
    formProviderId: string,
    props?: UseFormProps<TFieldValues, TContext>,
  ): Decorator =>
  (Story, ctx) => {
    const formMethods = useForm(props);
    const {
      handleSubmit,
      formState: { errors, isValid, isDirty, isSubmitted, submitCount },
    } = formMethods;
    // Setter formMethods i loaded for å kunne hente ut form state i play funksjon i story for testing, etc.
    ctx.loaded[formProviderId] = formMethods;

    const hasErrors = Object.keys(errors).length > 0;
    return (
      <FormProvider {...formMethods}>
        <form
          onSubmit={handleSubmit(
            v => action('onSubmit')(v),
            v => action('form errors')(v),
          )}
        >
          <Story />
          <fieldset style={{ marginTop: '24px' }}>
            <legend>
              <i>withFormProvider</i>
            </legend>
            <p>
              <i>
                isDirty: {`${isDirty}`}, &nbsp; isValid: {`${isValid}`}, &nbsp; isSubmitted: {`${isSubmitted}`}, &nbsp;
                submitCount: {submitCount}
              </i>
            </p>
            <button type="submit" data-testid={`${formProviderId}-Submit`}>
              Submit (to action)
            </button>
            {hasErrors ? (
              <>
                <h4>Errors:</h4>
                <pre>{JSON.stringify(errors, null, 2)}</pre>
              </>
            ) : undefined}
          </fieldset>
        </form>
      </FormProvider>
    );
  };
