import { BistandsvilkårIkkeOppfyltÅrsak } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/BistandsvilkårIkkeOppfyltÅrsak.js';
import Datovelger from '@k9-sak-web/gui/shared/datovelger/Datovelger.js';
import { Button, HStack, Label, Radio, VStack } from '@navikt/ds-react';
import { RhfCheckbox, RhfForm, RhfRadioGroup, RhfTextarea } from '@navikt/ft-form-hooks';
import { maxLength, minLength, required } from '@navikt/ft-form-validators';
import type { ReactNode } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import type { BehovForBistandFormData } from './behovForBistandFormData.js';

interface Props {
  formHook: UseFormReturn<BehovForBistandFormData>;
  selectedId: string;
  begrunnelseLabel: ReactNode;
  isPending: boolean;
  visAvbryt: boolean;
  onSubmit: (data: BehovForBistandFormData) => Promise<void>;
  onAvbryt: () => void;
}

export const BehovForBistandSkjema = ({
  formHook,
  selectedId,
  begrunnelseLabel,
  isPending,
  visAvbryt,
  onSubmit,
  onAvbryt,
}: Props) => {
  const behovForBistand = formHook.watch(`vurderinger.${selectedId}.behovForBistand`);
  const avslagsårsak = formHook.watch(`vurderinger.${selectedId}.avslagsårsak`);
  const redigerMaksdato = formHook.watch(`vurderinger.${selectedId}.redigerMaksdato`);
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
          key={`${selectedId}-behovForBistand`}
          control={formHook.control}
          name={`vurderinger.${selectedId}.behovForBistand`}
          legend="Har søker behov for bistand?"
          validate={[required]}
        >
          <Radio value="oppfylt">Ja</Radio>
          <Radio value="ikkeOppfylt">Nei</Radio>
        </RhfRadioGroup>
        {behovForBistand === 'oppfylt' && (
          <VStack gap="space-16">
            <VStack gap="space-8">
              <Label size="small" as="p">
                Behov for bistand:
              </Label>
              <HStack gap="space-20" align="end">
                <Datovelger
                  key={`${selectedId}-fra`}
                  name={`vurderinger.${selectedId}.fom`}
                  label="Fra"
                  size="small"
                  readOnly
                />
                <Datovelger
                  key={`${selectedId}-maksdato`}
                  name={`vurderinger.${selectedId}.tom`}
                  label="Til og med"
                  size="small"
                  readOnly={!redigerMaksdato}
                  validate={[
                    required,
                    value =>
                      redigerMaksdato && value === muligAvkortingPeriode?.tom
                        ? 'Velg en tidligere dato, eller fjern avhukingen hvis du vil bruke senest mulig maksdato.'
                        : undefined,
                  ]}
                  fromDate={muligAvkortingPeriode ? new Date(muligAvkortingPeriode.fom) : undefined}
                  toDate={muligAvkortingPeriode ? new Date(muligAvkortingPeriode.tom) : undefined}
                />
                {muligAvkortingPeriode && (
                  <RhfCheckbox
                    control={formHook.control}
                    name={`vurderinger.${selectedId}.redigerMaksdato`}
                    label="Rediger maksdato"
                  />
                )}
              </HStack>
            </VStack>
            {redigerMaksdato && (
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
        {behovForBistand === 'ikkeOppfylt' && (
          <RhfRadioGroup
            key={`${selectedId}-avslagsårsak`}
            control={formHook.control}
            name={`vurderinger.${selectedId}.avslagsårsak`}
            legend="Avslagsårsak"
            validate={[required]}
          >
            <Radio value={BistandsvilkårIkkeOppfyltÅrsak.IKKE_14A_VEDTAK}>
              Søker har ikke oppfølgingsvedtak etter Nav-loven §14a.
            </Radio>
            <Radio value="fritekst">Fritekst</Radio>
          </RhfRadioGroup>
        )}
        {behovForBistand === 'ikkeOppfylt' && avslagsårsak === 'fritekst' && (
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
