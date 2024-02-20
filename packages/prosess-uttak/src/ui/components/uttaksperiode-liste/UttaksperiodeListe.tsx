import React from 'react';
import dayjs from 'dayjs';

import { Alert, Label, BodyShort, Button } from '@navikt/ds-react';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';

import { Uttaksperiode } from '../../../types/Uttaksperiode';
import Table from '../table/Table';
import TableColumn from '../table/TableColumn';
import styles from './uttaksperiodeListe.module.css';
import Uttak from '../uttak/Uttak';
import ContainerContext from '../../context/ContainerContext';
import FullWidthRow from '../table/FullWidthRow';

interface UttaksperiodeListeProps {
  uttaksperioder: Uttaksperiode[];
  redigerVirkningsdatoFunc: () => void;
  redigerVirkningsdato: boolean;
}

const splitUttakByDate = (
  uttaksperioder: Uttaksperiode[],
  virkningsdatoUttakNyeRegler: string | null,
): [Uttaksperiode[], Uttaksperiode[]] => {
  // If virkningsdatoUttakNyeRegler is null, consider all periods as before the date.
  if (!virkningsdatoUttakNyeRegler) {
    return [uttaksperioder, []];
  }

  const virkningsdato =
    virkningsdatoUttakNyeRegler && !Number.isNaN(new Date(virkningsdatoUttakNyeRegler).getTime())
      ? new Date(virkningsdatoUttakNyeRegler)
      : new Date();

  const beforeVirkningsdato = uttaksperioder.filter(uttak => {
    const uttakToDate = new Date(uttak.periode.tom);

    // Check if the entire period is before the virkningsdato.
    return uttakToDate < virkningsdato;
  });

  const afterOrCoveringVirkningsdato = uttaksperioder.filter(uttak => {
    const uttakFromDate = new Date(uttak.periode.fom);
    const uttakToDate = new Date(uttak.periode.tom);

    // Check if the period starts before and ends after virkningsdato, or if it entirely starts after the virkningsdato.
    return uttakFromDate >= virkningsdato || (uttakFromDate < virkningsdato && uttakToDate >= virkningsdato);
  });

  return [beforeVirkningsdato, afterOrCoveringVirkningsdato];
};

const UttaksperiodeListe = (props: UttaksperiodeListeProps): JSX.Element => {
  const [valgtPeriodeIndex, velgPeriodeIndex] = React.useState<number>();
  const {
    erFagytelsetypeLivetsSluttfase,
    virkningsdatoUttakNyeRegler,
    status = false,
  } = React.useContext(ContainerContext);
  const { uttaksperioder, redigerVirkningsdatoFunc, redigerVirkningsdato } = props;

  const [before, afterOrCovering] = splitUttakByDate(uttaksperioder, virkningsdatoUttakNyeRegler);

  const headers = erFagytelsetypeLivetsSluttfase
    ? ['Uttaksperiode', 'Inngangsvilkår', 'Pleie i hjemmet', 'Pleiebehov', 'Parter', 'Søkers uttaksgrad']
    : ['Uttaksperiode', 'Inngangsvilkår', 'Pleiebehov', 'Parter', 'Søkers uttaksgrad'];

  const velgPeriode = (index: number) => {
    if (valgtPeriodeIndex === index) {
      velgPeriodeIndex(null);
    } else {
      velgPeriodeIndex(index);
    }
  };
  return (
    <div style={{ maxWidth: '961px' }}>
      <Table
        suppliedHeaders={
          <>
            {headers.map((header, index) => (
              <TableColumn key={header} className={styles.headerColumn} colSpan={headers.length - 1 === index ? 2 : 1}>
                {header}
              </TableColumn>
            ))}
          </>
        }
      >
        <>
          {afterOrCovering.map((uttak, index) => (
            <Uttak
              key={uttak.periode.prettifyPeriod()}
              uttak={uttak}
              erValgt={valgtPeriodeIndex === index}
              velgPeriode={() => velgPeriode(index)}
            />
          ))}
          {virkningsdatoUttakNyeRegler && !redigerVirkningsdato && (
            <FullWidthRow colSpan={12}>
              <div className={styles.alertRow}>
                <Alert variant="info">
                  <div style={{ display: 'flex' }}>
                    <Label size="small">Endringsdato: {dayjs(virkningsdatoUttakNyeRegler).format('DD.MM.YYYY')}</Label>
                    <Button
                      variant="secondary"
                      size="small"
                      className={styles.redigerDato}
                      onClick={redigerVirkningsdatoFunc}
                      disabled={status === behandlingStatus.AVSLUTTET}
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
            </FullWidthRow>
          )}
          {before.map((uttak, index) => (
            <Uttak
              key={uttak.periode.prettifyPeriod()}
              uttak={uttak}
              erValgt={valgtPeriodeIndex === index}
              velgPeriode={() => velgPeriode(index)}
              withBorderTop={index === 0 && !!virkningsdatoUttakNyeRegler}
            />
          ))}
        </>
      </Table>
    </div>
  );
};

export default UttaksperiodeListe;
