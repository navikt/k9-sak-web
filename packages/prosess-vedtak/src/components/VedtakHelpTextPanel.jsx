import { Element, Normaltekst } from 'nav-frontend-typografi';
import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { AksjonspunktHelpTextTemp, VerticalSpacer } from '@fpsak-frontend/shared-components';

import styles from './vedtakForm.css';

const findHelpTexts = (intl, aksjonspunktKoder) => {
  const helpTexts = [];
  if (aksjonspunktKoder && aksjonspunktKoder.includes(aksjonspunktCodes.VURDERE_ANNEN_YTELSE)) {
    helpTexts.push(intl.formatMessage({ id: 'VedtakForm.VurderAnnenYtelse' }));
  }
  if (aksjonspunktKoder && aksjonspunktKoder.includes(aksjonspunktCodes.VURDERE_DOKUMENT)) {
    helpTexts.push(intl.formatMessage({ id: 'VedtakForm.VurderDokument' }));
  }
  if (
    aksjonspunktKoder &&
    aksjonspunktKoder.includes(aksjonspunktCodes.KONTROLLER_REVURDERINGSBEHANDLING_VARSEL_VED_UGUNST)
  ) {
    helpTexts.push(intl.formatMessage({ id: 'VedtakForm.KontrollerRevurderingsbehandling' }));
  }

  return helpTexts;
};

/**
 * Det er i denne filen teksten vises ...
 */

export const VedtakHelpTextPanelImpl = ({ intl, readOnly, aksjonspunktKoder, viseFlereSjekkbokserForBrev }) => {
  const helpTexts = findHelpTexts(intl, aksjonspunktKoder);
  if (!readOnly && helpTexts.length > 0) {
    return (
      <>
        <div className={viseFlereSjekkbokserForBrev ? styles.begrensMaksBredde : null}>
          <AksjonspunktHelpTextTemp isAksjonspunktOpen>{helpTexts}</AksjonspunktHelpTextTemp>
        </div>
        <VerticalSpacer eightPx />
        {aksjonspunktKoder &&
          aksjonspunktKoder.includes(aksjonspunktCodes.KONTROLLER_REVURDERINGSBEHANDLING_VARSEL_VED_UGUNST) && (
            <Element className={styles.inline}>
              <FormattedMessage id="VedtakForm.HelpText0" />
            </Element>
          )}
        <Normaltekst className={styles.inline}>
          <FormattedMessage id="VedtakForm.HelpText1" />
        </Normaltekst>
        <Element className={styles.inline}>
          <FormattedMessage id="VedtakForm.TilGodkjenning" />
        </Element>
        <Normaltekst className={styles.inline}>
          <FormattedMessage id="VedtakForm.HelpText2" />
        </Normaltekst>
        <VerticalSpacer twentyPx />
      </>
    );
  }
  return null;
};

VedtakHelpTextPanelImpl.propTypes = {
  intl: PropTypes.shape().isRequired,
  readOnly: PropTypes.bool.isRequired,
  aksjonspunktKoder: PropTypes.arrayOf(PropTypes.string).isRequired,
  viseFlereSjekkbokserForBrev: PropTypes.bool,
};

export default injectIntl(VedtakHelpTextPanelImpl);
