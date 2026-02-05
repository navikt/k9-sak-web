import {
  type DefaultValues,
  type FieldValues,
  useForm,
  type UseFormProps,
  type UseFormReset,
  type UseFormResetField,
  type UseFormReturn,
} from 'react-hook-form';
import { useEffect } from 'react';

export class CrossMountStore<TFieldValues extends FieldValues, T = TFieldValues> {
  #stored: T | undefined = undefined;

  set(v: T | undefined) {
    this.#stored = v;
  }
  /**
   * Returns the stored value as DefaultValues type, since that is what react-hook-form requires in its defaultValues argument.
   * The type cast is always safe since one of the valid DefaultValues types is DeepPartial<TFieldValues>
   */
  getAsDefaultValues(): DefaultValues<T> | undefined {
    console.debug('getAsDefaultValues', this.#stored);
    return this.#stored as DefaultValues<T> | undefined;
  }

  reset() {
    this.#stored = undefined;
  }
}

export const useFormCrossMount = <
  TFieldValues extends FieldValues = FieldValues,
  TContext = any,
  TTransformedValues = TFieldValues,
>(
  state: CrossMountStore<TFieldValues>,
  props: UseFormProps<TFieldValues, TContext, TTransformedValues>,
): UseFormReturn<TFieldValues, TContext, TTransformedValues> => {
  if (typeof props.defaultValues === 'function') {
    throw new Error(`useFormCrossMount does not support function for defaultValues`);
  }
  const initDefaultValues = props.defaultValues;
  const form = useForm({ ...props, defaultValues: state.getAsDefaultValues() ?? initDefaultValues });
  const reset: UseFormReset<TFieldValues> = (values, keepStateOptions) => {
    state.reset();
    form.reset(values ?? initDefaultValues, keepStateOptions);
  };
  const resetField: UseFormResetField<TFieldValues> = (name, options) => {
    const fixedOptions = { ...options, defaultValue: options?.defaultValue ?? initDefaultValues?.[name] };
    form.resetField(name, fixedOptions);
  };

  useEffect(() => {
    return () => {
      state.set(form.getValues());
    };
  }, [form, state]);
  return { ...form, reset, resetField };
};
