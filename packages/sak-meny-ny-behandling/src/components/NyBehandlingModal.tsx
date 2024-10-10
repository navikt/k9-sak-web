import innvilgetImageUrl from '@fpsak-frontend/assets/images/innvilget_valgt.svg';
import { CheckboxField, SelectField } from '@fpsak-frontend/form';
import behandlingArsakType from '@fpsak-frontend/kodeverk/src/behandlingArsakType';
import bType from '@fpsak-frontend/kodeverk/src/behandlingType';
import { Image, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { required } from '@fpsak-frontend/utils';
import { Kodeverk, KodeverkMedNavn } from '@k9-sak-web/types';
import { Button, HGrid, Label, Modal } from '@navikt/ds-react';
import React, { ReactElement, useEffect } from 'react';
import { FormattedMessage, IntlShape, WrappedComponentProps, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { InjectedFormProps, formValueSelector, reduxForm } from 'redux-form';
import { createSelector } from 'reselect';
import styles from './nyBehandlingModal.module.css';

const createOptions = (
  bt: KodeverkMedNavn,
  enabledBehandlingstyper: KodeverkMedNavn[],
  intl: IntlShape,
): ReactElement => {
  // TODO Burde retta opp navn for behandlingstype i DB
  const navn =
    bt.kode === bType.REVURDERING ? intl.formatMessage({ id: 'MenyNyBehandlingIndex.OpprettRevurdering' }) : bt.navn;

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
};

interface PureOwnProps {
  ytelseType: Kodeverk;
  saksnummer: number;
  cancelEvent: () => void;
  submitCallback: (
    data: {
      eksternUuid?: string;
      fagsakYtelseType: Kodeverk;
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
}

interface MappedOwnProps {
  behandlingTyper: KodeverkMedNavn[];
  enabledBehandlingstyper: KodeverkMedNavn[];
  uuid?: string;
  behandlingArsakTyper: KodeverkMedNavn[];
  valgtBehandlingTypeKode: string;
  erTilbakekreving: boolean;
}

/**
 * NyBehandlingModal
 *
 * Presentasjonskomponent. Denne modalen vises etter at en saksbehandler har valgt opprett ny 1.gangsbehandling i behandlingsmenyen.
 * Ved å trykke på ok skal ny behandling(1.gangsbehandling) av sak opprettes.
 */
export const NyBehandlingModal = ({
  handleSubmit,
  cancelEvent,
  intl,
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
  erTilbakekreving,
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
  return (
    <Modal
      className={styles.modal}
      open
      aria-label={intl.formatMessage({ id: 'MenyNyBehandlingIndex.ModalDescription' })}
      onClose={cancelEvent}
    >
      <Modal.Body>
        <form onSubmit={handleSubmit}>
          <HGrid gap="1" columns={{ xs: '1fr 11fr' }}>
            <div className="relative">
              <Image className={styles.image} src={innvilgetImageUrl} />
              <div className={styles.divider} />
            </div>
            <div>
              <div className={styles.label}>
                <Label size="small" as="p">
                  <FormattedMessage id="MenyNyBehandlingIndex.OpprettNyForstegangsbehandling" />
                </Label>
              </div>
              <VerticalSpacer sixteenPx />
              <VerticalSpacer sixteenPx />
              <SelectField
                name="behandlingType"
                label=""
                placeholder={intl.formatMessage({ id: 'MenyNyBehandlingIndex.SelectBehandlingTypePlaceholder' })}
                validate={[required]}
                selectValues={behandlingTyper.map(bt => createOptions(bt, enabledBehandlingstyper, intl))}
                bredde="l"
              />
              <VerticalSpacer eightPx />
              {valgtBehandlingTypeKode === bType.FORSTEGANGSSOKNAD && (
                <CheckboxField
                  name="nyBehandlingEtterKlage"
                  label={intl.formatMessage({ id: 'MenyNyBehandlingIndex.NyBehandlingEtterKlage' })}
                />
              )}
              {behandlingArsakTyper.length > 0 && (
                <SelectField
                  name="behandlingArsakType"
                  label=""
                  placeholder={intl.formatMessage({ id: 'MenyNyBehandlingIndex.SelectBehandlingArsakTypePlaceholder' })}
                  validate={[required]}
                  selectValues={behandlingArsakTyper.map(b => (
                    <option key={b.kode} value={b.kode}>
                      {b.navn}
                    </option>
                  ))}
                />
              )}
              <VerticalSpacer sixteenPx />
              <div className={styles.buttonContainer}>
                <Button variant="primary" size="small" className={styles.button}>
                  <FormattedMessage id="MenyNyBehandlingIndex.Ok" />
                </Button>
                <Button
                  variant="secondary"
                  type="button"
                  size="small"
                  onClick={cancelEvent}
                  className={styles.cancelButton}
                >
                  <FormattedMessage id="MenyNyBehandlingIndex.Avbryt" />
                </Button>
              </div>
            </div>
          </HGrid>
        </form>
      </Modal.Body>
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
    // TODO lage en egen for UNNTAK når vi vet hvilke det skal være
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

const mapStateToPropsFactory = (initialState, initialOwnProps: PureOwnProps) => {
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
