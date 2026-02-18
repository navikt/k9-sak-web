import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { AksjonspunktHelpText, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { BodyShort, Label } from '@navikt/ds-react';
import { FormattedMessage, injectIntl, IntlShape, WrappedComponentProps } from 'react-intl';

import styles from './vedtakForm.module.css';

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

interface VedtakHelpTextPanelProps {
  readOnly: boolean;
  aksjonspunktKoder: string[];
  viseFlereSjekkbokserForBrev: boolean;
}

/**
 * Det er i denne filen teksten vises ...
 */

export const VedtakHelpTextPanelImpl = ({
  intl,
  readOnly,
  aksjonspunktKoder,
  viseFlereSjekkbokserForBrev,
}: VedtakHelpTextPanelProps & WrappedComponentProps) => {
  const helpTexts = findHelpTexts(intl, aksjonspunktKoder);
  if (!readOnly && helpTexts.length > 0) {
    return (
      <>
        <div className={viseFlereSjekkbokserForBrev ? styles.begrensMaksBredde : null}>
          <AksjonspunktHelpText isAksjonspunktOpen>{helpTexts}</AksjonspunktHelpText>
        </div>
        <VerticalSpacer eightPx />
        {aksjonspunktKoder &&
          aksjonspunktKoder.includes(aksjonspunktCodes.KONTROLLER_REVURDERINGSBEHANDLING_VARSEL_VED_UGUNST) && (
            <Label size="small" as="p" className={styles.inline}>
              <FormattedMessage id="VedtakForm.HelpText0" />
            </Label>
          )}
        <BodyShort size="small" className={styles.inline}>
          <FormattedMessage id="VedtakForm.HelpText1" />
        </BodyShort>
        <Label size="small" as="p" className={styles.inline}>
          <FormattedMessage id="VedtakForm.TilGodkjenning" />
        </Label>
        <BodyShort size="small" className={styles.inline}>
          <FormattedMessage id="VedtakForm.HelpText2" />
        </BodyShort>
        <VerticalSpacer twentyPx />
      </>
    );
  }
  return null;
};

export default injectIntl(VedtakHelpTextPanelImpl);
