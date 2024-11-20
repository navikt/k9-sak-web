import { FC } from 'react';
import GraderingMotTilsyn from '../../../types/GraderingMotTilsyn';
import { OverseEtablertTilsynÅrsak } from '../../../constants';
import { BodyShort, HelpText, HStack } from '@navikt/ds-react';

import styles from './nyUttakDetaljer.module.css';

const getÅrsakstekst = (overseEtablertTilsynÅrsak: OverseEtablertTilsynÅrsak, etablertTilsyn: number) => {
  if (overseEtablertTilsynÅrsak === OverseEtablertTilsynÅrsak.BEREDSKAP) {
    return `Etablert tilsyn på ${etablertTilsyn} % blir ikke medregnet på grunn av beredskap.`;
  }
  if (overseEtablertTilsynÅrsak === OverseEtablertTilsynÅrsak.NATTEVÅK) {
    return `Etablert tilsyn på ${etablertTilsyn} % blir ikke medregnet på grunn av nattevåk.`;
  }
  return `Etablert tilsyn på ${etablertTilsyn} % blir ikke medregnet på grunn av nattevåk og beredskap.`;
};

const harBeredskapEllerNattevåkÅrsak = (overseEtablertTilsynÅrsak: OverseEtablertTilsynÅrsak) => {
  const beredskapEllerNattevåkÅrsaker = [
    OverseEtablertTilsynÅrsak.BEREDSKAP,
    OverseEtablertTilsynÅrsak.NATTEVÅK,
    OverseEtablertTilsynÅrsak.NATTEVÅK_OG_BEREDSKAP,
  ];
  return beredskapEllerNattevåkÅrsaker.some(årsak => årsak === overseEtablertTilsynÅrsak);
};

interface ownProps {
  graderingMotTilsyn: GraderingMotTilsyn;
  pleiebehov: number;
}

const GraderingMotTilsynDetaljer: FC<ownProps> = ({ graderingMotTilsyn, pleiebehov }) => {
  const { etablertTilsyn, andreSøkeresTilsyn, tilgjengeligForSøker, overseEtablertTilsynÅrsak } = graderingMotTilsyn;

  const utnullingPåGrunnAvBeredskapEllerNattevåk =
    overseEtablertTilsynÅrsak && harBeredskapEllerNattevåkÅrsak(overseEtablertTilsynÅrsak);
  const beredskapEllerNattevåkÅrsakTekst = utnullingPåGrunnAvBeredskapEllerNattevåk
    ? getÅrsakstekst(overseEtablertTilsynÅrsak, etablertTilsyn)
    : '';

  return (
    <>
      <BodyShort as="div" className={styles.uttakDetaljer__detailItem} size="small">
        Pleiebehov: {pleiebehov} %
      </BodyShort>
      <BodyShort as="div" className={styles.uttakDetaljer__detailItem} size="small">
        <HStack>
          {`- Etablert tilsyn: `}{' '}
          {!overseEtablertTilsynÅrsak ? (
            <>
              {etablertTilsyn} %
              <HelpText className={styles.uttakDetaljer__data__questionMark} placement="right">
                {utnullingPåGrunnAvBeredskapEllerNattevåk
                  ? beredskapEllerNattevåkÅrsakTekst
                  : 'Etablert tilsyn under 10 % blir ikke medregnet.'}
              </HelpText>
            </>
          ) : (
            `${etablertTilsyn} %`
          )}
        </HStack>
      </BodyShort>
      <BodyShort as="div" className={styles.uttakDetaljer__detailItem} size="small">
        {`- Andre søkeres tilsyn: ${andreSøkeresTilsyn} %`}
      </BodyShort>
      <BodyShort as="div" className={styles.uttakDetaljer__detailSum} size="small">
        {`= ${tilgjengeligForSøker} % tilgjengelig til søker`}
      </BodyShort>
    </>
  );
};

export default GraderingMotTilsynDetaljer;
