import React from 'react';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import {
  finnesTilgjengeligeVedtaksbrev,
  kanHaAutomatiskVedtaksbrev,
  kanHaFritekstbrev,
  kanOverstyreMottakere,
  kanKunVelgeFritekstbrev,
  lagVisningsnavnForMottaker,
} from '@fpsak-frontend/utils/src/formidlingUtils';
import { Column, Row } from 'nav-frontend-grid';
import { SelectField } from '@fpsak-frontend/form';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { safeJSONParse, required } from '@fpsak-frontend/utils';

import dokumentMalType from '@fpsak-frontend/kodeverk/src/dokumentMalType';
import vedtaksbrevtype from '@fpsak-frontend/kodeverk/src/vedtaksbrevtype';
import styles from './BrevPanel.less';
import InformasjonsbehovAutomatiskVedtaksbrev from './InformasjonsbehovAutomatiskVedtaksbrev';
import FritekstBrevPanel from '../FritekstBrevPanel';
import { VedtakPreviewLink } from '../PreviewLink';
import MellomLagreBrev from './MellomLagreBrev';

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
  if (formProps.isValid) {
    previewCallback({
      dokumentdata: { fritekstbrev: { brødtekst: brødtekst || ' ', overskrift: overskrift || ' ' } },
      // Bruker FRITKS som fallback til lenken ikke vises for avsluttede behandlinger
      dokumentMal: tilgjengeligeVedtaksbrev?.vedtaksbrevmaler?.[vedtaksbrevtype.FRITEKST] ?? dokumentMalType.FRITKS,
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
  informasjonsbehovValues,
}) => ({
  dokumentdata: { fritekst: fritekst || ' ', redusertUtbetalingÅrsaker, ...informasjonsbehovValues },
  // Bruker UTLED som fallback til lenken ikke vises for avsluttede behandlinger
  dokumentMal: tilgjengeligeVedtaksbrev?.vedtaksbrevmaler?.[vedtaksbrevtype.AUTOMATISK] ?? dokumentMalType.UTLED,
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
  informasjonsbehovValues,
}) => e => {
  e.preventDefault();
  if (formProps.isValid) {
    previewCallback(
      automatiskVedtaksbrevParams({
        fritekst,
        redusertUtbetalingÅrsaker,
        overstyrtMottaker,
        tilgjengeligeVedtaksbrev,
        informasjonsbehovValues,
      }),
    );
  }
};

export const BrevPanel = props => {
  const {
    intl,
    readOnly,
    sprakkode,
    personopplysninger,
    arbeidsgiverOpplysningerPerId,
    tilgjengeligeVedtaksbrev,
    informasjonsbehovVedtaksbrev,
    informasjonsbehovValues,
    skalBrukeOverstyrendeFritekstBrev,
    begrunnelse,
    previewCallback,
    redusertUtbetalingÅrsaker,
    brødtekst,
    overskrift,
    behandlingResultat,
    overstyrtMottaker,
    formProps,
    dokumentdata,
    lagreDokumentdata
  } = props;

  const automatiskBrevCallback = getPreviewAutomatiskBrevCallback({
    fritekst: begrunnelse,
    redusertUtbetalingÅrsaker,
    overstyrtMottaker,
    formProps,
    previewCallback,
    tilgjengeligeVedtaksbrev,
    informasjonsbehovValues,
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
      <MellomLagreBrev
        lagreDokumentdata={lagreDokumentdata}
        dokumentdata={dokumentdata}
        overskrift={overskrift}
        brødtekst={brødtekst}
      />
    </>
  );

  const automatiskbrev = harAutomatiskVedtaksbrev && (
    <>
      <InformasjonsbehovAutomatiskVedtaksbrev
        intl={intl}
        readOnly={readOnly}
        sprakkode={sprakkode}
        begrunnelse={begrunnelse}
        informasjonsbehovVedtaksbrev={informasjonsbehovVedtaksbrev}
      />
      {kanResultatForhåndsvises(behandlingResultat) && <VedtakPreviewLink previewCallback={automatiskBrevCallback} />}
    </>
  );

  const brevpanel =
    skalBrukeOverstyrendeFritekstBrev || kanKunVelgeFritekstbrev(tilgjengeligeVedtaksbrev) ? fritekstbrev : automatiskbrev;
  console.log(informasjonsbehovValues)
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
  tilgjengeligeVedtaksbrev: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.shape()]),
  informasjonsbehovVedtaksbrev: PropTypes.shape({
    informasjonsbehov: PropTypes.arrayOf(PropTypes.shape({ type: PropTypes.string })),
  }),
  informasjonsbehovValues: PropTypes.shape().isRequired,
  skalBrukeOverstyrendeFritekstBrev: PropTypes.bool.isRequired,
  previewCallback: PropTypes.func.isRequired,
  redusertUtbetalingÅrsaker: PropTypes.arrayOf(PropTypes.string),
  brødtekst: PropTypes.string,
  overskrift: PropTypes.string,
  overstyrtMottaker: PropTypes.string,
  behandlingResultat: PropTypes.shape(),
  personopplysninger: PropTypes.shape(),
  arbeidsgiverOpplysningerPerId: PropTypes.shape(),
  formProps: PropTypes.shape().isRequired,
  dokumentdata: PropTypes.shape(),
  lagreDokumentdata: PropTypes.func.isRequired,
};

BrevPanel.defaultProps = {
  begrunnelse: null,
  brødtekst: null,
  overskrift: null,
};

export default injectIntl(BrevPanel);
