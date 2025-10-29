import { RadioGroupField, TextAreaField } from '@fpsak-frontend/form';
import { ArrowBox, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { hasValidText, maxLength, minLength, required } from '@fpsak-frontend/utils';
import { KodeverkMedNavn } from '@k9-sak-web/types';
import { Detail, Label } from '@navikt/ds-react';
import React from 'react';
import Aktsomhet from '../../../kodeverk/aktsomhet';

import AktsomhetSarligeGrunnerFormPanel from './AktsomhetSarligeGrunnerFormPanel';

const minLength3 = minLength(3);
const maxLength1500 = maxLength(1500);

const sarligGrunnerBegrunnelseDiv = (readOnly: boolean, intl: IntlShape) => (
  <div>
    <Label size="small" as="p">
      Særlige grunner 4. ledd
    </Label>
    <VerticalSpacer eightPx />
    <TextAreaField
      name="sarligGrunnerBegrunnelse"
      label={{ id: 'AktsomhetGradUaktsomhetFormPanel.VurderSærligGrunner' }}
      validate={[required, minLength3, maxLength1500, hasValidText]}
      maxLength={1500}
      readOnly={readOnly}
      placeholder={"Begrunn om det foreligger/ ikke foreligger særlige grunner for reduksjon av beløpet som kreves tilbake. Kryss av hvilke særlige grunner som er vektlagt for resultatet"}
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
            Totalbeløpet er under 4 rettsgebyr (6. ledd). Skal det tilbakekreves?
          </Detail>
          <VerticalSpacer eightPx />
          <RadioGroupField
            validate={[required]}
            name="tilbakekrevSelvOmBeloepErUnder4Rettsgebyr"
            readOnly={readOnly}
            radios={[
              {
                value: true,
                label: Ja,
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
                value: false,
                label: Nei,
                element: (
                  <ArrowBox alignOffset={20}>
                    Når 6. ledd anvendes må alle perioder behandles likt
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
