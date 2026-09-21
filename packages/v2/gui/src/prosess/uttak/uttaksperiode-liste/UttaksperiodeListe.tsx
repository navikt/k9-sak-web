import { Fragment, useState, type FC, type ReactNode } from 'react';
import dayjs from 'dayjs';
import { Alert, BodyLong, Button, Table, Loader, HStack } from '@navikt/ds-react';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import {
  type FagsakYtelsesType as FagsakYtelseType,
  fagsakYtelsesType as fagsakYtelseType,
} from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import UttakRad from './UttakRad';
import UttakRadOpplæringspenger from './UttakRadOpplæringspenger';
import styles from './uttaksperiodeListe.module.css';
import { useUttakContext } from '../context/UttakContext';
import { prettifyPeriod } from '../utils/periodUtils';
import splitUttakByDate from '../utils/splitUttakByDate';
import type { UttaksperiodeBeriket } from '../types/UttaksperiodeBeriket';
import { PencilIcon } from '@navikt/aksel-icons';

const NORMALARBEIDSTID_LÅST_DATO = '2027-01-01';

interface UttaksperiodeListeProps {
  redigerVirkningsdatoFunc: () => void;
  redigerVirkningsdato: boolean;
  visEndringerIUttakFunc: () => void;
}

interface UttaksregelInfo {
  dato: string;
  rad: ReactNode;
}

const tableHeaders = (sakstype: FagsakYtelseType | undefined) => {
  if (sakstype === fagsakYtelseType.OPPLÆRINGSPENGER) {
    return ['Uke', 'Uttaksperiode', 'Inngangsvilkår', 'Sykdom og opplæring', 'Søkers uttaksgrad'];
  }
  if (sakstype === fagsakYtelseType.PLEIEPENGER_NÆRSTÅENDE) {
    return ['Uke', 'Uttaksperiode', 'Inngangsvilkår', 'Pleie i hjemmet', 'Pleiebehov', 'Parter', 'Søkers uttaksgrad'];
  }
  return ['Uke', 'Uttaksperiode', 'Inngangsvilkår', 'Pleiebehov', 'Parter', 'Søkers uttaksgrad'];
};

const UttaksperiodeListe: FC<UttaksperiodeListeProps> = ({
  redigerVirkningsdatoFunc,
  redigerVirkningsdato,
  visEndringerIUttakFunc,
}) => {
  const {
    fagsakYtelseType: ytelseType,
    virkningsdatoUttakNyeRegler,
    erSakstype,
    uttaksperiodeListe,
    lasterUttak,
    readOnly,
    behandling,
  } = useUttakContext();
  const [valgtPeriodeIndex, velgPeriodeIndex] = useState<number>();
  const headers = tableHeaders(ytelseType);

  const velgPeriode = (index: number) => {
    if (valgtPeriodeIndex === index) {
      velgPeriodeIndex(undefined);
    } else {
      velgPeriodeIndex(index);
    }
  };

  const renderPeriodeRad = (uttak: UttaksperiodeBeriket, index: number) => (
    <Fragment key={`${prettifyPeriod(uttak.periode.fom, uttak.periode.tom)}`}>
      {uttak.harOppholdTilNestePeriode && (
        <Table.Row>
          <td colSpan={12}>
            <div className={styles['oppholdRow']} />
          </td>
        </Table.Row>
      )}
      {erSakstype(fagsakYtelseType.OPPLÆRINGSPENGER) ? (
        <UttakRadOpplæringspenger
          uttak={uttak}
          erValgt={valgtPeriodeIndex === index}
          velgPeriode={() => velgPeriode(index)}
        />
      ) : (
        <UttakRad uttak={uttak} erValgt={valgtPeriodeIndex === index} velgPeriode={() => velgPeriode(index)} />
      )}
    </Fragment>
  );

  const uttaksregelInfo: UttaksregelInfo[] = [];

  if (virkningsdatoUttakNyeRegler) {
    uttaksregelInfo.push({
      dato: virkningsdatoUttakNyeRegler,
      rad: (
        <Table.Row key="uttaksregelinfo-endringsdato">
          <Table.DataCell colSpan={12}>
            <div className={styles['alertRow']}>
              <Alert variant="info">
                <div className="flex items-center justify-between gap-4">
                  <BodyLong size="small">
                    Endringer fra {dayjs(virkningsdatoUttakNyeRegler).format('DD.MM.YYYY')}: Etter denne datoen er det
                    endring i hvordan utbetalingsgrad settes for ikke yrkesaktiv, kun ytelse og ny arbeidsaktivitet.
                  </BodyLong>
                  <Button
                    variant="secondary"
                    size="small"
                    icon={<PencilIcon />}
                    onClick={redigerVirkningsdatoFunc}
                    disabled={behandling.status === behandlingStatus.AVSLUTTET || readOnly || redigerVirkningsdato}
                  >
                    Rediger dato
                  </Button>
                </div>
              </Alert>
            </div>
          </Table.DataCell>
        </Table.Row>
      ),
    });
  }

  const { afterOrCovering: perioderEtterLåstNormalarbeidstid } = splitUttakByDate(
    [...uttaksperiodeListe],
    NORMALARBEIDSTID_LÅST_DATO,
  );
  const visNormalarbeidstidInfo = perioderEtterLåstNormalarbeidstid.length > 0;

  if (visNormalarbeidstidInfo) {
    uttaksregelInfo.push({
      dato: NORMALARBEIDSTID_LÅST_DATO,
      rad: (
        <Table.Row key="uttaksregelinfo-normalarbeidstid-låst">
          <Table.DataCell colSpan={12}>
            <div className={styles['alertRow']}>
              <Alert variant="info">
                <div className="flex items-center justify-between gap-4">
                  <BodyLong size="small">
                    Endringer fra {dayjs(NORMALARBEIDSTID_LÅST_DATO).format('DD.MM.YYYY')}: Fra denne datoen låses
                    normalarbeidstid på skjæringstidspunktet for arbeidsforhold, frilans og selvstendig næringsdrivende.
                  </BodyLong>
                  <Button variant="tertiary" size="small" onClick={visEndringerIUttakFunc}>
                    Les mer om endring
                  </Button>
                </div>
              </Alert>
            </div>
          </Table.DataCell>
        </Table.Row>
      ),
    });
  }

  // uttaksperiodeListe er sortert nyeste først, så regel-radene må splittes ut i synkende dato-rekkefølge
  // for at hver regel skal havne før perioden den gjelder fra.
  const uttaksregelInfoSynkende = [...uttaksregelInfo].sort((a, b) => (a.dato < b.dato ? 1 : -1));

  let resterendePerioder: UttaksperiodeBeriket[] = [...uttaksperiodeListe];
  let periodeIndeks = 0;
  const segmenter = uttaksregelInfoSynkende.map(uttaksregelInfo => {
    const { afterOrCovering, before } = splitUttakByDate(resterendePerioder, uttaksregelInfo.dato);
    resterendePerioder = before;
    const rader = afterOrCovering.map(uttak => renderPeriodeRad(uttak, periodeIndeks++));
    return [...rader, uttaksregelInfo.rad];
  });
  const sisteSegment = resterendePerioder.map(uttak => renderPeriodeRad(uttak, periodeIndeks++));

  return (
    <div className={styles['tableContainer']}>
      {lasterUttak && (
        <HStack justify="center">
          <Loader variant="inverted" size="2xlarge" title="Laster uttaksperioder..." />
        </HStack>
      )}
      <Table size="small">
        <Table.Header>
          <Table.Row>
            {headers.map((header, index) => (
              <Table.HeaderCell
                scope="col"
                key={header}
                className={styles['headerColumn']}
                colSpan={headers.length - 1 === index ? 2 : 1}
              >
                {header}
              </Table.HeaderCell>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {segmenter}
          {sisteSegment}
        </Table.Body>
      </Table>
    </div>
  );
};

export default UttaksperiodeListe;
