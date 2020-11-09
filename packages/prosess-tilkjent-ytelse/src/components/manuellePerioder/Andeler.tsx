import React, { FunctionComponent } from 'react';
import { WrappedComponentProps } from 'react-intl';
import { FieldArrayFieldsProps, FieldArrayMetaProps } from 'redux-form';
import AlertStripe from 'nav-frontend-alertstriper';

import { Kodeverk } from '@k9-sak-web/types';
import { Table, TableColumn } from '@fpsak-frontend/shared-components';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { DecimalField, SelectField, InputField } from '@fpsak-frontend/form';
import { hasValidDecimal, maxValue, minValue, required } from '@fpsak-frontend/utils';
// import { createVisningsnavnForAndel } from '../TilkjentYteleseUtils';

const minValue0 = minValue(0);
const maxValue200 = maxValue(200);

const getInntektskategori = alleKodeverk => {
  const aktivitetsstatuser = alleKodeverk[kodeverkTyper.INNTEKTSKATEGORI];
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

const headerTextCodes = ['Arbeidsforhold', 'Refusjon', 'Inntektskategori', 'Utbetalingsgrad'];

const Andeler: FunctionComponent<OwnProps & WrappedComponentProps> = ({
  fields,
  meta,
  alleKodeverk,
  readOnly,
  // getKodeverknavn,
}) => {
  return (
    <div>
      {meta.error && <AlertStripe type="feil">{meta.error}</AlertStripe>}
      {meta.warning && <AlertStripe type="info">{meta.warning}</AlertStripe>}

      <Table headerTextCodes={headerTextCodes}>
        {fields.map((fieldId: string, index: number, field: any[]) => {
          const andel = field.get(index);
          // const label = createVisningsnavnForAndel(andel, getKodeverknavn);
          return (
            <>
              <TableColumn>
                <InputField
                  readOnly={readOnly}
                  label=""
                  name={`${fieldId}.arbeidsgiverNavn`}
                  value={andel.arbeidsgiverNavn}
                />
              </TableColumn>
              <TableColumn>
                <DecimalField
                  name={`${fieldId}.refusjon`}
                  value={andel.refusjon}
                  validate={[required, minValue0, maxValue200, hasValidDecimal]}
                  bredde="S"
                  readOnly={readOnly}
                  format={value => value}
                  // @ts-ignore Fiks denne
                  normalizeOnBlur={value => (Number.isNaN(value) ? value : parseFloat(value).toFixed(2))}
                />
              </TableColumn>
              <TableColumn>
                <SelectField
                  label=""
                  bredde="l"
                  name={`${fieldId}.inntektskategori.kode`}
                  value={andel.inntektskategori.kode}
                  readOnly={readOnly}
                  selectValues={getInntektskategori(alleKodeverk)}
                />
              </TableColumn>
              <TableColumn>
                <DecimalField
                  name={`${fieldId}.utbetalingsgrad`}
                  value={andel.utbetalingsgrad}
                  validate={[required, minValue0, maxValue200, hasValidDecimal]}
                  bredde="S"
                  readOnly={readOnly}
                  format={value => value}
                  // @ts-ignore Fiks denne
                  normalizeOnBlur={value => (Number.isNaN(value) ? value : parseFloat(value).toFixed(2))}
                />
              </TableColumn>
            </>
          );
        })}
      </Table>
    </div>
  );
};

export default Andeler;
