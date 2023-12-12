import { isDayAfter, Period } from '@fpsak-frontend/utils';
import { Table } from '@navikt/ds-react';
import dayjs from 'dayjs';
import uniq from 'lodash/uniq';
import React from 'react';
import EtablertTilsynType from '../../../types/EtablertTilsynType';
import EtablertTilsynRowContent from './EtablertTilsynRowContent';
import PartIkon from './PartIkon';
import styles from './etablertTilsynMedSmoring.css';

interface EtablertTilsynProps {
  etablertTilsynData: EtablertTilsynType[];
  smurtEtablertTilsynPerioder: EtablertTilsynType[];
  sykdomsperioderSomIkkeErOppfylt: Period[];
  perioderSomOverstyrerTilsyn: Period[];
}

interface EtablertTilsynMappet {
  etablertTilsyn: EtablertTilsynType[];
  etablertTilsynSmurt: EtablertTilsynType[];
  uke: number;
  delAvUke?: number;
}

const erHelg = (dag: Date) => [6, 0].includes(dayjs(dag).day());

const ukeVisning = (uke, delAvUke) => {
  if (delAvUke) {
    return `Uke ${uke} - ${String.fromCharCode(64 + delAvUke)}`;
  }
  return `Uke ${uke}`;
};

const periodeVisning = (usmurtePerioder, smurtePerioder) => {
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
  const harVurderinger = etablertTilsynData.length > 0;
  const avslaatteDager = sykdomsperioderSomIkkeErOppfylt.flatMap(periode =>
    periode.asListOfDays().map(date => new Period(date, date)),
  );
  const dagerSomOverstyrerTilsyn = perioderSomOverstyrerTilsyn.flatMap(periode =>
    periode.asListOfDays().map(date => new Period(date, date)),
  );

  const avslaatteDagerFiltrert = avslaatteDager.filter(
    v => !dagerSomOverstyrerTilsyn.some(innlagtDag => v.includesDate(innlagtDag.fom)),
  );

  const dagerSomSkalEkskluderes = [...avslaatteDagerFiltrert];
  const etablertTilsynEnkeltdager = etablertTilsynData.flatMap(v =>
    v.periode
      .asListOfDays()
      .filter(date => !erHelg(date))
      .map(date => ({ ...v, periode: new Period(date, date) })),
  );
  const smurtEtablertTilsynEnkeltdager = smurtEtablertTilsynPerioder.flatMap(v =>
    v.periode
      .asListOfDays()
      .filter(date => !erHelg(date))
      .map(date => ({ ...v, periode: new Period(date, date) })),
  );

  const uker = uniq(etablertTilsynEnkeltdager.map(data => dayjs(data.periode.fom).week()));
  const tilsynPerUke = uker.map(uke => ({
    etablertTilsyn: etablertTilsynEnkeltdager.filter(v => dayjs(v.periode.fom).week() === uke),
    etablertTilsynSmurt: smurtEtablertTilsynEnkeltdager.filter(v => dayjs(v.periode.fom).week() === uke),
    uke,
  }));
  const tilsynPerUkeOppdeltSmoering = [];
  const tilsynPerUkeUtenOppdeltSmoering = tilsynPerUke
    .map(v => ({
      ...v,
      etablertTilsynSmurt: v.etablertTilsynSmurt.filter(
        smurt => !dagerSomSkalEkskluderes.some(periode => periode.includesDate(smurt.periode.fom)),
      ),
    }))
    .map(v => {
      const smurtePerioder = [] as EtablertTilsynType[][];
      v.etablertTilsynSmurt.forEach(smurtPeriode => {
        const sammenhengendePeriode = smurtePerioder.find(periodeArray =>
          periodeArray.find(
            periode =>
              periode.tidPerDag === smurtPeriode.tidPerDag &&
              isDayAfter(dayjs(periode.periode.tom), dayjs(smurtPeriode.periode.fom)),
          ),
        );
        if (sammenhengendePeriode) {
          sammenhengendePeriode.push(smurtPeriode);
        } else {
          smurtePerioder.push([smurtPeriode]);
        }
      });

      smurtePerioder.forEach((smurtPeriode, index, array) =>
        tilsynPerUkeOppdeltSmoering.push({
          etablertTilsyn: v.etablertTilsyn,
          etablertTilsynSmurt: smurtPeriode,
          uke: v.uke,
          delAvUke: array.length > 1 ? index + 1 : undefined,
        }),
      );
      return smurtePerioder.length ? null : v;
    })
    .filter(Boolean);
  const etablertTilsynMappet = [...tilsynPerUkeUtenOppdeltSmoering, ...tilsynPerUkeOppdeltSmoering].sort(
    (a: EtablertTilsynMappet, b: EtablertTilsynMappet) =>
      new Date(a.etablertTilsynSmurt[0]?.periode?.fom).getTime() -
      new Date(b.etablertTilsynSmurt[0]?.periode?.fom).getTime(),
  );

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
                    dagerSomOverstyrerTilsyn={dagerSomOverstyrerTilsyn}
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
