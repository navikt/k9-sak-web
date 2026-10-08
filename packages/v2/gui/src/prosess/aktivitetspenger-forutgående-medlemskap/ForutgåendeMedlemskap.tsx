import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { AksjonspunktStatus } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktStatus.js';
import { Utfall } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/Utfall.js';
import type { AksjonspunktDto } from '@k9-sak-web/backend/ungsak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import type { BekreftetAksjonspunktDto } from '@k9-sak-web/backend/ungsak/kontrakt/aksjonspunkt/BekreftetAksjonspunktDto.js';
import type { BehandlingDto } from '@k9-sak-web/backend/ungsak/kontrakt/behandling/BehandlingDto.js';
import { $BekreftErMedlemVurderingDto } from '@k9-sak-web/backend/ungsak/kontrakt/vilkår/medlemskap/BekreftErMedlemVurderingSchema.js';
import { MedlemskapAvslagsÅrsakType } from '@k9-sak-web/backend/ungsak/kontrakt/vilkår/medlemskap/MedlemskapAvslagsÅrsakType.js';
import type { MedlemskapPeriodeInfoDto } from '@k9-sak-web/backend/ungsak/kontrakt/vilkår/medlemskap/MedlemskapPeriodeInfoDto.js';
import { Lovreferanse } from '@k9-sak-web/gui/shared/lovreferanse/Lovreferanse.js';
import { formatDate } from '@k9-sak-web/gui/utils/formatters.js';
import { CogIcon, PersonPencilFillIcon } from '@navikt/aksel-icons';
import { Alert, BodyShort, Box, Button, HStack, Label, List, Radio, Tag, VStack } from '@navikt/ds-react';
import { RhfForm, RhfRadioGroup, RhfTextarea } from '@navikt/ft-form-hooks';
import { maxLength, minLength, required } from '@navikt/ft-form-validators';
import { useMutation } from '@tanstack/react-query';
import { type ReactNode, useContext, useEffect, useState } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { ProsessStegIkkeBehandlet } from '../../behandling/prosess/ProsessStegIkkeBehandlet';
import { SaksbehandlernavnContext } from '../../shared/SaksbehandlernavnContext/SaksbehandlernavnContext';
import { LabelledContent } from '../../shared/labelled-content/LabelledContent';
import type { VilkårSplittPanelPeriod } from '../../shared/vilkårSplittPanel/VilkårSplittPanel';
import { getPeriodStatus, VilkårSplittPanel } from '../../shared/vilkårSplittPanel/VilkårSplittPanel';
import type { AktivitetspengerApi } from '../aktivitetspenger-prosess/AktivitetspengerApi';

const begrunnelseMaxLength = $BekreftErMedlemVurderingDto.properties.begrunnelse.maxLength;
const fritekstVurderingBrevMaxLength = $BekreftErMedlemVurderingDto.properties.fritekstVurderingBrev.maxLength;

interface Props {
  api: AktivitetspengerApi;
  onAksjonspunktBekreftet: () => void;
  aksjonspunkt: Pick<AksjonspunktDto, 'definisjon' | 'status' | 'ansvarligSaksbehandler'> | undefined;
  behandling: BehandlingDto;
  readOnly: boolean;
  perioder: MedlemskapPeriodeInfoDto[];
  isPermanentlyReadOnly: boolean;
}

export type Vurdering = 'oppfylt' | 'ikkeOppfylt' | '';

interface FormData {
  vurderinger: Record<string, Vurdering>;
  begrunnelser: Record<string, string>;
  fritekster: Record<string, string>;
}

const utfallTilVurdering = (utfall: string | undefined): Vurdering => {
  if (utfall === Utfall.OPPFYLT) return 'oppfylt';
  if (utfall === Utfall.IKKE_OPPFYLT) return 'ikkeOppfylt';
  return '';
};

const buildInitialValues = (perioder: MedlemskapPeriodeInfoDto[]): FormData => ({
  vurderinger: Object.fromEntries(perioder.map(r => [r.periode.fom, utfallTilVurdering(r.utfall)])),
  begrunnelser: Object.fromEntries(perioder.map(r => [r.periode.fom, r.begrunnelse ?? ''])),
  fritekster: Object.fromEntries(perioder.map(r => [r.periode.fom, r.fritekstVurderingBrev ?? ''])),
});

const InfoBoks = ({ children }: { children: ReactNode }) => (
  <Box background="info-softA" borderRadius="8" padding="space-16">
    <VStack gap="space-16">{children}</VStack>
  </Box>
);

export const ForutgåendeMedlemskap = ({
  aksjonspunkt,
  api,
  behandling,
  readOnly,
  perioder,
  onAksjonspunktBekreftet,
  isPermanentlyReadOnly,
}: Props) => {
  const saksbehandlernavn = useContext(SaksbehandlernavnContext);
  const isAksjonspunktSolved = aksjonspunkt?.status === AksjonspunktStatus.UTFØRT;
  const sortertePerioder = perioder.toSorted(
    (a, b) => new Date(a.periode.fom).getTime() - new Date(b.periode.fom).getTime(),
  );
  const periods: VilkårSplittPanelPeriod[] = sortertePerioder.map((periodeInfo, index) => {
    const nestePeriodeInfo = sortertePerioder[index + 1];
    const visTom = !!nestePeriodeInfo && !nestePeriodeInfo.vurderesIBehandlingen;
    return {
      id: periodeInfo.periode.fom,
      status: getPeriodStatus(periodeInfo.utfall ?? Utfall.IKKE_VURDERT),
      label: `${formatDate(periodeInfo.periode.fom)}${visTom ? ` - ${formatDate(periodeInfo.periode.tom)}` : ''}`,
      periode: periodeInfo.periode,
    };
  });

  const [selectedItemId, setSelectedItemId] = useState(
    () => sortertePerioder.find(periodeInfo => periodeInfo.vurderesIBehandlingen)?.periode.fom ?? periods[0]?.id ?? '',
  );

  useEffect(() => {
    if (!periods.some(period => period.id === selectedItemId)) {
      setSelectedItemId('');
    }
  }, [periods, selectedItemId]);

  const valgtPeriodeInfo = sortertePerioder.find(periodeInfo => periodeInfo.periode.fom === selectedItemId);
  // Perioder som ikke vurderes i denne behandlingen er allerede avgjort (f.eks. i en tidligere behandling)
  // og skal ikke kunne redigeres, selv om aksjonspunktet for øvrig er åpent.
  const erValgtPeriodePermanentLåst = isPermanentlyReadOnly || valgtPeriodeInfo?.vurderesIBehandlingen === false;
  const medlemskapFraBruker = valgtPeriodeInfo?.medlemskapFraBruker;
  const utenlandsopphold = medlemskapFraBruker?.utenlandsopphold ?? [];

  const søknadsopplysninger: { label: string; value: boolean }[] = medlemskapFraBruker
    ? [
        {
          label: 'Har du bodd sammenhengende i Norge de 5 siste årene?',
          value: medlemskapFraBruker.harBoddINorge,
        },
        ...(medlemskapFraBruker.harJobbetINorge !== undefined
          ? [
              {
                label: 'Har du jobbet sammenhengende i Norge de 5 siste årene?',
                value: medlemskapFraBruker.harJobbetINorge,
              },
            ]
          : []),
        ...(medlemskapFraBruker.harJobbetUtenforNorge !== undefined
          ? [
              {
                label: 'Har du jobbet utenfor Norge de 5 siste årene?',
                value: medlemskapFraBruker.harJobbetUtenforNorge,
              },
            ]
          : []),
      ]
    : [];

  const formHook = useForm<FormData>({
    defaultValues: buildInitialValues(sortertePerioder),
  });

  const { mutateAsync: bekreftAksjonspunktMutation, isPending } = useMutation({
    mutationFn: async (data: FormData) => {
      if (!aksjonspunkt || !valgtPeriodeInfo) {
        return;
      }
      const erVilkårInnvilget = data.vurderinger[selectedItemId] === 'oppfylt';
      const payload: BekreftetAksjonspunktDto = {
        '@type': AksjonspunktDefinisjon.AVKLAR_GYLDIG_MEDLEMSKAP,
        begrunnelse: data.begrunnelser[selectedItemId],
        erVilkårInnvilget,
        avslagsårsak: erVilkårInnvilget ? undefined : MedlemskapAvslagsÅrsakType.SØKER_IKKE_MEDLEM,
        perioderVurdert: [valgtPeriodeInfo.periode],
        fritekstVurderingBrev: erVilkårInnvilget ? undefined : data.fritekster[selectedItemId],
      };
      await api.bekreftAksjonspunkt(behandling.uuid, behandling.versjon, [payload]);
    },
    onSuccess: () => {
      onAksjonspunktBekreftet();
    },
  });

  const onSubmit: SubmitHandler<FormData> = data => bekreftAksjonspunktMutation(data);

  const vurderingSpørsmål = 'Har søker 5 år forutgående medlemskap?';

  const vurderingBegrunnelseLabel = (
    <span>
      Vurder om søker har 5 år forutgående medlemskap, jf.{' '}
      <Lovreferanse isAktivitetspenger includeFullTextInLink>
        § 3 Forutgående medlemskap
      </Lovreferanse>
    </span>
  );

  if (!aksjonspunkt && !sortertePerioder.some(r => r.vurderesIBehandlingen)) {
    return <ProsessStegIkkeBehandlet />;
  }

  if (sortertePerioder.length === 0) {
    return (
      <Box width="fit-content">
        <Alert variant="info" size="small">
          Ingen perioder å vurdere.
        </Alert>
      </Box>
    );
  }

  return (
    <VilkårSplittPanel
      isAktivitetspenger
      periods={periods}
      selectedItemId={selectedItemId}
      onItemSelect={setSelectedItemId}
      detailHeading="Vurdering av forutgående medlemskap"
      defaultIsLocked={isAksjonspunktSolved}
      readOnly={readOnly}
      isPermanentlyReadOnly={erValgtPeriodePermanentLåst}
      lovreferanse="§ 3"
      hideLockedBackground
    >
      {(isFormLocked: boolean, setIsFormLocked: React.Dispatch<React.SetStateAction<boolean>>) => {
        const vurdering = formHook.watch(`vurderinger.${selectedItemId}`);
        const begrunnelse = formHook.watch(`begrunnelser.${selectedItemId}`);
        const fritekst = formHook.watch(`fritekster.${selectedItemId}`);
        const harSøknadsinnhold = !!medlemskapFraBruker;
        const vurdertIndikator = (() => {
          if (!valgtPeriodeInfo) {
            return undefined;
          }
          if (!valgtPeriodeInfo.erManueltVurdert) {
            return { Icon: CogIcon, tekst: 'Automatisk vurdert' };
          }
          const ident = valgtPeriodeInfo.vurderesIBehandlingen ? aksjonspunkt?.ansvarligSaksbehandler : undefined;
          const navn = ident && (saksbehandlernavn[ident] || ident);
          return {
            Icon: PersonPencilFillIcon,
            tekst: navn ? `Vurdert av ${navn}` : 'Manuelt vurdert',
          };
        })();

        const søknadsinnholdInnhold = (
          <>
            {søknadsopplysninger.length > 0 && (
              <VStack gap="space-8">
                <HStack justify="space-between" align="center">
                  <Label size="small" as="p">
                    Opplysninger fra søknaden:
                  </Label>
                  <Tag variant="outline" data-color="info" size="small">
                    Fra søknad
                  </Tag>
                </HStack>
                <VStack gap="space-4">
                  {søknadsopplysninger.map(opplysning => (
                    <BodyShort size="small" key={opplysning.label}>
                      {`${opplysning.label} ${opplysning.value ? 'Ja' : 'Nei'}`}
                    </BodyShort>
                  ))}
                </VStack>
              </VStack>
            )}
            {utenlandsopphold.length > 0 && (
              <VStack gap="space-8">
                <Label size="small" as="p">
                  Utenlandsopphold eller jobb utenfor Norge:
                </Label>
                <VStack gap="space-12">
                  {utenlandsopphold.map(utenlandsoppholdet => {
                    const formatertPeriode = `${formatDate(utenlandsoppholdet.periode.fom)} - ${formatDate(utenlandsoppholdet.periode.tom)}`;
                    return (
                      <VStack gap="space-2" key={`${utenlandsoppholdet.land}_${formatertPeriode}`}>
                        <HStack gap="space-8" align="center">
                          <BodyShort size="small">{`${utenlandsoppholdet.land}: ${formatertPeriode}`}</BodyShort>
                          {utenlandsoppholdet.harTrygdeavtale ? (
                            <Tag variant="outline" data-color="success" size="small">
                              EØS
                            </Tag>
                          ) : (
                            <Tag variant="outline" data-color="danger" size="small">
                              Ikke EØS
                            </Tag>
                          )}
                        </HStack>
                        {(utenlandsoppholdet.harJobbetIPerioden !== undefined ||
                          utenlandsoppholdet.utenlandskNasjonalId) && (
                          <List size="small">
                            {utenlandsoppholdet.harJobbetIPerioden !== undefined && (
                              <List.Item className="!mb-0">
                                {`Jobbet i perioden: ${utenlandsoppholdet.harJobbetIPerioden ? 'Ja' : 'Nei'}`}
                              </List.Item>
                            )}
                            {utenlandsoppholdet.utenlandskNasjonalId && (
                              <List.Item className="!mb-0">{`Utenlandsk nasjonal ID: ${utenlandsoppholdet.utenlandskNasjonalId}`}</List.Item>
                            )}
                          </List>
                        )}
                      </VStack>
                    );
                  })}
                </VStack>
              </VStack>
            )}
          </>
        );

        return (
          <RhfForm formMethods={formHook} onSubmit={onSubmit}>
            <VStack gap="space-16">
              {isFormLocked ? (
                <>
                  {harSøknadsinnhold && <InfoBoks>{søknadsinnholdInnhold}</InfoBoks>}
                  {(begrunnelse || vurdering) && (
                    <InfoBoks>
                      {begrunnelse && (
                        <LabelledContent label={vurderingBegrunnelseLabel} content={begrunnelse} indentContent />
                      )}
                      {vurdering && (
                        <VStack gap="space-8">
                          <Label size="small" as="p">
                            {vurderingSpørsmål}
                          </Label>
                          <BodyShort size="small">{vurdering === 'oppfylt' ? 'Ja' : 'Nei'}</BodyShort>
                          {vurdering === 'ikkeOppfylt' && fritekst && (
                            <LabelledContent label="Fritekst avslagsbrev" content={fritekst} indentContent />
                          )}
                          {vurdertIndikator && (
                            <HStack gap="space-8" align="center">
                              <vurdertIndikator.Icon fontSize="1.5rem" />
                              <BodyShort size="small" weight="semibold">
                                {vurdertIndikator.tekst}
                              </BodyShort>
                            </HStack>
                          )}
                        </VStack>
                      )}
                    </InfoBoks>
                  )}
                </>
              ) : (
                <>
                  {harSøknadsinnhold && <InfoBoks>{søknadsinnholdInnhold}</InfoBoks>}
                  <RhfTextarea
                    control={formHook.control}
                    name={`begrunnelser.${selectedItemId}`}
                    label={vurderingBegrunnelseLabel}
                    validate={[required, minLength(3), maxLength(begrunnelseMaxLength)]}
                    maxLength={begrunnelseMaxLength}
                  />
                </>
              )}
              {!(isFormLocked && vurdering) && (
                <RhfRadioGroup
                  key={selectedItemId}
                  control={formHook.control}
                  name={`vurderinger.${selectedItemId}`}
                  legend={vurderingSpørsmål}
                  validate={[required]}
                  readOnly={isFormLocked}
                >
                  <Radio value="oppfylt">Ja</Radio>
                  <Radio value="ikkeOppfylt">Nei</Radio>
                </RhfRadioGroup>
              )}
              {!isFormLocked && vurdering === 'ikkeOppfylt' && (
                <RhfTextarea
                  key={`${selectedItemId}-fritekst`}
                  control={formHook.control}
                  name={`fritekster.${selectedItemId}`}
                  label="Fritekst avslagsbrev"
                  description="Beskriv hvorfor vilkåret er avslått. Teksten vises i vedtaksbrevet til søker."
                  validate={[required, minLength(3), maxLength(fritekstVurderingBrevMaxLength)]}
                  maxLength={fritekstVurderingBrevMaxLength}
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
        );
      }}
    </VilkårSplittPanel>
  );
};
