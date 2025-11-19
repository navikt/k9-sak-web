import { initializeDate } from '@k9-sak-web/lib/dateUtils/initializeDate.js';
import { BodyShort, Detail, HelpText, Label } from '@navikt/ds-react';
import EtablertTilsynType from '../../../types/EtablertTilsynType';
import Kilde from '../../../types/Kilde';
import EtablertTilsynDag from './EtablertTilsynDag';
import PartIkon from './PartIkon';
import styles from './etablertTilsynRowContent.module.css';

interface TilsynMappet {
  date: string;
  tidPerDag: number;
}

interface DagMedKilde {
  date: string;
  tidPerDag: number;
  kilde: Kilde;
}

interface OwnProps {
  etablertTilsyn: EtablertTilsynType[];
  etablertTilsynSmurt: EtablertTilsynType[];
  tilsynProsent: number;
  visIkon: boolean;
}

export const mapDagerPerUkedag = (etablertTilsyn: EtablertTilsynType[]): Map<number, DagMedKilde> => {
  const dagerPerUkedag = new Map<number, DagMedKilde>();

  etablertTilsyn.forEach(v => {
    v.periode.asListOfDays().forEach(date => {
      const weekday = initializeDate(date).day();
      if (weekday >= 1 && weekday <= 5) {
        dagerPerUkedag.set(weekday, { date, tidPerDag: v.tidPerDag, kilde: v.kilde });
      }
    });
  });

  return dagerPerUkedag;
};

export const mapSmurtDagerPerUkedag = (etablertTilsynSmurt: EtablertTilsynType[]): Map<number, TilsynMappet> => {
  const smurtDagerPerUkedag = new Map<number, TilsynMappet>();

  etablertTilsynSmurt.forEach(v => {
    v.periode.asListOfDays().forEach(date => {
      const weekday = initializeDate(date).day();
      if (weekday >= 1 && weekday <= 5) {
        smurtDagerPerUkedag.set(weekday, { date, tidPerDag: v.tidPerDag });
      }
    });
  });

  return smurtDagerPerUkedag;
};

const EtablertTilsynRowContent = ({ etablertTilsyn, etablertTilsynSmurt, tilsynProsent, visIkon }: OwnProps) => {
  const dagerPerUkedag = mapDagerPerUkedag(etablertTilsyn);
  const smurtDagerPerUkedag = mapSmurtDagerPerUkedag(etablertTilsynSmurt);

  const mandag = dagerPerUkedag.get(1);
  const tirsdag = dagerPerUkedag.get(2);
  const onsdag = dagerPerUkedag.get(3);
  const torsdag = dagerPerUkedag.get(4);
  const fredag = dagerPerUkedag.get(5);

  const mandagSmurt = smurtDagerPerUkedag.get(1);
  const tirsdagSmurt = smurtDagerPerUkedag.get(2);
  const onsdagSmurt = smurtDagerPerUkedag.get(3);
  const torsdagSmurt = smurtDagerPerUkedag.get(4);
  const fredagSmurt = smurtDagerPerUkedag.get(5);

  const timerSmurt = Array.from(smurtDagerPerUkedag.values()).find(v => v.tidPerDag)?.tidPerDag;

  const skalDisables = (tilsynSmurt?: TilsynMappet) => !tilsynSmurt;
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
