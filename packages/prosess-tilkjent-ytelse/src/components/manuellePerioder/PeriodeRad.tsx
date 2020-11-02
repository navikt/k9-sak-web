import React, { FunctionComponent } from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { FieldArrayFieldsProps, FieldArrayMetaProps } from 'redux-form';
import AlertStripe from 'nav-frontend-alertstriper';

import { Kodeverk } from '@k9-sak-web/types';
import { FlexRow, FlexColumn, Table, TableRow, TableColumn, Image } from '@fpsak-frontend/shared-components';
import editPeriodeIcon from '@fpsak-frontend/assets/images/endre.svg';
import editPeriodeDisabledIcon from '@fpsak-frontend/assets/images/endre_disablet.svg';
import removePeriod from '@fpsak-frontend/assets/images/remove.svg';
import removePeriodDisabled from '@fpsak-frontend/assets/images/remove_disabled.svg';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { DecimalField, SelectField, DatepickerField } from '@fpsak-frontend/form';

import { hasValidDecimal, maxValue, minValue, required } from '@fpsak-frontend/utils';

import styles from './periode.less';

const minValue0 = minValue(0);
const maxValue200 = maxValue(200);

const getMottaker = kategorier =>
  kategorier.map(ik => (
    <option value={ik.kode} key={ik.kode}>
      {ik.navn}
    </option>
  ));

const getInntektskategori = alleKodeverk => {
  const aktivitetsstatuser = alleKodeverk[kodeverkTyper.INNTEKTSKATEGORI];
  return aktivitetsstatuser.map(ik => (
    <option value={ik.kode} key={ik.kode}>
      {ik.navn}
    </option>
  ));
};

const getAktivitetsStatus = alleKodeverk => {
  const aktivitetsstatuser = alleKodeverk[kodeverkTyper.AKTIVITET_STATUS];
  return aktivitetsstatuser.map(ik => (
    <option value={ik.kode} key={ik.kode}>
      {ik.navn}
    </option>
  ));
};

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

const headerTextCodes = ['Periode', 'Mottaker', 'Dagsats', 'Aktivitetsstatus', 'Inntektskategori', 'Utbetalingsgrad'];

const PeriodeRad: FunctionComponent<OwnProps & WrappedComponentProps> = ({
  // cancelEditPeriode,
  editPeriode,
  fields,
  meta,
  openSlettPeriodeModalCallback,
  // updatePeriode,
  alleKodeverk,
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
                    <DatepickerField name={`${fieldId}.fom`} label="" value={periode.fom} />
                  </FlexColumn>
                  <FlexColumn>
                    <DatepickerField name={`${fieldId}.tom`} label="" value={periode.tom} />
                  </FlexColumn>
                </FlexRow>
              </TableColumn>
              <TableColumn>
                <SelectField
                  label=""
                  name={`${fieldId}.mottaker`}
                  value={periode.mottaker}
                  bredde="l"
                  selectValues={getMottaker([])}
                />
              </TableColumn>
              <TableColumn>
                <DecimalField
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
                <SelectField
                  label=""
                  bredde="l"
                  name={`${fieldId}.aktivitetsstatus`}
                  value={periode.aktivitetsstatus}
                  readOnly={readOnly}
                  selectValues={getAktivitetsStatus(alleKodeverk)}
                />
              </TableColumn>
              <TableColumn>
                <SelectField
                  label=""
                  bredde="l"
                  name={`${fieldId}.inntektskategori`}
                  value={periode.inntektskategori}
                  readOnly={readOnly}
                  selectValues={getInntektskategori(alleKodeverk)}
                />
              </TableColumn>
              <TableColumn>
                <DecimalField
                  name={`${fieldId}.utbetalingsgrad`}
                  value={periode.utbetalingsgrad}
                  validate={[required, minValue0, maxValue200, hasValidDecimal]}
                  bredde="S"
                  readOnly={readOnly}
                  format={value => value}
                  // @ts-ignore Fiks denne
                  normalizeOnBlur={value => (Number.isNaN(value) ? value : parseFloat(value).toFixed(2))}
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
