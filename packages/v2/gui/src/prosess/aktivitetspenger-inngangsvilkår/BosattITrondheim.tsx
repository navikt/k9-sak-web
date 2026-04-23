import { ung_kodeverk_vilkår_VilkårType } from '@k9-sak-web/backend/ungsak/generated/types.js';
import { BostedAksjonspunktKode } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { AksjonspunktStatus } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktStatus.js';
import { Utfall } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/Utfall.js';
import type { AksjonspunktDto } from '@k9-sak-web/backend/ungsak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import type { BostedGrunnlagPeriodeDto } from '@k9-sak-web/backend/ungsak/kontrakt/bosatt/BostedGrunnlagResponseDto.js';
import type { BehandlingDto } from '@k9-sak-web/backend/ungsak/kontrakt/behandling/BehandlingDto.js';
import { formatDate } from '@k9-sak-web/gui/utils/formatters.js';
import { BodyShort, Box, Button, HStack, Radio, Textarea, VStack } from '@navikt/ds-react';
import { RhfForm, RhfRadioGroup, RhfTextarea } from '@navikt/ft-form-hooks';
import { required } from '@navikt/ft-form-validators';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import type { UngSakVilkårMedPerioderDto } from '@k9-sak-web/backend/combined/kontrakt/vilkår/VilkårMedPerioderDto.js';
import type { VilkårSplittPanelItem } from './VilkårSplittPanel.js';
import { VilkårSplittPanel } from './VilkårSplittPanel.js';
import type { AktivitetspengerApi } from '../aktivitetspenger-prosess/AktivitetspengerApi.js';

interface Props {
  aksjonspunkter: AksjonspunktDto[];
  vilkår: UngSakVilkårMedPerioderDto | undefined;
  api: AktivitetspengerApi;
  behandling: BehandlingDto;
  kanSaksbehandle: boolean;
  onAksjonspunktBekreftet: () => void;
}

// --- Form-typer ---

interface VurderPeriodeForm {
  erBosattITrondheim: 'ja' | 'nei' | '';
  begrunnelse: string;
}

interface VurderBostedForm {
  perioder: Record<string, VurderPeriodeForm>;
  brevtekst: string;
}

interface FastsettPeriodeForm {
  foreslåttErGyldig: 'ja' | 'nei' | '';
  nyErBosattITrondheim?: 'ja' | 'nei' | '';
}

interface FastsettBostedForm {
  perioder: Record<string, FastsettPeriodeForm>;
  begrunnelse: string;
}

// --- Hjelpefunksjoner ---

const getItemStatus = (vilkarStatus: string): VilkårSplittPanelItem['status'] => {
  if (vilkarStatus === Utfall.OPPFYLT) return 'success';
  if (vilkarStatus === Utfall.IKKE_OPPFYLT) return 'error';
  return 'warning';
};

const finnÅpentAksjonspunkt = (aksjonspunkter: AksjonspunktDto[], kode: string) =>
  aksjonspunkter.find(ap => ap.definisjon === kode && ap.status !== AksjonspunktStatus.UTFØRT);

// --- VurderBosted-skjema ---

interface VurderBostedSkjemaProps {
  selectedFom: string;
  formMethods: ReturnType<typeof useForm<VurderBostedForm>>;
  isPending: boolean;
  isReadOnly: boolean;
}

const VurderBostedSkjema = ({ selectedFom, formMethods, isPending, isReadOnly }: VurderBostedSkjemaProps) => (
  <VStack gap="space-16">
    <RhfRadioGroup
      key={selectedFom}
      control={formMethods.control}
      name={`perioder.${selectedFom}.erBosattITrondheim`}
      legend="Er bruker bosatt i Trondheim?"
      validate={[required]}
      readOnly={isReadOnly}
    >
      <Radio value="ja">Ja</Radio>
      <Radio value="nei">Nei</Radio>
    </RhfRadioGroup>
    <RhfTextarea
      key={`begrunnelse-${selectedFom}`}
      control={formMethods.control}
      name={`perioder.${selectedFom}.begrunnelse`}
      label="Begrunnelse"
      readOnly={isReadOnly}
    />
    {!isReadOnly && (
      <RhfTextarea
        control={formMethods.control}
        name="brevtekst"
        label="Tekst til bruker (valgfritt)"
        description="Sendes med varselet til bruker"
      />
    )}
    {!isReadOnly && (
      <HStack gap="space-8">
        <Button type="submit" size="small" loading={isPending}>
          Bekreft og send varsel
        </Button>
      </HStack>
    )}
  </VStack>
);

// --- FastsettBosted-skjema ---

interface FastsettBostedSkjemaProps {
  selectedFom: string;
  grunnlagPeriode: BostedGrunnlagPeriodeDto | undefined;
  formMethods: ReturnType<typeof useForm<FastsettBostedForm>>;
  isPending: boolean;
  isReadOnly: boolean;
}

const FastsettBostedSkjema = ({
  selectedFom,
  grunnlagPeriode,
  formMethods,
  isPending,
  isReadOnly,
}: FastsettBostedSkjemaProps) => {
  const foreslåttVerdi = grunnlagPeriode?.foreslåttErBosattITrondheim;
  const watchedGyldig = formMethods.watch(`perioder.${selectedFom}.foreslåttErGyldig`);

  return (
    <VStack gap="space-16">
      {foreslåttVerdi !== undefined && (
        <Box background="neutral-soft" padding="space-12" borderRadius="8">
          <BodyShort size="small" weight="semibold">
            Foreslått vurdering:{' '}
            <span style={{ fontWeight: 'normal' }}>{foreslåttVerdi ? 'Ja – bosatt i Trondheim' : 'Nei – ikke bosatt i Trondheim'}</span>
          </BodyShort>
        </Box>
      )}
      <RhfRadioGroup
        key={selectedFom}
        control={formMethods.control}
        name={`perioder.${selectedFom}.foreslåttErGyldig`}
        legend="Er foreslått vurdering gyldig etter brukerens uttalelse?"
        validate={[required]}
        readOnly={isReadOnly}
      >
        <Radio value="ja">Ja, bekreft foreslått vurdering</Radio>
        <Radio value="nei">Nei, overstyr vurdering</Radio>
      </RhfRadioGroup>
      {watchedGyldig === 'nei' && !isReadOnly && (
        <RhfRadioGroup
          key={`ny-${selectedFom}`}
          control={formMethods.control}
          name={`perioder.${selectedFom}.nyErBosattITrondheim`}
          legend="Ny vurdering: Er bruker bosatt i Trondheim?"
          validate={[required]}
        >
          <Radio value="ja">Ja</Radio>
          <Radio value="nei">Nei</Radio>
        </RhfRadioGroup>
      )}
      {!isReadOnly && (
        <RhfTextarea
          control={formMethods.control}
          name="begrunnelse"
          label="Begrunnelse"
          validate={[required]}
        />
      )}
      {!isReadOnly && (
        <HStack gap="space-8">
          <Button type="submit" size="small" loading={isPending}>
            Bekreft
          </Button>
        </HStack>
      )}
    </VStack>
  );
};

// --- Hoved-komponent ---

export const BosattITrondheim = ({
  aksjonspunkter,
  vilkår,
  api,
  behandling,
  kanSaksbehandle,
  onAksjonspunktBekreftet,
}: Props) => {
  const vurderBostedAp = finnÅpentAksjonspunkt(aksjonspunkter, BostedAksjonspunktKode.VURDER_BOSTED);
  const fastsettBostedAp = finnÅpentAksjonspunkt(aksjonspunkter, BostedAksjonspunktKode.FASTSETT_BOSTED);
  const harÅpentAksjonspunkt = !!(vurderBostedAp || fastsettBostedAp);
  const isReadOnly = !kanSaksbehandle || !harÅpentAksjonspunkt;

  const bostedsvilkår = vilkår ?? null;
  const perioder = bostedsvilkår?.perioder ?? [];

  const items: VilkårSplittPanelItem[] = perioder.map(p => ({
    id: p.periode.fom,
    status: getItemStatus(p.vilkarStatus),
    label: `${formatDate(p.periode.fom)} – ${formatDate(p.periode.tom)}`,
  }));

  const [selectedFom, setSelectedFom] = useState(items[0]?.id ?? '');

  // Hent bostedgrunnlag (trengs for FASTSETT_BOSTED og for forhåndsutfylling)
  const { data: bostedGrunnlag } = useQuery({
    queryKey: ['bostedGrunnlag', behandling.uuid],
    queryFn: () => api.hentBostedGrunnlag(behandling.uuid),
    enabled: harÅpentAksjonspunkt,
  });

  const grunnlagByFom = Object.fromEntries(
    (bostedGrunnlag?.perioder ?? []).map(p => [p.fom, p]),
  );

  // --- VURDER_BOSTED skjema ---

  const buildVurderDefaultValues = (): VurderBostedForm => ({
    perioder: Object.fromEntries(
      perioder.map(p => [
        p.periode.fom,
        {
          erBosattITrondheim: grunnlagByFom[p.periode.fom]?.foreslåttErBosattITrondheim === true
            ? 'ja'
            : grunnlagByFom[p.periode.fom]?.foreslåttErBosattITrondheim === false
              ? 'nei'
              : '',
          begrunnelse: '',
        } satisfies VurderPeriodeForm,
      ]),
    ),
    brevtekst: '',
  });

  const vurderForm = useForm<VurderBostedForm>({ defaultValues: buildVurderDefaultValues() });

  const { mutateAsync: bekreftVurderBosted, isPending: isPendingVurder } = useMutation({
    mutationFn: async (data: VurderBostedForm) => {
      const avklaringer = perioder.map(p => {
        const periodeForm = data.perioder[p.periode.fom];
        return {
          periode: { fom: p.periode.fom, tom: p.periode.tom },
          erBosattITrondheim: periodeForm?.erBosattITrondheim === 'ja',
          begrunnelse: periodeForm?.begrunnelse ?? '',
        };
      });
      const payload = {
        '@type': BostedAksjonspunktKode.VURDER_BOSTED,
        begrunnelse: data.brevtekst || 'Vurdering av bosted',
        brevtekst: data.brevtekst || undefined,
        avklaringer,
      };
      await api.bekreftAksjonspunkt(behandling.uuid, behandling.versjon, [payload as never]);
    },
    onSuccess: onAksjonspunktBekreftet,
  });

  const onVurderSubmit: SubmitHandler<VurderBostedForm> = data => bekreftVurderBosted(data);

  // --- FASTSETT_BOSTED skjema ---

  const buildFastsettDefaultValues = (): FastsettBostedForm => ({
    perioder: Object.fromEntries(
      perioder.map(p => [
        p.periode.fom,
        { foreslåttErGyldig: '', nyErBosattITrondheim: '' } satisfies FastsettPeriodeForm,
      ]),
    ),
    begrunnelse: '',
  });

  const fastsettForm = useForm<FastsettBostedForm>({ defaultValues: buildFastsettDefaultValues() });

  const { mutateAsync: bekreftFastsettBosted, isPending: isPendingFastsett } = useMutation({
    mutationFn: async (data: FastsettBostedForm) => {
      const avklaringer = perioder.map(p => {
        const periodeForm = data.perioder[p.periode.fom];
        const foreslåttErGyldig = periodeForm?.foreslåttErGyldig === 'ja';
        return {
          periode: { fom: p.periode.fom, tom: p.periode.tom },
          foreslåttVurderingErGyldig: foreslåttErGyldig,
          nyErBosattITrondheim: foreslåttErGyldig
            ? undefined
            : periodeForm?.nyErBosattITrondheim === 'ja',
        };
      });
      const payload = {
        '@type': BostedAksjonspunktKode.FASTSETT_BOSTED,
        begrunnelse: data.begrunnelse,
        avklaringer,
      };
      await api.bekreftAksjonspunkt(behandling.uuid, behandling.versjon, [payload as never]);
    },
    onSuccess: onAksjonspunktBekreftet,
  });

  const onFastsettSubmit: SubmitHandler<FastsettBostedForm> = data => bekreftFastsettBosted(data);

  if (items.length === 0) {
    return <BodyShort>Ingen vilkårsperioder funnet for bostedsvilkåret.</BodyShort>;
  }

  return (
    <VilkårSplittPanel
      items={items}
      selectedItemId={selectedFom}
      onItemSelect={setSelectedFom}
      detailHeading="Bosatt i Trondheim"
      defaultIsEditable={isReadOnly}
      readOnly={isReadOnly}
    >
      {(effectiveLocked: boolean) => (
        <>
          {fastsettBostedAp ? (
            <RhfForm formMethods={fastsettForm} onSubmit={onFastsettSubmit}>
              <FastsettBostedSkjema
                selectedFom={selectedFom}
                grunnlagPeriode={grunnlagByFom[selectedFom]}
                formMethods={fastsettForm}
                isPending={isPendingFastsett}
                isReadOnly={effectiveLocked}
              />
            </RhfForm>
          ) : (
            <RhfForm formMethods={vurderForm} onSubmit={onVurderSubmit}>
              <VurderBostedSkjema
                selectedFom={selectedFom}
                formMethods={vurderForm}
                isPending={isPendingVurder}
                isReadOnly={effectiveLocked}
              />
            </RhfForm>
          )}
        </>
      )}
    </VilkårSplittPanel>
  );
};

