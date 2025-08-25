import {
  type k9_sak_web_app_tjenester_behandling_opplæringspenger_visning_institusjon_InstitusjonResultat as InstitusjonVurderingDtoResultat,
  k9_sak_web_app_tjenester_behandling_opplæringspenger_visning_opplæring_OpplæringResultat as OpplæringVurderingDtoResultat,
  type k9_sak_web_app_tjenester_behandling_opplæringspenger_visning_reisetid_ReisetidResultat as ReisetidResultat,
  type k9_kodeverk_sykdom_Resultat as SykdomVurderingOversiktElementResultat,
  k9_sak_web_app_tjenester_behandling_opplæringspenger_visning_institusjon_InstitusjonResultat as instEnumObject,
  k9_sak_web_app_tjenester_behandling_opplæringspenger_visning_reisetid_ReisetidResultat as reisetidEnumObject,
  k9_kodeverk_sykdom_Resultat as sykdomEnumObject,
} from '@k9-sak-web/backend/k9sak/generated/types.js';
import { Box, Heading } from '@navikt/ds-react';
import type { Period } from '@navikt/ft-utils';
import React, { useEffect, useMemo, useState } from 'react';
import { PeriodeRad } from './PeriodeRad';
import styles from './periodeRad.module.css';

export type ResultatType =
  | InstitusjonVurderingDtoResultat
  | SykdomVurderingOversiktElementResultat
  | OpplæringVurderingDtoResultat
  | ReisetidResultat;

type ResultatKeys =
  | keyof typeof instEnumObject
  | keyof typeof sykdomEnumObject
  | keyof typeof OpplæringVurderingDtoResultat
  | keyof typeof reisetidEnumObject;

export const Resultat = {
  ...instEnumObject,
  ...sykdomEnumObject,
  ...OpplæringVurderingDtoResultat,
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
  title?: string;
  nyesteFørst?: boolean;
}
const sortNyestFørst = (a: Vurderingselement, b: Vurderingselement) => {
  const periodeA = a.perioder[0]?.fom;
  const periodeB = b.perioder[0]?.fom;
  if (periodeA && periodeB) {
    return new Date(periodeB).getTime() - new Date(periodeA).getTime();
  }
  return 0;
};

const sortEldestFørst = (a: Vurderingselement, b: Vurderingselement) => {
  const periodeA = a.perioder[0]?.fom;
  const periodeB = b.perioder[0]?.fom;
  if (periodeA && periodeB) {
    return new Date(periodeA).getTime() - new Date(periodeB).getTime();
  }
  return 0;
};
/**
 * Navigasjon for perioder som må vurderes og er vurdert
 */
const Vurderingsnavigasjon = <T extends Vurderingselement = Vurderingselement>({
  valgtPeriode,
  perioder,
  onPeriodeClick,
  customPeriodeRad,
  customPeriodeLabel,
  title = 'Alle perioder',
  nyesteFørst = true,
}: VurderingslisteProps<T>) => {
  // nyeste først
  const sortedPerioder = perioder.sort(nyesteFørst ? sortNyestFørst : sortEldestFørst);
  const perioderSomSkalVurderes = sortedPerioder.filter(periode => periode.resultat === Resultat.MÅ_VURDERES);
  const perioderSomErVurdert = sortedPerioder.filter(periode => periode.resultat !== Resultat.MÅ_VURDERES);
  const allePerioder = useMemo(
    () => [...perioderSomSkalVurderes, ...perioderSomErVurdert],
    [perioderSomSkalVurderes, perioderSomErVurdert],
  );

  const [harAutomatiskValgtPeriode, setHarAutomatiskValgtPeriode] = useState(false);
  // Hvis valgt periode ikke lenger finnes i listen, regner vi med at det er stale data og setter valgt periode til null
  useEffect(() => {
    if (valgtPeriode && !allePerioder.find(periode => JSON.stringify(periode) === JSON.stringify(valgtPeriode))) {
      onPeriodeClick(null);
      setHarAutomatiskValgtPeriode(false);
    }
  }, [valgtPeriode, allePerioder, onPeriodeClick]);

  // Hvis vi ikke har valgt en periode, og det finnes en periode som må vurderes, så velger vi den første periode som må vurderes
  // Hvis ikke vi har en periode som må vurderes, og det finnes en periode som er vurdert, så velger vi den første periode som er vurdert
  useEffect(() => {
    const periodeSomMåVurderes = allePerioder.find(
      periode => periode.resultat === Resultat.MÅ_VURDERES || periode.resultat === Resultat.IKKE_VURDERT,
    );
    const periodeSomErVurdert = allePerioder.find(periode => periode.resultat !== Resultat.MÅ_VURDERES);
    if (!valgtPeriode && !harAutomatiskValgtPeriode) {
      if (periodeSomMåVurderes) {
        onPeriodeClick(periodeSomMåVurderes);
        setHarAutomatiskValgtPeriode(true);
      } else if (periodeSomErVurdert) {
        onPeriodeClick(periodeSomErVurdert);
        setHarAutomatiskValgtPeriode(true);
      }
    }
  }, [valgtPeriode, allePerioder, onPeriodeClick, harAutomatiskValgtPeriode]);

  const handlePeriodeClick = (index: number) => {
    if (allePerioder[index]) {
      onPeriodeClick(allePerioder[index]);
    }
  };

  return (
    <Box.New className="min-w-[400px]">
      <Heading size="xsmall" className="ml-[15px] mt-[21px] mb-[24px]">
        {title}
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
    </Box.New>
  );
};

export default Vurderingsnavigasjon;
