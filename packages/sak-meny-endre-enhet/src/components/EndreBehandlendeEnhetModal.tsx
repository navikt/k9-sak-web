import innvilgetImageUrl from '@fpsak-frontend/assets/images/innvilget_valgt.svg';
import { SelectField, TextAreaField } from '@fpsak-frontend/form';
import { Image, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { hasValidText, maxLength, required } from '@fpsak-frontend/utils';
import { Button, Modal } from '@navikt/ds-react';
import { Column, Row } from 'nav-frontend-grid';
import { Normaltekst } from 'nav-frontend-typografi';
import React from 'react';
import { FormattedMessage, WrappedComponentProps, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { InjectedFormProps, formValueSelector, reduxForm } from 'redux-form';
import styles from './endreBehandlendeEnhetModal.module.css';

const maxLength400 = maxLength(400);

interface PureOwnProps {
  lukkModal: () => void;
  behandlendeEnheter: {
    enhetId: string;
    enhetNavn: string;
  }[];
  gjeldendeBehandlendeEnhetId?: string;
  gjeldendeBehandlendeEnhetNavn?: string;
}

interface MappedOwnProps {
  nyEnhet?: string;
  begrunnelse?: string;
}

/**
 * EndreBehandlendeEnhetModal
 *
 * Presentasjonskomponent. Denne modalen vises når saksbehandler valger 'Bytt behandlende enhet'.
 * Ved å angi ny enhet og begrunnelse og trykke på 'OK' blir behandlende enhet endret.
 */
export const EndreBehandlendeEnhetModal = ({
  intl,
  handleSubmit,
  lukkModal,
  behandlendeEnheter,
  gjeldendeBehandlendeEnhetId,
  gjeldendeBehandlendeEnhetNavn,
  nyEnhet,
  begrunnelse,
}: PureOwnProps & MappedOwnProps & WrappedComponentProps & InjectedFormProps) => {
  const selectOptions = () =>
    behandlendeEnheter.map((enhet, index) => (
      <option value={`${index}`} key={enhet.enhetId}>
        {`${enhet.enhetId} ${enhet.enhetNavn}`}
      </option>
    ));
  return (
    <Modal
      className={styles.modal}
      open
      aria-label={intl.formatMessage({ id: 'EndreBehandlendeEnhetModal.ModalDescription' })}
      onClose={lukkModal}
    >
      <form onSubmit={handleSubmit}>
        <Modal.Header closeButton={false}>
          <Row>
            <Column xs="1">
              <Image
                className={styles.image}
                alt={intl.formatMessage({ id: 'EndreBehandlendeEnhetModal.Endre' })}
                src={innvilgetImageUrl}
              />
              <div className={styles.divider} />
            </Column>
            <Column xs="11">
              <Normaltekst className={styles.infotekstBeskrivelse}>
                <FormattedMessage id="EndreBehandlendeEnhetModal.EndreEnhet" />
              </Normaltekst>
            </Column>
          </Row>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Column xs="1" />
            <Column xs="5">
              <SelectField
                name="nyEnhet"
                label={intl.formatMessage({ id: 'EndreBehandlendeEnhetModal.NyEnhetField' })}
                validate={[required]}
                placeholder={`${gjeldendeBehandlendeEnhetId} ${gjeldendeBehandlendeEnhetNavn}`}
                selectValues={selectOptions()}
                bredde="xl"
              />
            </Column>
          </Row>
          <Row>
            <Column xs="1" />
            <Column xs="8">
              <VerticalSpacer eightPx />
              <TextAreaField
                name="begrunnelse"
                label={intl.formatMessage({ id: 'EndreBehandlendeEnhetModal.BegrunnelseField' })}
                validate={[required, maxLength400, hasValidText]}
                maxLength={400}
              />
            </Column>
          </Row>
          <Row>
            <Column xs="1" />
            <Column xs="8">
              <VerticalSpacer sixteenPx />
              <div className={styles.floatButtons}>
                <Button variant="primary" size="small" className={styles.button} disabled={!(nyEnhet && begrunnelse)}>
                  {intl.formatMessage({ id: 'EndreBehandlendeEnhetModal.Ok' })}
                </Button>
                <Button variant="secondary" type="button" size="small" onClick={lukkModal}>
                  {intl.formatMessage({ id: 'EndreBehandlendeEnhetModal.Avbryt' })}
                </Button>
              </div>
            </Column>
          </Row>
        </Modal.Body>
      </form>
    </Modal>
  );
};

const mapStateToProps = (state): MappedOwnProps => ({
  nyEnhet: formValueSelector('ChangeBehandlendeEnhetModal')(state, 'nyEnhet'),
  begrunnelse: formValueSelector('ChangeBehandlendeEnhetModal')(state, 'begrunnelse'),
});

export default connect(mapStateToProps)(
  reduxForm({
    form: 'ChangeBehandlendeEnhetModal',
  })(injectIntl(EndreBehandlendeEnhetModal)),
);
