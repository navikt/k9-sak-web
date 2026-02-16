import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import {
  type k9_kodeverk_behandling_FagsakYtelseType as FagsakYtelseType,
  k9_kodeverk_behandling_FagsakYtelseType as fagsakYtelseType,
} from '@k9-sak-web/backend/k9sak/generated/types.js';
import { Alert, BodyShort, Button, HStack, Label, Loader, Table } from '@navikt/ds-react';
import dayjs from 'dayjs';
import { type FC, Fragment, useState } from 'react';
import { useUttakContext } from '../context/UttakContext';
import { prettifyPeriod } from '../utils/periodUtils';
import splitUttakByDate from '../utils/splitUttakByDate';
import UttakRad from './UttakRad';
import UttakRadOpplæringspenger from './UttakRadOpplæringspenger';
import styles from './uttaksperiodeListe.module.css';

interface UttaksperiodeListeProps {
  redigerVirkningsdatoFunc: () => void;
  redigerVirkningsdato: boolean;
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

const UttaksperiodeListe: FC<UttaksperiodeListeProps> = ({ redigerVirkningsdatoFunc, redigerVirkningsdato }) => {
  const {
    fagsakYtelseType: ytelseType,
    virkningsdatoUttakNyeRegler,
    erSakstype,
    uttaksperiodeListe,
    lasterUttak,
    readOnly,
  } = useUttakContext();
  const [valgtPeriodeIndex, velgPeriodeIndex] = useState<number>();
  const { before, afterOrCovering } = splitUttakByDate([...uttaksperiodeListe], virkningsdatoUttakNyeRegler);
  const headers = tableHeaders(ytelseType);

  const velgPeriode = (index: number) => {
    if (valgtPeriodeIndex === index) {
      velgPeriodeIndex(undefined);
    } else {
      velgPeriodeIndex(index);
    }
  };

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
          {afterOrCovering.map((uttak, index) => (
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
          ))}
          {virkningsdatoUttakNyeRegler && !redigerVirkningsdato && (
            <Table.Row>
              <Table.DataCell colSpan={12}>
                <div className={styles['alertRow']}>
                  <Alert variant="info">
                    <div className="flex">
                      <Label size="small">
                        Endringsdato: {dayjs(virkningsdatoUttakNyeRegler).format('DD.MM.YYYY')}
                      </Label>
                      <Button
                        variant="secondary"
                        size="small"
                        className={styles['redigerDato']}
                        onClick={redigerVirkningsdatoFunc}
                        disabled={status === behandlingStatus.AVSLUTTET || readOnly}
                      >
                        Rediger
                      </Button>
                    </div>
                    <BodyShort>
                      Etter denne datoen er det endring i hvordan utbetalingsgrad settes for ikke yrkesaktiv, kun ytelse
                      og ny arbeidsaktivitet.
                    </BodyShort>
                  </Alert>
                </div>
              </Table.DataCell>
            </Table.Row>
          )}
          {before.map((uttak, index) => (
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
                  erValgt={valgtPeriodeIndex === (afterOrCovering.length ? afterOrCovering.length + index : index)}
                  velgPeriode={() => velgPeriode(afterOrCovering.length ? afterOrCovering.length + index : index)}
                />
              ) : (
                <UttakRad
                  uttak={uttak}
                  erValgt={valgtPeriodeIndex === (afterOrCovering.length ? afterOrCovering.length + index : index)}
                  velgPeriode={() => velgPeriode(afterOrCovering.length ? afterOrCovering.length + index : index)}
                />
              )}
            </Fragment>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
};

export default UttaksperiodeListe;
