import { CheckboxField, DatepickerField, SelectField } from '@fpsak-frontend/form';
import behandlingArsakType from '@fpsak-frontend/kodeverk/src/behandlingArsakType';
import bType from '@fpsak-frontend/kodeverk/src/behandlingType';
import { required } from '@fpsak-frontend/utils';
import { FagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { Kodeverk, KodeverkMedNavn } from '@k9-sak-web/types';
import { Button, Fieldset, HStack, Modal, VStack } from '@navikt/ds-react';
import { ModalBody, ModalFooter } from '@navikt/ds-react/Modal';
import { ReactElement, useEffect } from 'react';
import { WrappedComponentProps, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { InjectedFormProps, formValueSelector, reduxForm } from 'redux-form';
import { createSelector } from 'reselect';
import styles from './nyBehandlingModal.module.css';

const createOptions = (bt: KodeverkMedNavn, enabledBehandlingstyper: KodeverkMedNavn[]): ReactElement<any> => {
  const navn = bt.kode === bType.REVURDERING ? 'Revurderingsbehandling' : bt.navn;

  const isEnabled = enabledBehandlingstyper.some(b => b.kode === bt.kode);
  return <option key={bt.kode} value={bt.kode} disabled={!isEnabled}>{` ${navn} `}</option>;
};

export type BehandlingOppretting = Readonly<{
  behandlingType: Kodeverk;
  kanOppretteBehandling: boolean;
}>;

export type FormValues = {
  behandlingType: string;
  nyBehandlingEtterKlage?: string;
  behandlingArsakType?: string;
  steg?: 'inngangsvilkår' | 'RE-ENDRET-FORDELING';
  fom?: string;
  tom?: string;
};

interface PureOwnProps {
  ytelseType: FagsakYtelsesType;
  saksnummer: number;
  cancelEvent: () => void;
  submitCallback: (
    data: {
      eksternUuid?: string;
      fagsakYtelseType: FagsakYtelsesType;
    } & FormValues,
  ) => void;
  behandlingOppretting: BehandlingOppretting[];
  behandlingstyper: KodeverkMedNavn[];
  tilbakekrevingRevurderingArsaker: KodeverkMedNavn[];
  revurderingArsaker: KodeverkMedNavn[];
  kanTilbakekrevingOpprettes: {
    kanBehandlingOpprettes: boolean;
    kanRevurderingOpprettes: boolean;
  };
  behandlingType?: Kodeverk;
  behandlingId?: number;
  behandlingUuid?: string;
  uuidForSistLukkede?: string;
  erTilbakekrevingAktivert: boolean;
  sjekkOmTilbakekrevingKanOpprettes: (params: { saksnummer: number; uuid: string }) => void;
  sjekkOmTilbakekrevingRevurderingKanOpprettes: (params: { uuid: string }) => void;
  aktorId?: string;
  gjeldendeVedtakBehandlendeEnhetId?: string;
  sisteDagISøknadsperiode: Date | null;
}

interface MappedOwnProps {
  behandlingTyper: KodeverkMedNavn[];
  enabledBehandlingstyper: KodeverkMedNavn[];
  uuid?: string;
  behandlingArsakTyper: KodeverkMedNavn[];
  valgtBehandlingTypeKode: string;
  erTilbakekreving: boolean;
  fom?: string;
  steg?: string;
}

/**
 * NyBehandlingModal
 *
 * Presentasjonskomponent. Denne modalen vises etter at en saksbehandler har valgt opprett ny 1.gangsbehandling i behandlingsmenyen.
 * Ved å trykke på "Opprett behandling" skal ny behandling (1.gangsbehandling) av sak opprettes.
 */
export const NyBehandlingModal = ({
  handleSubmit,
  cancelEvent,
  behandlingTyper,
  behandlingArsakTyper,
  enabledBehandlingstyper,
  behandlingUuid,
  sjekkOmTilbakekrevingKanOpprettes,
  sjekkOmTilbakekrevingRevurderingKanOpprettes,
  uuid,
  saksnummer,
  erTilbakekrevingAktivert,
  valgtBehandlingTypeKode,
  steg,
  fom,
  erTilbakekreving,
  sisteDagISøknadsperiode,
}: Partial<PureOwnProps> & MappedOwnProps & WrappedComponentProps & InjectedFormProps) => {
  useEffect(() => {
    if (erTilbakekrevingAktivert) {
      if (uuid !== undefined) {
        sjekkOmTilbakekrevingKanOpprettes({ saksnummer, uuid });
      }
      if (erTilbakekreving) {
        sjekkOmTilbakekrevingRevurderingKanOpprettes({ uuid: behandlingUuid });
      }
    }
  }, []);
  const erFørstegangsbehandling = valgtBehandlingTypeKode === bType.FORSTEGANGSSOKNAD;
  const erRevurdering = valgtBehandlingTypeKode === bType.REVURDERING;
  const visÅrsak = (erRevurdering && steg === 'inngangsvilkår') || (!erRevurdering && behandlingArsakTyper.length > 0);
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
      <form onSubmit={handleSubmit}>
        <ModalBody>
          <VStack gap="5">
            <SelectField
              name="behandlingType"
              label="Hva slags behandling ønsker du å opprette?"
              placeholder="Velg behandlingstype"
              validate={[required]}
              selectValues={behandlingTyper.map(bt => createOptions(bt, enabledBehandlingstyper))}
            />
            {erRevurdering && (
              <SelectField
                name="steg"
                label="Hvor i prosessen vil du starte revurderingen?"
                placeholder="Velg startpunkt i revurderingsprosessen"
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
                name="behandlingArsakType"
                label="Hva er årsaken til den nye behandlingen?"
                placeholder="Velg årsak"
                validate={[required]}
                selectValues={behandlingArsakTyper.map(b => (
                  <option key={b.kode} value={b.kode}>
                    {b.navn}
                  </option>
                ))}
              />
            )}
            {erRevurdering && steg === 'RE-ENDRET-FORDELING' && (
              <Fieldset className={styles.datePickerContainer} legend="Hvilken periode vil du revurdere?">
                <DatepickerField
                  name="fom"
                  disabledDays={{ before: undefined, after: sisteDagISøknadsperiode ?? new Date() }}
                  label="Fra og med"
                  validate={[required]}
                />
                <DatepickerField
                  name="tom"
                  disabledDays={{ before: new Date(fom), after: sisteDagISøknadsperiode ?? new Date() }}
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
      </form>
    </Modal>
  );
};

const formName = 'NyBehandlingModal';

// TODO Denne inndelinga burde vel flyttast til DB (KODELISTE.EKSTRA_DATA)?

const manuelleRevurderingsArsaker = [
  behandlingArsakType.BEREEGNINGSGRUNNLAG,
  behandlingArsakType.MEDLEMSKAP,
  behandlingArsakType.OPPTJENING,
  behandlingArsakType.FORDELING,
  behandlingArsakType.INNTEKT,
  behandlingArsakType.DØD,
  behandlingArsakType.SØKERS_RELASJON,
  behandlingArsakType.SØKNADSFRIST,
  behandlingArsakType.KLAGE_U_INNTK,
  behandlingArsakType.KLAGE_M_INNTK,
  behandlingArsakType.ANNET,
  behandlingArsakType.FEIL_I_LOVANDVENDELSE,
  behandlingArsakType.FEIL_ELLER_ENDRET_FAKTA,
  behandlingArsakType.FEIL_REGELVERKSFORSTAELSE,
  behandlingArsakType.FEIL_PROSESSUELL,
  behandlingArsakType.ETTER_KLAGE,
];

const unntakVurderingsArsaker = [behandlingArsakType.UNNT_GENERELL, behandlingArsakType.ANNET];

const tilbakekrevingRevurderingArsaker = [
  behandlingArsakType.RE_FORELDELSE,
  behandlingArsakType.RE_VILKÅR,
  behandlingArsakType.RE_KLAGE_KA,
  behandlingArsakType.RE_KLAGE_NFP,
  behandlingArsakType.RE_FEILUTBETALT_BELØP_REDUSERT,
];

export const getBehandlingAarsaker = createSelector(
  [
    (_state, ownProps: PureOwnProps) => ownProps.revurderingArsaker,
    (_state, ownProps: PureOwnProps) => ownProps.tilbakekrevingRevurderingArsaker,
    state => formValueSelector(formName)(state, 'behandlingType'),
  ],
  (alleRevurderingArsaker, alleTilbakekrevingRevurderingArsaker, valgtBehandlingType) => {
    if (valgtBehandlingType === bType.TILBAKEKREVING_REVURDERING) {
      return tilbakekrevingRevurderingArsaker
        .map(ar => alleTilbakekrevingRevurderingArsaker.find(el => el.kode === ar))
        .filter(ar => ar);
    }
    if (valgtBehandlingType === bType.REVURDERING) {
      return alleRevurderingArsaker
        .filter(bat => manuelleRevurderingsArsaker.indexOf(bat.kode) > -1)
        .sort((bat1, bat2) => bat1.navn.localeCompare(bat2.navn));
    }

    if (valgtBehandlingType === bType.UNNTAK) {
      return alleRevurderingArsaker
        .filter(bat => unntakVurderingsArsaker.indexOf(bat.kode) > -1)
        .sort((bat1, bat2) => bat1.navn.localeCompare(bat2.navn));
    }

    return [];
  },
);

export const getBehandlingTyper = createSelector(
  [(ownProps: PureOwnProps) => ownProps.behandlingstyper],
  behandlingstyper => behandlingstyper.sort((bt1, bt2) => bt1.navn.localeCompare(bt2.navn)),
);

const kanOppretteBehandlingstype = (
  behandlingOppretting: BehandlingOppretting[],
  behandlingTypeKode: string,
): boolean =>
  behandlingOppretting.some(bo => bo.behandlingType.kode === behandlingTypeKode && bo.kanOppretteBehandling);

export const getEnabledBehandlingstyper = createSelector(
  [
    getBehandlingTyper,
    (ownProps: PureOwnProps) => ownProps.behandlingOppretting,
    (ownProps: PureOwnProps) => ownProps.kanTilbakekrevingOpprettes,
  ],
  (
    behandlingstyper,
    behandlingOppretting,
    kanTilbakekrevingOpprettes = {
      kanBehandlingOpprettes: false,
      kanRevurderingOpprettes: false,
    },
  ) => {
    const behandlingstyperSomErValgbare = behandlingstyper.filter(type =>
      kanOppretteBehandlingstype(behandlingOppretting, type.kode),
    );
    if (kanTilbakekrevingOpprettes.kanBehandlingOpprettes) {
      behandlingstyperSomErValgbare.push(behandlingstyper.find(type => type.kode === bType.TILBAKEKREVING));
    }
    if (kanTilbakekrevingOpprettes.kanRevurderingOpprettes) {
      behandlingstyperSomErValgbare.push(behandlingstyper.find(type => type.kode === bType.TILBAKEKREVING_REVURDERING));
    }
    return behandlingstyperSomErValgbare;
  },
);

const mapStateToPropsFactory = (_, initialOwnProps: PureOwnProps) => {
  const onSubmit = values => {
    const klageOnlyValues =
      values?.behandlingType === bType.KLAGE
        ? {
            aktørId: initialOwnProps.aktorId,
            behandlendeEnhetId: initialOwnProps.gjeldendeVedtakBehandlendeEnhetId,
          }
        : {};
    initialOwnProps.submitCallback({
      ...values,
      eksternUuid: initialOwnProps.uuidForSistLukkede,
      fagsakYtelseType: initialOwnProps.ytelseType,
      ...klageOnlyValues,
    });
  };
  return (state, ownProps) => ({
    onSubmit,
    behandlingTyper: getBehandlingTyper(ownProps),
    enabledBehandlingstyper: getEnabledBehandlingstyper(ownProps),
    uuid: ownProps.uuidForSistLukkede,
    behandlingArsakTyper: getBehandlingAarsaker(state, ownProps),
    valgtBehandlingTypeKode: formValueSelector(formName)(state, 'behandlingType'),
    steg: formValueSelector(formName)(state, 'steg'),
    fom: formValueSelector(formName)(state, 'fom'),
    erTilbakekreving:
      ownProps.behandlingType &&
      (ownProps.behandlingType.kode === bType.TILBAKEKREVING ||
        ownProps.behandlingType.kode === bType.TILBAKEKREVING_REVURDERING),
  });
};

export default connect(mapStateToPropsFactory)(
  reduxForm({
    form: formName,
  })(injectIntl(NyBehandlingModal)),
);
