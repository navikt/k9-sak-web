import React from 'react';
import { createSelector } from 'reselect';
import { injectIntl, IntlShape } from 'react-intl';
import { connect } from 'react-redux';
import { Button } from '@navikt/ds-react';

import klageBehandlingArsakType from '@fpsak-frontend/kodeverk/src/behandlingArsakType';
import behandlingStatusCode from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import { Aksjonspunkt } from '@k9-sak-web/types';

import { DokumentDataType, LagreDokumentdataType } from '@k9-sak-web/types/src/dokumentdata';
import MellomLagreBrev from '../brev/MellomLagreBrev';
import redusertUtbetalingArsak from '../../kodeverk/redusertUtbetalingArsak';
import { fieldnames } from '../../konstanter';
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
  brødtekst: string;
  overskrift: string;
  dokumentdata: DokumentDataType;
  lagreDokumentdata: LagreDokumentdataType;
  aksjonspunkter: Aksjonspunkt[];
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
  lagreDokumentdata,
  dokumentdata,
  overskrift,
  brødtekst,
  aksjonspunkter,
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
        <MellomLagreBrev
          lagreDokumentdata={lagreDokumentdata}
          dokumentdata={dokumentdata}
          overskrift={overskrift}
          inkluderKalender={formikValues[fieldnames.INKLUDER_KALENDER_VED_OVERSTYRING]}
          brødtekst={brødtekst}
          submitKnapp={submitKnapp}
        />
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
