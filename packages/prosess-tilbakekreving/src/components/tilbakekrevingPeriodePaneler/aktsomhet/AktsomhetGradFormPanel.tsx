import type { KodeverkMedNavn } from '@k9-sak-web/types';
import React from 'react';

import Aktsomhet from '../../../kodeverk/aktsomhet';
import AktsomhetGradForsettFormPanel from './AktsomhetGradForsettFormPanel';
import AktsomhetGradUaktsomhetFormPanel from './AktsomhetGradUaktsomhetFormPanel';

interface OwnProps {
  harGrunnerTilReduksjon?: boolean;
  readOnly: boolean;
  handletUaktsomhetGrad: Aktsomhet;
  erSerligGrunnAnnetValgt: boolean;
  erValgtResultatTypeForstoBurdeForstaatt?: boolean;
  harMerEnnEnYtelse: boolean;
  feilutbetalingBelop: number;
  erTotalBelopUnder4Rettsgebyr: boolean;
  sarligGrunnTyper?: KodeverkMedNavn[];
  andelSomTilbakekreves?: string;
}

const AktsomhetGradFormPanel = ({
  harGrunnerTilReduksjon,
  readOnly,
  handletUaktsomhetGrad,
  erSerligGrunnAnnetValgt,
  erValgtResultatTypeForstoBurdeForstaatt,
  sarligGrunnTyper,
  harMerEnnEnYtelse,
  feilutbetalingBelop,
  erTotalBelopUnder4Rettsgebyr,
  andelSomTilbakekreves,
}: OwnProps) => (
  <>
    {handletUaktsomhetGrad === Aktsomhet.FORSETT && (
      <AktsomhetGradForsettFormPanel
        readOnly={readOnly}
        erValgtResultatTypeForstoBurdeForstaatt={erValgtResultatTypeForstoBurdeForstaatt}
      />
    )}
    {handletUaktsomhetGrad !== Aktsomhet.FORSETT && (
      <AktsomhetGradUaktsomhetFormPanel
        harGrunnerTilReduksjon={harGrunnerTilReduksjon}
        readOnly={readOnly}
        handletUaktsomhetGrad={handletUaktsomhetGrad}
        erSerligGrunnAnnetValgt={erSerligGrunnAnnetValgt}
        sarligGrunnTyper={sarligGrunnTyper}
        harMerEnnEnYtelse={harMerEnnEnYtelse}
        feilutbetalingBelop={feilutbetalingBelop}
        erTotalBelopUnder4Rettsgebyr={erTotalBelopUnder4Rettsgebyr}
        andelSomTilbakekreves={andelSomTilbakekreves}
        erValgtResultatTypeForstoBurdeForstaatt={erValgtResultatTypeForstoBurdeForstaatt}
      />
    )}
  </>
);

export default AktsomhetGradFormPanel;
