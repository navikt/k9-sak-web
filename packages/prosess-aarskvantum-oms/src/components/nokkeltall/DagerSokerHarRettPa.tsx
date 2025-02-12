import { formatQueryString, parseQueryString } from '@fpsak-frontend/utils';
import { faktaPanelCodes } from '@k9-sak-web/konstanter';
import { Link } from '@navikt/ds-react';
import { FormattedMessage } from 'react-intl';
import { useLocation } from 'react-router';
import Nokkeltall from './Nokkeltall';
import styles from './nokkeltall.module.css';

interface DagerSokerHarRettPaProps {
  dagerRettPå: number;
  antallOmsorgsdager: number;
  antallKoronadager: number;
  benyttetRammemelding: boolean;
  visDetaljer: () => void;
  viserDetaljer: boolean;
  ar: string;
}

const DagerSokerHarRettPa = ({
  dagerRettPå,
  antallOmsorgsdager,
  antallKoronadager,
  benyttetRammemelding,
  visDetaljer,
  viserDetaljer,
  ar,
}: DagerSokerHarRettPaProps) => {
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
              &nbsp;
              <FormattedMessage
                id="Nøkkeltall.Rammemelding"
                values={{
                  a: (...lenketekst) => (
                    <Link href={`/k9/web${pathname}${formatQueryString(faktapanelUttak)}`}>{lenketekst}</Link>
                  ),
                }}
              />
            </>
          )}
        </>
      ),
    },
  ];

  if (antallKoronadager > 0) {
    detaljer.push({
      antallDager: antallKoronadager,
      overskrifttekstId: 'Nøkkeltall.Koronadager',
      infotekstContent: <FormattedMessage id={`Nøkkeltall.Koronadager.InfoText.${ar}`} />,
    });
  }

  return (
    <Nokkeltall
      overskrift={{ antallDager: dagerRettPå, overskrifttekstId: 'Nøkkeltall.DagerSøkerHarRettPå' }}
      detaljer={detaljer}
      viserDetaljer={viserDetaljer}
      visDetaljer={visDetaljer}
      className={styles.dagerSokerHarRettPa}
    />
  );
};

export default DagerSokerHarRettPa;
