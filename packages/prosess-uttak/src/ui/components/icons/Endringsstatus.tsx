import React from 'react';
import { ContentWithTooltip } from '@navikt/ft-plattform-komponenter';
import PillIcon from './PillIcon';
import EndringsstatusType from '../../../types/Endringsstatus';

const Endringsstatus = ({ status }: { status: EndringsstatusType }): JSX.Element | null => {
  if (status === 'NY') {
    return (
      <ContentWithTooltip tooltipText="Ny denne behandlingen">
        <PillIcon text="Ny" type="success" />
      </ContentWithTooltip>
    );
  }
  if (status === 'ENDRET') {
    return (
      <ContentWithTooltip tooltipText="Endret denne behandlingen">
        <PillIcon text="Endret" type="warning" />
      </ContentWithTooltip>
    );
  }
  if (status === 'UENDRET_RESULTAT') {
    return (
      <ContentWithTooltip tooltipText="Endret denne behandlingen, men uten endring i resultat">
        <PillIcon text="Endring med uendret resultat" type="warning" />
      </ContentWithTooltip>
    );
  }
  if (status === 'UENDRET') {
    return (
      <ContentWithTooltip tooltipText="Uendret denne behandlingen">
        <PillIcon text="Uendret" type="info" />
      </ContentWithTooltip>
    );
  }

  return null;
};

export default Endringsstatus;
