import React from 'react';
import { createSelector } from 'reselect';
import { injectIntl, IntlShape } from 'react-intl';
import { connect } from 'react-redux';
import { Button, Alert, BodyLong, ErrorMessage } from '@navikt/ds-react';

import klageBehandlingArsakType from '@fpsak-frontend/kodeverk/src/behandlingArsakType';
import behandlingStatusCode from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import { Aksjonspunkt } from '@k9-sak-web/types';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { SjekkTilbakekrevingType } from '../VedtakForm';

import redusertUtbetalingArsak from '../../kodeverk/redusertUtbetalingArsak';

import styles from '../vedtakForm.less';

interface OwnProps {
  intl: IntlShape;
  formikValues: any;
  readOnly: boolean;
  harRedusertUtbetaling: boolean;
  visFeilmeldingFordiArsakerMangler: () => void;
  behandlingStatusKode: string;
  isSubmitting: boolean;
  handleSubmit: (event: any) => void;
  aksjonspunkter: Aksjonspunkt[];
  sjekkTilbakekreving: SjekkTilbakekrevingType;
  errorOnSubmit: boolean;
}

export const submitKnappTekst = aksjonspunkter =>
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
  sjekkTilbakekreving,
  errorOnSubmit,
}: OwnProps): JSX.Element => {
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
      disabled={
        isSubmitting ||
        (sjekkTilbakekreving.visAksjonspunkt &&
          sjekkTilbakekreving.harVurdertÅSjekkeTilbakekreving &&
          sjekkTilbakekreving.skalBehandleTilbakekrevingFørst) ||
        (sjekkTilbakekreving.visAksjonspunkt && !sjekkTilbakekreving.harVurdertÅSjekkeTilbakekreving)
      }
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
      {sjekkTilbakekreving.skalBehandleTilbakekrevingFørst && (
        <>
          <VerticalSpacer twentyPx />
          <Alert className={styles.aksjonspunktAlert} variant="error" size="small">
            <BodyLong>Sett behandlingen på vent og behandle tilbakekrevingssaken først.</BodyLong>
          </Alert>
        </>
      )}
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
  // @ts-ignore
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
  erBehandlingEtterKlage: erArsakTypeBehandlingEtterKlage(ownProps),
});

export default connect(mapStateToProps)(injectIntl(VedtakRevurderingSubmitPanelImpl));
