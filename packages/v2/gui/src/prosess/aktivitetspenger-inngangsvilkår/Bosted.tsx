import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { Kilde } from '@k9-sak-web/backend/ungsak/kodeverk/bosatt/Kilde.js';
import { BostedsvilkårIkkeOppfyltÅrsak } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/BostedsvilkårIkkeOppfyltÅrsak.js';
import { Utfall } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/Utfall.js';
import { vilkarType } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/VilkårType.js';
import type { AksjonspunktDto } from '@k9-sak-web/backend/ungsak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import type { BehandlingDto } from '@k9-sak-web/backend/ungsak/kontrakt/behandling/BehandlingDto.js';
import type {
  BostedGrunnlagResponseDto,
  VilkårBostedPeriodeVurderingDto,
} from '@k9-sak-web/backend/ungsak/kontrakt/vilkår/bosted/BostedGrunnlagResponseDto.js';
import type { VilkårMedPerioderDto } from '@k9-sak-web/backend/ungsak/kontrakt/vilkår/VilkårMedPerioderDto.js';
import { formatDate } from '@k9-sak-web/gui/utils/formatters.js';
import { Alert, BodyShort, Box, Button, HStack, Label, Radio, Tag, VStack } from '@navikt/ds-react';
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
import {
  getPeriodStatus,
  VilkårSplittPanel,
  type VilkårSplittPanelPeriod,
} from '../../shared/vilkårSplittPanel/VilkårSplittPanel';
import { VurdertAv } from '../../shared/vurdert-av/VurdertAv';
import { sendTilBeslutter } from '../aktivitetspenger-felles/utils/sendTilBeslutter.js';
import { aksjonspunktErLøst, aksjonspunktErÅpent } from '../aktivitetspenger-felles/utils/utils.js';
import type { AktivitetspengerApi } from '../aktivitetspenger-prosess/AktivitetspengerApi';
import { perioderSomKanAvkortesQueryOptions } from '../aktivitetspenger-prosess/aktivitetspengerQueryOptions';
import type { MuligAvkortingPeriode } from '@k9-sak-web/backend/ungsak/kontrakt/aktivitetspenger/MuligAvkortingPeriode.js';
import { opphørsårsakLabels } from '../aktivitetspenger-prosess/types.js';
import { byggVisningsperioder, type VilkårPeriodeVisning } from '../aktivitetspenger-felles/utils/visningsperioder.js';

interface Props {
  bostedAp: AksjonspunktDto | undefined;
  lokalkontorForeslårVilkårAp: AksjonspunktDto | undefined;
  bostedVilkår: VilkårMedPerioderDto;
  readOnly: boolean;
  behandling: BehandlingDto;
  api: AktivitetspengerApi;
  onAksjonspunktBekreftet: () => Promise<void>;
  isPermanentlyReadOnly: boolean;
  bostedGrunnlag: BostedGrunnlagResponseDto;
}

type Vurdering = 'oppfylt' | 'ikkeOppfylt' | '';

interface FormData {
  vurderinger: Record<
    string,
    {
      begrunnelse: string;
      bosatt: Vurdering;
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
        bosatt: utfallTilVurdering(p.vilkarStatus),
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

export const Bosted = ({
  bostedVilkår,
  readOnly,
  api,
  behandling,
  onAksjonspunktBekreftet,
  bostedAp,
  lokalkontorForeslårVilkårAp,
  isPermanentlyReadOnly,
  bostedGrunnlag,
}: Props) => {
  const { data: avkortingsperioder } = useQuery(perioderSomKanAvkortesQueryOptions(api, behandling));
  const avkortingsperiodeBosted = avkortingsperioder?.resultat.find(v => v.vilkårType === vilkarType.BOSTEDSVILKÅR);
  const søknadsperioder = byggVisningsperioder(bostedVilkår, avkortingsperiodeBosted?.perioder ?? []);
  const periods: VilkårSplittPanelPeriod[] = søknadsperioder.map(periode => {
    return {
      id: periode.periode.fom,
      status: getPeriodStatus(periode.vilkarStatus),
      label: `${formatDate(periode.periode.fom)}${periode.avkortetPeriodeInfo ? ` - ${formatDate(periode.avkortetPeriodeInfo.periode.tom)}` : ''}`,
      periode: {
        fom: periode.periode.fom,
        tom: periode.periode.tom,
      },
    };
  });
  const formHook = useForm<FormData>({
    defaultValues: buildInitialValues(søknadsperioder),
  });

  const [selectedId, setSelectedId] = useState(periods[0]?.id ?? '');
  useEffect(() => {
    if (!periods.some(period => period.id === selectedId)) {
      setSelectedId('');
    }
  }, [periods, selectedId]);
  const { mutateAsync: bekreftAksjonspunktMutation, isPending } = useMutation({
    mutationFn: async (data: FormData) => {
      const vurdering = data.vurderinger[selectedId];
      const selectedItem = periods.find(period => period.id === selectedId);
      if (!selectedItem || !vurdering) {
        throw new Error('Kunne ikke finne valgt periode for bostedsvilkår');
      }
      const redigerMaksdatoAktiv =
        vurdering?.bosatt === 'oppfylt' &&
        vurdering?.redigerMaksdato &&
        vurdering.tom !== vurdering.muligAvkortingPeriode.tom;
      const begrunnelseInnvilget = vurdering?.begrunnelse ?? '';
      const begrunnelseAvkortet = vurdering?.begrunnelseKortereMaksdato ?? '';
      const vurdertePerioder: VilkårBostedPeriodeVurderingDto[] = [
        {
          avslagsårsak:
            vurdering?.bosatt !== 'oppfylt' ? BostedsvilkårIkkeOppfyltÅrsak.IKKE_BOSATTADRESSE_I_TRONDHEIM : undefined,
          begrunnelse: begrunnelseInnvilget,
          erVilkårOppfylt: vurdering?.bosatt === 'oppfylt',
          periode: {
            fom: vurdering.fom,
            tom: redigerMaksdatoAktiv ? vurdering.tom : vurdering.muligAvkortingPeriode.tom,
          },
          fritekstVurderingBrev:
            vurdering?.avslagsårsak === BostedsvilkårIkkeOppfyltÅrsak.ANNET ? vurdering?.fritekst : undefined,
        },
      ];
      if (redigerMaksdatoAktiv) {
        vurdertePerioder.push({
          avslagsårsak: BostedsvilkårIkkeOppfyltÅrsak.AVKORTET,
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
        '@type': AksjonspunktDefinisjon.VURDER_BOSTEDVILKÅR,
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

  // hold valgt periode gyldig hvis grupperingen endrer seg etter en refetch

  const isBostedApSolved = aksjonspunktErLøst(bostedAp);
  const selectedBostedGrunnlagPeriode = bostedGrunnlag.perioder.find(p => p.fom === selectedId);
  const bosatt = formHook.watch(`vurderinger.${selectedId}.bosatt`);
  const avslagsårsak = formHook.watch(`vurderinger.${selectedId}.avslagsårsak`);
  const redigerMaksdato = formHook.watch(`vurderinger.${selectedId}.redigerMaksdato`);
  const harAvslagIBosted = bostedVilkår.perioder?.some(p => p.vilkarStatus === Utfall.IKKE_OPPFYLT);

  // finner avkortingsperioden som overlapper valgt periode
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

  const vurdering = formHook.watch(`vurderinger.${selectedId}`);
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
        detailHeading="Vurdering av bosatt i Trondheim kommune"
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
        {(
          isFormLocked: boolean,
          setIsFormLocked: React.Dispatch<React.SetStateAction<boolean>>,
          isDefaultLocked: boolean,
        ) => (
          <VStack gap="space-24">
            <VStack gap="space-8">
              <Label size="small" as="p">
                Bor søker i Trondheim kommune?
              </Label>
              {selectedBostedGrunnlagPeriode && (
                <HStack gap="space-8" align="center">
                  <BodyShort size="small">{selectedBostedGrunnlagPeriode.erBosattITrondheim ? 'Ja' : 'Nei'}</BodyShort>
                  <Tag variant="outline" size="small" data-color={!isFormLocked ? 'info' : undefined}>
                    {selectedBostedGrunnlagPeriode.kilde === Kilde.SØKNAD ? 'Fra søknad' : 'Saksbehandler'}
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
              <VStack gap="space-24" maxWidth="70ch" width="100%">
                <RhfTextarea
                  control={formHook.control}
                  name={`vurderinger.${selectedId}.begrunnelse`}
                  readOnly={isFormLocked}
                  label={
                    <span>
                      Vurder om søker er bosatt i Trondheim kommune, jf.{' '}
                      {bostedVilkår.lovReferanse && <Lovreferanse isUng>{bostedVilkår.lovReferanse}</Lovreferanse>}
                    </span>
                  }
                  validate={[required, minLength(3), maxLength(4000)]}
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
                    <>
                      {Object.values(BostedsvilkårIkkeOppfyltÅrsak)
                        .filter(
                          årsak =>
                            årsak === BostedsvilkårIkkeOppfyltÅrsak.IKKE_BOSATTADRESSE_I_TRONDHEIM ||
                            årsak ===
                              BostedsvilkårIkkeOppfyltÅrsak.IKKE_BOSTEDSADRESSE_OG_IKKE_FOLKEREGISTRERT_I_TRONDHEIM ||
                            årsak === BostedsvilkårIkkeOppfyltÅrsak.STUDIE_ELLER_ARBEIDSSTED_UTENFOR_TRONDHEIM ||
                            årsak === BostedsvilkårIkkeOppfyltÅrsak.ANNET,
                        )
                        .map(årsak => (
                          <Radio key={årsak} value={årsak}>
                            {opphørsårsakLabels[årsak]}
                          </Radio>
                        ))}
                    </>
                  </RhfRadioGroup>
                )}
                {avslagsårsak === BostedsvilkårIkkeOppfyltÅrsak.ANNET && (
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
                {bosatt === 'oppfylt' && (
                  <VStack gap="space-8">
                    <Label size="small" as="p">
                      Bosatt i Trondheim kommune:
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
          </VStack>
        )}
      </VilkårSplittPanel>
    </VStack>
  );
};
