import React from 'react';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import {
  finnesTilgjengeligeVedtaksbrev,
  kanHaAutomatiskVedtaksbrev,
  kanHaFritekstbrev,
  kanOverstyreMottakere,
  kanKunVelge,
  lagVisningsnavnForMottaker,
} from '@fpsak-frontend/utils/src/formidlingUtils';
import { Column, Row } from 'nav-frontend-grid';
import SelectFieldFormik from '@fpsak-frontend/form/src/SelectFieldFormik';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { safeJSONParse, required } from '@fpsak-frontend/utils';

import dokumentMalType from '@fpsak-frontend/kodeverk/src/dokumentMalType';
import vedtaksbrevtype from '@fpsak-frontend/kodeverk/src/vedtaksbrevtype';
import styles from './BrevPanel.less';
import InformasjonsbehovAutomatiskVedtaksbrev from './InformasjonsbehovAutomatiskVedtaksbrev';
import FritekstBrevPanel from '../FritekstBrevPanel';
import { VedtakPreviewLink } from '../PreviewLink';
import { fieldnames } from '../../konstanter';

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

const getManuellBrevCallback =
  ({ brødtekst, overskrift, overstyrtMottaker, formProps, previewCallback, tilgjengeligeVedtaksbrev }) =>
  e => {
    if (formProps.isValid) {
      previewCallback({
        dokumentdata: {
          fritekstbrev: {
            brødtekst: brødtekst || ' ',
            overskrift: overskrift || ' ',
            inkluderKalender: formProps.values[fieldnames.BEHOLD_KALENDER_VED_OVERSTYRING] || false,
          },
        },
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
  dokumentdata: {
    fritekst: fritekst || ' ',
    redusertUtbetalingÅrsaker,
    ...Object.assign({}, ...informasjonsbehovValues),
  },

  // Bruker UTLED som fallback til lenken ikke vises for avsluttede behandlinger
  dokumentMal: tilgjengeligeVedtaksbrev?.vedtaksbrevmaler?.[vedtaksbrevtype.AUTOMATISK] ?? dokumentMalType.UTLED,
  ...(overstyrtMottaker ? { overstyrtMottaker: safeJSONParse(overstyrtMottaker) } : {}),
});

const getPreviewAutomatiskBrevCallbackUtenValidering =
  ({ fritekst, redusertUtbetalingÅrsaker, overstyrtMottaker, previewCallback, tilgjengeligeVedtaksbrev }) =>
  e => {
    previewCallback(
      automatiskVedtaksbrevParams({ fritekst, redusertUtbetalingÅrsaker, overstyrtMottaker, tilgjengeligeVedtaksbrev }),
    );
    e.preventDefault();
  };

const getPreviewAutomatiskBrevCallback =
  ({
    fritekst,
    redusertUtbetalingÅrsaker,
    overstyrtMottaker,
    formProps,
    previewCallback,
    tilgjengeligeVedtaksbrev,
    informasjonsbehovValues,
  }) =>
  e => {
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
    formikProps,
  } = props;

  const automatiskBrevCallback = getPreviewAutomatiskBrevCallback({
    fritekst: begrunnelse,
    redusertUtbetalingÅrsaker,
    overstyrtMottaker,
    formProps: formikProps,
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
    formProps: formikProps,
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
        intl={intl}
        previewBrev={automatiskBrevUtenValideringCallback}
        harAutomatiskVedtaksbrev={harAutomatiskVedtaksbrev}
        formikProps={formikProps}
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
        begrunnelse={begrunnelse}
        informasjonsbehovVedtaksbrev={informasjonsbehovVedtaksbrev}
      />
      {kanResultatForhåndsvises(behandlingResultat) && <VedtakPreviewLink previewCallback={automatiskBrevCallback} />}
    </>
  );

  const brevpanel =
    skalBrukeOverstyrendeFritekstBrev || kanKunVelge(tilgjengeligeVedtaksbrev, vedtaksbrevtype.FRITEKST)
      ? fritekstbrev
      : automatiskbrev;
  return (
    <div data-testid="brevpanel">
      {harAlternativeMottakere && (
        <Row>
          <Column xs="12">
            <SelectFieldFormik
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
  informasjonsbehovValues: PropTypes.arrayOf(PropTypes.string).isRequired,
  skalBrukeOverstyrendeFritekstBrev: PropTypes.bool.isRequired,
  previewCallback: PropTypes.func.isRequired,
  redusertUtbetalingÅrsaker: PropTypes.arrayOf(PropTypes.string),
  brødtekst: PropTypes.string,
  overskrift: PropTypes.string,
  overstyrtMottaker: PropTypes.string,
  behandlingResultat: PropTypes.shape(),
  personopplysninger: PropTypes.shape(),
  arbeidsgiverOpplysningerPerId: PropTypes.shape(),
  formikProps: PropTypes.shape().isRequired,
};

BrevPanel.defaultProps = {
  begrunnelse: null,
  brødtekst: null,
  overskrift: null,
};

export default injectIntl(BrevPanel);
