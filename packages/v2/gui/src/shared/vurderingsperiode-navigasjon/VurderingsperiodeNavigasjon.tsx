import React, { useEffect, useMemo } from 'react';
import { Box, Heading } from '@navikt/ds-react';
import { PeriodeRad } from './PeriodeRad';
import type { Period } from '@navikt/ft-utils';
import {
  type InstitusjonVurderingDtoResultat,
  OpplæringVurderingDtoResultat,
  type SykdomVurderingOversiktElementResultat,
  InstitusjonVurderingDtoResultat as instEnumObject,
  SykdomVurderingOversiktElementResultat as sykdomEnumObject,
  OpplæringVurderingDtoResultat as opplæringEnumObject,
  ReisetidPeriodeVurderingDtoResultat,
  ReisetidPeriodeVurderingDtoResultat as reisetidEnumObject,
} from '@k9-sak-web/backend/k9sak/generated';
import styles from './periodeRad.module.css';

export type ResultatType =
  | InstitusjonVurderingDtoResultat
  | SykdomVurderingOversiktElementResultat
  | OpplæringVurderingDtoResultat
  | ReisetidPeriodeVurderingDtoResultat;

type ResultatKeys =
  | keyof typeof instEnumObject
  | keyof typeof sykdomEnumObject
  | keyof typeof opplæringEnumObject
  | keyof typeof reisetidEnumObject;

export const Resultat = {
  ...instEnumObject,
  ...sykdomEnumObject,
  ...opplæringEnumObject,
  ...reisetidEnumObject,
} satisfies Record<ResultatKeys, ResultatType>;

export interface Vurderingselement {
  perioder: Period[];
  id?: string;
  resultat: ResultatType;
}

export interface VurderingslisteProps<T extends Vurderingselement = Vurderingselement> {
  valgtPeriode: ({ perioder: Period[] } & T) | null;
  perioder: T[];
  onPeriodeClick: (periode: T | null) => void;
  customPeriodeRad?: (periode: T, onPeriodeClick: (periode: T) => void) => React.ReactNode;
  customPeriodeLabel?: string;
}

const Vurderingsnavigasjon = <T extends Vurderingselement = Vurderingselement>({
  valgtPeriode,
  perioder,
  onPeriodeClick,
  customPeriodeRad,
  customPeriodeLabel,
}: VurderingslisteProps<T>) => {
  // nyeste først
  const sortedPerioder = perioder.sort((a, b) => {
    const periodeA = a.perioder[0]?.fom;
    const periodeB = b.perioder[0]?.fom;
    if (periodeA && periodeB) {
      return new Date(periodeB).getTime() - new Date(periodeA).getTime();
    }
    return 0;
  });
  const perioderSomSkalVurderes = sortedPerioder.filter(periode => periode.resultat === Resultat.MÅ_VURDERES);
  const perioderSomErVurdert = sortedPerioder.filter(periode => periode.resultat !== Resultat.MÅ_VURDERES);
  const allePerioder = useMemo(
    () => [...perioderSomSkalVurderes, ...perioderSomErVurdert],
    [perioderSomSkalVurderes, perioderSomErVurdert],
  );

  useEffect(() => {
    if (valgtPeriode && !allePerioder.find(periode => JSON.stringify(periode) === JSON.stringify(valgtPeriode))) {
      onPeriodeClick(null);
    }
  }, [valgtPeriode, allePerioder, onPeriodeClick]);

  useEffect(() => {
    const periodeSomMåVurderes = allePerioder.find(
      periode => periode.resultat === Resultat.MÅ_VURDERES || periode.resultat === Resultat.IKKE_VURDERT,
    );
    if (!valgtPeriode && periodeSomMåVurderes) {
      onPeriodeClick(periodeSomMåVurderes);
    }
  }, [valgtPeriode, allePerioder, onPeriodeClick]);

  const handlePeriodeClick = (index: number) => {
    if (allePerioder[index]) {
      onPeriodeClick(allePerioder[index]);
    }
  };

  return (
    <Box className="min-w-[400px]">
      <Heading size="xsmall" className="ml-[15px] mt-[21px] mb-[24px]">
        Alle perioder
      </Heading>

      {allePerioder.length === 0 && <div className="ml-[15px] mt-[15px] mb-5">Ingen vurderinger å vise</div>}
      {allePerioder.length > 0 && (
        <>
          <div className="flex w-[120px]">
            <div className="mx-4 min-w-[50px]">Status</div>
            <div>{customPeriodeLabel || 'Periode'}</div>
          </div>
          <ul className={styles.interactiveList}>
            {allePerioder.map((element, currentIndex) => (
              <li key={element.id || element.perioder[0]?.fom}>
                {customPeriodeRad ? (
                  customPeriodeRad(element, () => handlePeriodeClick(currentIndex))
                ) : (
                  <PeriodeRad
                    perioder={element.perioder}
                    resultat={element.resultat}
                    active={valgtPeriode?.perioder.some(periode => periode.fom === element.perioder[0]?.fom)}
                    handleClick={() => handlePeriodeClick(currentIndex)}
                  />
                )}
              </li>
            ))}
          </ul>
        </>
      )}
    </Box>
  );
};

export default Vurderingsnavigasjon;
