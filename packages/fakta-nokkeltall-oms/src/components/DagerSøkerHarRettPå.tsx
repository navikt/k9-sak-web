import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Nøkkeltall from './Nøkkeltall';

interface DagerSøkerHarRettPåProps {
  dagerRettPå: number;
  antallOmsorgsdager: number;
  antallKoronadager: number;
  benyttetRammemelding: boolean;
  visDetaljer: () => void;
  viserDetaljer: boolean;
}

const DagerSøkerHarRettPå: React.FunctionComponent<DagerSøkerHarRettPåProps> = ({
  dagerRettPå,
  antallOmsorgsdager,
  antallKoronadager,
  benyttetRammemelding,
  visDetaljer,
  viserDetaljer,
}) => {
  return (
    <Nøkkeltall
      overskrift={{ antallDager: dagerRettPå, overskrifttekstId: 'Nøkkeltall.DagerSøkerHarRettPå' }}
      detaljer={[
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
        {
          antallDager: antallKoronadager,
          overskrifttekstId: 'Nøkkeltall.Koronadager',
          infotekstContent: <FormattedMessage id="Nøkkeltall.Koronadager.InfoText" />,
        },
      ]}
      farge="#66cbec"
      viserDetaljer={viserDetaljer}
      visDetaljer={visDetaljer}
    />
  );
};

export default DagerSøkerHarRettPå;
