import React, { FunctionComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import { Undertittel, Element } from 'nav-frontend-typografi';
import { TableColumn, TableRow, Table, Image } from '@fpsak-frontend/shared-components/index';
import kalender from '@fpsak-frontend/assets/images/kalender.svg';
import BorderedContainer from './BorderedContainer';
import Aktivitet from '../dto/Aktivitet';

interface UttaksplanProps {
  aktiviteter: Aktivitet[];
}

const storForbokstav = (string: string) => string.charAt(0).toUpperCase() + string.substr(1);

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
              headerTextCodes={['Uttaksplan.Periode', 'Uttaksplan.Fravær', 'Uttaksplan.Utfall', 'Uttaksplan.Årsak']}
              noHover
            >
              {uttaksperioder.map(periode => (
                <TableRow key={periode.periode}>
                  <TableColumn>{periode.periode}</TableColumn>
                  <TableColumn>{periode.delvisFravær}</TableColumn>
                  <TableColumn>{periode.utfall}</TableColumn>
                  <TableColumn>{periode.årsak}</TableColumn>
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
