import React, { FunctionComponent } from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { FieldArray, FieldArrayFieldsProps, FieldArrayMetaProps } from 'redux-form';
import AlertStripe from 'nav-frontend-alertstriper';
import { Kodeverk } from '@k9-sak-web/types';
import { FlexRow, FlexColumn, Table, TableRow, TableColumn, Image } from '@fpsak-frontend/shared-components';
import editPeriodeIcon from '@fpsak-frontend/assets/images/endre.svg';
import editPeriodeDisabledIcon from '@fpsak-frontend/assets/images/endre_disablet.svg';
import removePeriod from '@fpsak-frontend/assets/images/remove.svg';
import removePeriodDisabled from '@fpsak-frontend/assets/images/remove_disabled.svg';
import { DecimalField, DatepickerField } from '@fpsak-frontend/form';
import { hasValidDecimal, minValue, required } from '@fpsak-frontend/utils';
import Andeler from './Andeler';

import styles from './periode.less';

const minValue0 = minValue(0);

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
  alleKodeverk: { [key: string]: KodeverkMedNavn[] };
}

const headerTextCodes = ['Periode', 'Dagsats', 'Andeler'];

const PeriodeRad: FunctionComponent<OwnProps & WrappedComponentProps> = ({
  // cancelEditPeriode,
  editPeriode,
  fields,
  meta,
  openSlettPeriodeModalCallback,
  // updatePeriode,
  alleKodeverk,
  getKodeverknavn,
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
                <FlexRow>
                  <FlexColumn>
                    <DatepickerField name={`${fieldId}.fom`} label="" value={periode.fom} readOnly={readOnly} />
                  </FlexColumn>
                  <FlexColumn>
                    <DatepickerField name={`${fieldId}.tom`} label="" value={periode.tom} readOnly={readOnly} />
                  </FlexColumn>
                </FlexRow>
              </TableColumn>

              <TableColumn>
                <DecimalField
                  readOnly={readOnly}
                  name={`${fieldId}.dagsats`}
                  value={periode.dagsats}
                  validate={[required, minValue0, hasValidDecimal]}
                  bredde="S"
                  format={value => value}
                  // @ts-ignore Fiks denne
                  normalizeOnBlur={value => (Number.isNaN(value) ? value : parseFloat(value).toFixed(2))}
                />
              </TableColumn>
              <TableColumn>
                <FieldArray
                  name={`${fieldId}.andeler`}
                  component={Andeler}
                  // andeler={andeler}
                  readOnly={readOnly}
                  alleKodeverk={alleKodeverk}
                  getKodeverknavn={getKodeverknavn}
                />
              </TableColumn>
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
