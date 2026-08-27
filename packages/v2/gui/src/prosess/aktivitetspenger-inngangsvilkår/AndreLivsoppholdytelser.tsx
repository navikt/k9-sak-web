import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { AndreLivsoppholdsytelserIkkeOppfyltÅrsak } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/AndreLivsoppholdsytelserIkkeOppfyltÅrsak.js';
import { Avslagsårsak } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/Avslagsårsak.js';
import { Utfall } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/Utfall.js';
import { vilkarType } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/VilkårType.js';
import type { MuligAvkortingPeriode } from '@k9-sak-web/backend/ungsak/kontrakt/aktivitetspenger/MuligAvkortingPeriode.js';
import type { AksjonspunktDto } from '@k9-sak-web/backend/ungsak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import type { BehandlingDto } from '@k9-sak-web/backend/ungsak/kontrakt/behandling/BehandlingDto.js';
import type { VilkårLivsoppholdsytelserPeriodeVurderingDto } from '@k9-sak-web/backend/ungsak/kontrakt/vilkår/livsopphold/VilkårLivsoppholdsytelserPeriodeVurderingDto.js';
import type { VilkårMedPerioderDto } from '@k9-sak-web/backend/ungsak/kontrakt/vilkår/VilkårMedPerioderDto.js';
import { formatDate } from '@k9-sak-web/gui/utils/formatters.js';
import { Alert, BodyLong, BodyShort, Box, Button, HStack, Label, Radio, VStack } from '@navikt/ds-react';
import { RhfCheckbox, RhfForm, RhfRadioGroup, RhfTextarea } from '@navikt/ft-form-hooks';
import { maxLength, minLength, required } from '@navikt/ft-form-validators';
import { ISO_DATE_FORMAT } from '@navikt/ft-utils';
import { useMutation, useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ProsessStegIkkeBehandlet } from '../../behandling/prosess/ProsessStegIkkeBehandlet';
import Datovelger from '../../shared/datovelger/Datovelger';
import { Lovreferanse } from '../../shared/lovreferanse/Lovreferanse';
import { LabelledContent } from '../../shared/labelled-content/LabelledContent';
import {
  getPeriodStatus,
  VilkårSplittPanel,
  type VilkårSplittPanelPeriod,
} from '../../shared/vilkårSplittPanel/VilkårSplittPanel';
import { VurdertAv } from '../../shared/vurdert-av/VurdertAv';
import { byggVisningsperioder, type VilkårPeriodeVisning } from '../aktivitetspenger-felles/utils/visningsperioder.js';
import { sendTilBeslutter } from '../aktivitetspenger-felles/utils/sendTilBeslutter';
import { aksjonspunktErLøst, aksjonspunktErÅpent } from '../aktivitetspenger-felles/utils/utils';
import type { AktivitetspengerApi } from '../aktivitetspenger-prosess/AktivitetspengerApi';
import { perioderSomKanAvkortesQueryOptions } from '../aktivitetspenger-prosess/aktivitetspengerQueryOptions';

interface Props {
  andreLivsoppholdytelserAp: AksjonspunktDto | undefined;
  lokalkontorForeslårVilkårAp: AksjonspunktDto | undefined;
  andreLivsoppholdytelserVilkår: VilkårMedPerioderDto;
  readOnly: boolean;
  behandling: BehandlingDto;
  api: AktivitetspengerApi;
  onAksjonspunktBekreftet: () => Promise<void>;
  isPermanentlyReadOnly: boolean;
}

type Vurdering = 'oppfylt' | 'ikkeOppfylt' | '';

const avslagsårsakLabels: Record<string, string> = {
  [Avslagsårsak.SØKER_HAR_ANNEN_LIVSOPPHOLDSYTELSE]: 'Søker har annen livsoppholdytelse',
  fritekst: 'Fritekst',
};

interface FormData {
  vurderinger: Record<
    string,
    {
      begrunnelse: string;
      andreLivsoppholdytelser: Vurdering;
      avslagsårsak?: string;
      fritekst?: string;
      fom: string;
      tom: string;
      muligAvkortingPeriode: MuligAvkortingPeriode;
      redigerMaksdato: boolean;
      begrunnelseKortereMaksdato?: string;
    }
  >;
}

const utfallTilVurdering = (utfall: string): Vurdering => {
  if (utfall === Utfall.OPPFYLT) return 'oppfylt';
  if (utfall === Utfall.IKKE_OPPFYLT) return 'ikkeOppfylt';
  return '';
};

const buildInitialValues = (vilkår: VilkårPeriodeVisning[]): FormData => ({
  vurderinger: Object.fromEntries(
    vilkår.map(p => [
      p.periode.fom,
      {
        begrunnelse: p.begrunnelse ?? '',
        andreLivsoppholdytelser: utfallTilVurdering(p.vilkarStatus),
        avslagsårsak: p.avslagKode,
        fritekst: p.fritekstVurderingBrev,
        fom: p.periode.fom,
        tom: p.periode.tom ?? p.muligAvkortingPeriode.tom,
        redigerMaksdato: p.avkortetPeriodeInfo ? true : false,
        begrunnelseKortereMaksdato: p.avkortetPeriodeInfo?.begrunnelse ?? '',
        muligAvkortingPeriode: p.muligAvkortingPeriode,
      },
    ]),
  ),
});
export const AndreLivsoppholdytelser = ({
  andreLivsoppholdytelserAp,
  lokalkontorForeslårVilkårAp,
  andreLivsoppholdytelserVilkår,
  readOnly,
  api,
  behandling,
  onAksjonspunktBekreftet,
  isPermanentlyReadOnly,
}: Props) => {
  const { data: avkortingsperioder } = useQuery(perioderSomKanAvkortesQueryOptions(api, behandling));
  const avkortingsperiodeLivsopphold = avkortingsperioder?.resultat.find(
    v => v.vilkårType === vilkarType.ANDRE_LIVSOPPHOLDSYTELSER_VILKÅR,
  );
  const søknadsperioder = byggVisningsperioder(
    andreLivsoppholdytelserVilkår,
    avkortingsperiodeLivsopphold?.perioder ?? [],
  );
  const periods: VilkårSplittPanelPeriod[] = søknadsperioder.map(periode => ({
    id: periode.periode.fom,
    status: getPeriodStatus(periode.vilkarStatus),
    label: `${formatDate(periode.periode.fom)}${periode.avkortetPeriodeInfo ? ` - ${formatDate(periode.avkortetPeriodeInfo.periode.tom)}` : ''}`,
    periode: periode.periode,
  }));
  const [selectedId, setSelectedId] = useState(periods[0]?.id ?? '');
  useEffect(() => {
    if (!periods.some(period => period.id === selectedId)) {
      setSelectedId('');
    }
  }, [periods, selectedId]);
  const isAndreLivsoppholdytelserApSolved = aksjonspunktErLøst(andreLivsoppholdytelserAp);
  const formHook = useForm<FormData>({
    defaultValues: buildInitialValues(søknadsperioder),
  });

  const { mutateAsync: bekreftAksjonspunktMutation, isPending } = useMutation({
    mutationFn: async (data: FormData) => {
      const vurdering = data.vurderinger[selectedId];
      const selectedItem = periods.find(period => period.id === selectedId);
      if (!selectedItem || selectedItem.periode === undefined || !vurdering) {
        throw new Error('Kunne ikke finne valgt periode for andre livsoppholdytelser vilkår');
      }
      const redigerMaksdatoAktiv =
        vurdering.andreLivsoppholdytelser === 'oppfylt' &&
        vurdering.redigerMaksdato &&
        vurdering.tom !== vurdering.muligAvkortingPeriode.tom;
      const begrunnelseInnvilget = vurdering.begrunnelse ?? '';
      const begrunnelseAvkortet = vurdering.begrunnelseKortereMaksdato ?? '';
      const vurdertePerioder: VilkårLivsoppholdsytelserPeriodeVurderingDto[] = [
        {
          avslagsårsak:
            vurdering.andreLivsoppholdytelser !== 'oppfylt'
              ? AndreLivsoppholdsytelserIkkeOppfyltÅrsak.HAR_ANNEN_LIVSOPPHOLDSYTELSE
              : undefined,
          begrunnelse: begrunnelseInnvilget,
          erVilkårOppfylt: vurdering.andreLivsoppholdytelser === 'oppfylt',
          periode: {
            fom: vurdering.fom,
            tom: redigerMaksdatoAktiv ? vurdering.tom : vurdering.muligAvkortingPeriode.tom,
          },
          fritekstVurderingBrev: vurdering.avslagsårsak === 'fritekst' ? vurdering.fritekst : undefined,
        },
      ];
      if (redigerMaksdatoAktiv) {
        vurdertePerioder.push({
          avslagsårsak: AndreLivsoppholdsytelserIkkeOppfyltÅrsak.AVKORTET,
          begrunnelse: begrunnelseAvkortet,
          erVilkårOppfylt: false,
          periode: {
            fom: dayjs(vurdering.tom).add(1, 'day').format(ISO_DATE_FORMAT),
            tom: vurdering.muligAvkortingPeriode.tom,
          },
          fritekstVurderingBrev: undefined,
        });
      }

      const payload = {
        '@type': AksjonspunktDefinisjon.VURDER_ANDRE_LIVSOPPHOLDSYTELSER,
        begrunnelse: redigerMaksdatoAktiv
          ? `${begrunnelseInnvilget}\n\n${begrunnelseAvkortet}`.trim()
          : begrunnelseInnvilget,
        vurdertePerioder,
      };

      await api.bekreftAksjonspunkt(behandling.uuid, behandling.versjon, [payload]);
    },
    onSuccess: async () => {
      await onAksjonspunktBekreftet();
    },
  });

  const { mutateAsync: sendTilBeslutterMutation, isPending: isSendingTilBeslutter } = useMutation({
    mutationFn: async () => sendTilBeslutter(api, behandling),
    onSuccess: async () => {
      await onAksjonspunktBekreftet();
    },
  });

  const andreLivsoppholdytelser = formHook.watch(`vurderinger.${selectedId}.andreLivsoppholdytelser`);
  const avslagsårsak = formHook.watch(`vurderinger.${selectedId}.avslagsårsak`);
  const redigerMaksdato = formHook.watch(`vurderinger.${selectedId}.redigerMaksdato`);
  const vurdering = formHook.watch(`vurderinger.${selectedId}`);
  const harAvslagIAndreLivsoppholdytelser = andreLivsoppholdytelserVilkår.perioder?.some(
    p => p.vilkarStatus === Utfall.IKKE_OPPFYLT,
  );
  const begrunnelseLabel = (
    <span>
      Vurder om søker mottar andre livsoppholdsytelser, jf.{' '}
      {andreLivsoppholdytelserVilkår.lovReferanse && (
        <Lovreferanse isUng>{andreLivsoppholdytelserVilkår.lovReferanse}</Lovreferanse>
      )}
    </span>
  );
  const skalViseSendTilBeslutter =
    !!harAvslagIAndreLivsoppholdytelser &&
    !!lokalkontorForeslårVilkårAp &&
    aksjonspunktErÅpent(lokalkontorForeslårVilkårAp) &&
    !readOnly;

  if (!andreLivsoppholdytelserVilkår) {
    return null;
  }
  if (
    !andreLivsoppholdytelserAp &&
    !andreLivsoppholdytelserVilkår.perioder?.some(p => p.vilkarStatus !== Utfall.IKKE_VURDERT)
  ) {
    return <ProsessStegIkkeBehandlet />;
  }

  if (andreLivsoppholdytelserVilkår.perioder?.every(p => p.vilkarStatus === Utfall.IKKE_RELEVANT)) {
    return (
      <Box width="fit-content">
        <Alert variant="info" size="small">
          Ingen perioder å vurdere.
        </Alert>
      </Box>
    );
  }

  return (
    <VStack gap="space-20">
      {!isAndreLivsoppholdytelserApSolved && (
        <Alert variant="warning" size="small">
          Vurder om søker har andre livsoppholdsytelser på søknadstidspunktet.
        </Alert>
      )}
      <VilkårSplittPanel
        periods={periods}
        selectedItemId={selectedId}
        onItemSelect={setSelectedId}
        detailHeading="Vurdering av andre livsoppholdsytelser"
        lovreferanse={andreLivsoppholdytelserVilkår.lovReferanse}
        defaultIsLocked={isAndreLivsoppholdytelserApSolved}
        readOnly={readOnly}
        isPermanentlyReadOnly={isPermanentlyReadOnly}
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
        lockedContent={
          isAndreLivsoppholdytelserApSolved ? (
            <VurdertAv ident={andreLivsoppholdytelserAp?.ansvarligSaksbehandler} />
          ) : undefined
        }
      >
        {(
          isFormLocked: boolean,
          setIsFormLocked: React.Dispatch<React.SetStateAction<boolean>>,
          isDefaultLocked: boolean,
        ) =>
          isFormLocked && vurdering ? (
            <VStack gap="space-24" maxWidth="70ch" width="100%">
              <LabelledContent
                label={begrunnelseLabel}
                indentContent
                content={
                  <BodyLong size="small" className="whitespace-pre-wrap">
                    {vurdering.begrunnelse}
                  </BodyLong>
                }
              />
              <VStack gap="space-8">
                <Label size="small" as="p">
                  Er søker uten andre livsoppholdsytelser?
                </Label>
                <BodyShort size="small">{vurdering.andreLivsoppholdytelser === 'oppfylt' ? 'Ja' : 'Nei'}</BodyShort>
              </VStack>
              {vurdering.andreLivsoppholdytelser === 'ikkeOppfylt' && vurdering.avslagsårsak && (
                <VStack gap="space-8">
                  <Label size="small" as="p">
                    Avslagsårsak
                  </Label>
                  <BodyShort size="small">{avslagsårsakLabels[vurdering.avslagsårsak]}</BodyShort>
                </VStack>
              )}
              {vurdering.andreLivsoppholdytelser === 'ikkeOppfylt' && vurdering.fritekst && (
                <LabelledContent
                  label="Fritekst avslagsbrev"
                  indentContent
                  content={
                    <BodyLong size="small" className="whitespace-pre-wrap">
                      {vurdering.fritekst}
                    </BodyLong>
                  }
                />
              )}
              {vurdering.andreLivsoppholdytelser === 'oppfylt' && (
                <VStack gap="space-8">
                  <Label size="small" as="p">
                    Uten andre livsoppholdsytelser:
                  </Label>
                  <BodyShort size="small">{`${formatDate(vurdering.fom)} – ${formatDate(vurdering.tom)}`}</BodyShort>
                </VStack>
              )}
              {vurdering.andreLivsoppholdytelser === 'oppfylt' && vurdering.redigerMaksdato && (
                <LabelledContent
                  label="Begrunn kortere periode enn 260 dager"
                  indentContent
                  content={
                    <BodyLong size="small" className="whitespace-pre-wrap">
                      {vurdering.begrunnelseKortereMaksdato}
                    </BodyLong>
                  }
                />
              )}
            </VStack>
          ) : (
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
                  name={`vurderinger.${selectedId}.begrunnelse`}
                  readOnly={isFormLocked}
                  label={begrunnelseLabel}
                  validate={[required, minLength(3), maxLength(4000)]}
                />
                <RhfRadioGroup
                  key={`${selectedId}-andreLivsoppholdytelser`}
                  control={formHook.control}
                  name={`vurderinger.${selectedId}.andreLivsoppholdytelser`}
                  legend="Er søker uten andre livsoppholdsytelser?"
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
                    validate={[required, minLength(3), maxLength(4000)]}
                    readOnly={isFormLocked}
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
                        />
                        <Datovelger
                          key={`${selectedId}-maksdato`}
                          name={`vurderinger.${selectedId}.tom`}
                          label="Maksdato"
                          size="small"
                          readOnly={isFormLocked || !redigerMaksdato}
                          validate={[
                            required,
                            value =>
                              redigerMaksdato && value === vurdering?.muligAvkortingPeriode.tom
                                ? 'Velg en tidligere dato, eller fjern avhukingen hvis du vil bruke senest mulig maksdato.'
                                : undefined,
                          ]}
                          fromDate={vurdering ? new Date(vurdering.muligAvkortingPeriode.fom) : undefined}
                          toDate={vurdering ? new Date(vurdering.muligAvkortingPeriode.tom) : undefined}
                        />
                        <RhfCheckbox
                          control={formHook.control}
                          name={`vurderinger.${selectedId}.redigerMaksdato`}
                          label="Rediger maksdato"
                          readOnly={isFormLocked}
                        />
                      </HStack>
                    </VStack>
                    {redigerMaksdato && (
                      <RhfTextarea
                        key={`${selectedId}-begrunnelseKortereMaksdato`}
                        control={formHook.control}
                        name={`vurderinger.${selectedId}.begrunnelseKortereMaksdato`}
                        label="Begrunn kortere periode enn 260 dager"
                        validate={[required]}
                        readOnly={isFormLocked}
                      />
                    )}
                  </VStack>
                )}
                {!isFormLocked && (
                  <HStack gap="space-8">
                    <Button type="submit" size="small" loading={isPending}>
                      Bekreft og fortsett
                    </Button>
                    {isDefaultLocked && (
                      <Button
                        size="small"
                        variant="tertiary"
                        type="button"
                        onClick={() => {
                          formHook.reset(buildInitialValues(søknadsperioder));
                          setIsFormLocked(true);
                        }}
                      >
                        Avbryt
                      </Button>
                    )}
                  </HStack>
                )}
              </VStack>
            </RhfForm>
          )
        }
      </VilkårSplittPanel>
    </VStack>
  );
};
