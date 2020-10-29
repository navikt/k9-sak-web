import React, { FunctionComponent } from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { FieldArrayFieldsProps, FieldArrayMetaProps } from 'redux-form';
import AlertStripe from 'nav-frontend-alertstriper';

import { Kodeverk } from '@k9-sak-web/types';
import { Table, TableRow, TableColumn, PeriodLabel, Image } from '@fpsak-frontend/shared-components';
import editPeriodeIcon from '@fpsak-frontend/assets/images/endre.svg';
import editPeriodeDisabledIcon from '@fpsak-frontend/assets/images/endre_disablet.svg';
import removePeriod from '@fpsak-frontend/assets/images/remove.svg';
import removePeriodDisabled from '@fpsak-frontend/assets/images/remove_disabled.svg';

import styles from './periode.less';

interface OwnProps {
  fields: FieldArrayFieldsProps<any>;
  meta: FieldArrayMetaProps;
  openSlettPeriodeModalCallback: (...args: any[]) => any;
  updatePeriode: (...args: any[]) => any;
  editPeriode: (...args: any[]) => any;
  cancelEditPeriode: (...args: any[]) => any;
  readOnly: boolean;
  perioder: any[];
  isNyPeriodeFormOpen: boolean;
  getKodeverknavn: (...args: any[]) => any;
  behandlingVersjon: number;
  behandlingId: number;
  behandlingStatus: Kodeverk;
}

const headerTextCodes = ['Periode', 'Mottaker', 'Dagsats', 'Aktivitetsstatus', 'Inntektskategori', 'Utbetalingsgrad'];

const PeriodeRad: FunctionComponent<OwnProps & WrappedComponentProps> = ({
  // cancelEditPeriode,
  editPeriode,
  fields,
  meta,
  openSlettPeriodeModalCallback,
  // updatePeriode,
  // getKodeverknavn,
  // id,
  intl,
  isNyPeriodeFormOpen,
  readOnly,
  isAnyFormOpen,
}) => {
  const isAnyFormOrNyPeriodeOpen = isAnyFormOpen() || isNyPeriodeFormOpen;
  return (
    <div>
      {meta.error && <AlertStripe type="feil">{meta.error}</AlertStripe>}
      {meta.warning && <AlertStripe type="info">{meta.warning}</AlertStripe>}

      <Table headerTextCodes={headerTextCodes}>
        {fields.map((fieldId: string, index: number, field: any[]) => {
          const periode = field.get(index);
          return (
            <TableRow key={periode.id} id={periode.id}>
              <TableColumn>
                <PeriodLabel showTodayString dateStringFom={periode.fom} dateStringTom={periode.tom} />
              </TableColumn>
              <TableColumn>mottaker</TableColumn>
              <TableColumn>dagsats</TableColumn>
              <TableColumn>Aktivitetsstatus</TableColumn>
              <TableColumn>Inntektskategori</TableColumn>
              <TableColumn>Utbetalingsgrad</TableColumn>
              <TableColumn>
                {!readOnly && (
                  <div className={styles.iconContainer}>
                    <Image
                      className={styles.editIcon}
                      src={isAnyFormOrNyPeriodeOpen ? editPeriodeDisabledIcon : editPeriodeIcon}
                      onClick={isAnyFormOrNyPeriodeOpen ? () => undefined : () => editPeriode(id)}
                      alt={intl.formatMessage({ id: 'TilkjentYtelse.EndrePerioden' })}
                    />
                    <Image
                      className={styles.removeIcon}
                      src={isAnyFormOrNyPeriodeOpen ? removePeriodDisabled : removePeriod}
                      onClick={isAnyFormOrNyPeriodeOpen ? () => undefined : () => openSlettPeriodeModalCallback(id)}
                      alt={intl.formatMessage({ id: 'TilkjentYtelse.SlettPerioden' })}
                    />
                  </div>
                )}
              </TableColumn>
            </TableRow>
          );
        })}
      </Table>
    </div>
  );
};

export default injectIntl(PeriodeRad);
