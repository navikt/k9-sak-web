import { SelectField, TextAreaField } from '@fpsak-frontend/form';
import behandlingResultatType from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import BehandlingType, { erTilbakekrevingType } from '@fpsak-frontend/kodeverk/src/behandlingType';
import dokumentMalType from '@fpsak-frontend/kodeverk/src/dokumentMalType';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { hasValidText, maxLength, required, safeJSONParse } from '@fpsak-frontend/utils';
import KlagePart from '@k9-sak-web/behandling-klage/src/types/klagePartTsType';
import { ArbeidsgiverOpplysningerPerId, Kodeverk, KodeverkMedNavn, Personopplysninger } from '@k9-sak-web/types';
import { Button, Detail, Modal } from '@navikt/ds-react';
import { Column, Row } from 'nav-frontend-grid';
import { SkjemaGruppe } from 'nav-frontend-skjema';
import React, { useMemo } from 'react';
import { WrappedComponentProps, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { InjectedFormProps, formValueSelector, reduxForm } from 'redux-form';
import { createSelector } from 'reselect';
import Brevmottakere from './Brevmottakere';
import styles from './henleggBehandlingModal.module.css';

const maxLength1500 = maxLength(1500);

// TODO (TOR) Skal bruka navn fra kodeverk i staden for oppslag klientside for "henleggArsaker"

const previewHenleggBehandlingDoc =
  (
    previewHenleggBehandling: (erHenleggelse: boolean, data: any) => void,
    ytelseType: Kodeverk,
    fritekst: string,
    behandlingId: number,
    behandlingUuid?: string,
    behandlingType?: Kodeverk,
    valgtMottaker?: KlagePart,
  ) =>
  (e: React.MouseEvent | React.KeyboardEvent): void => {
    // TODO Hardkoda verdiar. Er dette eit kodeverk?
    const data = erTilbakekrevingType(behandlingType)
      ? {
          ytelseType,
          dokumentMal: 'HENLEG',
          fritekst,
          mottaker: 'Søker',
          behandlingId,
        }
      : {
          dokumentMal: dokumentMalType.HENLEGG_BEHANDLING_DOK,
          dokumentdata: { fritekst: fritekst || ' ' },
          overstyrtMottaker: valgtMottaker?.identifikasjon,
        };
    previewHenleggBehandling(true, data);
    e.preventDefault();
  };

const showHenleggelseFritekst = (behandlingTypeKode: string, årsakKode?: string): boolean =>
  BehandlingType.TILBAKEKREVING_REVURDERING === behandlingTypeKode &&
  behandlingResultatType.HENLAGT_FEILOPPRETTET_MED_BREV === årsakKode;

const disableHovedKnapp = (
  behandlingTypeKode: string,
  årsakKode?: string,
  begrunnelse?: string,
  fritekst?: string,
): boolean => {
  if (showHenleggelseFritekst(behandlingTypeKode, årsakKode)) {
    return !(årsakKode && begrunnelse && fritekst);
  }
  return !(årsakKode && begrunnelse);
};

const henleggArsakerPerBehandlingType = {
  [BehandlingType.KLAGE]: [behandlingResultatType.HENLAGT_KLAGE_TRUKKET, behandlingResultatType.HENLAGT_FEILOPPRETTET],
  [BehandlingType.ANKE]: [behandlingResultatType.HENLAGT_SOKNAD_TRUKKET, behandlingResultatType.HENLAGT_FEILOPPRETTET],
  [BehandlingType.DOKUMENTINNSYN]: [
    behandlingResultatType.HENLAGT_INNSYN_TRUKKET,
    behandlingResultatType.HENLAGT_FEILOPPRETTET,
  ],
  [BehandlingType.TILBAKEKREVING]: [behandlingResultatType.HENLAGT_FEILOPPRETTET],
  [BehandlingType.TILBAKEKREVING_REVURDERING]: [
    behandlingResultatType.HENLAGT_FEILOPPRETTET_MED_BREV,
    behandlingResultatType.HENLAGT_FEILOPPRETTET_UTEN_BREV,
  ],
  [BehandlingType.REVURDERING]: [
    behandlingResultatType.HENLAGT_SOKNAD_TRUKKET,
    behandlingResultatType.HENLAGT_FEILOPPRETTET,
  ],
  [BehandlingType.FORSTEGANGSSOKNAD]: [
    behandlingResultatType.HENLAGT_SOKNAD_TRUKKET,
    behandlingResultatType.HENLAGT_FEILOPPRETTET,
  ],
  [BehandlingType.UNNTAK]: [
    behandlingResultatType.HENLAGT_FEILOPPRETTET,
    behandlingResultatType.HENLAGT_SOKNAD_TRUKKET,
  ],
};

export const getHenleggArsaker = (
  behandlingResultatTyper: KodeverkMedNavn[],
  behandlingType: Kodeverk,
  ytelseType: Kodeverk,
): KodeverkMedNavn[] => {
  const typerForBehandlingType = henleggArsakerPerBehandlingType[behandlingType.kode];
  return typerForBehandlingType
    .filter(
      type =>
        ytelseType.kode !== fagsakYtelseType.ENGANGSSTONAD ||
        (ytelseType.kode === fagsakYtelseType.ENGANGSSTONAD &&
          type !== behandlingResultatType.MANGLER_BEREGNINGSREGLER),
    )
    .map(type => behandlingResultatTyper.find(brt => brt.kode === type));
};

interface PureOwnProps {
  cancelEvent: () => void;
  previewHenleggBehandling: (erHenleggelse: boolean, data: any) => void;
  behandlingUuid?: string;
  ytelseType: Kodeverk;
  behandlingId?: number;
  behandlingResultatTyper: KodeverkMedNavn[];
  behandlingType: Kodeverk;
  hentMottakere: () => Promise<KlagePart[]>;
  personopplysninger?: Personopplysninger;
  arbeidsgiverOpplysningerPerId?: ArbeidsgiverOpplysningerPerId;
}

interface MappedOwnProps {
  årsakKode?: string;
  begrunnelse?: string;
  fritekst?: string;
  valgtMottaker?: KlagePart;
  showLink: boolean;
}

/**
 * HenleggBehandlingModal
 *
 * Presentasjonskomponent. Denne modalen vises når saksbehandler valger 'Henlegg behandling og avslutt'.
 * Ved å angi årsak og begrunnelse og trykke på 'Henlegg behandling' blir behandlingen henlagt og avsluttet.
 */
export const HenleggBehandlingModalImpl = ({
  handleSubmit,
  cancelEvent,
  previewHenleggBehandling,
  behandlingUuid,
  ytelseType,
  intl,
  årsakKode,
  begrunnelse,
  fritekst,
  showLink,
  behandlingType,
  behandlingId,
  behandlingResultatTyper,
  hentMottakere,
  personopplysninger,
  arbeidsgiverOpplysningerPerId,
  valgtMottaker,
}: PureOwnProps & MappedOwnProps & WrappedComponentProps & InjectedFormProps) => {
  const henleggArsaker = useMemo(
    () => getHenleggArsaker(behandlingResultatTyper, behandlingType, ytelseType),
    [behandlingResultatTyper, behandlingType, ytelseType],
  );
  return (
    <Modal
      className={styles.modal}
      open
      // closeButton={false}
      aria-label={intl.formatMessage({ id: 'HenleggBehandlingModal.ModalDescription' })}
      onClose={cancelEvent}
      header={{
        heading: intl.formatMessage({ id: 'HenleggBehandlingModal.HenleggBehandling' }),
        closeButton: false,
        size: 'small',
      }}
    >
      <Modal.Body>
        <form onSubmit={handleSubmit}>
          <div>
            <SkjemaGruppe legend={intl.formatMessage({ id: 'HenleggBehandlingModal.HenleggBehandling' })}>
              <Row>
                <Column xs="5">
                  <SelectField
                    name="årsakKode"
                    label={intl.formatMessage({ id: 'HenleggBehandlingModal.ArsakField' })}
                    validate={[required]}
                    placeholder={intl.formatMessage({ id: 'HenleggBehandlingModal.ArsakFieldDefaultValue' })}
                    selectValues={henleggArsaker.map(arsak => (
                      <option value={arsak.kode} key={arsak.kode}>
                        {intl.formatMessage({ id: arsak.kode })}
                      </option>
                    ))}
                  />
                </Column>
              </Row>
              <Row>
                <Column xs="8">
                  <TextAreaField
                    name="begrunnelse"
                    label={intl.formatMessage({ id: 'HenleggBehandlingModal.BegrunnelseField' })}
                    validate={[required, maxLength1500, hasValidText]}
                    maxLength={1500}
                  />
                </Column>
              </Row>
              {showHenleggelseFritekst(behandlingType.kode, årsakKode) && (
                <Row>
                  <Column xs="8">
                    <div className={styles.fritekstTilBrevTextArea}>
                      <TextAreaField
                        name="fritekst"
                        label={intl.formatMessage({ id: 'HenleggBehandlingModal.Fritekst' })}
                        validate={[required, hasValidText]}
                        maxLength={2000}
                      />
                    </div>
                  </Column>
                </Row>
              )}
              <VerticalSpacer sixteenPx />
              <Row>
                <Column xs="7">
                  <div>
                    <Button
                      variant="primary"
                      size="small"
                      className={styles.button}
                      disabled={disableHovedKnapp(behandlingType.kode, årsakKode, begrunnelse, fritekst)}
                    >
                      {intl.formatMessage({ id: 'HenleggBehandlingModal.HenleggBehandlingSubmit' })}
                    </Button>
                    <Button variant="secondary" type="button" size="small" onClick={cancelEvent}>
                      {intl.formatMessage({ id: 'HenleggBehandlingModal.Avbryt' })}
                    </Button>
                  </div>
                </Column>
                <Column xs="4">
                  {showLink && (
                    <div className={styles.forhandsvis}>
                      {behandlingType.kode === BehandlingType.KLAGE && (
                        <Brevmottakere
                          hentMottakere={hentMottakere}
                          personopplysninger={personopplysninger}
                          arbeidsgiverOpplysninger={arbeidsgiverOpplysningerPerId}
                          intl={intl}
                        />
                      )}
                      <Detail>{intl.formatMessage({ id: 'HenleggBehandlingModal.SokerInformeres' })}</Detail>
                      <a
                        href=""
                        onClick={previewHenleggBehandlingDoc(
                          previewHenleggBehandling,
                          ytelseType,
                          fritekst,
                          behandlingId,
                          behandlingUuid,
                          behandlingType,
                          valgtMottaker,
                        )}
                        onKeyDown={previewHenleggBehandlingDoc(
                          previewHenleggBehandling,
                          ytelseType,
                          fritekst,
                          behandlingId,
                          behandlingUuid,
                          behandlingType,
                          valgtMottaker,
                        )}
                        className="lenke lenke--frittstaende"
                      >
                        {intl.formatMessage({ id: 'HenleggBehandlingModal.ForhandsvisBrev' })}
                      </a>
                    </div>
                  )}
                </Column>
              </Row>
            </SkjemaGruppe>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

const getShowLink = createSelector(
  [
    state => formValueSelector('HenleggBehandlingModal')(state, 'årsakKode'),
    state => formValueSelector('HenleggBehandlingModal')(state, 'fritekst'),
    (_state, ownProps: PureOwnProps) => ownProps.behandlingType,
  ],
  (arsakKode: string, fritekst: string, type): boolean => {
    if (type.kode === BehandlingType.TILBAKEKREVING) {
      return behandlingResultatType.HENLAGT_FEILOPPRETTET === arsakKode;
    }
    if (type.kode === BehandlingType.TILBAKEKREVING_REVURDERING) {
      return behandlingResultatType.HENLAGT_FEILOPPRETTET_MED_BREV === arsakKode && !!fritekst;
    }

    return [
      behandlingResultatType.HENLAGT_SOKNAD_TRUKKET,
      behandlingResultatType.HENLAGT_KLAGE_TRUKKET,
      behandlingResultatType.HENLAGT_INNSYN_TRUKKET,
    ].includes(arsakKode);
  },
);

const mapStateToProps = (state, ownProps: PureOwnProps): MappedOwnProps => ({
  årsakKode: formValueSelector('HenleggBehandlingModal')(state, 'årsakKode'),
  begrunnelse: formValueSelector('HenleggBehandlingModal')(state, 'begrunnelse'),
  fritekst: formValueSelector('HenleggBehandlingModal')(state, 'fritekst'),
  valgtMottaker: safeJSONParse(formValueSelector('HenleggBehandlingModal')(state, 'valgtMottaker')),
  showLink: getShowLink(state, ownProps),
});

const HenleggBehandlingModal = reduxForm({
  form: 'HenleggBehandlingModal',
})(HenleggBehandlingModalImpl);

// @ts-ignore Fiks
export default connect(mapStateToProps)(injectIntl(HenleggBehandlingModal));
