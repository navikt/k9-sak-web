import Datovelger from '@k9-sak-web/gui/shared/datovelger/Datovelger.js';
import { Button, HStack, Label, Radio, VStack } from '@navikt/ds-react';
import { RhfCheckbox, RhfForm, RhfRadioGroup, RhfTextarea } from '@navikt/ft-form-hooks';
import { maxLength, minLength, required } from '@navikt/ft-form-validators';
import type { ReactNode } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import type { AktivitetFormData } from './aktivitetFormData.js';

interface Props {
  formHook: UseFormReturn<AktivitetFormData>;
  selectedId: string;
  begrunnelseLabel: ReactNode;
  isPending: boolean;
  visAvbryt: boolean;
  onSubmit: (data: AktivitetFormData) => Promise<void>;
  onAvbryt: () => void;
}

export const AktivitetSkjema = ({
  formHook,
  selectedId,
  begrunnelseLabel,
  isPending,
  visAvbryt,
  onSubmit,
  onAvbryt,
}: Props) => {
  const erSøkerIAktivitet = formHook.watch(`vurderinger.${selectedId}.erSøkerIAktivitet`);
  const redigerTomDato = formHook.watch(`vurderinger.${selectedId}.redigerTomDato`);
  const muligAvkortingPeriode = formHook.watch(`vurderinger.${selectedId}.muligAvkortingPeriode`);

  return (
    <RhfForm formMethods={formHook} onSubmit={onSubmit}>
      <VStack gap="space-24" maxWidth="70ch" width="100%">
        <RhfTextarea
          control={formHook.control}
          name={`vurderinger.${selectedId}.begrunnelse`}
          label={begrunnelseLabel}
          validate={[required, minLength(3), maxLength(4000)]}
        />
        <RhfRadioGroup
          key={`${selectedId}-erSøkerIAktivitet`}
          control={formHook.control}
          name={`vurderinger.${selectedId}.erSøkerIAktivitet`}
          legend="Er søker i aktivitet?"
          validate={[required]}
        >
          <Radio value="oppfylt">Ja</Radio>
          <Radio value="ikkeOppfylt">Nei</Radio>
        </RhfRadioGroup>
        {erSøkerIAktivitet === 'oppfylt' && (
          <VStack gap="space-16">
            <VStack gap="space-8">
              <Label size="small" as="p">
                I aktivitet:
              </Label>
              <HStack gap="space-20" align="end">
                <Datovelger
                  key={`${selectedId}-fra`}
                  name={`vurderinger.${selectedId}.fom`}
                  label="Fra og med"
                  size="small"
                  readOnly
                />
                <Datovelger
                  key={`${selectedId}-tom`}
                  name={`vurderinger.${selectedId}.tom`}
                  label="Til og med"
                  size="small"
                  readOnly={!redigerTomDato}
                  validate={[
                    required,
                    value =>
                      redigerTomDato && value === muligAvkortingPeriode?.tom
                        ? 'Velg en tidligere dato, eller fjern avhukingen hvis du vil bruke senest mulig til og med-dato.'
                        : undefined,
                  ]}
                  fromDate={muligAvkortingPeriode ? new Date(muligAvkortingPeriode.fom) : undefined}
                  toDate={muligAvkortingPeriode ? new Date(muligAvkortingPeriode.tom) : undefined}
                />
                {muligAvkortingPeriode && (
                  <RhfCheckbox
                    control={formHook.control}
                    name={`vurderinger.${selectedId}.redigerTomDato`}
                    label="Rediger til og med dato"
                  />
                )}
              </HStack>
            </VStack>
            {redigerTomDato && (
              <RhfTextarea
                key={`${selectedId}-begrunnelseKortereMaksdato`}
                control={formHook.control}
                name={`vurderinger.${selectedId}.begrunnelseKortereMaksdato`}
                label="Begrunn kortere periode enn 260 dager"
                validate={[required]}
              />
            )}
          </VStack>
        )}
        {erSøkerIAktivitet === 'ikkeOppfylt' && (
          <RhfTextarea
            key={`${selectedId}-fritekst`}
            control={formHook.control}
            name={`vurderinger.${selectedId}.fritekst`}
            label="Fritekst avslagsbrev"
            description="Beskriv hvorfor vilkåret er avslått. Teksten vises i vedtaksbrevet til søker."
            validate={[required, minLength(3), maxLength(4000)]}
          />
        )}
        <HStack gap="space-8">
          <Button type="submit" size="small" loading={isPending}>
            Bekreft og fortsett
          </Button>
          {visAvbryt && (
            <Button size="small" variant="tertiary" type="button" onClick={onAvbryt}>
              Avbryt
            </Button>
          )}
        </HStack>
      </VStack>
    </RhfForm>
  );
};
