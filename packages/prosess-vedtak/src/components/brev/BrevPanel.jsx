import React from 'react';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import {
  finnesTilgjengeligeVedtaksbrev,
  kanHaAutomatiskVedtaksbrev,
  kanHaFritekstbrev,
  kanOverstyreMottakere,
  harBareFritekstbrev,
  lagVisningsnavnForMottaker,
} from '@fpsak-frontend/utils/src/formidlingUtils';
import { Column, Row } from 'nav-frontend-grid';
import { SelectField } from '@fpsak-frontend/form';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { safeJSONParse, required } from '@fpsak-frontend/utils';

import vedtaksbrevtype from '@fpsak-frontend/kodeverk/src/vedtaksbrevtype';
import styles from './BrevPanel.less';
import InformasjonsbehovAutomatiskVedtaksbrev from './InformasjonsbehovAutomatiskVedtaksbrev';
import FritekstBrevPanel from '../FritekstBrevPanel';
import { VedtakPreviewLink } from '../PreviewLink';

const kanResultatForhåndsvises = behandlingResultat => {
  if (!behandlingResultat) {
    return true;
  }
  const { type } = behandlingResultat;
  if (!type) {
    return true;
  }
  return type.kode !== 'ENDRING_I_FORDELING_AV_YTELSEN' && type.kode !== 'INGEN_ENDRING';
};

const getManuellBrevCallback = ({
  brødtekst,
  overskrift,
  overstyrtMottaker,
  formProps,
  previewCallback,
  tilgjengeligeVedtaksbrev,
}) => e => {
  if (formProps.valid || formProps.pristine) {
    previewCallback({
      dokumentdata: { fritekstbrev: { brødtekst: brødtekst || ' ', overskrift: overskrift || ' ' } },
      dokumentMal: tilgjengeligeVedtaksbrev?.vedtaksbrevmaler[vedtaksbrevtype.FRITEKST],
      ...(overstyrtMottaker ? { overstyrtMottaker: safeJSONParse(overstyrtMottaker) } : {}),
    });
  } else {
    formProps.submit();
  }
  e.preventDefault();
};

const automatiskVedtaksbrevParams = ({
  fritekst,
  redusertUtbetalingÅrsaker,
  overstyrtMottaker,
  tilgjengeligeVedtaksbrev,
}) => ({
  dokumentdata: { fritekst: fritekst || ' ', redusertUtbetalingÅrsaker },
  dokumentMal: tilgjengeligeVedtaksbrev?.vedtaksbrevmaler[vedtaksbrevtype.AUTOMATISK],
  ...(overstyrtMottaker ? { overstyrtMottaker: safeJSONParse(overstyrtMottaker) } : {}),
});

const getPreviewAutomatiskBrevCallbackUtenValidering = ({
  fritekst,
  redusertUtbetalingÅrsaker,
  overstyrtMottaker,
  previewCallback,
  tilgjengeligeVedtaksbrev,
}) => e => {
  previewCallback(
    automatiskVedtaksbrevParams({ fritekst, redusertUtbetalingÅrsaker, overstyrtMottaker, tilgjengeligeVedtaksbrev }),
  );
  e.preventDefault();
};

const getPreviewAutomatiskBrevCallback = ({
  fritekst,
  redusertUtbetalingÅrsaker,
  overstyrtMottaker,
  formProps,
  previewCallback,
  tilgjengeligeVedtaksbrev,
}) => e => {
  if (formProps.valid || formProps.pristine) {
    previewCallback(
      automatiskVedtaksbrevParams({ fritekst, redusertUtbetalingÅrsaker, overstyrtMottaker, tilgjengeligeVedtaksbrev }),
    );
  } else {
    formProps.submit();
  }
  e.preventDefault();
};

export const BrevPanel = props => {
  const {
    intl,
    readOnly,
    sprakkode,
    personopplysninger,
    arbeidsgiverOpplysningerPerId,
    beregningErManueltFastsatt,
    tilgjengeligeVedtaksbrev,
    skalBrukeOverstyrendeFritekstBrev,
    begrunnelse,
    previewCallback,
    redusertUtbetalingÅrsaker,
    brødtekst,
    overskrift,
    behandlingResultat,
    overstyrtMottaker,
    formProps,
  } = props;

  const automatiskBrevCallback = getPreviewAutomatiskBrevCallback({
    fritekst: begrunnelse,
    redusertUtbetalingÅrsaker,
    overstyrtMottaker,
    formProps,
    previewCallback,
    tilgjengeligeVedtaksbrev,
  });
  const automatiskBrevUtenValideringCallback = getPreviewAutomatiskBrevCallbackUtenValidering({
    fritekst: begrunnelse,
    redusertUtbetalingÅrsaker,
    overstyrtMottaker,
    previewCallback,
    tilgjengeligeVedtaksbrev,
  });

  const manuellBrevCallback = getManuellBrevCallback({
    brødtekst,
    overskrift,
    overstyrtMottaker,
    formProps,
    previewCallback,
    tilgjengeligeVedtaksbrev,
  });

  const harAutomatiskVedtaksbrev = kanHaAutomatiskVedtaksbrev(tilgjengeligeVedtaksbrev);
  const harFritekstbrev = kanHaFritekstbrev(tilgjengeligeVedtaksbrev);
  const harAlternativeMottakere = kanOverstyreMottakere(tilgjengeligeVedtaksbrev);

  const fritekstbrev = harFritekstbrev && (
    <>
      <FritekstBrevPanel
        readOnly={readOnly}
        sprakkode={sprakkode}
        previewBrev={automatiskBrevUtenValideringCallback}
        harAutomatiskVedtaksbrev={harAutomatiskVedtaksbrev}
      />
      <VedtakPreviewLink previewCallback={manuellBrevCallback} />
    </>
  );

  const automatiskbrev = harAutomatiskVedtaksbrev && (
    <>
      <InformasjonsbehovAutomatiskVedtaksbrev
        intl={intl}
        readOnly={readOnly}
        sprakkode={sprakkode}
        beregningErManueltFastsatt={beregningErManueltFastsatt}
        begrunnelse={begrunnelse}
      />
      {kanResultatForhåndsvises(behandlingResultat) && <VedtakPreviewLink previewCallback={automatiskBrevCallback} />}
    </>
  );

  const brevpanel =
    skalBrukeOverstyrendeFritekstBrev || harBareFritekstbrev(tilgjengeligeVedtaksbrev) ? fritekstbrev : automatiskbrev;

  return (
    <div>
      {harAlternativeMottakere && (
        <Row>
          <Column xs="12">
            <SelectField
              readOnly={readOnly}
              name="overstyrtMottaker"
              selectValues={tilgjengeligeVedtaksbrev.alternativeMottakere.map(mottaker => (
                <option value={JSON.stringify(mottaker)} key={mottaker.id}>
                  {lagVisningsnavnForMottaker(mottaker.id, personopplysninger, arbeidsgiverOpplysningerPerId)}
                </option>
              ))}
              className={readOnly ? styles.selectReadOnly : null}
              label={intl.formatMessage({ id: 'VedtakForm.Fritekst.OverstyrtMottaker' })}
              validate={[required]}
              bredde="xl"
            />
            <VerticalSpacer sixteenPx />
          </Column>
        </Row>
      )}
      {finnesTilgjengeligeVedtaksbrev(tilgjengeligeVedtaksbrev) ? (
        brevpanel
      ) : (
        <AlertStripeInfo className={styles.infoIkkeVedtaksbrev}>
          {intl.formatMessage({ id: 'VedtakForm.IkkeVedtaksbrev' })}
        </AlertStripeInfo>
      )}
    </div>
  );
};

BrevPanel.propTypes = {
  intl: PropTypes.shape().isRequired,
  sprakkode: PropTypes.shape().isRequired,
  readOnly: PropTypes.bool.isRequired,
  begrunnelse: PropTypes.string,
  tilgjengeligeVedtaksbrev: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.shape()]).isRequired,
  skalBrukeOverstyrendeFritekstBrev: PropTypes.bool.isRequired,
  beregningErManueltFastsatt: PropTypes.bool,
  previewCallback: PropTypes.func.isRequired,
  redusertUtbetalingÅrsaker: PropTypes.arrayOf(PropTypes.string),
  brødtekst: PropTypes.string,
  overskrift: PropTypes.string,
  overstyrtMottaker: PropTypes.string,
  behandlingResultat: PropTypes.shape(),
  personopplysninger: PropTypes.shape(),
  arbeidsgiverOpplysningerPerId: PropTypes.shape(),
  formProps: PropTypes.shape().isRequired,
};

BrevPanel.defaultProps = {
  begrunnelse: null,
  brødtekst: null,
  overskrift: null,
};

export default injectIntl(BrevPanel);
