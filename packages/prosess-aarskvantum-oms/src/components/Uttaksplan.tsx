import React, { FunctionComponent, ReactNode } from 'react';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';
import { Undertittel, Element } from 'nav-frontend-typografi';
import { TableColumn, TableRow, Table, Image } from '@fpsak-frontend/shared-components/index';
import kalender from '@fpsak-frontend/assets/images/kalender.svg';
import { DDMMYYYY_DATE_FORMAT, ISO_DATE_FORMAT } from '@fpsak-frontend/utils';
import BorderedContainer from './BorderedContainer';
import Aktivitet from '../dto/Aktivitet';

interface UttaksplanProps {
  aktiviteter: Aktivitet[];
}

const storForbokstav = (string: string) => string.charAt(0).toUpperCase() + string.substr(1);

const formatDate = (date: string): string => moment(date, ISO_DATE_FORMAT).format(DDMMYYYY_DATE_FORMAT);

const periodevisning = (periode: string): string => {
  const [fom, tom] = periode.split('/');
  return `${formatDate(fom)} - ${formatDate(tom)}`;
};

const durationTilTimerMed7ogEnHalvTimesDagsbasis = (delvisFravær: string): number => {
  const antallTimerMedFulleDager = moment.duration(delvisFravær).asHours();
  const resttimer = antallTimerMedFulleDager % 24;
  const heleDager = Math.floor(antallTimerMedFulleDager / 24);

  return heleDager * 7.5 + resttimer;
};

const formaterDelvisFravær = (delvisFravær?: string): ReactNode => {
  if (delvisFravær) {
    const timer = durationTilTimerMed7ogEnHalvTimesDagsbasis(delvisFravær);
    return <FormattedMessage id="Uttaksplan.DelvisFravær" values={{ timer }} />;
  }
  return <FormattedMessage id="Uttaksplan.IngenFravær" />;
};

const Uttaksplan: FunctionComponent<UttaksplanProps> = ({ aktiviteter = [] }) => {
  return (
    <BorderedContainer
      heading={
        <Undertittel tag="h3">
          <Image src={kalender} />
          <FormattedMessage id="Uttaksplan.Heading" />
        </Undertittel>
      }
    >
      {aktiviteter.length ? (
        aktiviteter.map(({ arbeidsforhold, uttaksperioder }) => (
          <div>
            <Element>{storForbokstav(arbeidsforhold.type)}</Element>
            <Table
              headerTextCodes={[
                'Uttaksplan.Periode',
                'Uttaksplan.Fravær',
                'Uttaksplan.Utfall',
                'Uttaksplan.Årsak',
                'Uttaksplan.Utbetalingsgrad',
              ]}
              noHover
            >
              {uttaksperioder.map(({ periode, delvisFravær, utfall, årsak, utbetalingsgrad }) => (
                <TableRow key={periode}>
                  <TableColumn>{periodevisning(periode)}</TableColumn>
                  <TableColumn>{formaterDelvisFravær(delvisFravær)}</TableColumn>
                  <TableColumn>{utfall}</TableColumn>
                  <TableColumn>{årsak}</TableColumn>
                  <TableColumn>{`${utbetalingsgrad}%`}</TableColumn>
                </TableRow>
              ))}
            </Table>
          </div>
        ))
      ) : (
        <FormattedMessage id="Uttaksplan.IngenUttaksplaner" />
      )}
    </BorderedContainer>
  );
};

export default Uttaksplan;
