import { useContext } from 'react';

import { PersonPencilFillIcon } from '@navikt/aksel-icons';
import { BodyShort } from '@navikt/ds-react';

import { prettifyDateString } from '@navikt/ft-utils';

import { SaksbehandlernavnContext } from '../SaksbehandlernavnContext/SaksbehandlernavnContext';

export interface IAssessedByProps {
  ident?: string;
  date?: string;
}

/* For å få opp saksbehandlerens navn må sette saksbehandlernavn i SaksbehandlernavnContext.Provider
 */

export const AssessedBy = ({ ident, date }: IAssessedByProps) => {
  const saksbehandlernavn = useContext(SaksbehandlernavnContext);
  if (!ident) {
    return null;
  }
  const name = saksbehandlernavn[ident] || ident;
  const formattedDate = date ? `, ${prettifyDateString(date)}` : '';

  return (
    <div className="flex items-center my-2.5">
      <PersonPencilFillIcon className="mr-2" height="1em" width="1em" />
      <BodyShort size="small">{`Vurdering av ${name}${formattedDate}`}</BodyShort>
    </div>
  );
};
