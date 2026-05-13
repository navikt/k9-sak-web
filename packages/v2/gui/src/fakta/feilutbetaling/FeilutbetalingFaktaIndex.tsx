import type { LogiskPeriodeMedFaktaDto } from '@k9-sak-web/backend/k9tilbake/kontrakt/feilutbetaling/BehandlingFeilutbetalingFaktaDto.js';
import type {
  BehandlingsresultatDto,
  BehandlingÅrsakDto,
  TilbakekrevingValgDto,
} from '@k9-sak-web/backend/combined/kontrakt/tilbakekreving/TilbakekrevingBehandlingDto.js';
import { OrUndefined } from '@k9-sak-web/gui/kodeverk/oppslag/GeneriskKodeverkoppslag.js';
import { K9KodeverkoppslagContext } from '@k9-sak-web/gui/kodeverk/oppslag/K9KodeverkoppslagContext.js';
import AksjonspunktHelpText from '@k9-sak-web/gui/shared/aksjonspunktHelpText/AksjonspunktHelpText.js';
import FaktaGruppe from '@k9-sak-web/gui/shared/FaktaGruppe.js';
import { BodyShort, Button, Checkbox, Detail, HGrid, Label, Textarea, VStack } from '@navikt/ds-react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useContext, useMemo } from 'react';
import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form';
import { useFeilutbetalingFaktaOptions, useFeilutbetalingÅrsakerOptions } from './api/FeilutbetalingFaktaQueries.js';
import styles from './feilutbetalingFakta.module.css';
import FeilutbetalingPerioderTable from './FeilutbetalingPerioderTable.js';

export interface FeilutbetalingFormPeriode {
  fom: string;
  tom: string;
  årsak: string;
  underÅrsak: string;
}

export interface FeilutbetalingFormValues {
  perioder: FeilutbetalingFormPeriode[];
  begrunnelse: string;
  behandlePerioderSamlet: boolean;
}

interface FeilutbetalingFaktaIndexProps {
  behandlingUuid: string;
  fagsakYtelseType: string;
  readOnly: boolean;
  hasOpenAksjonspunkter: boolean;
  alleMerknaderFraBeslutter?: Record<string, { notAccepted?: boolean }>;
  submitCallback: (data: unknown) => Promise<void>;
  behandlingsresultat?: BehandlingsresultatDto;
  behandlingÅrsaker?: BehandlingÅrsakDto[];
  datoForRevurderingsvedtak?: string;
  tilbakekrevingValg?: TilbakekrevingValgDto;
}

const AKSJONSPUNKT_KODE = '7003';

const formatDate = (dateStr?: string) => {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  return `${day}.${month}.${year}`;
};

const buildDefaultValues = (perioder: LogiskPeriodeMedFaktaDto[], begrunnelse?: string): FeilutbetalingFormValues => ({
  begrunnelse: begrunnelse ?? '',
  behandlePerioderSamlet: false,
  perioder: [...perioder]
    .sort((a, b) => (a.fom ?? '').localeCompare(b.fom ?? ''))
    .map(p => ({
      fom: p.fom ?? '',
      tom: p.tom ?? '',
      årsak: p.feilutbetalingÅrsakDto?.hendelseType ?? '',
      underÅrsak: p.feilutbetalingÅrsakDto?.hendelseUndertype ?? '',
    })),
});

const FeilutbetalingFaktaIndex = ({
  behandlingUuid,
  fagsakYtelseType,
  readOnly,
  hasOpenAksjonspunkter,
  alleMerknaderFraBeslutter,
  submitCallback,
  behandlingsresultat,
  behandlingÅrsaker,
  datoForRevurderingsvedtak,
  tilbakekrevingValg,
}: FeilutbetalingFaktaIndexProps) => {
  const { data: faktaDto } = useSuspenseQuery(useFeilutbetalingFaktaOptions(behandlingUuid));
  const { data: alleÅrsaker } = useSuspenseQuery(useFeilutbetalingÅrsakerOptions());

  const kodeverkoppslag = useContext(K9KodeverkoppslagContext);

  const fakta = faktaDto?.behandlingFakta;
  const perioder = fakta?.perioder ?? [];

  const årsakerForYtelse = useMemo(() => {
    const match = alleÅrsaker?.find(a => a.ytelseType === fagsakYtelseType);
    const hendelseTyper = match?.hendelseTyper ?? [];
    return [...hendelseTyper].sort((a, b) => {
      const navn1 = a.hendelseType
        ? (kodeverkoppslag.k9tilbake.hendelseTyper(a.hendelseType, OrUndefined)?.navn ?? a.hendelseType)
        : '';
      const navn2 = b.hendelseType
        ? (kodeverkoppslag.k9tilbake.hendelseTyper(b.hendelseType, OrUndefined)?.navn ?? b.hendelseType)
        : '';
      const erParagraf1 = navn1.startsWith('§');
      const erParagraf2 = navn2.startsWith('§');
      const v1 = erParagraf1 ? navn1.replace(/\D/g, '') : navn1;
      const v2 = erParagraf2 ? navn2.replace(/\D/g, '') : navn2;
      return v1.localeCompare(v2);
    });
  }, [alleÅrsaker, fagsakYtelseType, kodeverkoppslag]);

  const formMethods = useForm<FeilutbetalingFormValues>({
    defaultValues: buildDefaultValues(perioder, fakta?.begrunnelse),
    mode: 'onTouched',
  });

  const { control, handleSubmit, formState } = formMethods;
  const behandlePerioderSamlet = useWatch({ control, name: 'behandlePerioderSamlet' });

  const onSubmit = async (values: FeilutbetalingFormValues) => {
    const feilutbetalingFakta = values.perioder.map(periode => {
      const feilutbetalingÅrsak = årsakerForYtelse.find(el => el.hendelseType === periode.årsak);
      const underÅrsak = periode.underÅrsak
        ? feilutbetalingÅrsak?.hendelseUndertyper?.find(el => el === periode.underÅrsak)
        : undefined;

      return {
        fom: periode.fom,
        tom: periode.tom,
        årsak: {
          hendelseType: feilutbetalingÅrsak?.hendelseType,
          hendelseUndertype: underÅrsak,
        },
      };
    });

    await submitCallback([
      {
        kode: AKSJONSPUNKT_KODE,
        begrunnelse: values.begrunnelse,
        feilutbetalingFakta,
      },
    ]);
  };

  const merknaderFraBeslutter = alleMerknaderFraBeslutter?.[AKSJONSPUNKT_KODE];

  const hentBehandlingÅrsakNavn = (kode?: string) => {
    if (!kode) return '';
    try {
      return (
        kodeverkoppslag.k9tilbake.behandlingÅrsakTyper(
          kode as Parameters<typeof kodeverkoppslag.k9tilbake.behandlingÅrsakTyper>[0],
          OrUndefined,
        )?.navn ?? kode
      );
    } catch {
      return kode;
    }
  };

  const hentBehandlingResultatNavn = (kode?: string) => {
    if (!kode) return '';
    try {
      return (
        kodeverkoppslag.k9tilbake.behandlingResultatTyper(
          kode as Parameters<typeof kodeverkoppslag.k9tilbake.behandlingResultatTyper>[0],
          OrUndefined,
        )?.navn ?? kode
      );
    } catch {
      return kode;
    }
  };

  const hentVidereBehandlingNavn = (kode?: string) => {
    if (!kode) return '';
    try {
      return (
        kodeverkoppslag.k9tilbake.videreBehandlinger(
          kode as Parameters<typeof kodeverkoppslag.k9tilbake.videreBehandlinger>[0],
          OrUndefined,
        )?.navn ?? kode
      );
    } catch {
      return kode;
    }
  };

  return (
    <VStack gap="space-16">
      <AksjonspunktHelpText isAksjonspunktOpen={hasOpenAksjonspunkter}>
        {['Kontroller at korrekt hendelse er satt']}
      </AksjonspunktHelpText>
      <FormProvider {...formMethods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <VStack gap="space-16">
            <HGrid gap="space-16" columns={{ xs: '12fr', md: '6fr 6fr' }}>
              <VStack gap="space-16">
                <Label size="small" as="p">
                  Feilutbetaling
                </Label>
                <HGrid gap="space-16" columns={{ xs: '12fr', md: '4fr 4fr 4fr' }}>
                  <VStack gap="space-2">
                    <Detail>Periode med feilutbetaling</Detail>
                    <BodyShort size="small">
                      {`${formatDate(fakta?.totalPeriodeFom)} - ${formatDate(fakta?.totalPeriodeTom)}`}
                    </BodyShort>
                  </VStack>
                  <VStack gap="space-2">
                    <Detail>Feilutbetalt beløp totalt</Detail>
                    <BodyShort size="small" className={styles['redText']}>
                      {fakta?.aktuellFeilUtbetaltBeløp}
                    </BodyShort>
                  </VStack>
                  <VStack gap="space-2">
                    <Detail>Tidligere varslet beløp</Detail>
                    <BodyShort size="small">{fakta?.tidligereVarseltBeløp ?? 'Ikke varslet'}</BodyShort>
                  </VStack>
                </HGrid>
                <Controller
                  control={control}
                  name="behandlePerioderSamlet"
                  render={({ field }) => (
                    <Checkbox size="small" checked={field.value} onChange={field.onChange} readOnly={readOnly}>
                      Behandle alle perioder samlet
                    </Checkbox>
                  )}
                />
                <FaktaGruppe merknaderFraBeslutter={merknaderFraBeslutter} withoutBorder>
                  <FeilutbetalingPerioderTable
                    perioder={perioder}
                    årsaker={årsakerForYtelse}
                    readOnly={readOnly}
                    behandlePerioderSamlet={behandlePerioderSamlet}
                  />
                </FaktaGruppe>
              </VStack>
              <VStack gap="space-16">
                <Label size="small" as="p">
                  Revurdering
                </Label>
                <HGrid gap="space-16" columns={{ xs: '6fr 6fr' }}>
                  <VStack gap="space-2">
                    <Detail>Årsak(er) til revurdering</Detail>
                    <BodyShort size="small">
                      {behandlingÅrsaker
                        ?.map(ba => hentBehandlingÅrsakNavn(ba.behandlingArsakType))
                        .filter(Boolean)
                        .join(', ')}
                    </BodyShort>
                  </VStack>
                  {datoForRevurderingsvedtak && (
                    <VStack gap="space-2">
                      <Detail>Dato for revurderingsvedtak</Detail>
                      <BodyShort size="small">{formatDate(datoForRevurderingsvedtak)}</BodyShort>
                    </VStack>
                  )}
                </HGrid>
                <HGrid gap="space-16" columns={{ xs: '6fr 6fr' }}>
                  <VStack gap="space-2">
                    <Detail>Resultat</Detail>
                    <BodyShort size="small">{hentBehandlingResultatNavn(behandlingsresultat?.type)}</BodyShort>
                  </VStack>
                </HGrid>
                <HGrid gap="space-16" columns={{ xs: '6fr 6fr' }}>
                  <VStack gap="space-2">
                    <Detail>Tilbakekrevingsvalg</Detail>
                    <BodyShort size="small">{hentVidereBehandlingNavn(tilbakekrevingValg?.videreBehandling)}</BodyShort>
                  </VStack>
                </HGrid>
              </VStack>
            </HGrid>
            <HGrid gap="space-16" columns={{ xs: '6fr 6fr' }}>
              <Controller
                control={control}
                name="begrunnelse"
                rules={{
                  required: 'Feltet må fylles ut',
                  minLength: { value: 3, message: 'Du må skrive minst 3 tegn' },
                  maxLength: { value: 1500, message: 'Du kan skrive maksimalt 1500 tegn' },
                }}
                render={({ field, fieldState }) => (
                  <Textarea
                    label="Forklar årsaken(e) til feilutbetalingen"
                    {...field}
                    error={fieldState.error?.message}
                    maxLength={1500}
                    readOnly={readOnly}
                    size="small"
                  />
                )}
              />
            </HGrid>
            <div>
              <Button
                variant="primary"
                size="small"
                type="submit"
                disabled={!formState.isDirty || formState.isSubmitting}
                loading={formState.isSubmitting}
              >
                Bekreft og fortsett
              </Button>
            </div>
          </VStack>
        </form>
      </FormProvider>
    </VStack>
  );
};

export default FeilutbetalingFaktaIndex;
