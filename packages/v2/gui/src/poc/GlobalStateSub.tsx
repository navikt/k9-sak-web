import { CrossMountStore, useFormCrossMount } from './useFormCrossMount.js';
import { useEffect } from 'react';

export type FormState = Readonly<{
  a: string;
  b: string;
}>;

// Viss ein har fleire instanser av komponent som bruker global state slik vil det føre til tap eller overføring av state
// ved unmount+mount viss meir enn ein av instansande blir unmounta samtidig.
const globalPersistentFormState = new CrossMountStore<FormState>();

export const GlobalStateSub = () => {
  const form = useFormCrossMount(globalPersistentFormState, {
    defaultValues: {
      a: 'aaa',
      b: 'bbb',
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
  const aValidation = { minLength: { value: 3, message: 'Må vere minst 3 teikn' } };
  return (
    <>
      <h3>Global State Sub Form</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register('a', aValidation)} />
        <br />
        <input {...register('b')} />
        <br />
        <input type="submit" />
      </form>
      <button onClick={() => reset()}>Reset all</button>
      <button onClick={() => resetField('b')}>Reset field b</button>
      <p>
        <b>Errors:</b>
        <br />
        {errors.root?.message}
        <br />
        {errors.a?.message}
        <br />
        {errors.b?.message}
        <br />
      </p>
    </>
  );
};
