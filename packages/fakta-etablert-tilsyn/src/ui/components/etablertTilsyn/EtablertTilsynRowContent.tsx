import { BodyShort, Detail, HelpText, Label } from '@navikt/ds-react';
import { Period } from '@navikt/k9-fe-period-utils';
import dayjs from 'dayjs';
import React from 'react';
import EtablertTilsynType from '../../../types/EtablertTilsynType';
import PartIkon from './PartIkon';
import styles from './etablertTilsynRowContent.css';
import EtablertTilsynDag from './EtablertTilsynDag';
import Kilde from '../../../types/Kilde';

interface TilsynMappet {
  date: string;
  tidPerDag: number;
}
interface OwnProps {
  etablertTilsyn: EtablertTilsynType[];
  etablertTilsynSmurt: EtablertTilsynType[];
  dagerSomOverstyrerTilsyn: Period[];
  tilsynProsent: number;
  visIkon: boolean;
}

const EtablertTilsynRowContent = ({
  etablertTilsyn,
  etablertTilsynSmurt,
  dagerSomOverstyrerTilsyn,
  tilsynProsent,
  visIkon,
}: OwnProps) => {
  const etablertTilsynDager = etablertTilsyn.flatMap(v =>
    v.periode.asListOfDays().map(date => ({ date, tidPerDag: v.tidPerDag, kilde: v.kilde })),
  );

  const etablertTilsynSmurtDager = etablertTilsynSmurt.flatMap(v =>
    v.periode.asListOfDays().map(date => ({ date, tidPerDag: v.tidPerDag })),
  );

  const mandag = etablertTilsynDager.find(v => dayjs(v.date).day() === 1);
  const tirsdag = etablertTilsynDager.find(v => dayjs(v.date).day() === 2);
  const onsdag = etablertTilsynDager.find(v => dayjs(v.date).day() === 3);
  const torsdag = etablertTilsynDager.find(v => dayjs(v.date).day() === 4);
  const fredag = etablertTilsynDager.find(v => dayjs(v.date).day() === 5);

  const mandagSmurt = etablertTilsynSmurtDager.find(v => dayjs(v.date).day() === 1);
  const tirsdagSmurt = etablertTilsynSmurtDager.find(v => dayjs(v.date).day() === 2);
  const onsdagSmurt = etablertTilsynSmurtDager.find(v => dayjs(v.date).day() === 3);
  const torsdagSmurt = etablertTilsynSmurtDager.find(v => dayjs(v.date).day() === 4);
  const fredagSmurt = etablertTilsynSmurtDager.find(v => dayjs(v.date).day() === 5);

  const dagOverstyres = (tilsyn: TilsynMappet) => dagerSomOverstyrerTilsyn.some(dag => dag.fom === tilsyn?.date);

  const timerSmurt = etablertTilsynSmurtDager.find(v => v.tidPerDag)?.tidPerDag;

  const skalDisables = (tilsynSmurt: TilsynMappet) => {
    if (tilsynSmurt) {
      return false;
    }

    if (dagOverstyres(tilsynSmurt)) {
      return true;
    }
    return true;
  };
  return (
    <>
      <div className={styles.etablertTilsyn__innrapportert_timer__container}>
        <Label>Innrapportert timer tilsyn</Label>
        <HelpText title="Hva er innrapportert timer tilsyn?">
          Timer tilsyn innrapportert fordeles/smøres utover sammenhengende dager hvor behovet for tilsyn og pleie er
          godkjent innenfor en uke. Søker graderes ikke mot timer tilsyn innrapportert på dager barnet er innlagt eller
          dager foreldrene er i beredskap eller har nattevåk.
        </HelpText>
      </div>
      <div className={styles.etablertTilsynRowContent}>
        <EtablertTilsynDag
          tittel="Mandag"
          timer={mandag?.tidPerDag}
          kilde={mandag?.kilde}
          disabled={skalDisables(mandagSmurt)}
          visIkon={visIkon}
        />
        <EtablertTilsynDag
          tittel="Tirsdag"
          timer={tirsdag?.tidPerDag}
          kilde={tirsdag?.kilde}
          disabled={skalDisables(tirsdagSmurt)}
          visIkon={visIkon}
        />
        <EtablertTilsynDag
          tittel="Onsdag"
          timer={onsdag?.tidPerDag}
          kilde={onsdag?.kilde}
          disabled={skalDisables(onsdagSmurt)}
          visIkon={visIkon}
        />
        <EtablertTilsynDag
          tittel="Torsdag"
          timer={torsdag?.tidPerDag}
          kilde={torsdag?.kilde}
          disabled={skalDisables(torsdagSmurt)}
          visIkon={visIkon}
        />
        <EtablertTilsynDag
          tittel="Fredag"
          timer={fredag?.tidPerDag}
          kilde={fredag?.kilde}
          disabled={skalDisables(fredagSmurt)}
          visIkon={visIkon}
        />
        <div className={styles.etablertTilsyn__timer__container}>
          <BodyShort>{`= ${timerSmurt || 0} t per dag (${tilsynProsent}%)`}</BodyShort>
        </div>
      </div>
      {visIkon && (
        <div className={styles.etablertTilsyn__ikon__container}>
          <div className={styles.etablertTilsyn__ikon__forklaring__container}>
            <PartIkon parter={[Kilde.SØKER]} fontSize="16px" />
            <Detail>= søker</Detail>
          </div>
          <div className={styles.etablertTilsyn__ikon__forklaring__container}>
            <PartIkon parter={[Kilde.ANDRE]} fontSize="16px" />
            <Detail>= annen part</Detail>
          </div>
        </div>
      )}
    </>
  );
};

export default EtablertTilsynRowContent;
