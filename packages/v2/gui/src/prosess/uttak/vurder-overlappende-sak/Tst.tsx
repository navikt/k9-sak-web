import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import type { ObjectSchema } from 'yup';

interface FormValues {
  someNum: number | undefined;
}

export interface SubmitData {
  someNum: number;
}

const submitDataSchema: ObjectSchema<SubmitData> = yup
  .object()
  .shape({
    someNum: yup
      .number()
      .transform(v => (Number.isNaN(v) ? undefined : v))
      .required(),
  })
  .required();

const resolver = yupResolver(submitDataSchema);

interface TstProps {
  readonly initValues: FormValues;
  readonly onSubmit: (data: SubmitData) => void | Promise<void>;
}

export const Tst = ({ initValues, onSubmit }: TstProps) => {
  const { register, handleSubmit, formState } = useForm<SubmitData>({
    resolver,
    defaultValues: { someNum: initValues.someNum },
  });
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input type="number" {...register('someNum')} defaultValue={initValues.someNum ?? undefined} />
        <button type="submit">Submit</button>
      </form>
      <p>someNum validering: {formState.errors.someNum?.message ?? 'Ok'}</p>
      <p>Skjema rot validering: {formState.errors.root?.message ?? 'Ok'}</p>
    </div>
  );
};
