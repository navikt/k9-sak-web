import React, { FunctionComponent, ReactNode } from 'react';
import { FormattedMessage } from 'react-intl';
import { Undertittel, Element } from 'nav-frontend-typografi';
import { TableColumn, TableRow, Table, Image } from '@fpsak-frontend/shared-components/index';
import kalender from '@fpsak-frontend/assets/images/kalender.svg';
import BorderedContainer from './BorderedContainer';
import Aktivitet from '../dto/Aktivitet';
import { durationTilTimerMed7ogEnHalvTimesDagsbasis, formatDate, joinNonNullStrings, storForbokstav } from './utils';

interface UttaksplanProps {
  aktiviteter: Aktivitet[];
}

const periodevisning = (periode: string): string => {
  const [fom, tom] = periode.split('/');
  return `${formatDate(fom)} - ${formatDate(tom)}`;
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
          <div key={joinNonNullStrings(Object.values(arbeidsforhold))}>
            <Element>{storForbokstav(arbeidsforhold.type)}</Element>
            <Table
              headerTextCodes={[
                'Uttaksplan.Periode',
                'Uttaksplan.Fravær',
                'Uttaksplan.Utfall',
                'Uttaksplan.Årsak',
                'Uttaksplan.Utbetalingsgrad',
              ]}
              stripet
              noHover
            >
              {uttaksperioder.map(({ periode, delvisFravær, utfall, årsak, utbetalingsgrad }) => (
                <TableRow key={periode}>
                  <TableColumn>{periodevisning(periode)}</TableColumn>
                  <TableColumn>{formaterDelvisFravær(delvisFravær)}</TableColumn>
                  <TableColumn>
                    <FormattedMessage id={`Uttaksplan.Utfall.${utfall}`} />
                  </TableColumn>
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
