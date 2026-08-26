import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { Kilde } from '@k9-sak-web/backend/ungsak/kodeverk/bosatt/Kilde.js';
import { Avslagsårsak } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/Avslagsårsak.js';
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
import { required } from '@navikt/ft-form-validators';
import { ISO_DATE_FORMAT } from '@navikt/ft-utils';
import { useMutation, useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ProsessStegIkkeBehandlet } from '../../behandling/prosess/ProsessStegIkkeBehandlet';
import Datovelger from '../../shared/datovelger/Datovelger';
import { Lovreferanse } from '../../shared/lovreferanse/Lovreferanse';
import { VurdertAv } from '../../shared/vurdert-av/VurdertAv';
import type { AktivitetspengerApi } from '../aktivitetspenger-prosess/AktivitetspengerApi';
import { perioderSomKanAvkortesQueryOptions } from '../aktivitetspenger-prosess/aktivitetspengerQueryOptions';
import { sendTilBeslutter } from './utils/sendTilBeslutter';
import { aksjonspunktErLøst, aksjonspunktErÅpent } from './utils/utils';
import { getPeriodStatus, VilkårSplittPanel, type VilkårSplittPanelPeriod } from './VilkårSplittPanel';
import { checkIfPeriodsAreEdgeToEdge, isPeriodCoveredByPeriod } from '@k9-sak-web/lib/dateUtils/dateUtils.js';
import type { MuligAvkortingPeriode } from '@k9-sak-web/backend/ungsak/kontrakt/aktivitetspenger/MuligAvkortingPeriode.js';
import type { ung_sak_kontrakt_vilkår_VilkårPeriodeDto } from '@k9-sak-web/backend/ungsak/generated/types.js';

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
    {
      begrunnelse: string;
      bosatt: Vurdering;
      avslagsårsak?: string;
      fritekst?: string;
      fom: string;
      tom: string;
      maksdatoØvreGrense: string;
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

type VilkårPeriodeVisning = ung_sak_kontrakt_vilkår_VilkårPeriodeDto & {
  muligAvkortingPeriode: MuligAvkortingPeriode;
  avkortetPeriodeInfo?: {
    begrunnelse: string;
    periode: {
      fom: string;
      tom: string;
    };
  };
};

const slåSammenPerioder = (vilkårMedPerioder: VilkårMedPerioderDto, avkortingsperioder: MuligAvkortingPeriode[]) => {
  const perioderFraVilkår = vilkårMedPerioder.perioder ?? [];
  const visningsperioder: VilkårPeriodeVisning[] = [];
  avkortingsperioder
    .map(avkortingsperiode => ({
      fom: dayjs(avkortingsperiode.fom).subtract(1, 'day').format(ISO_DATE_FORMAT),
      tom: avkortingsperiode.tom,
    }))
    .forEach(avkortingsperiode => {
      console.log('avkortingsperiode', avkortingsperiode);
      console.log('perioderFraVilkår', perioderFraVilkår);

      const vilkårISammePeriode = perioderFraVilkår
        .filter(vilkårPeriode => isPeriodCoveredByPeriod(avkortingsperiode, vilkårPeriode.periode))
        .toSorted((a, b) => new Date(a.periode.fom).getTime() - new Date(b.periode.fom).getTime())
        .map(vilkårPeriode => ({ ...vilkårPeriode, muligAvkortingPeriode: avkortingsperiode }));
      console.log('vilkårISammePeriode', vilkårISammePeriode);
      if (vilkårISammePeriode.length > 1) {
        const førstePeriode = vilkårISammePeriode[0];
        const avkortetPeriodeKantIKant = [...vilkårISammePeriode]
          .slice(1)
          .find(p => førstePeriode && checkIfPeriodsAreEdgeToEdge(førstePeriode.periode, p.periode));
        if (førstePeriode?.vilkarStatus === Utfall.OPPFYLT && avkortetPeriodeKantIKant) {
          const rest = vilkårISammePeriode.filter(p => p !== førstePeriode && p !== avkortetPeriodeKantIKant);
          return visningsperioder.push(
            {
              ...førstePeriode,
              avkortetPeriodeInfo: {
                begrunnelse: avkortetPeriodeKantIKant.begrunnelse ?? '',
                periode: {
                  fom: avkortetPeriodeKantIKant.periode.fom,
                  tom: avkortetPeriodeKantIKant.periode.tom,
                },
              },
            },
            ...rest,
          );
        }
        return visningsperioder.push(...vilkårISammePeriode);
      }
      return visningsperioder.push(...vilkårISammePeriode);
    });
  return visningsperioder;
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
        redigerMaksdato: false,
        begrunnelseKortereMaksdato: p.avkortetPeriodeInfo?.begrunnelse ?? '',
        maksdatoØvreGrense: p.muligAvkortingPeriode.tom,
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
  const { data: avkortingsperioder } = useQuery(perioderSomKanAvkortesQueryOptions(api, behandling));
  const avkortingsperiodeBosted = avkortingsperioder?.resultat.find(v => v.vilkårType === vilkarType.BOSTEDSVILKÅR);
  const søknadsperioder = slåSammenPerioder(bostedVilkår, avkortingsperiodeBosted?.perioder ?? []);
  const periods: VilkårSplittPanelPeriod[] = søknadsperioder.map(periode => {
    return {
      id: periode.periode.fom,
      status: getPeriodStatus(periode.vilkarStatus),
      label: `${formatDate(periode.periode.fom)}`,
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
      setSelectedId(periods[0]?.id ?? '');
    }
  }, [periods, selectedId]);
  const { mutateAsync: bekreftAksjonspunktMutation, isPending } = useMutation({
    mutationFn: async (data: FormData) => {
      const vurdering = data.vurderinger[selectedId];
      const selectedItem = periods.find(period => period.id === selectedId);
      if (!selectedItem || !vurdering) {
        throw new Error('Kunne ikke finne valgt periode for bostedsvilkår');
      }
      const redigerMaksdatoAktiv = vurdering?.bosatt === 'oppfylt' && vurdering?.redigerMaksdato;
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
            tom: redigerMaksdatoAktiv ? vurdering.tom : vurdering.maksdatoØvreGrense,
          },
          fritekstVurderingBrev: vurdering?.avslagsårsak === 'fritekst' ? vurdering?.fritekst : undefined,
        },
      ];
      if (redigerMaksdatoAktiv) {
        vurdertePerioder.push({
          avslagsårsak: BostedsvilkårIkkeOppfyltÅrsak.AVKORTET,
          begrunnelse: begrunnelseAvkortet,
          erVilkårOppfylt: false,
          periode: {
            fom: dayjs(vurdering.tom).add(1, 'day').format(ISO_DATE_FORMAT),
            tom: vurdering.maksdatoØvreGrense,
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

  // hold valgt periode gyldig hvis grupperingen endrer seg etter en refetch

  const isBostedApSolved = aksjonspunktErLøst(bostedAp);
  const selectedBosattFaktaPeriode = bosattFakta.perioder.find(p => p.fom === selectedId);
  const bosatt = formHook.watch(`vurderinger.${selectedId}.bosatt`);
  const avslagsårsak = formHook.watch(`vurderinger.${selectedId}.avslagsårsak`);
  const redigerMaksdato = formHook.watch(`vurderinger.${selectedId}.redigerMaksdato`);
  const harAvslagIBosted = bostedVilkår.perioder?.some(p => p.vilkarStatus === Utfall.IKKE_OPPFYLT);

  const selectedItem = periods.find(period => period.id === selectedId);
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

  const maksdatoØvreGrense = formHook.watch(`vurderinger.${selectedId}.maksdatoØvreGrense`);
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
                  validate={[required]}
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
                      Ytelse ikke tilgjengelig på bosted
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
                        validate={[required]}
                        fromDate={selectedItem ? new Date(selectedItem.periode.fom) : undefined}
                        toDate={selectedItem ? new Date(maksdatoØvreGrense) : undefined}
                      />
                      <RhfCheckbox
                        control={formHook.control}
                        name={`vurderinger.${selectedId}.redigerMaksdato`}
                        label="Rediger maksdato"
                        readOnly={isFormLocked}
                      />
                    </HStack>
                    {redigerMaksdato && (
                      <VStack gap="space-8">
                        <Label size="small" as="p">
                          Vurdering av avkortet periode
                        </Label>
                        <RhfTextarea
                          key={`${selectedId}-begrunnelseKortereMaksdato`}
                          control={formHook.control}
                          name={`vurderinger.${selectedId}.begrunnelseKortereMaksdato`}
                          label="Begrunn kortere periode enn 260 dager"
                          validate={[required]}
                          readOnly={isFormLocked}
                        />
                      </VStack>
                    )}
                  </VStack>
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
