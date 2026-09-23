import { Box, Select, Table } from '@navikt/ds-react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import type {
  FeilutbetalingPeriodeViewModel,
  FeilutbetalingÅrsakerPerYtelseViewModel,
} from './api/FeilutbetalingFaktaViewModel.js';
import styles from './feilutbetalingFakta.module.css';
import type { FeilutbetalingFormValues } from './FeilutbetalingFaktaIndex.js';
import { formatDateStringToDDMMYYYY } from '../../utils/dateutils.js';

interface FeilutbetalingPerioderRowProps {
  periode: FeilutbetalingPeriodeViewModel;
  index: number;
  årsaker: NonNullable<FeilutbetalingÅrsakerPerYtelseViewModel['hendelseTyper']>;
  readOnly: boolean;
  behandlePerioderSamlet: boolean;
  hentHendelseTypeNavn: (kode?: string) => string;
  hentHendelseUnderTypeNavn: (kode?: string) => string;
}

const FeilutbetalingPerioderRow = ({
  periode,
  index,
  årsaker,
  readOnly,
  behandlePerioderSamlet,
  hentHendelseTypeNavn,
  hentHendelseUnderTypeNavn,
}: FeilutbetalingPerioderRowProps) => {
  const { control, setValue, getValues } = useFormContext<FeilutbetalingFormValues>();

  const valgtÅrsak = useWatch({ control, name: `perioder.${index}.årsak` });

  const hendelseUndertyper = årsaker.find(a => a.hendelseType === valgtÅrsak)?.hendelseUndertyper ?? [];

  const harUndertyper = hendelseUndertyper.length > 0;

  const propagateÅrsak = (nyÅrsak: string) => {
    if (!behandlePerioderSamlet) return;
    const perioder = getValues('perioder');
    perioder.forEach((_, i) => {
      if (i !== index) {
        setValue(`perioder.${i}.årsak`, nyÅrsak, { shouldDirty: true, shouldValidate: true });
        setValue(`perioder.${i}.underÅrsak`, '', { shouldDirty: true, shouldValidate: false });
      }
    });
  };

  const propagateUnderÅrsak = (nyUnderÅrsak: string) => {
    if (!behandlePerioderSamlet) return;
    const perioder = getValues('perioder');
    perioder.forEach((p, i) => {
      if (i !== index && p.årsak === valgtÅrsak) {
        setValue(`perioder.${i}.underÅrsak`, nyUnderÅrsak, { shouldDirty: true, shouldValidate: true });
      }
    });
  };

  return (
    <Table.Row shadeOnHover={false}>
      <Table.DataCell>
        {`${formatDateStringToDDMMYYYY(periode.fom ?? '')} - ${formatDateStringToDDMMYYYY(periode.tom ?? '')}`}
      </Table.DataCell>
      <Table.DataCell>
        <Controller
          control={control}
          name={`perioder.${index}.årsak`}
          rules={{ required: 'Feltet må fylles ut' }}
          render={({ field, fieldState }) => (
            <Select
              label="Hendelse"
              hideLabel
              size="small"
              {...field}
              onChange={e => {
                field.onChange(e);
                setValue(`perioder.${index}.underÅrsak`, '');
                propagateÅrsak(e.target.value);
              }}
              error={fieldState.error?.message}
              disabled={readOnly}
            >
              <option value="">Velg</option>
              {årsaker.map(a => (
                <option key={a.hendelseType} value={a.hendelseType ?? ''}>
                  {hentHendelseTypeNavn(a.hendelseType)}
                </option>
              ))}
            </Select>
          )}
        />
        {harUndertyper && (
          <Box marginBlock="space-2 space-0">
            <Controller
              control={control}
              name={`perioder.${index}.underÅrsak`}
              rules={{ required: 'Feltet må fylles ut' }}
              render={({ field, fieldState }) => (
                <Select
                  label="Underårsak"
                  hideLabel
                  size="small"
                  {...field}
                  onChange={e => {
                    field.onChange(e);
                    propagateUnderÅrsak(e.target.value);
                  }}
                  error={fieldState.error?.message}
                  disabled={readOnly}
                >
                  <option value="">Velg</option>
                  {hendelseUndertyper.map(u => (
                    <option key={u} value={u ?? ''}>
                      {hentHendelseUnderTypeNavn(u)}
                    </option>
                  ))}
                </Select>
              )}
            />
          </Box>
        )}
      </Table.DataCell>
      <Table.DataCell className={styles['redText']}>{periode.belop}</Table.DataCell>
    </Table.Row>
  );
};

export default FeilutbetalingPerioderRow;
