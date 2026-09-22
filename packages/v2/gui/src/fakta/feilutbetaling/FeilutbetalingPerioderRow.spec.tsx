import type { LogiskPeriodeMedFaktaDto } from '@k9-sak-web/backend/k9tilbake/kontrakt/feilutbetaling/BehandlingFeilutbetalingFaktaDto.js';
import type { HendelseTypeMedUndertyperDto } from '@k9-sak-web/backend/k9tilbake/kontrakt/feilutbetaling/HendelseTyperDto.js';
import { K9KodeverkoppslagContext } from '@k9-sak-web/gui/kodeverk/oppslag/K9KodeverkoppslagContext.js';
import { fakeK9Kodeverkoppslag } from '@k9-sak-web/gui/kodeverk/mocks/fakeK9Kodeverkoppslag.js';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormProvider, useForm, useFormContext, useFormState, useWatch } from 'react-hook-form';
import { describe, expect, it } from 'vitest';
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
] as HendelseTypeMedUndertyperDto[];

const perioder = [
  { fom: '2024-01-01', tom: '2024-01-31', belop: 1000 },
  { fom: '2024-02-01', tom: '2024-02-29', belop: 1000 },
] as LogiskPeriodeMedFaktaDto[];

const FormValues = () => {
  const { control } = useFormContext<FeilutbetalingFormValues>();
  const values = useWatch({ control });
  const { dirtyFields } = useFormState({ control });
  return <output>{JSON.stringify({ values, dirtyFields })}</output>;
};

const TestForm = () => {
  const formMethods = useForm<FeilutbetalingFormValues>({
    defaultValues: {
      begrunnelse: '',
      behandlePerioderSamlet: true,
      perioder: [
        { fom: '2024-01-01', tom: '2024-01-31', årsak: '', underÅrsak: '' },
        { fom: '2024-02-01', tom: '2024-02-29', årsak: 'MEDLEMSKAP', underÅrsak: 'GAMMEL_UNDERÅRSAK' },
      ],
    },
  });

  return (
    <K9KodeverkoppslagContext value={fakeK9Kodeverkoppslag()}>
      <FormProvider {...formMethods}>
        <table>
          <tbody>
            <FeilutbetalingPerioderRow
              periode={perioder[0]!}
              index={0}
              årsaker={årsaker}
              readOnly={false}
              behandlePerioderSamlet
            />
            <FeilutbetalingPerioderRow
              periode={perioder[1]!}
              index={1}
              årsaker={årsaker}
              readOnly={false}
              behandlePerioderSamlet
            />
          </tbody>
        </table>
        <FormValues />
      </FormProvider>
    </K9KodeverkoppslagContext>
  );
};

describe('FeilutbetalingPerioderRow', () => {
  it('propagerer årsak og underårsak, tømmer gammel underårsak og markerer alle endrede felt som dirty', async () => {
    const user = userEvent.setup();
    render(<TestForm />);

    const hendelser = screen.getAllByRole('combobox', { name: 'Hendelse' });
    await user.selectOptions(hendelser[0]!, 'BEREGNING_TYPE');

    const underårsaker = screen.getAllByRole('combobox', { name: 'Underårsak' });
    await user.selectOptions(underårsaker[0]!, 'ENDRING_GRUNNLAG');

    expect(screen.getByRole('status')).toHaveTextContent(
      '"perioder":[{"fom":"2024-01-01","tom":"2024-01-31","årsak":"BEREGNING_TYPE","underÅrsak":"ENDRING_GRUNNLAG"},{"fom":"2024-02-01","tom":"2024-02-29","årsak":"BEREGNING_TYPE","underÅrsak":"ENDRING_GRUNNLAG"}]',
    );
    expect(screen.getByRole('status')).toHaveTextContent('"dirtyFields":{"perioder":[{"årsak":true,"underÅrsak":true},{"årsak":true,"underÅrsak":true}]}');
  });
});
