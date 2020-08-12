import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Nøkkeltall from './Nøkkeltall';

interface DagerSøkerHarRettPåProps {
  dagerRettPå: number;
  antallOmsorgsdager: number;
  antallKoronadager: number;
  erISmittvernperioden: boolean;
  benyttetRammemelding: boolean;
  visDetaljer: () => void;
  viserDetaljer: boolean;
}

const DagerSøkerHarRettPå: React.FunctionComponent<DagerSøkerHarRettPåProps> = ({
  dagerRettPå,
  antallOmsorgsdager,
  antallKoronadager,
  erISmittvernperioden,
  benyttetRammemelding,
  visDetaljer,
  viserDetaljer,
}) => {
  const detaljer = [
    {
      antallDager: antallOmsorgsdager,
      overskrifttekstId: 'Nøkkeltall.DagerGrunnrett',
      infotekstContent: (
        <>
          <FormattedMessage id="Nøkkeltall.DagerGrunnrett.InfoText" />
          {benyttetRammemelding && <FormattedMessage id="Nøkkeltall.Rammemelding" />}
        </>
      ),
    },
  ];

  if (erISmittvernperioden || antallKoronadager > 0) {
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
