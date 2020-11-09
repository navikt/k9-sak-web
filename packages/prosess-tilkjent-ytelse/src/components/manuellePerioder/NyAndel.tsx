import React, { FunctionComponent } from 'react';
import { WrappedComponentProps } from 'react-intl';
import { FieldArrayFieldsProps } from 'redux-form';

import { FlexColumn, FlexRow, PeriodFieldArray } from '@fpsak-frontend/shared-components';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { InputField, DecimalField, SelectField } from '@fpsak-frontend/form';
import { hasValidDecimal, maxValue, minValue, required } from '@fpsak-frontend/utils';

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
  getKodeverknavn: (...args: any[]) => any;
  alleKodeverk: { [key: string]: KodeverkMedNavn[] };
}

const defaultAndel = {
  dagsats: '',
  Mottaker: '',
};

const NyAndel: FunctionComponent<OwnProps & WrappedComponentProps> = ({
  fields,
  meta,
  alleKodeverk,
  readOnly,
  // getKodeverknavn,
}) => (
  <PeriodFieldArray
    shouldShowAddButton
    fields={fields}
    meta={meta}
    textCode="Ny andel"
    emptyPeriodTemplate={defaultAndel}
    readOnly={readOnly}
  >
    {(periodeElementFieldId, index, getRemoveButton) => (
      <FlexRow key={periodeElementFieldId}>
        <FlexColumn>
          <DecimalField
            name={`${periodeElementFieldId}.refusjon`}
            label={{ id: 'TilkjentYtelse.NyPeriode.Refusjon' }}
            validate={[required, minValue0, hasValidDecimal]}
            bredde="S"
            format={value => value}
            // @ts-ignore Fiks denne
            normalizeOnBlur={value => (Number.isNaN(value) ? value : parseFloat(value).toFixed(2))}
          />
        </FlexColumn>
        <FlexColumn>
          <InputField
            label={{ id: 'TilkjentYtelse.NyPeriode.Arbeidsforhold' }}
            name={`${periodeElementFieldId}.Arbeidsforhold`}
            bredde="l"
          />
        </FlexColumn>
        <FlexColumn>
          <SelectField
            label={{ id: 'TilkjentYtelse.NyPeriode.Inntektskategori' }}
            name={`${periodeElementFieldId}.inntektskategori`}
            bredde="l"
            selectValues={getInntektskategori(alleKodeverk)}
          />
        </FlexColumn>
        <FlexColumn>
          <DecimalField
            name={`${periodeElementFieldId}.utbetalingsgrad`}
            label={{ id: 'TilkjentYtelse.NyPeriode.Ubetalingsgrad' }}
            validate={[required, minValue0, maxValue200, hasValidDecimal]}
            bredde="S"
            format={value => value}
            // @ts-ignore Fiks denne
            normalizeOnBlur={value => (Number.isNaN(value) ? value : parseFloat(value).toFixed(2))}
          />
        </FlexColumn>
        <FlexColumn>{getRemoveButton()}</FlexColumn>
      </FlexRow>
    )}
  </PeriodFieldArray>
);

export default NyAndel;
