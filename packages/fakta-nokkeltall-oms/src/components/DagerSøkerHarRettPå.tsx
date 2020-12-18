import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link, useLocation } from 'react-router-dom';
import { parseQueryString, formatQueryString } from '@fpsak-frontend/utils';
import { faktaPanelCodes } from '@k9-sak-web/konstanter';
import Nøkkeltall from './Nøkkeltall';

interface DagerSøkerHarRettPåProps {
  dagerRettPå: number;
  antallOmsorgsdager: number;
  antallKoronadager: number;
  erIKoronaperioden: boolean;
  benyttetRammemelding: boolean;
  visDetaljer: () => void;
  viserDetaljer: boolean;
}

const DagerSøkerHarRettPå: React.FunctionComponent<DagerSøkerHarRettPåProps> = ({
  dagerRettPå,
  antallOmsorgsdager,
  antallKoronadager,
  erIKoronaperioden,
  benyttetRammemelding,
  visDetaljer,
  viserDetaljer,
}) => {
  const location = useLocation();
  const { search, pathname } = location;
  const faktapanelUttak = {
    ...parseQueryString(search),
    fakta: faktaPanelCodes.UTTAK,
  };

  const detaljer = [
    {
      antallDager: antallOmsorgsdager,
      overskrifttekstId: 'Nøkkeltall.DagerGrunnrett',
      infotekstContent: (
        <>
          <FormattedMessage id="Nøkkeltall.DagerGrunnrett.InfoText" />
          {benyttetRammemelding && (
            <>
              <FormattedMessage id="Nøkkeltall.Rammemelding" />
              <Link to={`${pathname}${formatQueryString(faktapanelUttak)}`}>
                <FormattedMessage id="Nøkkeltall.Rammemelding.Linknavn" />
              </Link>
            </>
          )}
        </>
      ),
    },
  ];

  if (erIKoronaperioden || antallKoronadager > 0) {
    detaljer.push({
      antallDager: antallKoronadager,
      overskrifttekstId: 'Nøkkeltall.Koronadager',
      infotekstContent: <FormattedMessage id="Nøkkeltall.Koronadager.InfoText" />,
    });
  }

  return (
    <Nøkkeltall
      overskrift={{ antallDager: dagerRettPå, overskrifttekstId: 'Nøkkeltall.DagerSøkerHarRettPå' }}
      detaljer={detaljer}
      farge="#66cbec"
      viserDetaljer={viserDetaljer}
      visDetaljer={visDetaljer}
    />
  );
};

export default DagerSøkerHarRettPå;
