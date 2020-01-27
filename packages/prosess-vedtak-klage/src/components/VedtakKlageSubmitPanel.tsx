import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import classNames from 'classnames';
import { Hovedknapp } from 'nav-frontend-knapper';
import { Column, Row } from 'nav-frontend-grid';
import { InjectedFormProps } from 'redux-form';

import klageVurderingType from '@fpsak-frontend/kodeverk/src/klageVurdering';
import dokumentMalType from '@fpsak-frontend/kodeverk/src/dokumentMalType';
import KlageVurderingResultat from '@k9-frontend/types/src/klage/klageVurderingResultatType';

import styles from './vedtakKlageSubmitPanel.less';

const medholdIKlage = klageVurderingResultat =>
  klageVurderingResultat && klageVurderingResultat.klageVurdering === klageVurderingType.MEDHOLD_I_KLAGE;

export const isMedholdIKlage = (klageVurderingResultatNFP, klageVurderingResultatNK) =>
  medholdIKlage(klageVurderingResultatNFP) || medholdIKlage(klageVurderingResultatNK);

const getBrevKode = (klageVurdering, klageVurdertAvKa) => {
  switch (klageVurdering) {
    case klageVurderingType.STADFESTE_YTELSESVEDTAK:
      return klageVurdertAvKa
        ? dokumentMalType.KLAGE_YTELSESVEDTAK_STADFESTET_DOK
        : dokumentMalType.KLAGE_OVERSENDT_KLAGEINSTANS_DOK;
    case klageVurderingType.OPPHEVE_YTELSESVEDTAK:
      return dokumentMalType.KLAGE_YTELSESVEDTAK_OPPHEVET_DOK;
    case klageVurderingType.HJEMSENDE_UTEN_Å_OPPHEVE:
      return dokumentMalType.KLAGE_YTELSESVEDTAK_OPPHEVET_DOK;
    case klageVurderingType.MEDHOLD_I_KLAGE:
      return dokumentMalType.VEDTAK_MEDHOLD;
    case klageVurderingType.AVVIS_KLAGE:
      return dokumentMalType.KLAGE_AVVIST_DOK;
    default:
      return null;
  }
};

const getPreviewCallback = (formProps, begrunnelse, previewVedtakCallback, klageResultat) => e => {
  const klageVurdertAvNK = klageResultat.klageVurdertAv === 'NFP';
  const data = {
    fritekst: begrunnelse || '',
    mottaker: '',
    brevmalkode: getBrevKode(klageResultat.klageVurdering, klageVurdertAvNK),
    klageVurdertAv: klageResultat.klageVurdertAv,
    erOpphevet: klageResultat.klageVurdering === klageVurderingType.OPPHEVE_YTELSESVEDTAK,
  };
  if (formProps.valid || formProps.pristine) {
    previewVedtakCallback(data);
  } else {
    formProps.submit();
  }
  e.preventDefault();
};

interface VedtakKlageSubmitPanelProps {
  behandlingPaaVent: boolean;
  previewVedtakCallback: (data: {
    gjelderVedtak: boolean,
  }) => Promise<any>;
  begrunnelse?: string;
  klageResultat?: KlageVurderingResultat;
  formProps: InjectedFormProps;
  readOnly: boolean;
}

export const VedtakKlageSubmitPanelImpl: React.FunctionComponent<VedtakKlageSubmitPanelProps> = ({
  behandlingPaaVent,
  previewVedtakCallback,
  begrunnelse,
  klageResultat,
  formProps,
  readOnly,
}) => {
  const previewBrev = getPreviewCallback(formProps, begrunnelse, previewVedtakCallback, klageResultat);
  const intl = useIntl();

  return (
    <Row>
      <Column xs="6">
        {!readOnly && (
          <Hovedknapp
            mini
            className={styles.mainButton}
            onClick={formProps.handleSubmit}
            disabled={behandlingPaaVent || formProps.submitting}
            spinner={formProps.submitting}
          >
            {intl.formatMessage({ id: 'VedtakKlageForm.TilGodkjenning' })}
          </Hovedknapp>
        )}
        <a
          href=""
          onClick={previewBrev}
          onKeyDown={e => (e.keyCode === 13 ? previewBrev(e) : null)}
          className={classNames('lenke lenke--frittstaende')}
        >
          <FormattedMessage id="VedtakKlageForm.ForhandvisBrev" />
        </a>
      </Column>
    </Row>
  );
};

VedtakKlageSubmitPanelImpl.defaultProps = {
  begrunnelse: undefined,
  klageResultat: undefined,
};

export default VedtakKlageSubmitPanelImpl;
