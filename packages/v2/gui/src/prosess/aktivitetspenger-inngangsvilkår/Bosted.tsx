import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { AksjonspunktStatus } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktStatus.js';
import { Avslagsårsak } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/Avslagsårsak.js';
import { Utfall } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/Utfall.js';
import type { AksjonspunktDto } from '@k9-sak-web/backend/ungsak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import type { BehandlingDto } from '@k9-sak-web/backend/ungsak/kontrakt/behandling/BehandlingDto.js';
import type { VilkårMedPerioderDto } from '@k9-sak-web/backend/ungsak/kontrakt/vilkår/VilkårMedPerioderDto.js';
import { formatDate } from '@k9-sak-web/gui/utils/formatters.js';
import { BodyShort, Button, HStack, Label, Radio, Tag, VStack } from '@navikt/ds-react';
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
  bostedAp: AksjonspunktDto | undefined;
  bostedVilkår: VilkårMedPerioderDto;
  readOnly: boolean;
  behandling: BehandlingDto;
  api: AktivitetspengerApi;
  onAksjonspunktBekreftet: () => void;
}

type Vurdering = 'oppfylt' | 'ikkeOppfylt' | '';

interface FormData {
  vurderinger: Record<string, { begrunnelse: string; bosatt: Vurdering; avslagsårsak?: string; fritekst?: string }>;
}

const getVilkårUtfall = (vilkårStatus: Utfall) => {
  if (vilkårStatus === Utfall.OPPFYLT) return 'Ja';
  return 'Nei';
};

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
        bosatt: utfallTilVurdering(p.vilkarStatus),
        avslagsårsak: p.avslagKode,
      },
    ]),
  ),
});

export const Bosted = ({ bostedVilkår, readOnly, api, behandling, onAksjonspunktBekreftet, bostedAp }: Props) => {
  const items: VilkårSplittPanelItem[] = (bostedVilkår?.perioder ?? []).map(p => ({
    id: p.periode.fom,
    status: getItemStatus(p.vilkarStatus),
    label: `${formatDate(p.periode.fom)} - ${formatDate(p.periode.tom)}`,
    periode: p.periode,
  }));
  const [selectedId, setSelectedId] = useState(items[0]?.id ?? '');
  const formHook = useForm<FormData>({
    defaultValues: buildInitialValues(bostedVilkår),
  });

  const { mutateAsync: bekreftAksjonspunktMutation, isPending } = useMutation({
    mutationFn: async (data: FormData) => {
      const vurdering = data.vurderinger[selectedId];
      const selectedItem = items.find(item => item.id === selectedId);
      if (!selectedItem) {
        throw new Error('Kunne ikke finne valgt periode for bostedsvilkår');
      }
      const vurdertePerioder = {
        avslagsårsak: vurdering?.bosatt !== 'oppfylt' ? Avslagsårsak.YTELSE_IKKE_TILGJENGELIG_PÅ_BOSTED : undefined,
        begrunnelse: vurdering?.begrunnelse ?? '',
        erVilkårOppfylt: vurdering?.bosatt === 'oppfylt',
        periode: selectedItem.periode,
      };

      const payload = {
        '@type': AksjonspunktDefinisjon.VURDER_BOSTED,
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

  const isAksjonspunktSolved = bostedAp?.status === AksjonspunktStatus.UTFØRT;
  const selectedVilkårPeriode = bostedVilkår.perioder?.find(p => p.periode.fom === selectedId);
  const onSubmit: SubmitHandler<FormData> = data => bekreftAksjonspunktMutation(data);
  const bosatt = formHook.watch(`vurderinger.${selectedId}.bosatt`);
  const avslagsårsak = formHook.watch(`vurderinger.${selectedId}.avslagsårsak`);

  if (!bostedVilkår) {
    return null;
  }
  if (!bostedAp && !bostedVilkår.perioder?.some(p => p.vilkarStatus !== Utfall.IKKE_VURDERT)) {
    return <ProsessStegIkkeBehandlet />;
  }

  return (
    <VilkårSplittPanel
      items={items}
      selectedItemId={selectedId}
      onItemSelect={setSelectedId}
      detailHeading="Vurdering av bostedsvilkår"
      lovreferanse={bostedVilkår.lovReferanse}
      defaultIsEditable={isAksjonspunktSolved}
      readOnly={readOnly}
    >
      {(isEditable: boolean, setIsEditable: React.Dispatch<React.SetStateAction<boolean>>) => (
        <VStack gap="space-24">
          <VStack gap="space-8">
            <Label size="small" as="p">
              Bor søker i Trondheim kommune?
            </Label>
            <HStack gap="space-8" align="center">
              <BodyShort size="small">
                {selectedVilkårPeriode && getVilkårUtfall(selectedVilkårPeriode.vilkarStatus)}
              </BodyShort>
              <Tag variant="outline" size="small">
                Fra søknad
              </Tag>
            </HStack>
          </VStack>
          <RhfForm formMethods={formHook} onSubmit={onSubmit}>
            <VStack gap="space-24">
              <RhfTextarea
                control={formHook.control}
                name={`vurderinger.${selectedId}.begrunnelse`}
                readOnly={isEditable}
                label={
                  <span>
                    Vurder om søker er bosatt i Trondheim kommune, jmf.{' '}
                    {bostedVilkår.lovReferanse && <Lovreferanse isUng>{bostedVilkår.lovReferanse}</Lovreferanse>}
                  </span>
                }
              />
              <RhfRadioGroup
                key={selectedId}
                control={formHook.control}
                name={`vurderinger.${selectedId}.bosatt`}
                legend="Er søker bosatt i Trondheim kommune?"
                validate={[required]}
                readOnly={isEditable}
              >
                <Radio value="oppfylt">Ja</Radio>
                <Radio value="ikkeOppfylt">Nei</Radio>
              </RhfRadioGroup>
              {bosatt === 'ikkeOppfylt' && (
                <RhfRadioGroup
                  key={selectedId}
                  control={formHook.control}
                  name={`vurderinger.${selectedId}.avslagsårsak`}
                  legend="Avslagsårsak"
                  validate={[required]}
                  readOnly={isEditable}
                >
                  <Radio value={Avslagsårsak.YTELSE_IKKE_TILGJENGELIG_PÅ_BOSTED}>
                    Ytelse ikke tilgjengelig på bosted
                  </Radio>
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
                  readOnly={isEditable}
                />
              )}
              {!isEditable && (
                <HStack gap="space-8">
                  <Button type="submit" size="small" loading={isPending}>
                    Bekreft og fortsett
                  </Button>
                  <Button size="small" variant="tertiary" type="button" onClick={() => setIsEditable(true)}>
                    Avbryt
                  </Button>
                </HStack>
              )}
            </VStack>
          </RhfForm>
        </VStack>
      )}
    </VilkårSplittPanel>
  );
};
