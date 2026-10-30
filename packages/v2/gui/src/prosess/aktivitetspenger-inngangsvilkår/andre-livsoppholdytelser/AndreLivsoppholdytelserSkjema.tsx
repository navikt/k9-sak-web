import { AndreLivsoppholdsytelserIkkeOppfyltÅrsak } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/AndreLivsoppholdsytelserIkkeOppfyltÅrsak.js';
import {
  $VilkårLivsoppholdsytelserPeriodeVurderingDto,
  $VurderAndreLivsoppholdsytelserDto,
} from '@k9-sak-web/backend/ungsak/kontrakt/vilkår/livsopphold/VilkårLivsoppholdsytelserPeriodeVurderingDto.js';
import Datovelger from '@k9-sak-web/gui/shared/datovelger/Datovelger.js';
import { BodyLong, BodyShort, Button, HStack, Label, Link, List, Radio, ReadMore, VStack } from '@navikt/ds-react';
import { RhfCheckbox, RhfForm, RhfRadioGroup, RhfSelect, RhfTextarea, RhfTextField } from '@navikt/ft-form-hooks';
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
  const redigerMaksdato = formHook.watch(`vurderinger.${selectedId}.redigerMaksdato`);
  const muligAvkortingPeriode = formHook.watch(`vurderinger.${selectedId}.muligAvkortingPeriode`);
  const harFritekstbrev = formHook.watch(`vurderinger.${selectedId}.harFritekstbrev`);
  const avslagsårsak = formHook.watch(`vurderinger.${selectedId}.avslagsårsak`);

  return (
    <RhfForm formMethods={formHook} onSubmit={onSubmit}>
      <VStack gap="space-24" maxWidth="70ch" width="100%">
        <RhfTextarea
          control={formHook.control}
          name={`vurderinger.${selectedId}.begrunnelse`}
          label={begrunnelseLabel}
          validate={[required, minLength(3), maxLength(begrunnelseMaxLength)]}
          maxLength={begrunnelseMaxLength}
          description={
            <ReadMore size="small" header="Hvilke ytelser kan bruker motta samtidig som aktivitetspenger?">
              <VStack gap="space-20">
                <BodyLong size="small">
                  Aktivitetspenger kan som hovedregel ikke mottas samtidig med andre ytelser som skal sikre inntekt til
                  livsopphold. Det gjelder alle livsoppholdsytelser, både i og utenfor Nav.
                </BodyLong>
                <VStack gap="space-8">
                  <BodyShort size="small">
                    Det finnes noen unntak. Bruker kan motta aktivitetspenger samtidig med:
                  </BodyShort>
                  <List size="small">
                    <List.Item>
                      økonomisk stønad (
                      <Link href="https://lovdata.no/pro/#document/NL/lov/2009-12-18-131/%C2%A718" target="_blank">
                        sosialtjenesteloven § 18
                      </Link>{' '}
                      og{' '}
                      <Link href="https://lovdata.no/pro/#document/NL/lov/2009-12-18-131/%C2%A719" target="_blank">
                        § 19
                      </Link>
                      )
                    </List.Item>
                    <List.Item>
                      stønad ved barns eller andre nærståendes sykdom (
                      <Link href="https://lovdata.no/pro/#document/NL/lov/1997-02-28-19/kap9" target="_blank">
                        folketrygdloven kapittel 9
                      </Link>
                      )
                    </List.Item>
                    <List.Item>
                      lån og stipend til utdanning (
                      <Link href="https://lovdata.no/pro/#document/SF/forskrift/2020-04-15-798" target="_blank">
                        forskrift om utdanningsstøtte
                      </Link>
                      )
                    </List.Item>
                  </List>
                </VStack>
                <BodyLong size="small">
                  Et medlem som allerede mottar sykepenger på tidspunktet hen setter fram krav om aktivitetspenger, skal
                  først benytte retten til sykepenger fullt ut.
                </BodyLong>
                <BodyLong size="small">
                  Mottak av stønad ved barns og andre nærståendes sykdom vil føre til reduksjon av aktivitetspenger, se
                  §&nbsp;14. Det samme vil skje hvis en person har tjent opp rett til sykepenger etter oppstart med
                  aktivitetspenger.
                </BodyLong>
              </VStack>
            </ReadMore>
          }
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

        {andreLivsoppholdytelser === 'ikkeOppfylt' &&
          avslagsårsak === AndreLivsoppholdsytelserIkkeOppfyltÅrsak.MOTTAR_ANNEN_YTELSE && (
            <RhfTextField
              key={`${selectedId}-annen-ytelse`}
              control={formHook.control}
              name={`vurderinger.${selectedId}.ytelseNavn`}
              label="Skriv inn hvilken ytelse"
              validate={[required, minLength(3), maxLength(fritekstVurderingBrevMaxLength)]}
              maxLength={fritekstVurderingBrevMaxLength}
            />
          )}

        {andreLivsoppholdytelser === 'ikkeOppfylt' && (
          <RhfCheckbox
            control={formHook.control}
            name={`vurderinger.${selectedId}.harFritekstbrev`}
            label="Legg til fritekstbeskrivelse i avslagsbrev"
          />
        )}

        {andreLivsoppholdytelser === 'ikkeOppfylt' && harFritekstbrev && (
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
