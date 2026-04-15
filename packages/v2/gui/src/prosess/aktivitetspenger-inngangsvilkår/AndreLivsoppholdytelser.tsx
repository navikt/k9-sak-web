import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { Avslagsårsak } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/Avslagsårsak.js';
import { Utfall } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/Utfall.js';
import type { BehandlingDto } from '@k9-sak-web/backend/ungsak/kontrakt/behandling/BehandlingDto.js';
import type { VilkårMedPerioderDto } from '@k9-sak-web/backend/ungsak/kontrakt/vilkår/VilkårMedPerioderDto.js';
import { formatDate } from '@k9-sak-web/gui/utils/formatters.js';
import { Box, Button, Radio, VStack } from '@navikt/ds-react';
import { RhfForm, RhfRadioGroup, RhfTextarea } from '@navikt/ft-form-hooks';
import { required } from '@navikt/ft-form-validators';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { Lovreferanse } from '../../shared/lovreferanse/Lovreferanse';
import type { AktivitetspengerApi } from '../aktivitetspenger-prosess/AktivitetspengerApi';
import { getItemStatus, VilkårSplittPanel, type VilkårSplittPanelItem } from './VilkårSplittPanel';

interface Props {
  andreLivsoppholdytelserVilkår: VilkårMedPerioderDto;
  readOnly: boolean;
  behandling: BehandlingDto;
  api: AktivitetspengerApi;
  onAksjonspunktBekreftet: () => void;
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
  andreLivsoppholdytelserVilkår,
  readOnly,
  api,
  behandling,
  onAksjonspunktBekreftet,
}: Props) => {
  const items: VilkårSplittPanelItem[] = (andreLivsoppholdytelserVilkår?.perioder ?? []).map(p => ({
    id: p.periode.fom,
    status: getItemStatus(p.vilkarStatus),
    label: `${formatDate(p.periode.fom)} - ${formatDate(p.periode.tom)}`,
    periode: p.periode,
  }));
  const [selectedId, setSelectedId] = useState(items[0]?.id ?? '');
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
  return (
    <VilkårSplittPanel
      items={items}
      selectedItemId={selectedId}
      onItemSelect={setSelectedId}
      detailHeading="Vurdering av andre livsoppholdytelser"
      lovreferanse={andreLivsoppholdytelserVilkår.lovReferanse}
    >
      <VStack gap="space-24">
        <RhfForm formMethods={formHook} onSubmit={onSubmit}>
          <VStack gap="space-16">
            <RhfTextarea
              control={formHook.control}
              name={`vurderinger.${selectedId}.begrunnelse`}
              readOnly={readOnly}
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
              key={selectedId}
              control={formHook.control}
              name={`vurderinger.${selectedId}.andreLivsoppholdytelser`}
              legend="Har søker andre livsoppholdytelser?"
              validate={[required]}
              disabled={readOnly}
              readOnly={readOnly}
            >
              <Radio value="oppfylt">Ja</Radio>
              <Radio value="ikkeOppfylt">Nei</Radio>
            </RhfRadioGroup>
            {andreLivsoppholdytelser === 'ikkeOppfylt' && (
              <RhfRadioGroup
                key={selectedId}
                control={formHook.control}
                name={`vurderinger.${selectedId}.avslagsårsak`}
                legend="Avslagsårsak"
                validate={[required]}
                readOnly={readOnly}
              >
                <Radio value={Avslagsårsak.SØKER_HAR_ANNEN_LIVSOPPHOLDSYTELSE}>Søker har annen livsoppholdytelse</Radio>
                <Radio value="fritekst">Fritekst</Radio>
              </RhfRadioGroup>
            )}
            {avslagsårsak === 'fritekst' && (
              <RhfTextarea
                control={formHook.control}
                name={`vurderinger.${selectedId}.fritekst`}
                label="Fritekst avslagsbrev"
                description="Beskriv hvorfor vilkåret er avslått. Teksten vises i vedtaksbrevet til søker."
                validate={[required]}
                readOnly={readOnly}
              />
            )}
            <Box>
              <Button type="submit" size="small" disabled={readOnly} loading={isPending}>
                Bekreft og fortsett
              </Button>
            </Box>
          </VStack>
        </RhfForm>
      </VStack>
    </VilkårSplittPanel>
  );
};
