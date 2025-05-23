import { VurdertAv } from '@k9-sak-web/gui/shared/vurdert-av/VurdertAv.js';
import { RettVedDød } from '../../../types/RettVedDød';
import RettVedDødUtfallType from '../../../types/RettVedDødType';

import { LabelledContent } from '@k9-sak-web/gui/shared/labelled-content/LabelledContent.js';
import { CheckmarkIcon } from '@navikt/aksel-icons';
import type { JSX } from 'react';

interface RettVedDødVurderingsdetaljerProps {
  rettVedDød: RettVedDød;
}

const RettVedDødVurderingsdetaljer = ({ rettVedDød }: RettVedDødVurderingsdetaljerProps): JSX.Element => {
  const getRettVedDødUtfallTekst = () => {
    if (rettVedDød.rettVedDødType === RettVedDødUtfallType.RETT_6_UKER) {
      return 'Søker har mottatt pleiepenger i mindre enn 3 år og har rett på 30 dager (6 uker) med pleiepenger jf § 9-10, fjerde ledd, første punktum.';
    }

    return 'Søker har mottatt 100 % pleiepenger i 3 år eller mer og har rett på 3 måneder med pleiepenger jf § 9-10, fjerde ledd, andre punktum.';
  };

  return (
    <>
      <div className="mt-6 flex items-center">
        <CheckmarkIcon />
        <p className="my-0 ml-1.5">{getRettVedDødUtfallTekst()}</p>
      </div>
      <div className="mt-6">
        <LabelledContent label="Vurdering" content={rettVedDød.vurdering} indentContent />
        <VurdertAv ident={rettVedDød.vurdertAv} date={rettVedDød.vurdertTidspunkt} />
      </div>
    </>
  );
};

export default RettVedDødVurderingsdetaljer;
