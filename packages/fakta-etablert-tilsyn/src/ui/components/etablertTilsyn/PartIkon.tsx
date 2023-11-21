import { ContentWithTooltip } from '@navikt/ft-plattform-komponenter';
import React from 'react';
import { CoApplicantFilled, PeopleFilled, People } from '@navikt/ds-icons';
import Kilde from '../../../types/Kilde';

const PartIkon = ({ parter, fontSize = '24px' }: { parter: Kilde[]; fontSize?: string }) => {
  if (parter.includes(Kilde.SØKER) && parter.includes(Kilde.ANDRE)) {
    return (
      <ContentWithTooltip tooltipText="To søkere">
        <CoApplicantFilled style={{ height: 'unset', width: 'unset', fontSize, scale: '0.90' }} />
      </ContentWithTooltip>
    );
  }
  if (parter.includes(Kilde.SØKER)) {
    return (
      <ContentWithTooltip tooltipText="Søker">
        <PeopleFilled style={{ height: 'unset', width: 'unset', fontSize, paddingBottom: '2px', marginRight: '6px' }} />
      </ContentWithTooltip>
    );
  }
  if (parter.includes(Kilde.ANDRE)) {
    return (
      <ContentWithTooltip tooltipText="Annen part">
        <People style={{ height: 'unset', width: 'unset', fontSize, paddingBottom: '2px', marginRight: '6px' }} />
      </ContentWithTooltip>
    );
  }
  return null;
};

export default PartIkon;
