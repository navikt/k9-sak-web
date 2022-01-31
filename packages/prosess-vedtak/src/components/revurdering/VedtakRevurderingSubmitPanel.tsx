import React from 'react';
import { createSelector } from 'reselect';
import { injectIntl, IntlShape } from 'react-intl';
import { connect } from 'react-redux';
import { FormikState } from 'formik';
import { Button } from '@navikt/ds-react';

import klageBehandlingArsakType from '@fpsak-frontend/kodeverk/src/behandlingArsakType';
import behandlingStatusCode from '@fpsak-frontend/kodeverk/src/behandlingStatus';

import { DokumentDataType, LagreDokumentdataType } from '@k9-sak-web/types/src/dokumentdata';
import MellomLagreBrev from '../brev/MellomLagreBrev';
import redusertUtbetalingArsak from '../../kodeverk/redusertUtbetalingArsak';
import styles from '../vedtakForm.less';

export const getSubmitKnappTekst = createSelector([ownProps => ownProps.aksjonspunkter], aksjonspunkter =>
  aksjonspunkter && aksjonspunkter.some(ap => ap.erAktivt === true && ap.toTrinnsBehandling === true)
    ? 'VedtakForm.TilGodkjenning'
    : 'VedtakForm.FattVedtak',
);

interface OwnProps {
  intl: IntlShape;
  formikProps: FormikState<any>;
  readOnly: boolean;
  submitKnappTextId: string;
  harRedusertUtbetaling: boolean;
  visFeilmeldingFordiArsakerMangler: () => void;
  behandlingStatusKode: string;
  isSubmitting: boolean;
  handleSubmit: (event: any) => void;
  brødtekst: string;
  overskrift: string;
  dokumentdata: DokumentDataType;
  lagreDokumentdata: LagreDokumentdataType;
}

export const VedtakRevurderingSubmitPanelImpl = ({
  intl,
  formikProps,
  readOnly,
  submitKnappTextId,
  harRedusertUtbetaling,
  visFeilmeldingFordiArsakerMangler,
  behandlingStatusKode,
  isSubmitting,
  handleSubmit,
  lagreDokumentdata,
  dokumentdata,
  overskrift,
  brødtekst,
}: OwnProps): JSX.Element => {
  const onClick = event =>
    !harRedusertUtbetaling || Object.values(redusertUtbetalingArsak).some(a => !!formikProps.values[a])
      ? handleSubmit(event)
      : visFeilmeldingFordiArsakerMangler();

  const submitKnapp = (
    <Button
      variant="primary"
      type="button"
      className={styles.mainButton}
      onClick={onClick}
      disabled={isSubmitting}
      loading={isSubmitting}
    >
      {intl.formatMessage({
        id: submitKnappTextId,
      })}
    </Button>
  );

  if (behandlingStatusKode !== behandlingStatusCode.BEHANDLING_UTREDES) {
    return null;
  }

  return (
    <div>
      <div className={styles.margin} />
      {!readOnly && (
        <>
          <MellomLagreBrev
            lagreDokumentdata={lagreDokumentdata}
            dokumentdata={dokumentdata}
            overskrift={overskrift}
            brødtekst={brødtekst}
            submitKnapp={submitKnapp}
          />
        </>
      )}
    </div>
  );
};

const erArsakTypeBehandlingEtterKlage = createSelector(
  [ownProps => ownProps.behandlingArsaker],
  (behandlingArsakTyper = []) =>
    behandlingArsakTyper
      .map(({ behandlingArsakType }) => behandlingArsakType)
      .some(
        bt =>
          bt.kode === klageBehandlingArsakType.ETTER_KLAGE ||
          bt.kode === klageBehandlingArsakType.KLAGE_U_INNTK ||
          bt.kode === klageBehandlingArsakType.KLAGE_M_INNTK,
      ),
);

const mapStateToProps = (state, ownProps) => ({
  submitKnappTextId: getSubmitKnappTekst(ownProps),
  erBehandlingEtterKlage: erArsakTypeBehandlingEtterKlage(ownProps),
});

export default connect(mapStateToProps)(injectIntl(VedtakRevurderingSubmitPanelImpl));
