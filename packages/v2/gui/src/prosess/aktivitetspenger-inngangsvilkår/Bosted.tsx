import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { Kilde } from '@k9-sak-web/backend/ungsak/kodeverk/bosatt/Kilde.js';
import { Avslagsårsak } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/Avslagsårsak.js';
import { Utfall } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/Utfall.js';
import type { AksjonspunktDto } from '@k9-sak-web/backend/ungsak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import type { BehandlingDto } from '@k9-sak-web/backend/ungsak/kontrakt/behandling/BehandlingDto.js';
import type { BostedGrunnlagResponseDto } from '@k9-sak-web/backend/ungsak/kontrakt/vilkår/bosted/BostedGrunnlagResponseDto.js';
import type { VilkårMedPerioderDto } from '@k9-sak-web/backend/ungsak/kontrakt/vilkår/VilkårMedPerioderDto.js';
import { formatDate } from '@k9-sak-web/gui/utils/formatters.js';
import { Alert, BodyShort, Box, Button, HStack, Label, Radio, Tag, VStack } from '@navikt/ds-react';
import { RhfForm, RhfRadioGroup, RhfTextarea } from '@navikt/ft-form-hooks';
import { required } from '@navikt/ft-form-validators';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ProsessStegIkkeBehandlet } from '../../behandling/prosess/ProsessStegIkkeBehandlet';
import { Lovreferanse } from '../../shared/lovreferanse/Lovreferanse';
import { VurdertAv } from '../../shared/vurdert-av/VurdertAv';
import type { AktivitetspengerApi } from '../aktivitetspenger-prosess/AktivitetspengerApi';
import { sendTilBeslutter } from './utils/sendTilBeslutter';
import { aksjonspunktErLøst, aksjonspunktErÅpent } from './utils/utils';
import { getPeriodStatus, VilkårSplittPanel, type VilkårSplittPanelPeriod } from './VilkårSplittPanel';

interface Props {
  bostedAp: AksjonspunktDto | undefined;
  lokalkontorForeslårVilkårAp: AksjonspunktDto | undefined;
  bostedVilkår: VilkårMedPerioderDto;
  readOnly: boolean;
  behandling: BehandlingDto;
  api: AktivitetspengerApi;
  onAksjonspunktBekreftet: () => void;
  isPermanentlyReadOnly: boolean;
  bosattFakta: BostedGrunnlagResponseDto;
}

type Vurdering = 'oppfylt' | 'ikkeOppfylt' | '';

interface FormData {
  vurderinger: Record<
    string,
    { begrunnelse: string; bosatt: Vurdering; avslagsårsak?: Avslagsårsak; fritekst?: string }
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
        bosatt: utfallTilVurdering(p.vilkarStatus),
        avslagsårsak: p.avslagKode ? Avslagsårsak[p.avslagKode as keyof typeof Avslagsårsak] : undefined,
      },
    ]),
  ),
});

export const Bosted = ({
  bostedVilkår,
  readOnly,
  api,
  behandling,
  onAksjonspunktBekreftet,
  bostedAp,
  lokalkontorForeslårVilkårAp,
  isPermanentlyReadOnly,
  bosattFakta,
}: Props) => {
  const periods: VilkårSplittPanelPeriod[] = (bostedVilkår?.perioder ?? []).map(p => ({
    id: p.periode.fom,
    status: getPeriodStatus(p.vilkarStatus),
    label: `${formatDate(p.periode.fom)}`,
    periode: p.periode,
  }));
  const [selectedId, setSelectedId] = useState(periods[0]?.id ?? '');
  const formHook = useForm<FormData>({
    defaultValues: buildInitialValues(bostedVilkår),
  });

  const { mutateAsync: bekreftAksjonspunktMutation, isPending } = useMutation({
    mutationFn: async (data: FormData) => {
      const vurdering = data.vurderinger[selectedId];
      const selectedItem = periods.find(period => period.id === selectedId);
      if (!selectedItem) {
        throw new Error('Kunne ikke finne valgt periode for bostedsvilkår');
      }
      const vurdertePerioder = {
        avslagsårsak: vurdering?.bosatt !== 'oppfylt' ? vurdering?.avslagsårsak : undefined,
        begrunnelse: vurdering?.begrunnelse ?? '',
        erVilkårOppfylt: vurdering?.bosatt === 'oppfylt',
        periode: selectedItem.periode,
        fritekstVurderingBrev: vurdering?.avslagsårsak === Avslagsårsak.ANNET ? vurdering?.fritekst : undefined,
      };

      const payload = {
        '@type': AksjonspunktDefinisjon.VURDER_BOSTEDVILKÅR,
        begrunnelse: vurdering?.begrunnelse ?? '',
        vurdertePerioder: [vurdertePerioder],
      };

      await api.bekreftAksjonspunkt(behandling.uuid, behandling.versjon, [payload]);
    },
    onSuccess: () => {
      onAksjonspunktBekreftet();
    },
  });

  const { mutateAsync: sendTilBeslutterMutation, isPending: isSendingTilBeslutter } = useMutation({
    mutationFn: async () => sendTilBeslutter(api, behandling),
    onSuccess: () => {
      onAksjonspunktBekreftet();
    },
  });

  const isBostedApSolved = aksjonspunktErLøst(bostedAp);
  const selectedBosattFaktaPeriode = bosattFakta.perioder.find(p => p.fom === selectedId);
  const bosatt = formHook.watch(`vurderinger.${selectedId}.bosatt`);
  const avslagsårsak = formHook.watch(`vurderinger.${selectedId}.avslagsårsak`);
  const harAvslagIBosted = bostedVilkår.perioder?.some(p => p.vilkarStatus === Utfall.IKKE_OPPFYLT);
  const skalViseSendTilBeslutter =
    !!harAvslagIBosted &&
    !!lokalkontorForeslårVilkårAp &&
    aksjonspunktErÅpent(lokalkontorForeslårVilkårAp) &&
    !readOnly;

  if (!bostedVilkår) {
    return null;
  }
  if (!bostedAp && !bostedVilkår.perioder?.some(p => p.vilkarStatus !== Utfall.IKKE_VURDERT)) {
    return <ProsessStegIkkeBehandlet />;
  }

  return (
    <VStack gap="space-20">
      {!isBostedApSolved && (
        <Alert variant="warning" size="small">
          Vurder om søker er bosatt i Trondheim kommune på søknadstidspunktet.
        </Alert>
      )}
      <VilkårSplittPanel
        periods={periods}
        selectedItemId={selectedId}
        onItemSelect={setSelectedId}
        detailHeading="Vurdering av bostedsvilkår"
        lovreferanse={bostedVilkår.lovReferanse}
        defaultIsLocked={isBostedApSolved}
        readOnly={readOnly}
        lockedContent={isBostedApSolved ? <VurdertAv ident={bostedAp?.ansvarligSaksbehandler} /> : undefined}
        afterEditButton={
          skalViseSendTilBeslutter ? (
            <VStack gap="space-20">
              <Alert variant="info" size="small">
                Behandlingen vil gå videre til avslag. Øvrige inngangsvilkår vil ikke bli behandlet.
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
        isPermanentlyReadOnly={isPermanentlyReadOnly}
      >
        {(isFormLocked: boolean, setIsFormLocked: React.Dispatch<React.SetStateAction<boolean>>) => (
          <VStack gap="space-24">
            <VStack gap="space-8">
              <Label size="small" as="p">
                Bor søker i Trondheim kommune?
              </Label>
              {selectedBosattFaktaPeriode && (
                <HStack gap="space-8" align="center">
                  <BodyShort size="small">{selectedBosattFaktaPeriode.erBosattITrondheim ? 'Ja' : 'Nei'}</BodyShort>
                  <Tag variant="outline" size="small">
                    {selectedBosattFaktaPeriode.kilde === Kilde.SØKNAD ? 'Fra søknad' : 'Saksbehandler'}
                  </Tag>
                </HStack>
              )}
            </VStack>
            <RhfForm
              formMethods={formHook}
              onSubmit={async data => {
                await bekreftAksjonspunktMutation(data);
                setIsFormLocked(true);
              }}
            >
              <VStack gap="space-24" width="70ch">
                <RhfTextarea
                  control={formHook.control}
                  name={`vurderinger.${selectedId}.begrunnelse`}
                  readOnly={isFormLocked}
                  label={
                    <span>
                      Vurder om søker er bosatt i Trondheim kommune, jmf.{' '}
                      {bostedVilkår.lovReferanse && <Lovreferanse isUng>{bostedVilkår.lovReferanse}</Lovreferanse>}
                    </span>
                  }
                />
                <RhfRadioGroup
                  key={`${selectedId}-bosatt`}
                  control={formHook.control}
                  name={`vurderinger.${selectedId}.bosatt`}
                  legend="Er søker bosatt i Trondheim kommune?"
                  validate={[required]}
                  readOnly={isFormLocked}
                >
                  <Radio value="oppfylt">Ja</Radio>
                  <Radio value="ikkeOppfylt">Nei</Radio>
                </RhfRadioGroup>
                {bosatt === 'ikkeOppfylt' && (
                  <RhfRadioGroup
                    key={`${selectedId}-avslagsårsak`}
                    control={formHook.control}
                    name={`vurderinger.${selectedId}.avslagsårsak`}
                    legend="Avslagsårsak"
                    validate={[required]}
                    readOnly={isFormLocked}
                  >
                    <Radio value={Avslagsårsak.YTELSE_IKKE_TILGJENGELIG_PÅ_BOSTED}>
                      Ikke bosattadresse i Trondheim
                    </Radio>
                    <Radio value={Avslagsårsak.YTELSE_IKKE_TILGJENGELIG_PÅ_FOLKEREGISTRERT_ELLER_BOSTEDSADRESSE}>
                      Ikke bostedsadresse i Trondheim, og heller ikke folkeregistrert i Trondheim
                    </Radio>
                    <Radio value={Avslagsårsak.YTELSE_IKKE_PÅ_ARBEIDSSTED_STUDIESTED}>
                      Har studie/arbeidssted utenfor Trondheim
                    </Radio>
                    <Radio value={Avslagsårsak.ANNET}>Fritekst</Radio>
                  </RhfRadioGroup>
                )}
                {avslagsårsak === Avslagsårsak.ANNET && (
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
          </VStack>
        )}
      </VilkårSplittPanel>
    </VStack>
  );
};
