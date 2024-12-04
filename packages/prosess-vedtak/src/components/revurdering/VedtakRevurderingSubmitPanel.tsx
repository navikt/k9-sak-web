import { Button, ErrorMessage } from '@navikt/ds-react';
import { WrappedComponentProps, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import klageBehandlingArsakType from '@fpsak-frontend/kodeverk/src/behandlingArsakType';
import behandlingStatusCode from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';

import redusertUtbetalingArsak from '../../kodeverk/redusertUtbetalingArsak';

import { AksjonspunktDto, BehandlingÅrsakDto } from '@navikt/k9-sak-typescript-client';
import { FormikState } from 'formik';
import styles from '../vedtakForm.module.css';

interface OwnProps {
  formikValues: FormikState<any>['values'];
  readOnly: boolean;
  harRedusertUtbetaling: boolean;
  visFeilmeldingFordiArsakerMangler: () => void;
  behandlingStatusKode: string;
  isSubmitting: boolean;
  handleSubmit: (event: any) => void;
  aksjonspunkter: AksjonspunktDto[];
  errorOnSubmit: string;
  behandlingÅrsaker: BehandlingÅrsakDto[];
}

export const submitKnappTekst = (aksjonspunkter: AksjonspunktDto[]) =>
  aksjonspunkter && aksjonspunkter.some(ap => ap.erAktivt === true && ap.toTrinnsBehandling === true)
    ? 'VedtakForm.SendTilBeslutter'
    : 'VedtakForm.FattVedtak';

export const VedtakRevurderingSubmitPanelImpl = ({
  intl,
  formikValues,
  readOnly,
  harRedusertUtbetaling,
  visFeilmeldingFordiArsakerMangler,
  behandlingStatusKode,
  isSubmitting,
  handleSubmit,
  aksjonspunkter,
  errorOnSubmit,
}: OwnProps & WrappedComponentProps): JSX.Element => {
  const onClick = event =>
    !harRedusertUtbetaling || Object.values(redusertUtbetalingArsak).some(a => !!formikValues[a])
      ? handleSubmit(event)
      : visFeilmeldingFordiArsakerMangler();

  const submitKnappTekstID = submitKnappTekst(aksjonspunkter);

  const submitKnapp = (
    <Button
      variant="primary"
      type="button"
      className={styles.mainButton}
      onClick={onClick}
      disabled={isSubmitting}
      loading={isSubmitting}
      size="small"
    >
      {intl.formatMessage({
        id: submitKnappTekstID,
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
          <VerticalSpacer sixteenPx />
          {submitKnapp}
          <VerticalSpacer sixteenPx />
          {errorOnSubmit && <ErrorMessage size="small">{errorOnSubmit}</ErrorMessage>}
        </>
      )}
    </div>
  );
};

const erArsakTypeBehandlingEtterKlage = createSelector(
  [ownProps => ownProps.behandlingÅrsaker],
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

const mapStateToProps = (state, ownProps: OwnProps) => ({
  erBehandlingEtterKlage: erArsakTypeBehandlingEtterKlage(ownProps),
});

export default connect(mapStateToProps)(injectIntl(VedtakRevurderingSubmitPanelImpl));
