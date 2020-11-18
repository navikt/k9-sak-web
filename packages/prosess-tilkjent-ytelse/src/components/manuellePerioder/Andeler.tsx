import React, { FC } from 'react';
import { WrappedComponentProps } from 'react-intl';
import { FieldArrayFieldsProps, FieldArrayMetaProps } from 'redux-form';
import AlertStripe from 'nav-frontend-alertstriper';
import { Kodeverk, KodeverkMedNavn } from '@k9-sak-web/types';
import { Table, TableColumn } from '@fpsak-frontend/shared-components';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { SelectField, InputField } from '@fpsak-frontend/form';
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
  behandlingVersjon: number;
  behandlingId: number;
  behandlingStatus: Kodeverk;
  alleKodeverk: { [key: string]: KodeverkMedNavn[] };
}

const headerTextCodes = [
  'TilkjentYtelse.NyPeriode.Arbeidsforhold',
  'TilkjentYtelse.NyPeriode.Refusjon',
  'TilkjentYtelse.NyPeriode.Inntektskategori',
  'TilkjentYtelse.NyPeriode.Ubetalingsgrad',
];

const Andeler: FC<OwnProps & WrappedComponentProps> = ({ fields, meta, alleKodeverk, readOnly }) => {
  return (
    <div>
      {meta.error && <AlertStripe type="feil">{meta.error}</AlertStripe>}
      {meta.warning && <AlertStripe type="info">{meta.warning}</AlertStripe>}

      <Table headerTextCodes={headerTextCodes}>
        {fields.map((fieldId: string, index: number, field: FieldArrayFieldsProps<any>) => {
          const andel = field.get(index);
          // const label = createVisningsnavnForAndel(andel, getKodeverknavn);
          return (
            <>
              <TableColumn>
                <InputField
                  readOnly={readOnly}
                  label=""
                  name={`${fieldId}.arbeidsgiver.navn`}
                  value={andel.arbeidsgiver.navn}
                />
              </TableColumn>
              <TableColumn>
                <InputField
                  readOnly={readOnly}
                  label=""
                  name={`${fieldId}.refusjon`}
                  value={andel.refusjon}
                  validate={[required, minValue0, hasValidDecimal]}
                />
              </TableColumn>
              <TableColumn>
                <SelectField
                  label=""
                  bredde="l"
                  name={`${fieldId}.inntektskategori.kode`}
                  // @ts-ignore
                  value={andel.inntektskategori.kode}
                  readOnly={readOnly}
                  selectValues={getInntektskategori(alleKodeverk)}
                />
              </TableColumn>
              <TableColumn>
                <InputField
                  label=""
                  readOnly={readOnly}
                  name={`${fieldId}.utbetalingsgrad`}
                  validate={[required, minValue0, maxValue200, hasValidDecimal]}
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
