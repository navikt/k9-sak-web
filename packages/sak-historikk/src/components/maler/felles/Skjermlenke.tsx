import React from 'react';
import { NavLink } from 'react-router-dom';
import { Element } from 'nav-frontend-typografi';
import { createLocationForHistorikkItems } from '@fpsak-frontend/fp-felles/src/skjermlenkeCodes';
import { scrollUp } from './historikkUtils';

const Skjermlenke = ({ skjermlenke, behandlingLocation, getKodeverknavn }) => {
  if (!skjermlenke) {
    return null;
  }
  return (
    <Element>
      <NavLink to={createLocationForHistorikkItems(behandlingLocation, skjermlenke.kode)} onClick={scrollUp}>
        {getKodeverknavn(skjermlenke)}
      </NavLink>
    </Element>
  );
};

export default Skjermlenke;
