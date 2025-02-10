import { behandlingType as BehandlingTypeK9Klage } from '@k9-sak-web/backend/k9klage/kodeverk/behandling/BehandlingType.js';
import { behandlingType as BehandlingTypeK9Sak } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/BehandlingType.js';
import {
  behandlingÅrsakType,
  type BehandlingÅrsakType,
} from '@k9-sak-web/backend/k9sak/kodeverk/behandling/BehandlingÅrsakType.js';
import { behandlingÅrsakType as tilbakekrevingBehandlingÅrsakType } from '@k9-sak-web/backend/k9tilbake/kodeverk/behandling/BehandlingÅrsakType.js';
import type { KodeverkObject } from '@k9-sak-web/lib/kodeverk/types.js';
import { Button, Fieldset, HStack, Modal, VStack } from '@navikt/ds-react';
import { ModalBody, ModalFooter } from '@navikt/ds-react/Modal';
import { CheckboxField, Datepicker, Form, SelectField } from '@navikt/ft-form-hooks';
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
  behandlingÅrsakType?: string;
  steg?: 'inngangsvilkår' | 'RE-ENDRET-FORDELING';
  fom: string;
  tom: string;
};

interface NyBehandlingModalProps {
  ytelseType: string;
  saksnummer: string;
  cancelEvent: () => void;
  submitCallback: (
    data: {
      eksternUuid?: string;
      fagsakYtelseType: string;
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
  sjekkOmTilbakekrevingKanOpprettes: (params: { saksnummer: string; uuid: string }) => void;
  sjekkOmTilbakekrevingRevurderingKanOpprettes: (params: { uuid: string }) => void;
  aktorId?: string;
  gjeldendeVedtakBehandlendeEnhetId?: string;
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
}: NyBehandlingModalProps) => {
  useEffect(() => {
    if (erTilbakekrevingAktivert) {
      if (uuidForSistLukkede !== undefined) {
        sjekkOmTilbakekrevingKanOpprettes({ saksnummer, uuid: uuidForSistLukkede });
      }
      if (erTilbakekreving && behandlingUuid) {
        sjekkOmTilbakekrevingRevurderingKanOpprettes({ uuid: behandlingUuid });
      }
    }
  }, []);

  const formMethods = useForm<FormValues>({
    defaultValues: {
      behandlingType: '',
      nyBehandlingEtterKlage: '',
      behandlingÅrsakType: '',
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
  const behandlingÅrsakTyper = getBehandlingAarsaker(
    revurderingArsaker,
    tilbakekrevingRevurderingArsaker,
    valgtBehandlingTypeKode,
  );
  const visÅrsak = (erRevurdering && steg === 'inngangsvilkår') || (!erRevurdering && behandlingÅrsakTyper.length > 0);
  const erTilbakekreving =
    behandlingType === BehandlingTypeK9Klage.TILBAKEKREVING ||
    behandlingType === BehandlingTypeK9Klage.REVURDERING_TILBAKEKREVING;
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
      <Form<FormValues> formMethods={formMethods} onSubmit={handleSubmit}>
        <ModalBody>
          <VStack gap="5">
            <SelectField
              name="behandlingType"
              label="Hva slags behandling ønsker du å opprette?"
              validate={[required]}
              selectValues={behandlingTyper.map(bt => createOptions(bt, enabledBehandlingstyper))}
            />
            {erRevurdering && (
              <SelectField
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
              <CheckboxField
                name="nyBehandlingEtterKlage"
                label="Behandlingen opprettes som et resultat av klagebehandling"
              />
            )}
            {visÅrsak && (
              <SelectField
                name="behandlingÅrsakType"
                label="Hva er årsaken til den nye behandlingen?"
                validate={[required]}
                selectValues={behandlingÅrsakTyper.map(b => (
                  <option key={b?.kode} value={b?.kode}>
                    {b?.navn}
                  </option>
                ))}
              />
            )}
            {erRevurdering && steg === 'RE-ENDRET-FORDELING' && (
              <Fieldset className={styles.datePickerContainer} legend="Hvilken periode vil du revurdere?">
                <Datepicker
                  name="fom"
                  disabledDays={[{ before: undefined, after: new Date() }]}
                  label="Fra og med"
                  validate={[required]}
                />
                <Datepicker
                  name="tom"
                  disabledDays={[{ before: new Date(fom), after: new Date() }]}
                  label="Til og med"
                  validate={[required]}
                />
              </Fieldset>
            )}
          </VStack>
        </ModalBody>
        <ModalFooter>
          <HStack gap="2" justify="end">
            <Button variant="secondary" type="button" size="small" onClick={cancelEvent}>
              Avbryt
            </Button>
            <Button variant="primary" size="small">
              Opprett behandling
            </Button>
          </HStack>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

const manuelleRevurderingsArsaker = [
  behandlingÅrsakType.BEREEGNINGSGRUNNLAG,
  behandlingÅrsakType.MEDLEMSKAP,
  behandlingÅrsakType.OPPTJENING,
  behandlingÅrsakType.FORDELING,
  behandlingÅrsakType.INNTEKT,
  behandlingÅrsakType.DØD,
  behandlingÅrsakType.SØKERS_RELASJON,
  behandlingÅrsakType.SØKNADSFRIST,
  behandlingÅrsakType.KLAGE_U_INNTK,
  behandlingÅrsakType.KLAGE_M_INNTK,
  behandlingÅrsakType.ANNET,
  behandlingÅrsakType.FEIL_I_LOVANDVENDELSE,
  behandlingÅrsakType.FEIL_ELLER_ENDRET_FAKTA,
  behandlingÅrsakType.FEIL_REGELVERKSFORSTAELSE,
  behandlingÅrsakType.FEIL_PROSESSUELL,
  behandlingÅrsakType.ETTER_KLAGE,
];

const unntakVurderingsArsaker = [behandlingÅrsakType.UNNT_GENERELL, behandlingÅrsakType.ANNET];

const tilbakekrevingRevurderingArsaker = [
  tilbakekrevingBehandlingÅrsakType.RE_FORELDELSE,
  tilbakekrevingBehandlingÅrsakType.RE_VILKÅR,
  tilbakekrevingBehandlingÅrsakType.RE_KLAGE_KA,
  tilbakekrevingBehandlingÅrsakType.RE_KLAGE_NFP,
  tilbakekrevingBehandlingÅrsakType.RE_FEILUTBETALT_BELØP_REDUSERT,
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
      .filter(bat => manuelleRevurderingsArsaker.indexOf(bat.kode as BehandlingÅrsakType) > -1)
      .sort((bat1, bat2) => bat1.navn.localeCompare(bat2.navn));
  }

  if (valgtBehandlingType === BehandlingTypeK9Sak.UNNTAKSBEHANDLING) {
    return revurderingArsaker
      .filter(bat => unntakVurderingsArsaker.indexOf(bat.kode as BehandlingÅrsakType) > -1)
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
