import React, { useEffect } from 'react';
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
  resultat?: ResultatType;
}

export interface VurderingslisteProps<T extends Vurderingselement = Vurderingselement> {
  perioderTilVurdering: T[];
  vurdertePerioder: T[];
  onPeriodeClick: (periode: T) => void;
  customPeriodeRad?: (periode: T, onPeriodeClick: (periode: T) => void) => React.ReactNode;
}

const Vurderingsnavigasjon = <T extends Vurderingselement = Vurderingselement>({
  perioderTilVurdering,
  vurdertePerioder,
  onPeriodeClick,
  customPeriodeRad,
}: VurderingslisteProps<T>) => {
  const harPerioderSomSkalVurderes = perioderTilVurdering?.length > 0;
  const [activeIndex, setActiveIndex] = React.useState(harPerioderSomSkalVurderes ? 0 : -1);

  // Denne skal bare kjøres når komponenten mountes for at man automatisk skal få opp en periode som skal vurderes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (harPerioderSomSkalVurderes && perioderTilVurdering[0]) {
      setActiveIndex(0);
      onPeriodeClick(perioderTilVurdering[0]);
    }
  }, []);

  const allePerioder = [...perioderTilVurdering, ...vurdertePerioder];

  const handlePeriodeClick = (index: number) => {
    if (allePerioder[index]) {
      setActiveIndex(index);
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
          <div className="flex gap w-[120px]">
            <div className="mx-4 min-w-[50px]">Status</div>
            <div>Periode</div>
          </div>
          <ul className={styles.interactiveList}>
            {allePerioder.map((element, currentIndex) => (
              <li key={element.id}>
                {customPeriodeRad ? (
                  customPeriodeRad(element, () => handlePeriodeClick(currentIndex))
                ) : (
                  <PeriodeRad
                    perioder={element.perioder}
                    resultat={element.resultat}
                    active={activeIndex === currentIndex}
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
