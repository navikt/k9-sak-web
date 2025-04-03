import React, { useEffect } from 'react';
import { Box, Heading } from '@navikt/ds-react';
import PeriodeRad from './PeriodeRad';
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
import { InteractiveList } from '../InteractiveList/InteractiveList';

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
}

const Vurderingsnavigasjon = <T extends Vurderingselement = Vurderingselement>({
  perioderTilVurdering,
  vurdertePerioder,
  onPeriodeClick,
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

  const vurdertePerioderElements = vurdertePerioder.map(({ perioder, resultat, id }) => (
    <PeriodeRad
      perioder={perioder}
      resultat={resultat}
      key={`${perioder.map(p => p.prettifyPeriod()).join('-')}-${resultat}-${id}`}
    />
  ));

  const periodeTilVurderingElements = perioderTilVurdering.map(({ perioder, resultat, id }) => (
    <PeriodeRad
      perioder={perioder}
      resultat={resultat}
      key={`${perioder.map(p => p.prettifyPeriod()).join('-')}-${resultat}-${id}`}
    />
  ));

  const allePerioder = [...perioderTilVurdering, ...vurdertePerioder];
  const elements = [...periodeTilVurderingElements, ...vurdertePerioderElements];

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
          <div>
            <InteractiveList
              elements={elements.map((element, currentIndex) => ({
                content: element,
                active: activeIndex === currentIndex,
                key: `${element.key}`,
                onClick: () => handlePeriodeClick(currentIndex),
              }))}
            />
          </div>
        </>
      )}
    </Box>
  );
};

export default Vurderingsnavigasjon;
