import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { AksjonspunktHelpText, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { BodyShort, Label } from '@navikt/ds-react';

import styles from './vedtakForm.module.css';

const findHelpTexts = (intl: IntlShape, aksjonspunktKoder: string[]) => {
  const helpTexts = [];
  if (aksjonspunktKoder && aksjonspunktKoder.includes(aksjonspunktCodes.VURDERE_ANNEN_YTELSE)) {
    helpTexts.push("Vurder om den åpne oppgaven «Vurder konsekvens for ytelse» påvirker behandlingen");
  }
  if (aksjonspunktKoder && aksjonspunktKoder.includes(aksjonspunktCodes.VURDERE_DOKUMENT)) {
    helpTexts.push("Vurder om den åpne oppgaven «Vurder dokument» påvirker behandlingen");
  }
  if (
    aksjonspunktKoder &&
    aksjonspunktKoder.includes(aksjonspunktCodes.KONTROLLER_REVURDERINGSBEHANDLING_VARSEL_VED_UGUNST)
  ) {
    helpTexts.push("Vurder varsel ved vedtak til ugunst");
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
              Beregningsgrunnlaget er endret til ugunst for bruker i revurderingen. 
            </Label>
          )}
        <BodyShort size="small" className={styles.inline}>
          Klikk på 
        </BodyShort>
        <Label size="small" as="p" className={styles.inline}>
          Til godkjenning
        </Label>
        <BodyShort size="small" className={styles.inline}>
           dersom du ønsker å fullføre behandlingen nå.
        </BodyShort>
        <VerticalSpacer twentyPx />
      </>
    );
  }
  return null;
};

export default injectIntl(VedtakHelpTextPanelImpl);
