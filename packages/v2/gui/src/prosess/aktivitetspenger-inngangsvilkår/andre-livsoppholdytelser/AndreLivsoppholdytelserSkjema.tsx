import { AndreLivsoppholdsytelserIkkeOppfyltÅrsak } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/AndreLivsoppholdsytelserIkkeOppfyltÅrsak.js';
import {
  $VilkårLivsoppholdsytelserPeriodeVurderingDto,
  $VurderAndreLivsoppholdsytelserDto,
} from '@k9-sak-web/backend/ungsak/kontrakt/vilkår/livsopphold/VilkårLivsoppholdsytelserPeriodeVurderingDto.js';
import Datovelger from '@k9-sak-web/gui/shared/datovelger/Datovelger.js';
import { Button, HStack, Label, Radio, VStack } from '@navikt/ds-react';
import { RhfCheckbox, RhfForm, RhfRadioGroup, RhfSelect, RhfTextarea } from '@navikt/ft-form-hooks';
import { maxLength, minLength, required } from '@navikt/ft-form-validators';
import type { ReactNode } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { dateBefore } from '../../../utils/validation/validators.js';
import type { AndreLivsoppholdytelserFormData } from './andreLivsoppholdytelserFormData.js';

const begrunnelseMaxLength = $VurderAndreLivsoppholdsytelserDto.properties.begrunnelse.maxLength;
const periodeBegrunnelseMaxLength = $VilkårLivsoppholdsytelserPeriodeVurderingDto.properties.begrunnelse.maxLength;
const fritekstVurderingBrevMaxLength =
  $VilkårLivsoppholdsytelserPeriodeVurderingDto.properties.fritekstVurderingBrev.maxLength;

interface Props {
  formHook: UseFormReturn<AndreLivsoppholdytelserFormData>;
  selectedId: string;
  begrunnelseLabel: ReactNode;
  isPending: boolean;
  visAvbryt: boolean;
  onSubmit: (data: AndreLivsoppholdytelserFormData) => Promise<void>;
  onAvbryt: () => void;
}

export const AndreLivsoppholdytelserSkjema = ({
  formHook,
  selectedId,
  begrunnelseLabel,
  isPending,
  visAvbryt,
  onSubmit,
  onAvbryt,
}: Props) => {
  const andreLivsoppholdytelser = formHook.watch(`vurderinger.${selectedId}.andreLivsoppholdytelser`);
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
          validate={[required, minLength(3), maxLength(begrunnelseMaxLength)]}
          maxLength={begrunnelseMaxLength}
        />
        <RhfRadioGroup
          key={`${selectedId}-andreLivsoppholdytelser`}
          control={formHook.control}
          name={`vurderinger.${selectedId}.andreLivsoppholdytelser`}
          legend="Er søker uten andre livsoppholdsytelser?"
          validate={[required]}
        >
          <Radio value="oppfylt">Ja</Radio>
          <Radio value="ikkeOppfylt">Nei</Radio>
        </RhfRadioGroup>
        {andreLivsoppholdytelser === 'ikkeOppfylt' && (
          <RhfSelect
            key={`${selectedId}-avslagsårsak`}
            control={formHook.control}
            name={`vurderinger.${selectedId}.avslagsårsak`}
            label="Hvilken ytelse mottar bruker?"
            validate={[required]}
            selectValues={[
              <option value={AndreLivsoppholdsytelserIkkeOppfyltÅrsak.MOTTAR_ARBEIDSAVKLARINGSPENGER}>
                Arbeidsavklaringspenger (AAP)
              </option>,
              <option value={AndreLivsoppholdsytelserIkkeOppfyltÅrsak.MOTTAR_TILTAKSPENGER}>Tiltakspenger</option>,
              <option value={AndreLivsoppholdsytelserIkkeOppfyltÅrsak.MOTTAR_KVALIFISERINGSSTØNAD}>
                Kvalifiseringsstønad (KVP)
              </option>,
              <option value={AndreLivsoppholdsytelserIkkeOppfyltÅrsak.MOTTAR_DAGPENGER}>Dagpenger</option>,
              <option value={AndreLivsoppholdsytelserIkkeOppfyltÅrsak.MOTTAR_FORELDREPENGER}>Foreldrepenger</option>,
              <option value={AndreLivsoppholdsytelserIkkeOppfyltÅrsak.MOTTAR_SVANGERSKAPSPENGER}>
                Svangerskapspenger
              </option>,
              <option value={AndreLivsoppholdsytelserIkkeOppfyltÅrsak.MOTTAR_UFØRETRYGD}>Uføretrygd</option>,
              <option value={AndreLivsoppholdsytelserIkkeOppfyltÅrsak.MOTTAR_INTRODUKSJONSSTØNAD}>
                Introduksjonsstønad
              </option>,
              <option value={AndreLivsoppholdsytelserIkkeOppfyltÅrsak.MOTTAR_BARNEPENSJON}>Barnepensjon</option>,
              <option value={AndreLivsoppholdsytelserIkkeOppfyltÅrsak.MOTTAR_ANNEN_YTELSE}>Annen ytelse</option>,
            ]}
          />
        )}

        {avslagsårsak === AndreLivsoppholdsytelserIkkeOppfyltÅrsak.MOTTAR_ANNEN_YTELSE && (
          <RhfTextarea
            key={`${selectedId}-fritekst`}
            control={formHook.control}
            name={`vurderinger.${selectedId}.fritekst`}
            label="Fritekst avslagsbrev"
            description="Beskriv hvorfor vilkåret er avslått. Teksten vises i vedtaksbrevet til søker."
            validate={[required, minLength(3), maxLength(fritekstVurderingBrevMaxLength)]}
            maxLength={fritekstVurderingBrevMaxLength}
          />
        )}
        {andreLivsoppholdytelser === 'oppfylt' && (
          <VStack gap="space-16">
            <VStack gap="space-8">
              <Label size="small" as="p">
                Uten andre livsoppholdsytelser:
              </Label>
              <HStack gap="space-20" align="end">
                <Datovelger
                  key={`${selectedId}-fra`}
                  name={`vurderinger.${selectedId}.fom`}
                  label="Fra"
                  size="small"
                  readOnly
                  disableWeekends
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
                      redigerMaksdato && muligAvkortingPeriode
                        ? dateBefore(
                            muligAvkortingPeriode.tom,
                            'Velg en tidligere dato, eller fjern avhukingen hvis du vil bruke senest mulig "til og med" dato.',
                          )(value)
                        : undefined,
                  ]}
                  fromDate={muligAvkortingPeriode ? new Date(muligAvkortingPeriode.fom) : undefined}
                  toDate={muligAvkortingPeriode ? new Date(muligAvkortingPeriode.tom) : undefined}
                  disableWeekends
                />
                {muligAvkortingPeriode && (
                  <RhfCheckbox
                    control={formHook.control}
                    name={`vurderinger.${selectedId}.redigerMaksdato`}
                    label="Rediger til og med"
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
                validate={[required, minLength(3), maxLength(periodeBegrunnelseMaxLength)]}
                maxLength={periodeBegrunnelseMaxLength}
              />
            )}
          </VStack>
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
