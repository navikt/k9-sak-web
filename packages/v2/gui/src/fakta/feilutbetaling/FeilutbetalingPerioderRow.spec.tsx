import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormProvider, useForm, useFormContext, useFormState, useWatch } from 'react-hook-form';
import { describe, expect, it } from 'vitest';
import type {
  FeilutbetalingHendelseTypeViewModel,
  FeilutbetalingPeriodeViewModel,
} from './api/FeilutbetalingFaktaViewModel.js';
import type { FeilutbetalingFormValues } from './FeilutbetalingFaktaIndex.js';
import FeilutbetalingPerioderRow from './FeilutbetalingPerioderRow.js';

const årsaker = [
  {
    hendelseType: 'BEREGNING_TYPE',
    hendelseUndertyper: ['ENDRING_GRUNNLAG', 'ENDRET_DEKNINGSGRAD'],
  },
  {
    hendelseType: 'MEDLEMSKAP',
    hendelseUndertyper: [],
  },
] as FeilutbetalingHendelseTypeViewModel[];

const perioder = [
  { fom: '2024-01-01', tom: '2024-01-31', belop: 1000 },
  { fom: '2024-02-01', tom: '2024-02-29', belop: 1000 },
] as FeilutbetalingPeriodeViewModel[];

const FormValues = () => {
  const { control } = useFormContext<FeilutbetalingFormValues>();
  const values = useWatch({ control });
  const { dirtyFields } = useFormState({ control });
  return <output>{JSON.stringify({ values, dirtyFields })}</output>;
};

const TestForm = ({ førstePeriode }: { førstePeriode?: FeilutbetalingFormValues['perioder'][number] }) => {
  const formMethods = useForm<FeilutbetalingFormValues>({
    defaultValues: {
      begrunnelse: '',
      behandlePerioderSamlet: true,
      perioder: [
        førstePeriode ?? { fom: '2024-01-01', tom: '2024-01-31', årsak: '', underÅrsak: '' },
        { fom: '2024-02-01', tom: '2024-02-29', årsak: 'MEDLEMSKAP', underÅrsak: 'GAMMEL_UNDERÅRSAK' },
      ],
    },
  });

  return (
    <FormProvider {...formMethods}>
      <table>
        <tbody>
          <FeilutbetalingPerioderRow
            periode={perioder[0]!}
            index={0}
            årsaker={årsaker}
            readOnly={false}
            behandlePerioderSamlet
            hentHendelseTypeNavn={kode => kode ?? ''}
            hentHendelseUnderTypeNavn={kode => kode ?? ''}
          />
          <FeilutbetalingPerioderRow
            periode={perioder[1]!}
            index={1}
            årsaker={årsaker}
            readOnly={false}
            behandlePerioderSamlet
            hentHendelseTypeNavn={kode => kode ?? ''}
            hentHendelseUnderTypeNavn={kode => kode ?? ''}
          />
        </tbody>
      </table>
      <FormValues />
    </FormProvider>
  );
};

describe('FeilutbetalingPerioderRow', () => {
  it('tømmer gammel underårsak når hendelsen ikke har undertyper', async () => {
    const user = userEvent.setup();
    render(
      <TestForm
        førstePeriode={{
          fom: '2024-01-01',
          tom: '2024-01-31',
          årsak: 'BEREGNING_TYPE',
          underÅrsak: 'ENDRING_GRUNNLAG',
        }}
      />,
    );

    expect(screen.getByRole('combobox', { name: 'Hendelse for perioden 01.01.2024 - 31.01.2024' })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'Hendelse for perioden 01.02.2024 - 29.02.2024' })).toBeInTheDocument();
    expect(
      screen.getByRole('combobox', { name: 'Underårsak for perioden 01.01.2024 - 31.01.2024' }),
    ).toBeInTheDocument();
    await user.selectOptions(
      screen.getByRole('combobox', { name: 'Hendelse for perioden 01.01.2024 - 31.01.2024' }),
      'MEDLEMSKAP',
    );

    expect(screen.queryByRole('combobox', { name: /Underårsak for perioden/ })).not.toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent(
      '"perioder":[{"fom":"2024-01-01","tom":"2024-01-31","årsak":"MEDLEMSKAP","underÅrsak":""},{"fom":"2024-02-01","tom":"2024-02-29","årsak":"MEDLEMSKAP","underÅrsak":""}]',
    );
    expect(screen.getByRole('status')).toHaveTextContent('"dirtyFields":{"perioder":[{"årsak":true,"underÅrsak":true}');
  });

  it('propagerer årsak og underårsak, tømmer gammel underårsak og markerer alle endrede felt som dirty', async () => {
    const user = userEvent.setup();
    render(<TestForm />);

    const hendelser = screen.getAllByRole('combobox', { name: /Hendelse for perioden/ });
    await user.selectOptions(hendelser[0]!, 'BEREGNING_TYPE');

    expect(screen.getByRole('status')).toHaveTextContent(
      '"perioder":[{"fom":"2024-01-01","tom":"2024-01-31","årsak":"BEREGNING_TYPE","underÅrsak":""},{"fom":"2024-02-01","tom":"2024-02-29","årsak":"BEREGNING_TYPE","underÅrsak":""}]',
    );

    const underårsaker = screen.getAllByRole('combobox', { name: /Underårsak for perioden/ });
    await user.selectOptions(underårsaker[0]!, 'ENDRING_GRUNNLAG');

    expect(screen.getByRole('status')).toHaveTextContent(
      '"perioder":[{"fom":"2024-01-01","tom":"2024-01-31","årsak":"BEREGNING_TYPE","underÅrsak":"ENDRING_GRUNNLAG"},{"fom":"2024-02-01","tom":"2024-02-29","årsak":"BEREGNING_TYPE","underÅrsak":"ENDRING_GRUNNLAG"}]',
    );
    expect(screen.getByRole('status')).toHaveTextContent(
      '"dirtyFields":{"perioder":[{"årsak":true,"underÅrsak":true},{"årsak":true,"underÅrsak":true}]}',
    );
  });
});
