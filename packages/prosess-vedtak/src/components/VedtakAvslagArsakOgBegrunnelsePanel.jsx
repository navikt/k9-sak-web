import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Column, Row } from 'nav-frontend-grid';
import { Normaltekst, Undertekst } from 'nav-frontend-typografi';

import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import { TextAreaField } from '@fpsak-frontend/form';
import { getKodeverknavnFn } from '@fpsak-frontend/fp-felles';
import {
  decodeHtmlEntity,
  getLanguageCodeFromSprakkode,
  hasValidText,
  maxLength,
  minLength,
  requiredIfNotPristine,
} from '@fpsak-frontend/utils';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';

import { hasIkkeOppfyltSoknadsfristvilkar } from './VedtakHelper';

import styles from './vedtakAvslagPanel.less';
import vedtakVarselPropType from '../propTypes/vedtakVarselPropType';

const maxLength1500 = maxLength(1500);
const minLength3 = minLength(3);

export const getAvslagArsak = (vilkar, aksjonspunkter, vedtakVarsel, getKodeverknavn) => {
  const avslatteVilkar = vilkar.filter(v => v.vilkarStatus.kode === vilkarUtfallType.IKKE_OPPFYLT);
  if (avslatteVilkar.length === 0) {
    return <FormattedMessage id="VedtakForm.UttaksperioderIkkeGyldig" />;
  }

  return `${getKodeverknavn(avslatteVilkar[0].vilkarType)}: ${getKodeverknavn(
    vedtakVarsel.avslagsarsak,
    avslatteVilkar[0].vilkarType.kode,
  )}`;
};

export const VedtakAvslagArsakOgBegrunnelsePanel = ({
  intl,
  behandlingStatusKode,
  vilkar,
  aksjonspunkter,
  sprakkode,
  readOnly,
  alleKodeverk,
  vedtakVarsel,
}) => {
  const getKodeverknavn = getKodeverknavnFn(alleKodeverk, kodeverkTyper);
  return (
    <>
      {getAvslagArsak(vilkar, aksjonspunkter, vedtakVarsel, getKodeverknavn) && (
        <div>
          <Undertekst>{intl.formatMessage({ id: 'VedtakForm.ArsakTilAvslag' })}</Undertekst>
          <Normaltekst>{getAvslagArsak(vilkar, aksjonspunkter, vedtakVarsel, getKodeverknavn)}</Normaltekst>
          <VerticalSpacer sixteenPx />
        </div>
      )}
      {behandlingStatusKode === behandlingStatus.BEHANDLING_UTREDES && hasIkkeOppfyltSoknadsfristvilkar(vilkar) && (
        <Row>
          <VerticalSpacer sixteenPx />
          <Column xs="7">
            <TextAreaField
              name="begrunnelse"
              label={intl.formatMessage({ id: 'VedtakForm.Fritekst' })}
              validate={[requiredIfNotPristine, minLength3, maxLength1500, hasValidText]}
              maxLength={1500}
              readOnly={readOnly}
              badges={[
                {
                  type: 'fokus',
                  textId: getLanguageCodeFromSprakkode(sprakkode),
                  title: 'Malform.Beskrivelse',
                },
              ]}
            />
          </Column>
        </Row>
      )}
      {readOnly && vedtakVarsel.avslagsarsakFritekst !== null && (
        <span>
          <VerticalSpacer twentyPx />
          <Undertekst>{intl.formatMessage({ id: 'VedtakForm.Fritekst' })}</Undertekst>
          <VerticalSpacer eightPx />
          <div className={styles.fritekstItem}>{decodeHtmlEntity(vedtakVarsel.avslagsarsakFritekst)}</div>
        </span>
      )}
    </>
  );
};

VedtakAvslagArsakOgBegrunnelsePanel.propTypes = {
  intl: PropTypes.shape().isRequired,
  behandlingStatusKode: PropTypes.string.isRequired,
  vilkar: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  aksjonspunkter: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  sprakkode: PropTypes.shape().isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
  readOnly: PropTypes.bool.isRequired,
  vedtakVarsel: vedtakVarselPropType,
};

export default VedtakAvslagArsakOgBegrunnelsePanel;
