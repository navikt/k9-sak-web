import { Element, Normaltekst } from 'nav-frontend-typografi';
import React from 'react';
import { FormattedMessage, injectIntl, IntlShape } from 'react-intl';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { AksjonspunktHelpTextTemp, VerticalSpacer } from '@fpsak-frontend/shared-components';

import styles from './vedtakForm.less';

const findHelpTexts = (intl: IntlShape, aksjonspunktKoder: string[]) => {
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

interface VedtakHelpTextPanelImplProps {
  intl: IntlShape;
  readOnly: boolean;
  aksjonspunktKoder: string[];
  viseFlereSjekkbokserForBrev?: boolean;
}

export const VedtakHelpTextPanelImpl = ({
  intl,
  readOnly,
  aksjonspunktKoder,
  viseFlereSjekkbokserForBrev,
}: VedtakHelpTextPanelImplProps) => {
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

export default injectIntl(VedtakHelpTextPanelImpl);
