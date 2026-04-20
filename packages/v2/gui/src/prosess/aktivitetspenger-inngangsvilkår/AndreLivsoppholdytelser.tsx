import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { AksjonspunktStatus } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktStatus.js';
import { Avslagsårsak } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/Avslagsårsak.js';
import { Utfall } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/Utfall.js';
import type { AksjonspunktDto } from '@k9-sak-web/backend/ungsak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import type { BehandlingDto } from '@k9-sak-web/backend/ungsak/kontrakt/behandling/BehandlingDto.js';
import type { VilkårMedPerioderDto } from '@k9-sak-web/backend/ungsak/kontrakt/vilkår/VilkårMedPerioderDto.js';
import { formatDate } from '@k9-sak-web/gui/utils/formatters.js';
import { Alert, Button, HStack, Radio, VStack } from '@navikt/ds-react';
import { RhfForm, RhfRadioGroup, RhfTextarea } from '@navikt/ft-form-hooks';
import { required } from '@navikt/ft-form-validators';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { ProsessStegIkkeBehandlet } from '../../behandling/prosess/ProsessStegIkkeBehandlet';
import { Lovreferanse } from '../../shared/lovreferanse/Lovreferanse';
import type { AktivitetspengerApi } from '../aktivitetspenger-prosess/AktivitetspengerApi';
import { getItemStatus, VilkårSplittPanel, type VilkårSplittPanelItem } from './VilkårSplittPanel';

interface Props {
  andreLivsoppholdytelserAp: AksjonspunktDto | undefined;
  andreLivsoppholdytelserVilkår: VilkårMedPerioderDto;
  readOnly: boolean;
  behandling: BehandlingDto;
  api: AktivitetspengerApi;
  onAksjonspunktBekreftet: () => void;
  isPermanentlyReadOnly: boolean;
}

type Vurdering = 'oppfylt' | 'ikkeOppfylt' | '';

interface FormData {
  vurderinger: Record<
    string,
    { begrunnelse: string; andreLivsoppholdytelser: Vurdering; avslagsårsak?: string; fritekst?: string }
  >;
}

const utfallTilVurdering = (utfall: string): Vurdering => {
  if (utfall === Utfall.OPPFYLT) return 'oppfylt';
  if (utfall === Utfall.IKKE_OPPFYLT) return 'ikkeOppfylt';
  return '';
};

const buildInitialValues = (vilkår: VilkårMedPerioderDto): FormData => ({
  vurderinger: Object.fromEntries(
    (vilkår.perioder ?? []).map(p => [
      p.periode.fom,
      {
        begrunnelse: p.begrunnelse ?? '',
        andreLivsoppholdytelser: utfallTilVurdering(p.vilkarStatus),
        avslagsårsak: p.avslagKode,
      },
    ]),
  ),
});
export const AndreLivsoppholdytelser = ({
  andreLivsoppholdytelserAp,
  andreLivsoppholdytelserVilkår,
  readOnly,
  api,
  behandling,
  onAksjonspunktBekreftet,
  isPermanentlyReadOnly,
}: Props) => {
  const items: VilkårSplittPanelItem[] = (andreLivsoppholdytelserVilkår?.perioder ?? []).map(p => ({
    id: p.periode.fom,
    status: getItemStatus(p.vilkarStatus),
    label: `${formatDate(p.periode.fom)}`,
    periode: p.periode,
  }));
  const [selectedId, setSelectedId] = useState(items[0]?.id ?? '');
  const isAksjonspunktSolved = andreLivsoppholdytelserAp?.status === AksjonspunktStatus.UTFØRT;
  const formHook = useForm<FormData>({
    defaultValues: buildInitialValues(andreLivsoppholdytelserVilkår),
  });

  const { mutateAsync: bekreftAksjonspunktMutation, isPending } = useMutation({
    mutationFn: async (data: FormData) => {
      const vurdering = data.vurderinger[selectedId];
      const selectedItem = items.find(item => item.id === selectedId);
      if (!selectedItem) {
        throw new Error('Kunne ikke finne valgt periode for andre livsoppholdytelser vilkår');
      }
      const vurdertePerioder = {
        avslagsårsak:
          vurdering?.andreLivsoppholdytelser !== 'oppfylt'
            ? Avslagsårsak.SØKER_HAR_ANNEN_LIVSOPPHOLDSYTELSE
            : undefined,
        begrunnelse: vurdering?.begrunnelse ?? '',
        erVilkårOppfylt: vurdering?.andreLivsoppholdytelser === 'oppfylt',
        periode: selectedItem.periode,
      };

      const payload = {
        '@type': AksjonspunktDefinisjon.VURDER_ANDRE_LIVSOPPHOLDSYTELSER,
        begrunnelse: vurdering?.begrunnelse ?? '',
        brevtekst: vurdering?.avslagsårsak === 'fritekst' ? vurdering?.fritekst : undefined,
        vurdertePerioder: [vurdertePerioder],
      };

      await api.bekreftAksjonspunkt(behandling.uuid, behandling.versjon, [payload]);
    },
    onSuccess: () => {
      onAksjonspunktBekreftet();
    },
  });

  const onSubmit: SubmitHandler<FormData> = data => bekreftAksjonspunktMutation(data);
  const andreLivsoppholdytelser = formHook.watch(`vurderinger.${selectedId}.andreLivsoppholdytelser`);
  const avslagsårsak = formHook.watch(`vurderinger.${selectedId}.avslagsårsak`);

  if (!andreLivsoppholdytelserVilkår) {
    return null;
  }
  if (
    !andreLivsoppholdytelserAp &&
    !andreLivsoppholdytelserVilkår.perioder?.some(p => p.vilkarStatus !== Utfall.IKKE_VURDERT)
  ) {
    return <ProsessStegIkkeBehandlet />;
  }

  return (
    <VStack gap="space-20">
      {!isAksjonspunktSolved && (
        <Alert variant="warning" size="small">
          Vurder om søker har andre livsoppholdsytelser på søknadstidspunktet.
        </Alert>
      )}
      <VilkårSplittPanel
        items={items}
        selectedItemId={selectedId}
        onItemSelect={setSelectedId}
        detailHeading="Vurdering av andre livsoppholdytelser"
        lovreferanse={andreLivsoppholdytelserVilkår.lovReferanse}
        defaultIsLocked={isAksjonspunktSolved}
        readOnly={readOnly}
        isPermanentlyReadOnly={isPermanentlyReadOnly}
      >
        {(isFormLocked: boolean, setIsFormLocked: React.Dispatch<React.SetStateAction<boolean>>) => (
          <RhfForm formMethods={formHook} onSubmit={onSubmit}>
            <VStack gap="space-24">
              <RhfTextarea
                control={formHook.control}
                name={`vurderinger.${selectedId}.begrunnelse`}
                readOnly={isFormLocked}
                label={
                  <span>
                    Vurder om søker har andre livsoppholdytelser, jmf.{' '}
                    {andreLivsoppholdytelserVilkår.lovReferanse && (
                      <Lovreferanse isUng>{andreLivsoppholdytelserVilkår.lovReferanse}</Lovreferanse>
                    )}
                  </span>
                }
              />
              <RhfRadioGroup
                key={`${selectedId}-andreLivsoppholdytelser`}
                control={formHook.control}
                name={`vurderinger.${selectedId}.andreLivsoppholdytelser`}
                legend="Har søker andre livsoppholdytelser?"
                validate={[required]}
                readOnly={isFormLocked}
              >
                <Radio value="oppfylt">Ja</Radio>
                <Radio value="ikkeOppfylt">Nei</Radio>
              </RhfRadioGroup>
              {andreLivsoppholdytelser === 'ikkeOppfylt' && (
                <RhfRadioGroup
                  key={`${selectedId}-avslagsårsak`}
                  control={formHook.control}
                  name={`vurderinger.${selectedId}.avslagsårsak`}
                  legend="Avslagsårsak"
                  validate={[required]}
                  readOnly={isFormLocked}
                >
                  <Radio value={Avslagsårsak.SØKER_HAR_ANNEN_LIVSOPPHOLDSYTELSE}>
                    Søker har annen livsoppholdytelse
                  </Radio>
                  <Radio value="fritekst">Fritekst</Radio>
                </RhfRadioGroup>
              )}
              {avslagsårsak === 'fritekst' && (
                <RhfTextarea
                  key={`${selectedId}-fritekst`}
                  control={formHook.control}
                  name={`vurderinger.${selectedId}.fritekst`}
                  label="Fritekst avslagsbrev"
                  description="Beskriv hvorfor vilkåret er avslått. Teksten vises i vedtaksbrevet til søker."
                  validate={[required]}
                  readOnly={isFormLocked}
                />
              )}
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
