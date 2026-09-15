import type { LogiskPeriodeMedFaktaDto } from '@k9-sak-web/backend/k9tilbake/kontrakt/feilutbetaling/BehandlingFeilutbetalingFaktaDto.js';
import type { HendelseTypeMedUndertyperDto } from '@k9-sak-web/backend/k9tilbake/kontrakt/feilutbetaling/HendelseTyperDto.js';
import { OrUndefined } from '@k9-sak-web/gui/kodeverk/oppslag/GeneriskKodeverkoppslag.js';
import { K9KodeverkoppslagContext } from '@k9-sak-web/gui/kodeverk/oppslag/K9KodeverkoppslagContext.js';
import { Box, Select, Table } from '@navikt/ds-react';
import { useContext } from 'react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import styles from './feilutbetalingFakta.module.css';
import type { FeilutbetalingFormValues } from './FeilutbetalingFaktaIndex.js';

interface FeilutbetalingPerioderRowProps {
  periode: LogiskPeriodeMedFaktaDto;
  index: number;
  årsaker: HendelseTypeMedUndertyperDto[];
  readOnly: boolean;
  behandlePerioderSamlet: boolean;
}

const formatDate = (dateStr?: string) => {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  return `${day}.${month}.${year}`;
};

const FeilutbetalingPerioderRow = ({
  periode,
  index,
  årsaker,
  readOnly,
  behandlePerioderSamlet,
}: FeilutbetalingPerioderRowProps) => {
  const { control, setValue, getValues } = useFormContext<FeilutbetalingFormValues>();
  const kodeverkoppslag = useContext(K9KodeverkoppslagContext);

  const valgtÅrsak = useWatch({ control, name: `perioder.${index}.årsak` });

  const hendelseUndertyper = årsaker.find(a => a.hendelseType === valgtÅrsak)?.hendelseUndertyper ?? [];

  const harUndertyper = hendelseUndertyper.length > 0;

  const hentHendelseTypeNavn = (kode?: string) => {
    if (!kode) return kode ?? '';
    return (
      kodeverkoppslag.k9tilbake.hendelseTyper(
        kode as Parameters<typeof kodeverkoppslag.k9tilbake.hendelseTyper>[0],
        OrUndefined,
      )?.navn ?? kode
    );
  };

  const hentHendelseUnderTypeNavn = (kode?: string) => {
    if (!kode) return kode ?? '';
    return (
      kodeverkoppslag.k9tilbake.hendelseUnderTyper(
        kode as Parameters<typeof kodeverkoppslag.k9tilbake.hendelseUnderTyper>[0],
        OrUndefined,
      )?.navn ?? kode
    );
  };

  const propagateÅrsak = (nyÅrsak: string) => {
    if (!behandlePerioderSamlet) return;
    const perioder = getValues('perioder');
    perioder.forEach((_, i) => {
      if (i !== index) {
        setValue(`perioder.${i}.årsak`, nyÅrsak, { shouldValidate: true });
        setValue(`perioder.${i}.underÅrsak`, '', { shouldValidate: false });
      }
    });
  };

  const propagateUnderÅrsak = (nyUnderÅrsak: string) => {
    if (!behandlePerioderSamlet) return;
    const perioder = getValues('perioder');
    perioder.forEach((p, i) => {
      if (i !== index && p.årsak === valgtÅrsak) {
        setValue(`perioder.${i}.underÅrsak`, nyUnderÅrsak, { shouldValidate: true });
      }
    });
  };

  return (
    <Table.Row shadeOnHover={false}>
      <Table.DataCell>{`${formatDate(periode.fom)} - ${formatDate(periode.tom)}`}</Table.DataCell>
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
