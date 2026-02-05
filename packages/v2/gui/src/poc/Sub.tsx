import { CrossMountStore, useFormCrossMount } from './useFormCrossMount.js';
import { useEffect } from 'react';

export type FormState = Readonly<{
  txt1: string;
  txt2: string;
}>;

export type Sub1Props = Readonly<{ crossMountStore: CrossMountStore<FormState> }>;

export const Sub = ({ crossMountStore }: Sub1Props) => {
  const form = useFormCrossMount(crossMountStore, {
    defaultValues: {
      txt1: 'txt1',
      txt2: 'txt2',
    },
  });
  const {
    handleSubmit,
    register,
    reset,
    resetField,
    formState: { isSubmitSuccessful, errors },
  } = form;
  const onSubmit = (state: FormState) => {
    console.debug('Sub submit', state);
  };
  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);

  console.debug('Render Sub');
  const txt1Validation = { minLength: { value: 3, message: 'Må vere minst 3 teikn' } };
  return (
    <>
      <h3>Sub Form</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register('txt1', txt1Validation)} />
        <br />
        <input {...register('txt2')} />
        <br />
        <input type="submit" />
      </form>
      <button onClick={() => reset()}>Reset all</button>
      <button onClick={() => resetField('txt2')}>Reset field txt2</button>
      <p>
        <b>Errors:</b>
        <br />
        {errors.root?.message}
        <br />
        {errors.txt1?.message}
        <br />
        {errors.txt2?.message}
        <br />
      </p>
    </>
  );
};
