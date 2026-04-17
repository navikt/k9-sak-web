import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { AksjonspunktStatus } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktStatus.js';
import { Utfall } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/Utfall.js';
import type { AksjonspunktDto } from '@k9-sak-web/backend/ungsak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import type { BehandlingDto } from '@k9-sak-web/backend/ungsak/kontrakt/behandling/BehandlingDto.js';
import type { VilkårMedPerioderDto } from '@k9-sak-web/backend/ungsak/kontrakt/vilkår/VilkårMedPerioderDto.js';
import { formatDate } from '@k9-sak-web/gui/utils/formatters.js';
import { Alert, BodyShort, Box, Button, HStack, Radio, VStack } from '@navikt/ds-react';
import { RhfForm, RhfRadioGroup, RhfTextarea } from '@navikt/ft-form-hooks';
import { required } from '@navikt/ft-form-validators';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { ProsessStegIkkeBehandlet } from '../../behandling/prosess/ProsessStegIkkeBehandlet';
import { Lovreferanse } from '../../shared/lovreferanse/Lovreferanse';
import type { AktivitetspengerApi } from '../aktivitetspenger-prosess/AktivitetspengerApi';
import { aksjonspunktErÅpent } from './utils/utils';
import { getItemStatus, VilkårSplittPanel, type VilkårSplittPanelItem } from './VilkårSplittPanel';

interface Props {
  vurderBistandsvilkårVilkår: VilkårMedPerioderDto;
  vurderBistandsvilkårAp: AksjonspunktDto | undefined;
  lokalkontorForeslårVilkårAp: AksjonspunktDto | undefined;
  api: AktivitetspengerApi;
  behandling: BehandlingDto;
  onAksjonspunktBekreftet: () => void;
  readOnly: boolean;
}

type Vurdering = 'oppfylt' | 'ikkeOppfylt' | '';

interface FormData {
  vurderinger: Record<
    string,
    { begrunnelse: string; behovForBistand: Vurdering; avslagsårsak?: string; fritekst?: string }
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
        behovForBistand: utfallTilVurdering(p.vilkarStatus),
        avslagsårsak: p.avslagKode,
      },
    ]),
  ),
});

export const BehovForBistand = ({
  vurderBistandsvilkårVilkår,
  vurderBistandsvilkårAp,
  lokalkontorForeslårVilkårAp,
  api,
  behandling,
  onAksjonspunktBekreftet,
  readOnly,
}: Props) => {
  const items: VilkårSplittPanelItem[] = (vurderBistandsvilkårVilkår?.perioder ?? []).map(p => ({
    id: p.periode.fom,
    status: getItemStatus(p.vilkarStatus),
    label: `${formatDate(p.periode.fom)} - ${formatDate(p.periode.tom)}`,
    periode: p.periode,
  }));
  const [selectedId, setSelectedId] = useState(items[0]?.id ?? '');
  const formHook = useForm<FormData>({
    defaultValues: buildInitialValues(vurderBistandsvilkårVilkår),
  });

  const { mutateAsync: bekreftAksjonspunktMutation, isPending } = useMutation({
    mutationFn: async (data: FormData) => {
      const erVurderBistandsvilkårApÅpent = vurderBistandsvilkårAp && aksjonspunktErÅpent(vurderBistandsvilkårAp);

      const vurdering = data.vurderinger[selectedId];
      const selectedItem = items.find(item => item.id === selectedId);
      if (!selectedItem) {
        throw new Error('Kunne ikke finne valgt periode for bostedsvilkår');
      }
      const vurdertePerioder = {
        avslagsårsak: undefined,
        begrunnelse: vurdering?.begrunnelse ?? '',
        erVilkårOppfylt: vurdering?.behovForBistand === 'oppfylt',
        periode: selectedItem.periode,
      };

      const payload = erVurderBistandsvilkårApÅpent
        ? {
            '@type': AksjonspunktDefinisjon.VURDER_BISTANDSVILKÅR,
            begrunnelse: vurdering?.begrunnelse ?? '',
            brevtekst: vurdering?.avslagsårsak === 'fritekst' ? vurdering?.fritekst : undefined,
            vurdertePerioder: [vurdertePerioder],
          }
        : {
            '@type': AksjonspunktDefinisjon.LOKALKONTOR_FORESLÅR_VILKÅR,
            begrunnelse: 'Send til beslutter',
          };

      await api.bekreftAksjonspunkt(behandling.uuid, behandling.versjon, [payload]);
    },
    onSuccess: () => {
      onAksjonspunktBekreftet();
    },
  });

  const onSubmit: SubmitHandler<FormData> = data => bekreftAksjonspunktMutation(data);
  const behovForBistand = formHook.watch(`vurderinger.${selectedId}.behovForBistand`);
  const avslagsårsak = formHook.watch(`vurderinger.${selectedId}.avslagsårsak`);
  const isAksjonspunktSolved = vurderBistandsvilkårAp?.status === AksjonspunktStatus.UTFØRT;

  if (!vurderBistandsvilkårVilkår) {
    return null;
  }

  if (
    !vurderBistandsvilkårAp &&
    !vurderBistandsvilkårVilkår.perioder?.some(p => p.vilkarStatus !== Utfall.IKKE_VURDERT)
  ) {
    return <ProsessStegIkkeBehandlet />;
  }

  return (
    <VilkårSplittPanel
      items={items}
      selectedItemId={selectedId}
      onItemSelect={setSelectedId}
      detailHeading="Vurdering av behov for bistand"
      lovreferanse={vurderBistandsvilkårVilkår.lovReferanse}
      defaultIsEditable={isAksjonspunktSolved}
      readOnly={readOnly}
    >
      {(isEditable: boolean, setIsEditable: React.Dispatch<React.SetStateAction<boolean>>) => (
        <RhfForm formMethods={formHook} onSubmit={onSubmit}>
          <VStack gap="space-24">
            <VStack gap="space-24">
              <RhfTextarea
                control={formHook.control}
                name={`vurderinger.${selectedId}.begrunnelse`}
                readOnly={isEditable}
                label={
                  <span>
                    Vurder om søker har behov for bistand, jmf.{' '}
                    {vurderBistandsvilkårVilkår.lovReferanse && (
                      <Lovreferanse isUng>{vurderBistandsvilkårVilkår.lovReferanse}</Lovreferanse>
                    )}
                  </span>
                }
              />
              <RhfRadioGroup
                key={`${selectedId}-behovForBistand`}
                control={formHook.control}
                name={`vurderinger.${selectedId}.behovForBistand`}
                legend="Har søker behov for bistand?"
                validate={[required]}
                readOnly={isEditable}
              >
                <Radio value="oppfylt">Ja</Radio>
                <Radio value="ikkeOppfylt">Nei</Radio>
              </RhfRadioGroup>
              {behovForBistand === 'ikkeOppfylt' && (
                <RhfRadioGroup
                  key={`${selectedId}-avslagsårsak`}
                  control={formHook.control}
                  name={`vurderinger.${selectedId}.avslagsårsak`}
                  legend="Avslagsårsak"
                  validate={[required]}
                  readOnly={isEditable}
                >
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
            {!readOnly && lokalkontorForeslårVilkårAp && aksjonspunktErÅpent(lokalkontorForeslårVilkårAp) && (
              <Alert variant="success" size="small">
                <Box marginBlock="space-2 space-12">
                  <BodyShort size="small">Alle inngangsvilkår for Nav lokalt er ferdig vurdert.</BodyShort>
                </Box>
                <Button variant="primary" data-color="accent" size="small" type="submit" loading={isPending}>
                  Send vurderinger til beslutter
                </Button>
              </Alert>
            )}
          </VStack>
        </RhfForm>
      )}
    </VilkårSplittPanel>
  );
};
