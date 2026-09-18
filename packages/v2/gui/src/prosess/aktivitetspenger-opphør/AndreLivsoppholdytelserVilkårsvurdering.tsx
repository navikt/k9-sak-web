import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { AksjonspunktStatus } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktStatus.js';
import { AndreLivsoppholdsytelserIkkeOppfyltÅrsak } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/AndreLivsoppholdsytelserIkkeOppfyltÅrsak.js';
import { Utfall } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/Utfall.js';
import type { AksjonspunktDto } from '@k9-sak-web/backend/ungsak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import type { BehandlingDto } from '@k9-sak-web/backend/ungsak/kontrakt/behandling/BehandlingDto.js';
import type { VilkårMedPerioderDto } from '@k9-sak-web/backend/ungsak/kontrakt/vilkår/VilkårMedPerioderDto.js';
import { formatDate } from '@k9-sak-web/gui/utils/formatters.js';
import { Alert, Box, Button, HStack, Radio, VStack } from '@navikt/ds-react';
import { RhfForm, RhfRadioGroup, RhfTextarea } from '@navikt/ft-form-hooks';
import { maxLength, minLength, required } from '@navikt/ft-form-validators';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import {
  getPeriodStatus,
  VilkårSplittPanel,
  type VilkårSplittPanelPeriod,
} from '../../shared/vilkårSplittPanel/VilkårSplittPanel.js';
import { VurdertAv } from '../../shared/vurdert-av/VurdertAv.js';
import { sendTilBeslutter } from '../aktivitetspenger-felles/utils/sendTilBeslutter.js';
import { aksjonspunktErÅpent } from '../aktivitetspenger-felles/utils/utils.js';
import type { AktivitetspengerApi } from '../aktivitetspenger-prosess/AktivitetspengerApi.js';

interface PeriodForm {
  begrunnelse: string;
  andreLivsoppholdytelser: 'ja' | 'nei' | '';
  avslagsårsak: AndreLivsoppholdsytelserIkkeOppfyltÅrsak | 'fritekst' | '';
  fritekst: string;
}

interface FormData {
  perioder: Record<string, PeriodForm>;
}

interface Props {
  vurderAndreLivsoppholdytelserFaktaAP?: AksjonspunktDto;
  lokalkontorForeslårVilkårAP?: AksjonspunktDto;
  andreLivsoppholdytelserVilkår: VilkårMedPerioderDto;
  api: AktivitetspengerApi;
  behandling: BehandlingDto;
  onAksjonspunktBekreftet: () => void;
  readOnly: boolean;
  isPermanentlyReadOnly: boolean;
}

const buildInitialValues = (vilkår: VilkårMedPerioderDto): FormData => ({
  perioder: Object.fromEntries(
    (vilkår.perioder ?? []).map(period => [
      period.periode.fom,
      {
        begrunnelse: period.begrunnelse ?? '',
        andreLivsoppholdytelser:
          period.vilkarStatus === Utfall.OPPFYLT ? 'ja' : period.vilkarStatus === Utfall.IKKE_OPPFYLT ? 'nei' : '',
        avslagsårsak: '',
        fritekst: period.fritekstVurderingBrev ?? '',
      },
    ]),
  ),
});

const buildPeriods = (vilkår: VilkårMedPerioderDto): VilkårSplittPanelPeriod[] =>
  (vilkår.perioder ?? [])
    .toSorted((firstPeriod, secondPeriod) => secondPeriod.periode.fom.localeCompare(firstPeriod.periode.fom))
    .map(period => ({
      id: period.periode.fom,
      status: getPeriodStatus(period.vilkarStatus),
      label: period.periode.tom
        ? `${formatDate(period.periode.fom)} - ${formatDate(period.periode.tom)}`
        : formatDate(period.periode.fom),
      periode: period.periode.tom ? { fom: period.periode.fom, tom: period.periode.tom } : undefined,
    }));

const buildPayload = ({ formData, selectedId }: { formData: FormData; selectedId: string }) => {
  const selectedPeriod = formData.perioder[selectedId];
  if (!selectedPeriod) {
    throw new Error('Kunne ikke finne valgt periode for andre livsoppholdsytelser');
  }

  const erVilkårOppfylt = selectedPeriod.andreLivsoppholdytelser === 'ja';
  return {
    '@type': AksjonspunktDefinisjon.VURDER_ANDRE_LIVSOPPHOLDSYTELSER_OPPHØR,
    begrunnelse: selectedPeriod.begrunnelse,
    vurdertePerioder: [
      {
        avslagsårsak: erVilkårOppfylt
          ? undefined
          : selectedPeriod.avslagsårsak === 'fritekst'
            ? AndreLivsoppholdsytelserIkkeOppfyltÅrsak.MOTTAR_ANNEN_YTELSE
            : selectedPeriod.avslagsårsak || undefined,
        begrunnelse: selectedPeriod.begrunnelse,
        erVilkårOppfylt,
        periode: { fom: selectedId, tom: '' },
        fritekstVurderingBrev: selectedPeriod.avslagsårsak === 'fritekst' ? selectedPeriod.fritekst : undefined,
      },
    ],
  };
};

export const AndreLivsoppholdytelserVilkårsvurdering = ({
  vurderAndreLivsoppholdytelserFaktaAP,
  lokalkontorForeslårVilkårAP,
  andreLivsoppholdytelserVilkår,
  api,
  behandling,
  onAksjonspunktBekreftet,
  readOnly,
  isPermanentlyReadOnly,
}: Props) => {
  const periods = buildPeriods(andreLivsoppholdytelserVilkår);
  const [selectedId, setSelectedId] = useState(periods[0]?.id ?? '');
  const formHook = useForm<FormData>({ defaultValues: buildInitialValues(andreLivsoppholdytelserVilkår) });
  const andreLivsoppholdytelser = useWatch({
    control: formHook.control,
    name: `perioder.${selectedId}.andreLivsoppholdytelser`,
  });
  const isSolved = vurderAndreLivsoppholdytelserFaktaAP?.status === AksjonspunktStatus.UTFØRT;
  const erLokalkontorForeslårAPÅpent =
    !readOnly && !!lokalkontorForeslårVilkårAP && aksjonspunktErÅpent(lokalkontorForeslårVilkårAP);
  const defaultIsLocked = isSolved || erLokalkontorForeslårAPÅpent;
  const selectedPeriod = periods.find(period => period.id === selectedId);

  const { mutateAsync: bekreftAksjonspunktMutation, isPending } = useMutation({
    mutationFn: async (formData: FormData) => {
      await api.bekreftAksjonspunkt(behandling.uuid, behandling.versjon, [buildPayload({ formData, selectedId })]);
    },
    onSuccess: onAksjonspunktBekreftet,
  });

  const { mutateAsync: sendTilBeslutterMutation, isPending: isSendingTilBeslutter } = useMutation({
    mutationFn: async () => sendTilBeslutter(api, behandling),
    onSuccess: onAksjonspunktBekreftet,
  });

  return (
    <VStack gap="space-20">
      {!isSolved && vurderAndreLivsoppholdytelserFaktaAP && (
        <Alert variant="warning" size="small">
          Vurder om søker mottar andre livsoppholdsytelser.
        </Alert>
      )}
      <VilkårSplittPanel
        periods={periods}
        selectedItemId={selectedId}
        onItemSelect={setSelectedId}
        detailHeading="Vurdering av andre livsoppholdsytelser"
        periodListLabel="Alle perioder"
        lovreferanse={andreLivsoppholdytelserVilkår.lovReferanse}
        defaultIsLocked={isSolved || erLokalkontorForeslårAPÅpent}
        readOnly={readOnly || selectedPeriod?.status === 'success' || selectedPeriod?.status === 'error'}
        isPermanentlyReadOnly={isPermanentlyReadOnly}
        lockedContent={
          isSolved ? <VurdertAv ident={vurderAndreLivsoppholdytelserFaktaAP?.ansvarligSaksbehandler} /> : undefined
        }
        afterEditButton={
          erLokalkontorForeslårAPÅpent ? (
            <VStack gap="space-20">
              <Alert variant="success" size="small">
                Alle inngangsvilkår for Nav-kontor er ferdig vurdert.
              </Alert>
              <Box>
                <Button
                  variant="primary"
                  data-color="accent"
                  size="small"
                  type="button"
                  loading={isSendingTilBeslutter}
                  onClick={() => void sendTilBeslutterMutation()}
                >
                  Send til beslutter
                </Button>
              </Box>
            </VStack>
          ) : null
        }
      >
        {(isFormLocked, setIsFormLocked) => (
          <RhfForm
            formMethods={formHook}
            onSubmit={async data => {
              await bekreftAksjonspunktMutation(data);
              setIsFormLocked(true);
            }}
          >
            <VStack gap="space-24" maxWidth="70ch" width="100%">
              <RhfTextarea
                control={formHook.control}
                name={`perioder.${selectedId}.begrunnelse`}
                label="Vurder om bruker mottar annen livoppholdsytelse, jf. § 4 Forholdet til andre ytelser"
                readOnly={isFormLocked}
                validate={[required, minLength(3), maxLength(4000)]}
                resize
                maxLength={4000}
              />
              <RhfRadioGroup
                control={formHook.control}
                name={`perioder.${selectedId}.andreLivsoppholdytelser`}
                legend="Mottar bruker annen livsoppholdsytelse?"
                validate={[required]}
                readOnly={isFormLocked}
              >
                <Radio value="ja">
                  Ja, fra og med {selectedPeriod?.periode?.fom ? formatDate(selectedPeriod?.periode?.fom) : ''}
                </Radio>
                <Radio value="nei">Nei</Radio>
              </RhfRadioGroup>
              {andreLivsoppholdytelser === 'ja' && (
                <RhfTextarea
                  control={formHook.control}
                  name={`perioder.${selectedId}.fritekstVurderingBrev`}
                  label="Fritekst opphørsbrev"
                  description="Forklar hvorfor vilkåret er opphørt. Teksten vises i vedtaksbrevet."
                  readOnly={isFormLocked}
                  validate={[required, minLength(3), maxLength(4000)]} // TODO
                  resize
                  maxLength={4000} // TODO
                />
              )}
              {!isFormLocked && (
                <HStack gap="space-16">
                  <Button type="submit" size="small" loading={isPending}>
                    Send til beslutter
                  </Button>
                  {defaultIsLocked && (
                    <Button type="button" size="small" variant="secondary" onClick={() => setIsFormLocked(true)}>
                      Avbryt
                    </Button>
                  )}
                </HStack>
              )}
            </VStack>
          </RhfForm>
        )}
      </VilkårSplittPanel>
    </VStack>
  );
};
