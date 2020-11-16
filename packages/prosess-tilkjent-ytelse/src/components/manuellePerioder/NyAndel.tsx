import React, { FunctionComponent } from 'react';
import { WrappedComponentProps } from 'react-intl';
import { FieldArrayFieldsProps } from 'redux-form';
import { FlexColumn, FlexRow, PeriodFieldArray } from '@fpsak-frontend/shared-components';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { InputField, SelectField } from '@fpsak-frontend/form';
import { hasValidDecimal, maxValue, minValue, required } from '@fpsak-frontend/utils';

const minValue0 = minValue(0);
const maxValue100 = maxValue(100);
const maxValue3999 = maxValue(3999);

const arbeidsForholdArray = [
  {
    identifikator: '910909088',
    identifikatorGUI: '910909088',
    navn: 'BEDRIFT AS',
  },
];

const mapArbeidsforhold = (arbeidsForhold: any) =>
  arbeidsForhold.map((andel: any, index) => {
    const { identifikator, navn } = andel;
    const key = `${navn}${index}`;
    return (
      <option value={`${identifikator}|${navn}`} key={key}>
        {navn} {identifikator}
      </option>
    );
  });

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
          <InputField
            label="Refusjon"
            name={`${periodeElementFieldId}.refusjon`}
            validate={[required, minValue0, maxValue3999, hasValidDecimal]}
            format={value => value}
          />
        </FlexColumn>
        <FlexColumn>
          <SelectField
            label="Arbeidsforhold"
            bredde="xl"
            name={`${periodeElementFieldId}.arbeidsgiver`}
            validate={[required]}
            selectValues={mapArbeidsforhold(arbeidsForholdArray)}
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
          <InputField
            label={{ id: 'TilkjentYtelse.NyPeriode.Ubetalingsgrad' }}
            name={`${periodeElementFieldId}.utbetalingsgrad`}
            validate={[required, minValue0, maxValue100, hasValidDecimal]}
            format={value => value}
          />
        </FlexColumn>
        <FlexColumn>{getRemoveButton()}</FlexColumn>
      </FlexRow>
    )}
  </PeriodFieldArray>
);

export default NyAndel;
