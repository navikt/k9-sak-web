import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import type { ung_kodeverk_vilkår_BostedsvilkårIkkeOppfyltÅrsak } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/BostedsvilkårIkkeOppfyltÅrsak.js';
import type { AksjonspunktDto } from '@k9-sak-web/backend/ungsak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import type { BekreftetAksjonspunktDto } from '@k9-sak-web/backend/ungsak/kontrakt/aksjonspunkt/BekreftetAksjonspunktDto.js';
import type { BehandlingDto } from '@k9-sak-web/backend/ungsak/kontrakt/behandling/BehandlingDto.js';
import type { BostedGrunnlagResponseDto } from '@k9-sak-web/backend/ungsak/kontrakt/vilkår/bosted/BostedGrunnlagResponseDto.js';
import type { VilkårMedPerioderDto } from '@k9-sak-web/backend/ungsak/kontrakt/vilkår/VilkårMedPerioderDto.js';
import { formatDate } from '@k9-sak-web/gui/utils/formatters.js';
import { PersonFillIcon } from '@navikt/aksel-icons';
import { BodyLong, BodyShort, Box, Button, HStack, Radio, Tag, VStack } from '@navikt/ds-react';
import { RhfDatepicker, RhfForm, RhfRadioGroup, RhfSelect, RhfTextarea } from '@navikt/ft-form-hooks';
import { required } from '@navikt/ft-form-validators';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  getPeriodStatus,
  VilkårSplittPanel,
  type VilkårSplittPanelPeriod,
} from '../../shared/vilkårSplittPanel/VilkårSplittPanel.js';
import type { AktivitetspengerApi } from '../aktivitetspenger-prosess/AktivitetspengerApi.js';
import { BostedsvilkårIkkeOppfyltÅrsak, opphørsårsakLabels } from '../aktivitetspenger-prosess/types.js';

interface FormData {
  perioder: Record<
    string,
    {
      årsak: string;
      begrunnelse: string;
      flyttetFraTrondheim: string;
      opphørsdato: string;
    }
  >;
}

const buildInitialValues = (vilkår: VilkårMedPerioderDto): FormData => ({
  perioder: Object.fromEntries(
    (vilkår.perioder ?? []).map(p => [
      p.periode.fom,
      {
        årsak: '',
        begrunnelse: '',
        flyttetFraTrondheim: '',
        opphørsdato: '',
      },
    ]),
  ),
});

interface Props {
  vurderBostedVilkårAp?: AksjonspunktDto;
  bostedVilkår: VilkårMedPerioderDto;
  api: AktivitetspengerApi;
  behandling: BehandlingDto;
  onAksjonspunktBekreftet: () => void;
  readOnly: boolean;
  isPermanentlyReadOnly: boolean;
  bostedGrunnlag: BostedGrunnlagResponseDto;
}

export const Vilkaarsvurdering = ({
  vurderBostedVilkårAp,
  bostedVilkår,
  api,
  behandling,
  onAksjonspunktBekreftet,
  readOnly,
  isPermanentlyReadOnly,
  bostedGrunnlag,
}: Props) => {
  const periods: VilkårSplittPanelPeriod[] = (bostedVilkår.perioder ?? []).map(p => ({
    id: p.periode.fom,
    status: getPeriodStatus(p.vilkarStatus, vurderBostedVilkårAp),
    label: `${formatDate(p.periode.fom)} - ${formatDate(p.periode.tom)}`,
    periode: p.periode,
  }));
  const formHook = useForm<FormData>({
    defaultValues: buildInitialValues(bostedVilkår),
  });
  const [selectedId, setSelectedId] = useState(periods[0]?.id ?? '');
  const selectedFakta = bostedGrunnlag.perioder.find(p => p.fom === selectedId);
  const { mutateAsync: bekreftAksjonspunktMutation, isPending } = useMutation({
    mutationFn: async (formData: FormData) => {
      const selectedFormPeriod = formData.perioder[selectedId];
      if (!selectedFormPeriod) {
        throw new Error('Kunne ikke finne valgt periode for opphør');
      }
      const selectedPeriod = periods.find(p => p.id === selectedId);
      const payload: BekreftetAksjonspunktDto = {
        '@type': AksjonspunktDefinisjon.VURDER_BOSTEDVILKÅR,
        begrunnelse: selectedFormPeriod.begrunnelse,
        vurdertePerioder: [
          {
            avslagsårsak: selectedFormPeriod.årsak as ung_kodeverk_vilkår_BostedsvilkårIkkeOppfyltÅrsak,
            begrunnelse: selectedFormPeriod.begrunnelse,
            erVilkårOppfylt: selectedFormPeriod.flyttetFraTrondheim === 'nei',
            periode: {
              fom: selectedFormPeriod.opphørsdato || selectedPeriod?.periode?.fom || '',
              tom: selectedFormPeriod.opphørsdato ? null : (selectedPeriod?.periode?.tom ?? ''),
            },
          },
        ],
      };
      await api.bekreftAksjonspunkt(behandling.uuid, behandling.versjon, [payload]);
    },
    onSuccess: () => {
      onAksjonspunktBekreftet();
    },
  });

  const flyttetFraTrondheim = formHook.watch(`perioder.${selectedId}.flyttetFraTrondheim`);

  return (
    <VStack gap="space-20">
      <VilkårSplittPanel
        periods={periods}
        selectedItemId={selectedId}
        onItemSelect={setSelectedId}
        detailHeading="Vurdering av ikke lenger bosatt i Trondheim"
        periodListLabel="Alle perioder"
        lovreferanse={bostedVilkår.lovReferanse}
        // defaultIsLocked={isVarselApSolved}
        readOnly={readOnly}
        isPermanentlyReadOnly={isPermanentlyReadOnly}
        // lockedContent={isVarselApSolved ? <VurdertAv ident={vurderBostedAp?.ansvarligSaksbehandler} /> : undefined}
      >
        {(isFormLocked: boolean, setIsFormLocked: React.Dispatch<React.SetStateAction<boolean>>) => (
          <>
            <RhfForm
              formMethods={formHook}
              onSubmit={async data => {
                await bekreftAksjonspunktMutation(data);
                setIsFormLocked(true);
              }}
            >
              <VStack gap="space-24" maxWidth="70ch" width="100%">
                {selectedFakta?.harUttalelse && (
                  <Box borderRadius="8" padding={'space-16'} background={'info-softA'}>
                    <VStack gap="space-20">
                      <VStack gap="space-8">
                        <HStack justify="space-between">
                          <BodyShort size="small" weight="semibold">
                            Stemmer opplysningene om opphør?
                          </BodyShort>
                          <Tag variant="outline" data-color="info" size="small">
                            Fra bruker
                          </Tag>
                        </HStack>
                        <BodyShort size="small">Nei</BodyShort>
                      </VStack>
                      <HStack gap="space-4">
                        <PersonFillIcon title="Bruker" fontSize="1.5rem" />
                        <VStack gap="space-6" marginBlock="space-2 space-0">
                          <BodyShort size="small" weight="semibold">
                            Tilbakemelding fra bruker om opphør xx.xx.xxxx
                          </BodyShort>
                          <BodyLong size="small">{selectedFakta.uttalelseTekst}</BodyLong>
                        </VStack>
                      </HStack>
                    </VStack>
                  </Box>
                )}
                <RhfSelect
                  control={formHook.control}
                  name={`perioder.${selectedId}.årsak`}
                  label="Opphørsårsak"
                  readOnly={isFormLocked}
                  validate={[required]}
                  selectValues={Object.values(BostedsvilkårIkkeOppfyltÅrsak)
                    .filter(årsak => årsak !== '-')
                    .map(årsak => (
                      <option key={årsak} value={årsak}>
                        {opphørsårsakLabels[årsak]}
                      </option>
                    ))}
                />
                <RhfTextarea
                  control={formHook.control}
                  name={`perioder.${selectedId}.begrunnelse`}
                  label="Vurder om bruker har flyttet fra Trondheim kommune, jmf"
                  readOnly={isFormLocked}
                  validate={[required]}
                  resize
                />
                <RhfRadioGroup
                  control={formHook.control}
                  legend="Har bruker flyttet fra Trondheim kommune?"
                  name={`perioder.${selectedId}.flyttetFraTrondheim`}
                  validate={[required]}
                  readOnly={isFormLocked}
                >
                  <Radio value="ja">Ja, fra og med 30.03.2027</Radio>
                  <Radio value="jaMedAnnenDato">Ja, fra en annen dato</Radio>
                  <Radio value="nei">Nei, bruker bor fortsatt i Trondheim</Radio>
                </RhfRadioGroup>
                {flyttetFraTrondheim === 'jaMedAnnenDato' && (
                  <RhfDatepicker
                    control={formHook.control}
                    name={`perioder.${selectedId}.opphørsdato`}
                    label="Dato for opphør"
                    readOnly={isFormLocked}
                    validate={[required]}
                  />
                )}
                {!isFormLocked && (
                  <HStack gap="space-24">
                    <Button type="submit" size="small" loading={isPending}>
                      Send til beslutter
                    </Button>
                  </HStack>
                )}
              </VStack>
            </RhfForm>
          </>
        )}
      </VilkårSplittPanel>
    </VStack>
  );
};
