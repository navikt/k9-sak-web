import type { VilkårMedPerioderDto } from '@k9-sak-web/backend/ungsak/kontrakt/vilkår/VilkårMedPerioderDto.js';
import { HStack, Radio } from '@navikt/ds-react';
import { RhfRadioGroup } from '@navikt/ft-form-hooks';
import { dateAfterOrEqual, required } from '@navikt/ft-form-validators';
import type { Control, FieldValues } from 'react-hook-form';
import Datovelger from '../../../shared/datovelger/Datovelger.js';

const dagensDato = new Date();

export const getDateRangeFromVilkår = (
  perioder: VilkårMedPerioderDto['perioder'],
): { fromDate: Date; toDate: Date } | undefined => {
  if (!perioder?.length) return undefined;
  const foms = perioder.map(p => p.periode.fom).sort();
  const toms = perioder
    .map(p => p.periode.tom)
    .filter(Boolean)
    .sort();
  const førsteFom = foms[0];
  const sisteTom = toms[toms.length - 1];
  if (!førsteFom || !sisteTom) return undefined;
  return { fromDate: new Date(førsteFom), toDate: new Date(sisteTom) };
};

interface Props<TForm extends FieldValues> {
  control: Control<TForm>;
  selectedId: string;
  isFormLocked: boolean;
  opphøreEllerAvslå: string;
  avslagFom: string;
  dateRange: { fromDate: Date; toDate: Date } | undefined;
}

export const OpphørAvslagValg = <TForm extends FieldValues>({
  control,
  selectedId,
  isFormLocked,
  opphøreEllerAvslå,
  avslagFom,
  dateRange,
}: Props<TForm>) => {
  return (
    <>
      <RhfRadioGroup
        key={`${selectedId}-opphørsdato`}
        control={control}
        name={`perioder.${selectedId}.opphøreEllerAvslå` as never}
        legend="Hva skal du gjøre?"
        validate={[required]}
        readOnly={isFormLocked}
      >
        <Radio value="opphøre">Opphøre fra en dato</Radio>
        <Radio value="avslå">Avslå en innvilget periode</Radio>
      </RhfRadioGroup>
      {opphøreEllerAvslå === 'opphøre' && (
        <Datovelger
          name={`perioder.${selectedId}.opphørsdato` as never}
          label="Opphøre fra og med"
          readOnly={isFormLocked}
          validate={[required]}
          defaultMonth={dagensDato}
          fromDate={dateRange?.fromDate}
          toDate={dateRange?.toDate}
          disableWeekends
        />
      )}
      {opphøreEllerAvslå === 'avslå' && (
        <HStack gap="space-8">
          <Datovelger
            name={`perioder.${selectedId}.avslagFom` as never}
            label="Fra og med"
            readOnly={isFormLocked}
            validate={[required]}
            fromDate={dateRange?.fromDate}
            toDate={dateRange?.toDate}
            defaultMonth={dagensDato}
            disableWeekends
          />
          <Datovelger
            name={`perioder.${selectedId}.avslagTom` as never}
            label="Til og med"
            readOnly={isFormLocked}
            validate={[required, dateAfterOrEqual(avslagFom)]}
            fromDate={dateRange?.fromDate}
            toDate={dateRange?.toDate}
            defaultMonth={dagensDato}
            disableWeekends
          />
        </HStack>
      )}
    </>
  );
};
