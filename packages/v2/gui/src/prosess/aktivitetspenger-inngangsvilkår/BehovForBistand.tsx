import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { AksjonspunktStatus } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktStatus.js';
import { Utfall } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/Utfall.js';
import type { AksjonspunktDto } from '@k9-sak-web/backend/ungsak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import type { BehandlingDto } from '@k9-sak-web/backend/ungsak/kontrakt/behandling/BehandlingDto.js';
import type { VilkårMedPerioderDto } from '@k9-sak-web/backend/ungsak/kontrakt/vilkår/VilkårMedPerioderDto.js';
import { formatDate } from '@k9-sak-web/gui/utils/formatters.js';
import { Alert, Box, Button, HStack, Label, Radio, VStack } from '@navikt/ds-react';
import { RhfDatepicker, RhfForm, RhfRadioGroup, RhfTextarea } from '@navikt/ft-form-hooks';
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
  isPermanentlyReadOnly: boolean;
}

type Vurdering = 'oppfylt' | 'ikkeOppfylt' | '';

interface FormData {
  vurderinger: Record<
    string,
    {
      begrunnelse: string;
      behovForBistand: Vurdering;
      avslagsårsak?: string;
      fritekst?: string;
      bistandStart: string;
      bistandSlutt: string;
    }
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
        bistandStart: p.periode.fom ?? '',
        bistandSlutt: p.periode.tom ?? '',
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
  isPermanentlyReadOnly,
}: Props) => {
  const items: VilkårSplittPanelItem[] = (vurderBistandsvilkårVilkår?.perioder ?? []).map(p => ({
    id: p.periode.fom,
    status: getItemStatus(p.vilkarStatus),
    label: `${formatDate(p.periode.fom)}`,
    periode: p.periode,
  }));
  const [selectedId, setSelectedId] = useState(items[0]?.id ?? '');
  const formHook = useForm<FormData>({
    defaultValues: buildInitialValues(vurderBistandsvilkårVilkår),
  });
  const selectedItem = items.find(item => item.id === selectedId);

  const { mutateAsync: bekreftAksjonspunktMutation, isPending } = useMutation({
    mutationFn: async (data: FormData) => {
      const erVurderBistandsvilkårApÅpent = vurderBistandsvilkårAp && aksjonspunktErÅpent(vurderBistandsvilkårAp);

      const vurdering = data.vurderinger[selectedId];
      if (!vurdering) {
        throw new Error('Kunne ikke finne valgt periode for bostedsvilkår');
      }
      const vurdertePerioder = {
        avslagsårsak: undefined,
        begrunnelse: vurdering.begrunnelse ?? '',
        erVilkårOppfylt: vurdering.behovForBistand === 'oppfylt',
        periode: { fom: vurdering.bistandStart, tom: vurdering.bistandSlutt },
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
    <VStack gap="space-20">
      {!isAksjonspunktSolved && (
        <Alert variant="warning" size="small">
          Vurder behov for bistand på søknadstidspunktet.
        </Alert>
      )}
      <VilkårSplittPanel
        items={items}
        selectedItemId={selectedId}
        onItemSelect={setSelectedId}
        detailHeading="Vurdering av behov for bistand"
        lovreferanse={vurderBistandsvilkårVilkår.lovReferanse}
        defaultIsLocked={
          isAksjonspunktSolved ||
          (!readOnly && lokalkontorForeslårVilkårAp && aksjonspunktErÅpent(lokalkontorForeslårVilkårAp))
        }
        readOnly={readOnly}
        isPermanentlyReadOnly={isPermanentlyReadOnly}
        afterEditButton={
          !readOnly && lokalkontorForeslårVilkårAp && aksjonspunktErÅpent(lokalkontorForeslårVilkårAp) ? (
            <VStack gap="space-20">
              <Alert variant="success" size="small">
                Alle inngangsvilkår for Nav lokalt er ferdig vurdert.
              </Alert>
              <Box>
                <Button
                  variant="primary"
                  data-color="accent"
                  size="small"
                  type="button"
                  loading={isPending}
                  onClick={() => void formHook.handleSubmit(onSubmit)()}
                >
                  Send til beslutter
                </Button>
              </Box>
            </VStack>
          ) : null
        }
      >
        {(isFormLocked: boolean, setIsFormLocked: React.Dispatch<React.SetStateAction<boolean>>) => (
          <RhfForm formMethods={formHook} onSubmit={onSubmit}>
            <VStack gap="space-24">
              <VStack gap="space-24">
                <RhfTextarea
                  control={formHook.control}
                  name={`vurderinger.${selectedId}.begrunnelse`}
                  readOnly={isFormLocked}
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
                  readOnly={isFormLocked}
                >
                  <Radio value="oppfylt">Ja</Radio>
                  <Radio value="ikkeOppfylt">Nei</Radio>
                </RhfRadioGroup>
                {behovForBistand === 'oppfylt' && (
                  <VStack gap="space-12">
                    <Label size="small" as="p">
                      I hvilken periode er det behov for bistand?
                    </Label>
                    <HStack gap="space-24">
                      <RhfDatepicker
                        control={formHook.control}
                        name={`vurderinger.${selectedId}.bistandStart`}
                        label="Fra"
                        disabled={!isFormLocked}
                        readOnly={isFormLocked}
                      />
                      <RhfDatepicker
                        control={formHook.control}
                        name={`vurderinger.${selectedId}.bistandSlutt`}
                        label="Til"
                        readOnly={isFormLocked}
                        validate={[required]}
                        fromDate={selectedItem?.periode.fom ? new Date(selectedItem?.periode.fom) : undefined}
                        toDate={selectedItem?.periode.tom ? new Date(selectedItem?.periode.tom) : undefined}
                      />
                    </HStack>
                  </VStack>
                )}
                {behovForBistand === 'ikkeOppfylt' && (
                  <RhfRadioGroup
                    key={`${selectedId}-avslagsårsak`}
                    control={formHook.control}
                    name={`vurderinger.${selectedId}.avslagsårsak`}
                    legend="Avslagsårsak"
                    validate={[required]}
                    readOnly={isFormLocked}
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
            </VStack>
          </RhfForm>
        )}
      </VilkårSplittPanel>
    </VStack>
  );
};
