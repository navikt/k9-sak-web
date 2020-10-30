import React, { useEffect, FunctionComponent } from 'react';
import { formValueSelector, reduxForm, InjectedFormProps } from 'redux-form';
import { createSelector } from 'reselect';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl';
import { Column, Row } from 'nav-frontend-grid';
import { Element } from 'nav-frontend-typografi';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import Modal from 'nav-frontend-modal';

import { Image, VerticalSpacer } from '@fpsak-frontend/shared-components';
import innvilgetImageUrl from '@fpsak-frontend/assets/images/innvilget_valgt.svg';
import { CheckboxField, SelectField } from '@fpsak-frontend/form';
import { required } from '@fpsak-frontend/utils';
import bType from '@fpsak-frontend/kodeverk/src/behandlingType';
import behandlingArsakType from '@fpsak-frontend/kodeverk/src/behandlingArsakType';
import { KodeverkMedNavn, Kodeverk } from '@k9-sak-web/types';

import styles from './nyBehandlingModal.less';

const createOptions = (bt, enabledBehandlingstyper, intl) => {
  // TODO Burde retta opp navn for behandlingstype i DB
  const navn =
    bt.kode === bType.REVURDERING ? intl.formatMessage({ id: 'MenyNyBehandlingIndex.OpprettRevurdering' }) : bt.navn;

  const isEnabled = enabledBehandlingstyper.some(b => b.kode === bt.kode);
  return <option key={bt.kode} value={bt.kode} disabled={!isEnabled}>{` ${navn} `}</option>;
};

interface OwnProps {
  cancelEvent: () => void;
  behandlingTyper: KodeverkMedNavn[];
  valgtBehandlingTypeKode?: string;
  behandlingArsakTyper: KodeverkMedNavn[];
  enabledBehandlingstyper: KodeverkMedNavn[];
  behandlingerSomKanOpprettes: { [behandlingstype: string]: boolean };
  behandlingUuid?: string;
  sjekkOmTilbakekrevingKanOpprettes: (params: { saksnummer: string; uuid: string }) => void;
  sjekkOmTilbakekrevingRevurderingKanOpprettes: (params: { uuid: string }) => void;
  uuid?: string;
  saksnummer: string;
  erTilbakekrevingAktivert: boolean;
  erTilbakekreving: boolean;
}

/**
 * NyBehandlingModal
 *
 * Presentasjonskomponent. Denne modalen vises etter at en saksbehandler har valgt opprett ny 1.gangsbehandling i behandlingsmenyen.
 * Ved å trykke på ok skal ny behandling(1.gangsbehandling) av sak opprettes.
 */
export const NyBehandlingModal: FunctionComponent<OwnProps & WrappedComponentProps & InjectedFormProps> = ({
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
}) => {
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
      isOpen
      closeButton={false}
      contentLabel={intl.formatMessage({ id: 'MenyNyBehandlingIndex.ModalDescription' })}
      onRequestClose={cancelEvent}
      shouldCloseOnOverlayClick={false}
    >
      <form onSubmit={handleSubmit}>
        <Row>
          <Column xs="1">
            <Image className={styles.image} src={innvilgetImageUrl} />
            <div className={styles.divider} />
          </Column>
          <Column xs="11">
            <div className={styles.label}>
              <Element>
                <FormattedMessage id="MenyNyBehandlingIndex.OpprettNyForstegangsbehandling" />
              </Element>
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
            <div className={styles.right}>
              <Hovedknapp mini className={styles.button}>
                <FormattedMessage id="MenyNyBehandlingIndex.Ok" />
              </Hovedknapp>
              <Knapp htmlType="button" mini onClick={cancelEvent} className={styles.cancelButton}>
                <FormattedMessage id="MenyNyBehandlingIndex.Avbryt" />
              </Knapp>
            </div>
          </Column>
        </Row>
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
];

const tilbakekrevingRevurderingArsaker = [
  behandlingArsakType.RE_FORELDELSE,
  behandlingArsakType.RE_VILKÅR,
  behandlingArsakType.RE_KLAGE_KA,
  behandlingArsakType.RE_KLAGE_NFP,
  behandlingArsakType.RE_FEILUTBETALT_BELØP_REDUSERT,
];

export const getBehandlingAarsaker = createSelector(
  [
    (_state, ownProps) => ownProps.ytelseType,
    (_state, ownProps) => ownProps.revurderingArsaker,
    (_state, ownProps) => ownProps.tilbakekrevingRevurderingArsaker,
    state => formValueSelector(formName)(state, 'behandlingType'),
  ],
  (ytelseType, alleRevurderingArsaker, alleTilbakekrevingRevurderingArsaker, valgtBehandlingType) => {
    if (valgtBehandlingType === bType.TILBAKEKREVING_REVURDERING) {
      return tilbakekrevingRevurderingArsaker
        .map(ar => alleTilbakekrevingRevurderingArsaker.find(el => el.kode === ar))
        .filter(ar => ar);
    }

    if ([bType.REVURDERING, bType.UNNTAK].some(type => type === valgtBehandlingType)) {
      return alleRevurderingArsaker
        .filter(bat => manuelleRevurderingsArsaker.indexOf(bat.kode) > -1)
        .sort((bat1, bat2) => bat1.navn.localeCompare(bat2.navn));
    }

    return [];
  },
);

interface Props {
  behandlingstyper: KodeverkMedNavn[];
  behandlingerSomKanOpprettes: { [behandlingstype: string]: boolean };
  behandlingType: Kodeverk;
}

export const getBehandlingTyper = createSelector([(ownProps: Props) => ownProps.behandlingstyper], behandlingstyper =>
  behandlingstyper.sort((bt1, bt2) => bt1.navn.localeCompare(bt2.navn)),
);

export const getEnabledBehandlingstyper = createSelector(
  [getBehandlingTyper, ownProps => ownProps.behandlingerSomKanOpprettes],
  (behandlingstyper, behandlingerSomKanOpprettes) =>
    behandlingstyper.filter(b =>
      Object.prototype.hasOwnProperty.call(behandlingerSomKanOpprettes, b.kode)
        ? !!behandlingerSomKanOpprettes[b.kode]
        : true,
    ),
);

const mapStateToPropsFactory = (initialState, initialOwnProps) => {
  const onSubmit = values => {
    const klageOnlyValues =
      values?.behandlingType === bType.KLAGE
        ? {
            aktørId: initialOwnProps.aktorId,
            behandlendeEnhetId: initialOwnProps.gjeldendeVedtakBehandlendeEnhetId,
          }
        : undefined;
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
      ownProps.behandlingType.kode === bType.TILBAKEKREVING ||
      ownProps.behandlingType.kode === bType.TILBAKEKREVING_REVURDERING,
  });
};

export default connect(mapStateToPropsFactory)(
  reduxForm({
    form: formName,
  })(injectIntl(NyBehandlingModal)),
);
