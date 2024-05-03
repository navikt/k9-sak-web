import innvilgetImageUrl from '@k9-sak-web/assets/images/innvilget_valgt.svg';
import { SelectField, TextAreaField } from '@k9-sak-web/form';
import { Image, VerticalSpacer } from '@k9-sak-web/shared-components';
import { hasValidText, maxLength, required } from '@k9-sak-web/utils';
import { BodyShort, Button, HGrid, Modal } from '@navikt/ds-react';
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
          <HGrid gap="1" columns={{ xs: '1fr 11fr' }}>
            <div className="relative">
              <Image
                className={styles.image}
                alt={intl.formatMessage({ id: 'EndreBehandlendeEnhetModal.Endre' })}
                src={innvilgetImageUrl}
              />
              <div className={styles.divider} />
            </div>
            <div>
              <BodyShort size="small" className={styles.infotekstBeskrivelse}>
                <FormattedMessage id="EndreBehandlendeEnhetModal.EndreEnhet" />
              </BodyShort>
            </div>
          </HGrid>
        </Modal.Header>
        <Modal.Body>
          <HGrid gap="1" columns={{ xs: '1fr 5fr 6fr' }}>
            <div />
            <div>
              <SelectField
                name="nyEnhet"
                label={intl.formatMessage({ id: 'EndreBehandlendeEnhetModal.NyEnhetField' })}
                validate={[required]}
                placeholder={`${gjeldendeBehandlendeEnhetId} ${gjeldendeBehandlendeEnhetNavn}`}
                selectValues={selectOptions()}
                bredde="xl"
              />
            </div>
          </HGrid>
          <HGrid gap="1" columns={{ xs: '1fr 8fr 3fr' }}>
            <div />
            <div>
              <VerticalSpacer eightPx />
              <TextAreaField
                name="begrunnelse"
                label={intl.formatMessage({ id: 'EndreBehandlendeEnhetModal.BegrunnelseField' })}
                validate={[required, maxLength400, hasValidText]}
                maxLength={400}
              />
            </div>
          </HGrid>
          <HGrid gap="1" columns={{ xs: '1fr 8fr 3fr' }}>
            <div />
            <div>
              <VerticalSpacer sixteenPx />
              <div className={styles.floatButtons}>
                <Button variant="primary" size="small" className={styles.button} disabled={!(nyEnhet && begrunnelse)}>
                  {intl.formatMessage({ id: 'EndreBehandlendeEnhetModal.Ok' })}
                </Button>
                <Button variant="secondary" type="button" size="small" onClick={lukkModal}>
                  {intl.formatMessage({ id: 'EndreBehandlendeEnhetModal.Avbryt' })}
                </Button>
              </div>
            </div>
          </HGrid>
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
