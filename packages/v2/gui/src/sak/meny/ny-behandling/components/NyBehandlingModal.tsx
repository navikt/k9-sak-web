import { behandlingType as BehandlingTypeK9Klage } from '@k9-sak-web/backend/k9klage/kodeverk/behandling/BehandlingType.js';
import {
  k9_kodeverk_behandling_BehandlingÅrsakType as BehandlingÅrsakDtoBehandlingArsakType,
  k9_kodeverk_behandling_FagsakYtelseType,
} from '@k9-sak-web/backend/k9sak/generated/types.js';
import { behandlingType as BehandlingTypeK9Sak } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/BehandlingType.js';
import type { FagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { behandlingÅrsakType as tilbakekrevingBehandlingÅrsakDtoBehandlingArsakType } from '@k9-sak-web/backend/k9tilbake/kodeverk/behandling/BehandlingÅrsakType.js';
import { ung_kodeverk_behandling_BehandlingÅrsakType } from '@k9-sak-web/backend/ungsak/generated/types.js';
import { sif_tilbakekreving_behandlingslager_behandling_BehandlingÅrsakType as ungTilbakeBehandlingÅrsakType } from '@k9-sak-web/backend/ungtilbake/generated/types.js';
import { erTilbakekreving } from '@k9-sak-web/gui/utils/behandlingUtils.js';
import FeatureTogglesContext from '@k9-sak-web/gui/featuretoggles/FeatureTogglesContext.js';
import type { KodeverkObject, Periode } from '@k9-sak-web/lib/kodeverk/types.js';
import { Alert, Button, Fieldset, HStack, Modal, VStack } from '@navikt/ds-react';
import { ModalBody, ModalFooter } from '@navikt/ds-react/Modal';
import { RhfCheckbox, RhfDatepicker, RhfForm, RhfSelect } from '@navikt/ft-form-hooks';
import { required } from '@navikt/ft-form-validators';
import { use, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import styles from './nyBehandlingModal.module.css';

const createOptions = (bt: KodeverkObject, enabledBehandlingstyper: KodeverkObject[]) => {
  const navn = bt.kode === BehandlingTypeK9Klage.REVURDERING ? 'Revurderingsbehandling' : bt.navn;

  const isEnabled = enabledBehandlingstyper.some(b => b.kode === bt.kode);
  return <option key={bt.kode} value={bt.kode} disabled={!isEnabled}>{` ${navn} `}</option>;
};

export type ÅrsakOgPerioder = Readonly<{
  årsak: string;
  perioder: Periode[];
}>;

export type BehandlingOppretting = Readonly<{
  behandlingType: string;
  kanOppretteBehandling: boolean;
  gyldigePerioderPerÅrsak?: ÅrsakOgPerioder[];
}>;

export type FormValues = {
  behandlingType: string;
  nyBehandlingEtterKlage?: string;
  behandlingArsakType?: string;
  revurderingModus?: 'FULL' | 'DELVIS';
  steg?: string;
  fom: string;
  tom: string;
  fomForPeriodeForInntektskontroll?: string;
};

export type DelvisRevurderingÅrsakMapping = {
  årsak: string;
  vilkårType: string;
};

const VILKÅR_TYPE_KODE_TIL_NAVN: Record<string, string> = {
  FP_VK_41: 'Beregningsgrunnlagvilkåret',
  FP_VK_2: 'Medlemskapsvilkåret',
  K9_VK_1: 'Omsorgen for',
  FP_VK_23: 'Opptjeningsvilkåret',
  FP_VK_21: 'Opptjeningsperiodevilkåret',
  FP_VK_3: 'Søknadsfristvilkåret',
};

const DELVIS_REVURDERING_ARSAK_TIL_VILKAR_FALLBACK: Record<string, string> = {
  [BehandlingÅrsakDtoBehandlingArsakType.RE_ENDRING_BEREGNINGSGRUNNLAG]: 'Beregningsgrunnlagvilkåret',
  [BehandlingÅrsakDtoBehandlingArsakType.RE_ENDRET_FORDELING]: 'Beregningsgrunnlagvilkåret',
  [BehandlingÅrsakDtoBehandlingArsakType.RE_OPPLYSNINGER_OM_MEDLEMSKAP]: 'Medlemskapsvilkåret',
  [BehandlingÅrsakDtoBehandlingArsakType.RE_OPPLYSNINGER_OM_SØKERS_REL]: 'Omsorgen for',
  [BehandlingÅrsakDtoBehandlingArsakType.RE_OPPLYSNINGER_OM_OPPTJENING]: 'Opptjeningsvilkåret',
};

const byggÅrsakTilVilkårMap = (backendData?: DelvisRevurderingÅrsakMapping[]): Record<string, string> => {
  if (backendData && backendData.length > 0) {
    return Object.fromEntries(backendData.map(d => [d.årsak, VILKÅR_TYPE_KODE_TIL_NAVN[d.vilkårType] ?? d.vilkårType]));
  }
  return DELVIS_REVURDERING_ARSAK_TIL_VILKAR_FALLBACK;
};

export const DELVIS_REVURDERING_ARSAKER_FALLBACK = new Set(Object.keys(DELVIS_REVURDERING_ARSAK_TIL_VILKAR_FALLBACK));

interface NyBehandlingModalProps {
  ytelseType: FagsakYtelsesType;
  saksnummer: string;
  cancelEvent: () => void;
  submitCallback: (
    data: {
      behandlingUuid?: string;
      eksternUuid?: string;
      fagsakYtelseType: FagsakYtelsesType;
      periode?: Periode;
    } & FormValues,
  ) => void;
  behandlingOppretting: BehandlingOppretting[];
  delvisRevurderingsårsaker?: DelvisRevurderingÅrsakMapping[];
  behandlingstyper: KodeverkObject[];
  tilbakekrevingRevurderingArsaker: KodeverkObject[];
  revurderingArsaker: KodeverkObject[];
  kanTilbakekrevingOpprettes: {
    kanBehandlingOpprettes: boolean;
    kanRevurderingOpprettes: boolean;
  };
  behandlingType?: string;
  behandlingId?: number;
  behandlingUuid?: string;
  uuidForSistLukkede?: string;
  erTilbakekrevingAktivert: boolean;
  sjekkOmTilbakekrevingKanOpprettes: (params: {
    saksnummer: string;
    ytelsesbehandlingUuid: string;
    uuid: string;
  }) => void;
  sjekkOmTilbakekrevingRevurderingKanOpprettes: (params: { behandlingUuid: string; uuid: string }) => void;
  aktorId?: string;
  gjeldendeVedtakBehandlendeEnhetId?: string;
  sisteDagISøknadsperiode?: Date | null;
}

/**
 * NyBehandlingModal
 *
 * Presentasjonskomponent. Denne modalen vises etter at en saksbehandler har valgt opprett ny 1.gangsbehandling i behandlingsmenyen.
 * Ved å trykke på "Opprett behandling" skal ny behandling (1.gangsbehandling) av sak opprettes.
 */
export const NyBehandlingModal = ({
  submitCallback,
  cancelEvent,
  behandlingUuid,
  sjekkOmTilbakekrevingKanOpprettes,
  sjekkOmTilbakekrevingRevurderingKanOpprettes,
  saksnummer,
  erTilbakekrevingAktivert,
  aktorId,
  gjeldendeVedtakBehandlendeEnhetId,
  uuidForSistLukkede,
  ytelseType,
  behandlingstyper,
  behandlingOppretting,
  delvisRevurderingsårsaker,
  kanTilbakekrevingOpprettes,
  revurderingArsaker,
  tilbakekrevingRevurderingArsaker,
  behandlingType,
  sisteDagISøknadsperiode,
}: NyBehandlingModalProps) => {
  useEffect(() => {
    if (erTilbakekrevingAktivert) {
      if (uuidForSistLukkede !== undefined) {
        sjekkOmTilbakekrevingKanOpprettes({
          saksnummer,
          ytelsesbehandlingUuid: uuidForSistLukkede,
          uuid: uuidForSistLukkede,
        });
      }
      if (erTilbakekreving(behandlingType) && behandlingUuid) {
        sjekkOmTilbakekrevingRevurderingKanOpprettes({ behandlingUuid, uuid: behandlingUuid });
      }
    }
  }, [
    behandlingUuid,
    behandlingType,
    erTilbakekrevingAktivert,
    saksnummer,
    sjekkOmTilbakekrevingKanOpprettes,
    sjekkOmTilbakekrevingRevurderingKanOpprettes,
    uuidForSistLukkede,
  ]);

  const formMethods = useForm<FormValues>({
    defaultValues: {
      behandlingType: '',
      nyBehandlingEtterKlage: '',
      behandlingArsakType: '',
      revurderingModus: undefined,
      steg: undefined,
      fom: '',
      tom: '',
      fomForPeriodeForInntektskontroll: '',
    },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [valgtBehandlingTypeKode, steg, fom, behandlingArsakType, revurderingModus] = formMethods.watch([
    'behandlingType',
    'steg',
    'fom',
    'behandlingArsakType',
    'revurderingModus',
  ]);

  const { REVURDERING_FRA_STEG_V2 } = use(FeatureTogglesContext);

  useEffect(() => {
    if (REVURDERING_FRA_STEG_V2) {
      formMethods.setValue('steg', undefined);
      formMethods.setValue('fom', '');
      formMethods.setValue('tom', '');
    }
  }, [revurderingModus, REVURDERING_FRA_STEG_V2, formMethods]);
  const behandlingTyper = getBehandlingTyper(behandlingstyper);
  const enabledBehandlingstyper = getEnabledBehandlingstyper(
    behandlingstyper,
    behandlingOppretting,
    kanTilbakekrevingOpprettes,
  );
  const erFørstegangsbehandling = valgtBehandlingTypeKode === BehandlingTypeK9Klage.FØRSTEGANGSSØKNAD;
  const erUngdomsprogramytelse = ytelseType === k9_kodeverk_behandling_FagsakYtelseType.UNGDOMSYTELSE;
  const erRevurdering = valgtBehandlingTypeKode === BehandlingTypeK9Klage.REVURDERING;
  const BehandlingÅrsakDtoBehandlingArsakTyper = getBehandlingAarsaker(
    revurderingArsaker,
    tilbakekrevingRevurderingArsaker,
    valgtBehandlingTypeKode,
    erUngdomsprogramytelse,
  );
  const visÅrsak =
    (erRevurdering && !REVURDERING_FRA_STEG_V2 && steg === 'inngangsvilkår') ||
    (erRevurdering && REVURDERING_FRA_STEG_V2 && revurderingModus === 'FULL') ||
    (!erRevurdering && BehandlingÅrsakDtoBehandlingArsakTyper.length > 0) ||
    (erRevurdering && erUngdomsprogramytelse);

  const erDelvisRevurdering = REVURDERING_FRA_STEG_V2 && erRevurdering && revurderingModus === 'DELVIS';
  const årsakTilVilkårMap = byggÅrsakTilVilkårMap(delvisRevurderingsårsaker);
  const gyldigeDelvisÅrsaker = new Set(Object.keys(årsakTilVilkårMap));
  const delvisRevurderingÅrsaker = revurderingArsaker
    .filter(a => gyldigeDelvisÅrsaker.has(a.kode))
    .sort((a, b) => a.navn.localeCompare(b.navn));
  const vilkårSomRevurderes = steg ? årsakTilVilkårMap[steg] : undefined;
  const getUngPerioderTilRevurdering = () => {
    const rettigheterForBehandling = behandlingOppretting.find(
      b => b.behandlingType === BehandlingTypeK9Klage.REVURDERING,
    );
    if (!rettigheterForBehandling) {
      return [];
    }
    return rettigheterForBehandling.gyldigePerioderPerÅrsak?.find(it => it.årsak === behandlingArsakType)?.perioder;
  };
  const handleSubmit = async (formValues: FormValues) => {
    setIsSubmitting(true);
    try {
      const klageOnlyValues =
        formValues?.behandlingType === BehandlingTypeK9Klage.KLAGE
          ? {
              aktørId: aktorId,
              behandlendeEnhetId: gjeldendeVedtakBehandlendeEnhetId,
              behandlingArsakType: ung_kodeverk_behandling_BehandlingÅrsakType.UDEFINERT,
            }
          : {};
      submitCallback({
        ...formValues,
        behandlingUuid: kanTilbakekrevingOpprettes.kanRevurderingOpprettes ? behandlingUuid : undefined,
        eksternUuid: uuidForSistLukkede,
        fagsakYtelseType: ytelseType,
        periode: erUngdomsprogramytelse
          ? getUngPerioderTilRevurdering()?.find(p => p.fom === formValues.fomForPeriodeForInntektskontroll)
          : undefined,
        ...klageOnlyValues,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      className={styles.modal}
      open
      aria-label="Ny behandling"
      onClose={cancelEvent}
      header={{
        heading: 'Opprett ny behandling',
        size: 'small',
      }}
    >
      <RhfForm<FormValues> formMethods={formMethods} onSubmit={handleSubmit}>
        <ModalBody>
          <VStack gap="space-20">
            <RhfSelect
              control={formMethods.control}
              name="behandlingType"
              label="Hva slags behandling ønsker du å opprette?"
              validate={[required]}
              selectValues={behandlingTyper.map(bt => createOptions(bt, enabledBehandlingstyper))}
            />
            {erRevurdering && !erUngdomsprogramytelse && REVURDERING_FRA_STEG_V2 && (
              <RhfSelect
                control={formMethods.control}
                name="revurderingModus"
                label="Hvordan vil du opprette revurderingen?"
                validate={[required]}
                selectValues={[
                  <option key="FULL" value="FULL">
                    Full revurdering (alle vilkår)
                  </option>,
                  <option key="DELVIS" value="DELVIS">
                    Delvis revurdering (velg vilkår)
                  </option>,
                ]}
              />
            )}
            {erRevurdering && !erUngdomsprogramytelse && !REVURDERING_FRA_STEG_V2 && (
              <RhfSelect
                control={formMethods.control}
                name="steg"
                label="Hvor i prosessen vil du starte revurderingen?"
                validate={[required]}
                selectValues={[
                  <option key="inngangsvilkår" value="inngangsvilkår">
                    Fra inngangsvilkår (full revurdering)
                  </option>,
                  <option key="uttak" value="RE-ENDRET-FORDELING">
                    Fra uttak, refusjon og fordeling-steget (delvis revurdering)
                  </option>,
                ]}
              />
            )}
            {erDelvisRevurdering && (
              <RhfSelect
                control={formMethods.control}
                name="steg"
                label="Hva er årsaken til revurderingen?"
                validate={[required]}
                selectValues={delvisRevurderingÅrsaker.map(a => (
                  <option key={a.kode} value={a.kode}>
                    {a.navn}
                  </option>
                ))}
              />
            )}
            {erDelvisRevurdering && vilkårSomRevurderes && (
              <Alert variant="info" size="small">
                Vilkår som revurderes: {vilkårSomRevurderes}
              </Alert>
            )}
            {erDelvisRevurdering && steg && (
              <Fieldset className={styles.datePickerContainer} legend="Hvilken periode vil du revurdere?">
                <RhfDatepicker
                  control={formMethods.control}
                  name="fom"
                  toDate={sisteDagISøknadsperiode ?? new Date()}
                  label="Fra og med"
                  validate={[required]}
                />
                <RhfDatepicker
                  control={formMethods.control}
                  name="tom"
                  fromDate={fom ? new Date(fom) : undefined}
                  toDate={sisteDagISøknadsperiode ?? new Date()}
                  label="Til og med"
                  validate={[required]}
                />
              </Fieldset>
            )}
            {erFørstegangsbehandling && (
              <RhfCheckbox
                control={formMethods.control}
                name="nyBehandlingEtterKlage"
                label="Behandlingen opprettes som et resultat av klagebehandling"
              />
            )}
            {visÅrsak && (
              <RhfSelect
                control={formMethods.control}
                name="behandlingArsakType"
                label="Hva er årsaken til den nye behandlingen?"
                validate={[required]}
                selectValues={BehandlingÅrsakDtoBehandlingArsakTyper.map(b => (
                  <option key={b?.kode} value={b?.kode}>
                    {b?.navn}
                  </option>
                ))}
              />
            )}
            {erRevurdering && !REVURDERING_FRA_STEG_V2 && steg === 'RE-ENDRET-FORDELING' && (
              <Fieldset className={styles.datePickerContainer} legend="Hvilken periode vil du revurdere?">
                <RhfDatepicker
                  control={formMethods.control}
                  name="fom"
                  disabledDays={[{ before: undefined, after: sisteDagISøknadsperiode ?? new Date() }]}
                  label="Fra og med"
                  validate={[required]}
                />
                <RhfDatepicker
                  control={formMethods.control}
                  name="tom"
                  disabledDays={[{ before: new Date(fom), after: sisteDagISøknadsperiode ?? new Date() }]}
                  label="Til og med"
                  validate={[required]}
                />
              </Fieldset>
            )}
            {erRevurdering &&
              behandlingArsakType === ung_kodeverk_behandling_BehandlingÅrsakType.RE_KONTROLL_REGISTER_INNTEKT &&
              !!getUngPerioderTilRevurdering() && (
                <RhfSelect
                  control={formMethods.control}
                  label="Velg måned for kontroll av inntekt"
                  name="fomForPeriodeForInntektskontroll"
                  validate={[required]}
                  selectValues={getUngPerioderTilRevurdering()!
                    .filter((p): p is { fom: string } => typeof p.fom === 'string')
                    .map(p => {
                      const fomDato = new Date(p.fom);
                      const månedsnavn = new Intl.DateTimeFormat('nb-NO', {
                        month: 'long',
                        year: 'numeric',
                      }).format(fomDato);
                      const formatertMånedsnavn = månedsnavn.charAt(0).toUpperCase() + månedsnavn.slice(1);
                      return (
                        <option key={p.fom} value={p.fom}>
                          {formatertMånedsnavn}
                        </option>
                      );
                    })}
                />
              )}
          </VStack>
        </ModalBody>
        <ModalFooter>
          <HStack gap="space-8" justify="end">
            <Button variant="secondary" type="button" size="small" onClick={cancelEvent}>
              Avbryt
            </Button>
            <Button variant="primary" size="small" loading={isSubmitting} disabled={isSubmitting}>
              Opprett behandling
            </Button>
          </HStack>
        </ModalFooter>
      </RhfForm>
    </Modal>
  );
};

const manuelleRevurderingsArsaker = [
  BehandlingÅrsakDtoBehandlingArsakType.RE_OPPLYSNINGER_OM_BEREGNINGSGRUNNLAG,
  BehandlingÅrsakDtoBehandlingArsakType.RE_OPPLYSNINGER_OM_MEDLEMSKAP,
  BehandlingÅrsakDtoBehandlingArsakType.RE_OPPLYSNINGER_OM_OPPTJENING,
  BehandlingÅrsakDtoBehandlingArsakType.RE_OPPLYSNINGER_OM_FORDELING,
  BehandlingÅrsakDtoBehandlingArsakType.RE_OPPLYSNINGER_OM_INNTEKT,
  BehandlingÅrsakDtoBehandlingArsakType.RE_OPPLYSNINGER_OM_DØD,
  BehandlingÅrsakDtoBehandlingArsakType.RE_OPPLYSNINGER_OM_SØKERS_REL,
  BehandlingÅrsakDtoBehandlingArsakType.RE_OPPLYSNINGER_OM_SØKNAD_FRIST,
  BehandlingÅrsakDtoBehandlingArsakType.RE_KLAGE_UTEN_END_INNTEKT,
  BehandlingÅrsakDtoBehandlingArsakType.RE_KLAGE_MED_END_INNTEKT,
  BehandlingÅrsakDtoBehandlingArsakType.RE_ANNET,
  BehandlingÅrsakDtoBehandlingArsakType.RE_FEIL_I_LOVANDVENDELSE,
  BehandlingÅrsakDtoBehandlingArsakType.RE_FEIL_ELLER_ENDRET_FAKTA,
  BehandlingÅrsakDtoBehandlingArsakType.RE_FEIL_REGELVERKSFORSTÅELSE,
  BehandlingÅrsakDtoBehandlingArsakType.RE_FEIL_PROSESSUELL,
  BehandlingÅrsakDtoBehandlingArsakType.ETTER_KLAGE,
];

const ungdomsprogramytelseRevurderingsårsaker = [
  ung_kodeverk_behandling_BehandlingÅrsakType.RE_KONTROLL_REGISTER_INNTEKT,
];

const unntakVurderingsArsaker = [
  BehandlingÅrsakDtoBehandlingArsakType.UNNT_GENERELL,
  BehandlingÅrsakDtoBehandlingArsakType.RE_ANNET,
];

const tilbakekrevingRevurderingArsaker = [
  tilbakekrevingBehandlingÅrsakDtoBehandlingArsakType.RE_OPPLYSNINGER_OM_FORELDELSE,
  tilbakekrevingBehandlingÅrsakDtoBehandlingArsakType.RE_OPPLYSNINGER_OM_VILKÅR,
  tilbakekrevingBehandlingÅrsakDtoBehandlingArsakType.RE_KLAGE_KA,
  tilbakekrevingBehandlingÅrsakDtoBehandlingArsakType.RE_KLAGE_NFP,
  tilbakekrevingBehandlingÅrsakDtoBehandlingArsakType.RE_FEILUTBETALT_BELØP_HELT_ELLER_DELVIS_BORTFALT,
  ungTilbakeBehandlingÅrsakType.RE_KLAGE_VEDTAKSINSTANS,
];

export const getBehandlingAarsaker = (
  revurderingArsaker: KodeverkObject[],
  alleTilbakekrevingRevurderingArsaker: KodeverkObject[],
  valgtBehandlingType: string,
  erUngdomsprogramytelse: boolean,
) => {
  if (valgtBehandlingType === BehandlingTypeK9Klage.REVURDERING_TILBAKEKREVING) {
    return tilbakekrevingRevurderingArsaker
      .map(ar => alleTilbakekrevingRevurderingArsaker.find(el => el.kode === ar))
      .filter(ar => ar);
  }
  if (valgtBehandlingType === BehandlingTypeK9Klage.REVURDERING) {
    let årsaker: string[] = manuelleRevurderingsArsaker;
    if (erUngdomsprogramytelse) {
      årsaker = ungdomsprogramytelseRevurderingsårsaker;
    }
    return revurderingArsaker
      .filter(bat => årsaker.some(m => m === bat.kode))
      .sort((bat1, bat2) => bat1.navn.localeCompare(bat2.navn));
  }

  if (valgtBehandlingType === BehandlingTypeK9Sak.UNNTAKSBEHANDLING) {
    return revurderingArsaker
      .filter(bat => unntakVurderingsArsaker.some(u => u === bat.kode))
      .sort((bat1, bat2) => bat1.navn.localeCompare(bat2.navn));
  }

  return [];
};

export const getBehandlingTyper = (behandlingstyper: KodeverkObject[]) =>
  behandlingstyper.sort((bt1, bt2) => bt1.navn.localeCompare(bt2.navn));

const kanOppretteBehandlingstype = (
  behandlingOppretting: BehandlingOppretting[],
  behandlingTypeKode: string,
): boolean => behandlingOppretting.some(bo => bo.behandlingType === behandlingTypeKode && bo.kanOppretteBehandling);

export const getEnabledBehandlingstyper = (
  behandlingstyper: KodeverkObject[],
  behandlingOppretting: BehandlingOppretting[],
  kanTilbakekrevingOpprettes = {
    kanBehandlingOpprettes: false,
    kanRevurderingOpprettes: false,
  },
) => {
  const behandlingstyperSomErValgbare = behandlingstyper.filter(type =>
    kanOppretteBehandlingstype(behandlingOppretting, type.kode),
  );
  if (kanTilbakekrevingOpprettes.kanBehandlingOpprettes) {
    const tilbakekreving = behandlingstyper.find(type => type.kode === BehandlingTypeK9Klage.TILBAKEKREVING);
    if (tilbakekreving) {
      behandlingstyperSomErValgbare.push(tilbakekreving);
    }
  }
  if (kanTilbakekrevingOpprettes.kanRevurderingOpprettes) {
    const tilbakekrevingRevurdering = behandlingstyper.find(
      type => type.kode === BehandlingTypeK9Klage.REVURDERING_TILBAKEKREVING,
    );
    if (tilbakekrevingRevurdering) {
      behandlingstyperSomErValgbare.push(tilbakekrevingRevurdering);
    }
  }
  return behandlingstyperSomErValgbare;
};

export default NyBehandlingModal;
