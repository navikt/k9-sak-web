import { RadioGroupField, TextAreaField } from '@fpsak-frontend/form';
import { ArrowBox, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { hasValidText, maxLength, minLength, required } from '@fpsak-frontend/utils';
import { KodeverkMedNavn } from '@k9-sak-web/types';
import { Detail, Label } from '@navikt/ds-react';
import React from 'react';
import { FormattedMessage, injectIntl, IntlShape, WrappedComponentProps } from 'react-intl';
import Aktsomhet from '../../../kodeverk/aktsomhet';

import styles from './aktsomhetGradUaktsomhetFormPanel.module.css';
import AktsomhetSarligeGrunnerFormPanel from './AktsomhetSarligeGrunnerFormPanel';

const minLength3 = minLength(3);
const maxLength1500 = maxLength(1500);

const sarligGrunnerBegrunnelseDiv = (readOnly: boolean, intl: IntlShape) => (
  <div>
    <Label size="small" as="p">
      <FormattedMessage id="AktsomhetGradUaktsomhetFormPanel.SærligGrunner" />
    </Label>
    <VerticalSpacer eightPx />
    <TextAreaField
      name="sarligGrunnerBegrunnelse"
      label={{ id: 'AktsomhetGradUaktsomhetFormPanel.VurderSærligGrunner' }}
      validate={[required, minLength3, maxLength1500, hasValidText]}
      maxLength={1500}
      readOnly={readOnly}
      textareaClass={styles.explanationTextarea}
      placeholder={intl.formatMessage({ id: 'AktsomhetGradUaktsomhetFormPanel.VurderSærligGrunner.Hjelpetekst' })}
    />
    <VerticalSpacer twentyPx />
  </div>
);

interface OwnProps {
  harGrunnerTilReduksjon?: boolean;
  readOnly: boolean;
  handletUaktsomhetGrad: string;
  erSerligGrunnAnnetValgt: boolean;
  harMerEnnEnYtelse: boolean;
  feilutbetalingBelop: number;
  erTotalBelopUnder4Rettsgebyr: boolean;
  sarligGrunnTyper?: KodeverkMedNavn[];
  andelSomTilbakekreves?: string;
  erValgtResultatTypeForstoBurdeForstaatt?: boolean;
}

const AktsomhetGradUaktsomhetFormPanel = ({
  harGrunnerTilReduksjon,
  readOnly,
  handletUaktsomhetGrad,
  erSerligGrunnAnnetValgt,
  sarligGrunnTyper,
  harMerEnnEnYtelse,
  feilutbetalingBelop,
  erTotalBelopUnder4Rettsgebyr,
  andelSomTilbakekreves,
  intl,
  erValgtResultatTypeForstoBurdeForstaatt,
}: OwnProps & WrappedComponentProps) => {
  const grovUaktsomOffset = erValgtResultatTypeForstoBurdeForstaatt ? 188 : 208;
  return (
    <ArrowBox alignOffset={handletUaktsomhetGrad === Aktsomhet.GROVT_UAKTSOM ? grovUaktsomOffset : 28}>
      {handletUaktsomhetGrad === Aktsomhet.SIMPEL_UAKTSOM && erTotalBelopUnder4Rettsgebyr && (
        <>
          <Detail>
            <FormattedMessage id="AktsomhetGradUaktsomhetFormPanel.Tilbakekrev" />
          </Detail>
          <VerticalSpacer eightPx />
          <RadioGroupField
            validate={[required]}
            name="tilbakekrevSelvOmBeloepErUnder4Rettsgebyr"
            readOnly={readOnly}
            isTrueOrFalseSelection
            radios={[
              {
                value: 'true',
                label: <FormattedMessage id="AktsomhetGradUaktsomhetFormPanel.Ja" />,
                element: (
                  <div className="my-2">
                    {sarligGrunnerBegrunnelseDiv(readOnly, intl)}
                    <AktsomhetSarligeGrunnerFormPanel
                      harGrunnerTilReduksjon={harGrunnerTilReduksjon}
                      erSerligGrunnAnnetValgt={erSerligGrunnAnnetValgt}
                      sarligGrunnTyper={sarligGrunnTyper}
                      harMerEnnEnYtelse={harMerEnnEnYtelse}
                      feilutbetalingBelop={feilutbetalingBelop}
                      readOnly={readOnly}
                      handletUaktsomhetGrad={handletUaktsomhetGrad}
                      andelSomTilbakekreves={andelSomTilbakekreves}
                    />
                  </div>
                ),
              },
              {
                value: 'false',
                label: <FormattedMessage id="AktsomhetGradUaktsomhetFormPanel.Nei" />,
                element: (
                  <ArrowBox alignOffset={20}>
                    <FormattedMessage id="AktsomhetGradUaktsomhetFormPanel.AllePerioderBehandlesLikt" />
                  </ArrowBox>
                ),
              },
            ]}
          />
          <VerticalSpacer eightPx />
        </>
      )}
      {(handletUaktsomhetGrad !== Aktsomhet.SIMPEL_UAKTSOM || !erTotalBelopUnder4Rettsgebyr) && (
        <>
          {sarligGrunnerBegrunnelseDiv(readOnly, intl)}
          <AktsomhetSarligeGrunnerFormPanel
            harGrunnerTilReduksjon={harGrunnerTilReduksjon}
            erSerligGrunnAnnetValgt={erSerligGrunnAnnetValgt}
            sarligGrunnTyper={sarligGrunnTyper}
            harMerEnnEnYtelse={harMerEnnEnYtelse}
            feilutbetalingBelop={feilutbetalingBelop}
            readOnly={readOnly}
            handletUaktsomhetGrad={handletUaktsomhetGrad}
            andelSomTilbakekreves={andelSomTilbakekreves}
          />
        </>
      )}
    </ArrowBox>
  );
};

export default injectIntl(AktsomhetGradUaktsomhetFormPanel);
