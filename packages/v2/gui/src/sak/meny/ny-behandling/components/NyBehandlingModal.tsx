import { behandlingType as BehandlingTypeK9Klage } from '@k9-sak-web/backend/k9klage/kodeverk/behandling/BehandlingType.js';
import { k9_kodeverk_behandling_BehandlingÅrsakType as BehandlingÅrsakDtoBehandlingArsakType } from '@k9-sak-web/backend/k9sak/generated/types.js';
import { behandlingType as BehandlingTypeK9Sak } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/BehandlingType.js';
import type { FagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { behandlingÅrsakType as tilbakekrevingBehandlingÅrsakDtoBehandlingArsakType } from '@k9-sak-web/backend/k9tilbake/kodeverk/behandling/BehandlingÅrsakType.js';
import { erTilbakekreving } from '@k9-sak-web/gui/utils/behandlingUtils.js';
import type { KodeverkObject } from '@k9-sak-web/lib/kodeverk/types.js';
import { Button, Fieldset, HStack, Modal, VStack } from '@navikt/ds-react';
import { ModalBody, ModalFooter } from '@navikt/ds-react/Modal';
import { RhfCheckbox, RhfDatepicker, RhfForm, RhfSelect } from '@navikt/ft-form-hooks';
import { required } from '@navikt/ft-form-validators';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import styles from './nyBehandlingModal.module.css';

const createOptions = (bt: KodeverkObject, enabledBehandlingstyper: KodeverkObject[]) => {
  const navn = bt.kode === BehandlingTypeK9Klage.REVURDERING ? 'Revurderingsbehandling' : bt.navn;

  const isEnabled = enabledBehandlingstyper.some(b => b.kode === bt.kode);
  return <option key={bt.kode} value={bt.kode} disabled={!isEnabled}>{` ${navn} `}</option>;
};

export type BehandlingOppretting = Readonly<{
  behandlingType: string;
  kanOppretteBehandling: boolean;
}>;

export type FormValues = {
  behandlingType: string;
  nyBehandlingEtterKlage?: string;
  behandlingArsakType?: string;
  steg?: 'inngangsvilkår' | 'RE-ENDRET-FORDELING';
  fom: string;
  tom: string;
};

interface NyBehandlingModalProps {
  ytelseType: FagsakYtelsesType;
  saksnummer: string;
  cancelEvent: () => void;
  submitCallback: (
    data: {
      eksternUuid?: string;
      fagsakYtelseType: FagsakYtelsesType;
    } & FormValues,
  ) => void;
  behandlingOppretting: BehandlingOppretting[];
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
      steg: undefined,
      fom: '',
      tom: '',
    },
  });
  const [valgtBehandlingTypeKode, steg, fom] = formMethods.watch(['behandlingType', 'steg', 'fom']);
  const behandlingTyper = getBehandlingTyper(behandlingstyper);
  const enabledBehandlingstyper = getEnabledBehandlingstyper(
    behandlingstyper,
    behandlingOppretting,
    kanTilbakekrevingOpprettes,
  );
  const erFørstegangsbehandling = valgtBehandlingTypeKode === BehandlingTypeK9Klage.FØRSTEGANGSSØKNAD;
  const erRevurdering = valgtBehandlingTypeKode === BehandlingTypeK9Klage.REVURDERING;
  const BehandlingÅrsakDtoBehandlingArsakTyper = getBehandlingAarsaker(
    revurderingArsaker,
    tilbakekrevingRevurderingArsaker,
    valgtBehandlingTypeKode,
  );
  const visÅrsak =
    (erRevurdering && steg === 'inngangsvilkår') ||
    (!erRevurdering && BehandlingÅrsakDtoBehandlingArsakTyper.length > 0);
  const handleSubmit = (formValues: FormValues) => {
    const klageOnlyValues =
      formValues?.behandlingType === BehandlingTypeK9Klage.KLAGE
        ? {
            aktørId: aktorId,
            behandlendeEnhetId: gjeldendeVedtakBehandlendeEnhetId,
          }
        : {};
    submitCallback({
      ...formValues,
      eksternUuid: uuidForSistLukkede,
      fagsakYtelseType: ytelseType,
      ...klageOnlyValues,
    });
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
            {erRevurdering && (
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
            {erRevurdering && steg === 'RE-ENDRET-FORDELING' && (
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
          </VStack>
        </ModalBody>
        <ModalFooter>
          <HStack gap="space-8" justify="end">
            <Button variant="secondary" type="button" size="small" onClick={cancelEvent}>
              Avbryt
            </Button>
            <Button variant="primary" size="small">
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
];

export const getBehandlingAarsaker = (
  revurderingArsaker: KodeverkObject[],
  alleTilbakekrevingRevurderingArsaker: KodeverkObject[],
  valgtBehandlingType: string,
) => {
  if (valgtBehandlingType === BehandlingTypeK9Klage.REVURDERING_TILBAKEKREVING) {
    return tilbakekrevingRevurderingArsaker
      .map(ar => alleTilbakekrevingRevurderingArsaker.find(el => el.kode === ar))
      .filter(ar => ar);
  }
  if (valgtBehandlingType === BehandlingTypeK9Klage.REVURDERING) {
    return revurderingArsaker
      .filter(bat => manuelleRevurderingsArsaker.some(m => m === bat.kode))
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
