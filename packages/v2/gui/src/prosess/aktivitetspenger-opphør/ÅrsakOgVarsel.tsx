import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { AksjonspunktStatus } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktStatus.js';
import type { AksjonspunktDto } from '@k9-sak-web/backend/ungsak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import type { BehandlingDto } from '@k9-sak-web/backend/ungsak/kontrakt/behandling/BehandlingDto.js';
import type { VilkårMedPerioderDto } from '@k9-sak-web/backend/ungsak/kontrakt/vilkår/VilkårMedPerioderDto.js';
import { formatDate } from '@k9-sak-web/gui/utils/formatters.js';
import { Alert, Button, HStack, Radio, VStack } from '@navikt/ds-react';
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
import { VurdertAv } from '../../shared/vurdert-av/VurdertAv.js';
import type { AktivitetspengerApi } from '../aktivitetspenger-prosess/AktivitetspengerApi.js';
import { Opphørsårsak, opphørsårsakLabels } from './types.js';

interface FormData {
  perioder: Record<
    string,
    {
      opphørsdato: string;
      opphørsårsak: string;
      begrunnelse: string;
      åpenbarGrunnTilIkkeVarsle: 'ja' | 'nei' | '';
    }
  >;
}

const buildInitialValues = (vilkår: VilkårMedPerioderDto): FormData => ({
  perioder: Object.fromEntries(
    (vilkår.perioder ?? []).map(p => [
      p.periode.fom,
      {
        opphørsdato: p.periode.tom ?? '',
        opphørsårsak: '',
        begrunnelse: p.begrunnelse ?? '',
        åpenbarGrunnTilIkkeVarsle: '',
      },
    ]),
  ),
});

interface Props {
  varselAp: AksjonspunktDto | undefined;
  opphørVilkår: VilkårMedPerioderDto;
  api: AktivitetspengerApi;
  behandling: BehandlingDto;
  onAksjonspunktBekreftet: () => void;
  readOnly: boolean;
  isPermanentlyReadOnly: boolean;
}

export const AarsakOgVarsel = ({
  varselAp,
  opphørVilkår,
  api,
  behandling,
  onAksjonspunktBekreftet,
  readOnly,
  isPermanentlyReadOnly,
}: Props) => {
  const periods: VilkårSplittPanelPeriod[] = (opphørVilkår.perioder ?? []).map(p => ({
    id: p.periode.fom,
    status: getPeriodStatus(p.vilkarStatus),
    label: formatDate(p.periode.fom),
    periode: p.periode,
  }));

  const [selectedId, setSelectedId] = useState(periods[0]?.id ?? '');

  const formHook = useForm<FormData>({
    defaultValues: buildInitialValues(opphørVilkår),
  });

  const isVarselApSolved = varselAp?.status === AksjonspunktStatus.UTFØRT;

  const { mutateAsync: bekreftAksjonspunktMutation, isPending } = useMutation({
    mutationFn: async (data: FormData) => {
      const periode = data.perioder[selectedId];
      if (!periode) {
        throw new Error('Kunne ikke finne valgt periode for opphør');
      }
      const payload = {
        '@type': AksjonspunktDefinisjon.KONTROLLER_REVURDERINGSBEHANDLING_VARSEL_VED_UGUNST,
        begrunnelse: periode.begrunnelse,
        sendVarsel: periode.åpenbarGrunnTilIkkeVarsle === 'nei',
        fritekst: periode.begrunnelse,
        aktivFom: selectedId,
        opphørsdato: periode.opphørsdato,
        opphørsårsak: periode.opphørsårsak,
      };
      await api.bekreftAksjonspunkt(behandling.uuid, behandling.versjon, [payload]);
    },
    onSuccess: () => {
      onAksjonspunktBekreftet();
    },
  });

  return (
    <VStack gap="space-20">
      {!isVarselApSolved && varselAp && (
        <Alert variant="warning" size="small">
          Vurder årsak til opphør og om bruker skal varsles.
        </Alert>
      )}
      <VilkårSplittPanel
        periods={periods}
        selectedItemId={selectedId}
        onItemSelect={setSelectedId}
        detailHeading="Årsak og varsel for opphør"
        lovreferanse={opphørVilkår.lovReferanse}
        defaultIsLocked={isVarselApSolved}
        readOnly={readOnly}
        isPermanentlyReadOnly={isPermanentlyReadOnly}
        lockedContent={isVarselApSolved ? <VurdertAv ident={varselAp?.ansvarligSaksbehandler} /> : undefined}
      >
        {(isFormLocked: boolean, setIsFormLocked: React.Dispatch<React.SetStateAction<boolean>>) => (
          <RhfForm
            formMethods={formHook}
            onSubmit={async data => {
              await bekreftAksjonspunktMutation(data);
              setIsFormLocked(true);
            }}
          >
            <VStack gap="space-24" width="70ch">
              <RhfDatepicker
                control={formHook.control}
                name={`perioder.${selectedId}.opphørsdato`}
                label="Dato for opphør"
                readOnly={isFormLocked}
                validate={[required]}
              />
              <RhfSelect
                control={formHook.control}
                name={`perioder.${selectedId}.opphørsårsak`}
                label="Opphørsårsak"
                readOnly={isFormLocked}
                validate={[required]}
                selectValues={Object.values(Opphørsårsak).map(årsak => (
                  <option key={årsak} value={årsak}>
                    {opphørsårsakLabels[årsak]}
                  </option>
                ))}
              />
              <RhfTextarea
                control={formHook.control}
                name={`perioder.${selectedId}.begrunnelse`}
                label="Begrunnelse for opphør"
                readOnly={isFormLocked}
                validate={[required]}
              />
              <RhfRadioGroup
                key={`${selectedId}-varsle`}
                control={formHook.control}
                name={`perioder.${selectedId}.åpenbarGrunnTilIkkeVarsle`}
                legend="Er det åpenbar grunn til å ikke varsle bruker om opphør?"
                validate={[required]}
                readOnly={isFormLocked}
              >
                <Radio value="ja">Ja</Radio>
                <Radio value="nei">Nei</Radio>
              </RhfRadioGroup>
              {!isFormLocked && (
                <HStack gap="space-8">
                  <Button type="submit" size="small" loading={isPending}>
                    Bekreft og fortsett
                  </Button>
                  <Button size="small" variant="tertiary" type="button" onClick={() => setIsFormLocked(true)}>
                    Avbryt
                  </Button>
                </HStack>
              )}
            </VStack>
          </RhfForm>
        )}
      </VilkårSplittPanel>
    </VStack>
  );
};
