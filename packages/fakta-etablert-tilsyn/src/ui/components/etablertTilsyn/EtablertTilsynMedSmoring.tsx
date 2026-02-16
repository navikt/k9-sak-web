import { isDayAfter, Period } from '@fpsak-frontend/utils';
import { Table } from '@navikt/ds-react';
import dayjs from 'dayjs';
import { type JSX, useMemo } from 'react';
import type EtablertTilsynType from '../../../types/EtablertTilsynType';
import EtablertTilsynRowContent from './EtablertTilsynRowContent';
import styles from './etablertTilsynMedSmoring.module.css';
import PartIkon from './PartIkon';

interface EtablertTilsynProps {
  etablertTilsynData: EtablertTilsynType[];
  smurtEtablertTilsynPerioder: EtablertTilsynType[];
  sykdomsperioderSomIkkeErOppfylt: Period[];
  perioderSomOverstyrerTilsyn: Period[];
}

export interface EtablertTilsynMappet {
  etablertTilsyn: EtablertTilsynType[];
  etablertTilsynSmurt: EtablertTilsynType[];
  uke: number;
  delAvUke?: number;
}

export interface TilsynPerUke {
  etablertTilsyn: EtablertTilsynType[];
  etablertTilsynSmurt: EtablertTilsynType[];
  uke: number;
}

export const erHelg = (dag: string) => [6, 0].includes(dayjs(dag).day());

// Bygger set med alle datoer som har overstyrende tilsyn
export const byggDagerSomOverstyrerTilsyn = (perioder: Period[]): Set<string> => {
  const s = new Set<string>();
  perioder.forEach(periode => periode.asListOfDays().forEach(d => s.add(d)));
  return s;
};

// Bygger set med datoer som skal ekskluderes (sykdom ikke oppfylt og ikke overstyrt)
export const byggDagerSomSkalEkskluderes = (
  sykdomsperioder: Period[],
  dagerSomOverstyrerTilsyn: Set<string>,
): Set<string> => {
  const s = new Set<string>();
  sykdomsperioder.forEach(p => {
    p.asListOfDays().forEach(d => {
      if (!dagerSomOverstyrerTilsyn.has(d)) {
        s.add(d);
      }
    });
  });
  return s;
};

// Ekspanderer perioder til enkeltdager (uten helg) og pakker hver dag som egen periode
export const ekspanderTilEnkeltdager = (
  perioder: EtablertTilsynType[],
  filtrer: (date: string) => boolean,
): EtablertTilsynType[] =>
  perioder.flatMap(v =>
    v.periode
      .asListOfDays()
      .filter(filtrer)
      .map(date => ({ ...v, periode: new Period(date, date) })),
  );

// Henter uke-nummer for alle enkeltdager (unike)
export const finnUker = (enkeltdager: EtablertTilsynType[]): number[] => [
  ...new Set(enkeltdager.map(d => dayjs(d.periode.fom).week())),
];

// Grupperer tilsyn per uke
export const grupperTilsynPerUke = (
  uker: number[],
  etablerte: EtablertTilsynType[],
  smurte: EtablertTilsynType[],
): TilsynPerUke[] =>
  uker.map(uke => ({
    etablertTilsyn: etablerte.filter(v => dayjs(v.periode.fom).week() === uke),
    etablertTilsynSmurt: smurte.filter(v => dayjs(v.periode.fom).week() === uke),
    uke,
  }));

// Deler smurte perioder i sammenhengende blokker basert på tidPerDag og kronologi
export const splittSmurtePerioder = (smurt: EtablertTilsynType[]): EtablertTilsynType[][] => {
  const grupper: EtablertTilsynType[][] = [];
  smurt.forEach(p => {
    const sammenhengende = grupper.find(gruppe =>
      gruppe.find(g => g.tidPerDag === p.tidPerDag && isDayAfter(dayjs(g.periode.tom), dayjs(p.periode.fom))),
    );
    if (sammenhengende) {
      sammenhengende.push(p);
    } else {
      grupper.push([p]);
    }
  });
  return grupper;
};

// Konverterer grupper av smurte perioder til EtablertTilsynMappet med eventuell delAvUke
export const byggOppdeltSmoring = (perUke: TilsynPerUke[]): EtablertTilsynMappet[] => {
  const result: EtablertTilsynMappet[] = [];
  perUke.forEach(v => {
    const grupper = splittSmurtePerioder(v.etablertTilsynSmurt);
    grupper.forEach((gruppe, idx, arr) => {
      result.push({
        etablertTilsyn: v.etablertTilsyn,
        etablertTilsynSmurt: gruppe,
        uke: v.uke,
        delAvUke: arr.length > 1 ? idx + 1 : undefined,
      });
    });
  });
  return result;
};

// Fletter oppdelt og ikke-oppdelt smøring og sorterer kronologisk på første smurt-dag
export const flettOgSorterTilsyn = (
  perUke: TilsynPerUke[],
  oppdelt: EtablertTilsynMappet[],
): EtablertTilsynMappet[] => {
  const utenOppdelt: TilsynPerUke[] = perUke.filter(
    v => !v.etablertTilsynSmurt.length || !splittSmurtePerioder(v.etablertTilsynSmurt).length,
  );

  const samlet: EtablertTilsynMappet[] = [...utenOppdelt.map(v => ({ ...v })), ...oppdelt];
  return samlet.sort(
    (a, b) =>
      new Date(a.etablertTilsynSmurt[0]?.periode?.fom).getTime() -
      new Date(b.etablertTilsynSmurt[0]?.periode?.fom).getTime(),
  );
};

const ukeVisning = (uke: number, delAvUke?: number) => {
  if (delAvUke) {
    return `Uke ${uke} - ${String.fromCharCode(64 + delAvUke)}`;
  }
  return `Uke ${uke}`;
};

const periodeVisning = (usmurtePerioder: EtablertTilsynType[], smurtePerioder: EtablertTilsynType[]) => {
  if (smurtePerioder.length) {
    return new Period(
      smurtePerioder[0].periode.fom,
      smurtePerioder[smurtePerioder.length - 1].periode.tom,
    ).prettifyPeriod();
  }
  return new Period(
    usmurtePerioder[0].periode.fom,
    usmurtePerioder[usmurtePerioder.length - 1].periode.tom,
  ).prettifyPeriod();
};

const EtablertTilsyn = ({
  etablertTilsynData,
  smurtEtablertTilsynPerioder,
  sykdomsperioderSomIkkeErOppfylt,
  perioderSomOverstyrerTilsyn,
}: EtablertTilsynProps): JSX.Element => {
  const { harVurderinger, etablertTilsynMappet } = useMemo(() => {
    const harVurderingerInner = etablertTilsynData.length > 0;
    const dagerSomOverstyrerTilsyn = byggDagerSomOverstyrerTilsyn(perioderSomOverstyrerTilsyn);
    const dagerSomSkalEkskluderes = byggDagerSomSkalEkskluderes(
      sykdomsperioderSomIkkeErOppfylt,
      dagerSomOverstyrerTilsyn,
    );

    const etablertTilsynEnkeltdager = ekspanderTilEnkeltdager(etablertTilsynData, d => !erHelg(d));
    const smurtEtablertTilsynEnkeltdager = ekspanderTilEnkeltdager(
      smurtEtablertTilsynPerioder,
      d => !erHelg(d) && !dagerSomSkalEkskluderes.has(d),
    );

    const uker = finnUker(etablertTilsynEnkeltdager);
    const tilsynPerUke = grupperTilsynPerUke(uker, etablertTilsynEnkeltdager, smurtEtablertTilsynEnkeltdager);
    const oppdeltSmoring = byggOppdeltSmoring(tilsynPerUke);
    const etablertTilsynMappetInner = flettOgSorterTilsyn(tilsynPerUke, oppdeltSmoring);

    return { harVurderinger: harVurderingerInner, etablertTilsynMappet: etablertTilsynMappetInner };
  }, [etablertTilsynData, smurtEtablertTilsynPerioder, sykdomsperioderSomIkkeErOppfylt, perioderSomOverstyrerTilsyn]);

  if (!harVurderinger) {
    return <p className={styles.etablertTilsyn__ingenTilsyn}>Søker har ikke oppgitt etablert tilsyn</p>;
  }

  return (
    <div className={styles.etablertTilsynMedSmoringTabell}>
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell />
            <Table.HeaderCell scope="col">Uke</Table.HeaderCell>
            <Table.HeaderCell scope="col">Periode</Table.HeaderCell>
            <Table.HeaderCell scope="col">% tilsyn i periode</Table.HeaderCell>
            <Table.HeaderCell scope="col">Part</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {etablertTilsynMappet.map(tilsyn => {
            const tidPerDagArray = tilsyn.etablertTilsynSmurt?.map(v => v.tidPerDag).filter(Boolean);
            const tidPerDag = tidPerDagArray[0] || 0;
            const tilsynIPeriodeProsent = Math.round((tidPerDag / 7.5) * 100);
            const parter = tilsyn.etablertTilsyn.map(v => v.kilde);
            return (
              <Table.ExpandableRow
                key={ukeVisning(tilsyn.uke, tilsyn.delAvUke)}
                content={
                  <EtablertTilsynRowContent
                    etablertTilsyn={tilsyn.etablertTilsyn}
                    etablertTilsynSmurt={tilsyn.etablertTilsynSmurt}
                    tilsynProsent={tilsynIPeriodeProsent}
                    visIkon
                  />
                }
              >
                <Table.DataCell scope="row">{ukeVisning(tilsyn.uke, tilsyn.delAvUke)}</Table.DataCell>
                <Table.DataCell>{periodeVisning(tilsyn.etablertTilsyn, tilsyn.etablertTilsynSmurt)}</Table.DataCell>
                <Table.DataCell>{`${tilsynIPeriodeProsent}%`}</Table.DataCell>
                <Table.DataCell>
                  <span className={styles.visuallyHidden}>Kilde</span>
                  <PartIkon parter={parter} />
                </Table.DataCell>
              </Table.ExpandableRow>
            );
          })}
        </Table.Body>
      </Table>
    </div>
  );
};

export default EtablertTilsyn;
