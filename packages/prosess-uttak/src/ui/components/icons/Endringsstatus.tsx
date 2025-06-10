import { Tooltip } from '@navikt/ds-react';
import { type JSX } from 'react';
import EndringsstatusType from '../../../types/Endringsstatus';
import PillIcon from './PillIcon';

const Endringsstatus = ({ status }: { status?: EndringsstatusType }): JSX.Element | null => {
  if (status === 'NY') {
    return (
      <Tooltip content="Ny denne behandlingen">
        <div>
          <PillIcon text="Ny" type="success" />
        </div>
      </Tooltip>
    );
  }
  if (status === 'ENDRET') {
    return (
      <Tooltip content="Endret denne behandlingen">
        <div>
          <PillIcon text="Endret" type="warning" />
        </div>
      </Tooltip>
    );
  }
  if (status === 'UENDRET_RESULTAT') {
    return (
      <Tooltip content="Endret denne behandlingen, men uten endring i resultat">
        <div>
          <PillIcon text="Endring med uendret resultat" type="warning" />
        </div>
      </Tooltip>
    );
  }
  if (status === 'UENDRET') {
    return (
      <Tooltip content="Uendret denne behandlingen">
        <div>
          <PillIcon text="Uendret" type="info" />
        </div>
      </Tooltip>
    );
  }

  return null;
};

export default Endringsstatus;
