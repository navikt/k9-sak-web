import { BostedAksjonspunktKode } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { AksjonspunktStatus } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktStatus.js';
import { FraflyttingsÅrsak, fraflyttingsÅrsakLabels } from '@k9-sak-web/backend/ungsak/kodeverk/bosatt/FraflyttingsÅrsak.js';
import { Utfall } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/Utfall.js';
import type { AksjonspunktDto } from '@k9-sak-web/backend/ungsak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import type { BehandlingDto } from '@k9-sak-web/backend/ungsak/kontrakt/behandling/BehandlingDto.js';
import { formatDate } from '@k9-sak-web/gui/utils/formatters.js';
import { BodyShort, Button, HStack, Radio, VStack } from '@navikt/ds-react';
import { RhfDatepicker, RhfForm, RhfRadioGroup, RhfSelect, RhfTextarea } from '@navikt/ft-form-hooks';
import { hasValidDate, required } from '@navikt/ft-form-validators';
import { useMutation } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useForm, useWatch, type SubmitHandler } from 'react-hook-form';
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
  borITrondheimIHelePerioden: 'ja' | 'nei' | '';
  fraflyttingsDato: string;
  fraflyttingsÅrsak: string;
  begrunnelse: string;
}

interface VurderBostedForm {
  perioder: Record<string, VurderPeriodeForm>;
  brevtekst: string;
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
  selectedTom: string;
  formMethods: ReturnType<typeof useForm<VurderBostedForm>>;
  isPending: boolean;
  isReadOnly: boolean;
}

const VurderBostedSkjema = ({ selectedFom, selectedTom, formMethods, isPending, isReadOnly }: VurderBostedSkjemaProps) => {
  const borHele = useWatch({ control: formMethods.control, name: `perioder.${selectedFom}.borITrondheimIHelePerioden` });

  return (
    <VStack gap="space-16">
      <RhfRadioGroup
        key={selectedFom}
        control={formMethods.control}
        name={`perioder.${selectedFom}.borITrondheimIHelePerioden`}
        legend="Bor bruker i Trondheim i hele perioden?"
        validate={[required]}
        readOnly={isReadOnly}
      >
        <Radio value="ja">Ja</Radio>
        <Radio value="nei">Nei</Radio>
      </RhfRadioGroup>
      {borHele === 'nei' && (
        <RhfDatepicker
          key={`fraflytting-${selectedFom}`}
          control={formMethods.control}
          name={`perioder.${selectedFom}.fraflyttingsDato`}
          label="Dato for flytting fra Trondheim"
          validate={[required, hasValidDate]}
          fromDate={dayjs(selectedFom).toDate()}
          toDate={dayjs(selectedTom).toDate()}
          readOnly={isReadOnly}
        />
      )}
      {borHele === 'nei' && (
        <RhfSelect
          key={`aarsak-${selectedFom}`}
          control={formMethods.control}
          name={`perioder.${selectedFom}.fraflyttingsÅrsak`}
          label="Årsak til fraflytting"
          validate={[required]}
          readOnly={isReadOnly}
          selectValues={Object.values(FraflyttingsÅrsak).map(kode => (
            <option value={kode} key={kode}>
              {fraflyttingsÅrsakLabels[kode]}
            </option>
          ))}
        />
      )}
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
  const isReadOnly = !kanSaksbehandle || !vurderBostedAp;

  const bostedsvilkår = vilkår ?? null;
  const perioder = bostedsvilkår?.perioder ?? [];

  const items: VilkårSplittPanelItem[] = perioder.map(p => ({
    id: p.periode.fom,
    status: getItemStatus(p.vilkarStatus),
    label: `${formatDate(p.periode.fom)} – ${formatDate(p.periode.tom)}`,
  }));

  const [selectedFom, setSelectedFom] = useState(items[0]?.id ?? '');

  const buildVurderDefaultValues = (): VurderBostedForm => ({
    perioder: Object.fromEntries(
      perioder.map(p => [
        p.periode.fom,
        {
          borITrondheimIHelePerioden: '',
          fraflyttingsDato: '',
          fraflyttingsÅrsak: '',
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
        const borHele = periodeForm?.borITrondheimIHelePerioden === 'ja';
        return {
          periode: { fom: p.periode.fom, tom: p.periode.tom },
          vurdering: {
            borITrondheimIHelePerioden: borHele,
            fraflyttingsDato: borHele ? null : (periodeForm?.fraflyttingsDato ?? null),
            fraflyttingsÅrsak: borHele ? null : (periodeForm?.fraflyttingsÅrsak ?? null),
            begrunnelse: periodeForm?.begrunnelse ?? '',
          },
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

  if (items.length === 0) {
    return <BodyShort>Ingen vilkårsperioder funnet for bostedsvilkåret.</BodyShort>;
  }

  const selectedPeriode = perioder.find(p => p.periode.fom === selectedFom);
  const selectedTom = selectedPeriode?.periode.tom ?? selectedFom;

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
        <RhfForm formMethods={vurderForm} onSubmit={onVurderSubmit}>
          <VurderBostedSkjema
            selectedFom={selectedFom}
            selectedTom={selectedTom}
            formMethods={vurderForm}
            isPending={isPendingVurder}
            isReadOnly={effectiveLocked}
          />
        </RhfForm>
      )}
    </VilkårSplittPanel>
  );
};
