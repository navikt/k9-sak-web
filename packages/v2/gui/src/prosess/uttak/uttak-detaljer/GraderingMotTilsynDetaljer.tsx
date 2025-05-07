import type { FC } from 'react';
import {
  GraderingMotTilsynOverseEtablertTilsynÅrsak,
  type GraderingMotTilsynOverseEtablertTilsynÅrsak as GraderingMotTilsynOverseEtablertTilsynÅrsakType,
  type GraderingMotTilsyn,
} from '@k9-sak-web/backend/k9sak/generated';
import { BodyShort, HelpText, HStack } from '@navikt/ds-react';

import styles from './uttakDetaljer.module.css';

const getÅrsakstekst = (
  overseEtablertTilsynÅrsak: GraderingMotTilsynOverseEtablertTilsynÅrsakType,
  etablertTilsyn: number,
) => {
  if (overseEtablertTilsynÅrsak === GraderingMotTilsynOverseEtablertTilsynÅrsak.BEREDSKAP) {
    return `Etablert tilsyn på ${etablertTilsyn} % blir ikke medregnet på grunn av beredskap.`;
  }
  if (overseEtablertTilsynÅrsak === GraderingMotTilsynOverseEtablertTilsynÅrsak.NATTEVÅK) {
    return `Etablert tilsyn på ${etablertTilsyn} % blir ikke medregnet på grunn av nattevåk.`;
  }
  return `Etablert tilsyn på ${etablertTilsyn} % blir ikke medregnet på grunn av nattevåk og beredskap.`;
};

const harBeredskapEllerNattevåkÅrsak = (overseEtablertTilsynÅrsak: GraderingMotTilsynOverseEtablertTilsynÅrsakType) => {
  const beredskapEllerNattevåkÅrsaker = [
    GraderingMotTilsynOverseEtablertTilsynÅrsak.BEREDSKAP,
    GraderingMotTilsynOverseEtablertTilsynÅrsak.NATTEVÅK,
    GraderingMotTilsynOverseEtablertTilsynÅrsak.NATTEVÅK_OG_BEREDSKAP,
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
  const beredskapEllerNattevåkÅrsakTekst =
    utnullingPåGrunnAvBeredskapEllerNattevåk && etablertTilsyn
      ? getÅrsakstekst(overseEtablertTilsynÅrsak, etablertTilsyn)
      : '';

  return (
    <>
      <BodyShort as="div" className={`${styles['uttakDetaljer__detailItem']} mt-2`} size="small">
        Pleiebehov: {pleiebehov} %
      </BodyShort>
      <BodyShort as="div" className={styles['uttakDetaljer__detailItem']} size="small">
        <HStack>
          {`- Etablert tilsyn: `}{' '}
          {!overseEtablertTilsynÅrsak ? (
            <>
              {etablertTilsyn} %
              <HelpText className={styles['uttakDetaljer__data__questionMark']} placement="right">
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
      <BodyShort as="div" className={styles['uttakDetaljer__detailItem']} size="small">
        {`- Andre søkeres tilsyn: ${andreSøkeresTilsyn} %`}
      </BodyShort>
      <BodyShort as="div" className={styles['uttakDetaljer__detailSum']} size="small">
        {`= ${tilgjengeligForSøker} % tilgjengelig til søker`}
      </BodyShort>
    </>
  );
};

export default GraderingMotTilsynDetaljer;
