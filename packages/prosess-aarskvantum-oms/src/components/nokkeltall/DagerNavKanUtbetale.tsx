import FeatureTogglesContext from '@k9-sak-web/gui/featuretoggles/FeatureTogglesContext.js';
import { useContext } from 'react';
import Nokkeltall from './Nokkeltall';
import styles from './nokkeltall.module.css';

interface DagerNavKanUtbetaleProps {
  dagerNavKanUtbetale: number;
  dagerRettPå: number;
  antallDagerArbeidsgiverDekker: number;
  antallDagerFraværRapportertSomNyoppstartet: number;
  visDetaljer: () => void;
  viserDetaljer: boolean;
}

const DagerNavKanUtbetale = ({
  dagerNavKanUtbetale,
  dagerRettPå,
  antallDagerArbeidsgiverDekker,
  antallDagerFraværRapportertSomNyoppstartet,
  visDetaljer,
  viserDetaljer,
}: DagerNavKanUtbetaleProps) => {
  const featureToggles = useContext(FeatureTogglesContext);

  return (
    <Nokkeltall
      overskrift={{ antallDager: dagerNavKanUtbetale, overskrifttekstId: 'Nøkkeltall.DagerNavKanUtbetale' }}
      detaljer={[
        {
          antallDager: dagerRettPå,
          overskrifttekstId: 'Nøkkeltall.TotaltAntallDager',
          infotekstContent: Totalt antall dager søkeren har rett på, utenom eventuelle smitteverndager.,
        },
        {
          antallDager: -antallDagerArbeidsgiverDekker,
          overskrifttekstId: 'Nøkkeltall.Ventetid',
          infotekstContent: (
            `Trekker fra ${antallDagerArbeidsgiverDekker} dager som er dekket av arbeidsgiver eller bruker.`
          ),
        },
        featureToggles?.NYE_NOKKELTALL && {
          antallDager: antallDagerFraværRapportertSomNyoppstartet,
          overskrifttekstId: 'Nøkkeltall.AntallDagerFraværRapportertSomNyoppstartet',
          infotekstContent: Trekker ikke fra dager dekket av arbeidsgiver eller bruker, dersom de de er rapportert som nyoppstartet.,
        },
      ]}
      viserDetaljer={viserDetaljer}
      visDetaljer={visDetaljer}
      className={styles.dagerNavKanUtbetale}
    />
  );
};

export default DagerNavKanUtbetale;
