import React, { useState, FC } from 'react';
import { WrappedComponentProps } from 'react-intl';
import { FieldArrayFieldsProps, FieldArrayMetaProps } from 'redux-form';
import { FlexColumn, FlexRow, PeriodFieldArray } from '@fpsak-frontend/shared-components';
import { KodeverkMedNavn, InntektArbeidYtelse } from '@k9-sak-web/types';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { InputField, SelectField } from '@fpsak-frontend/form';
import { hasValidDecimal, maxValue, minValue, required } from '@fpsak-frontend/utils';
import { Knapp } from 'nav-frontend-knapper';
import NyttArbeidsforholdModal from './NyttArbeidsforholdModal';

const minValue0 = minValue(0);
const maxValue100 = maxValue(100);
const maxValue3999 = maxValue(3999);

const mapArbeidsforhold = (arbeidsForhold: any) =>
  arbeidsForhold.map((andel: any, index) => {
    const { arbeidsgiverIdentifikator, navn } = andel;
    const key = `${navn}${index}`;
    return (
      <option value={`${arbeidsgiverIdentifikator}|${navn}`} key={key}>
        {navn} {arbeidsgiverIdentifikator}
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

const defaultAndel = {
  fom: '',
  tom: '',
};

interface OwnProps {
  meta: FieldArrayMetaProps;
  readOnly: boolean;
  fields: FieldArrayFieldsProps<any>;
  alleKodeverk: { [key: string]: KodeverkMedNavn[] };
  inntektArbeidYtelse: InntektArbeidYtelse;
  nyeArbeidsforhold?: {
    navn: string;
    orgnr: number;
  };
}

export const NyAndel: FC<OwnProps & WrappedComponentProps> = ({
  fields,
  meta,
  alleKodeverk,
  readOnly,
  inntektArbeidYtelse,
  nyeArbeidsforhold,
  behandlingId,
  behandlingVersjon,
}) => {
  const [isOpen, setOpen] = useState(false);
  console.info(nyeArbeidsforhold);
  const arbeidsforhold = inntektArbeidYtelse?.arbeidsforhold || [];

  return (
    <>
      <PeriodFieldArray
        shouldShowAddButton
        fields={fields}
        meta={meta}
        textCode="TilkjentYtelse.NyAndel"
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
                selectValues={mapArbeidsforhold(arbeidsforhold)}
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

      <Knapp htmlType="button" onClick={() => setOpen(true)} mini>
        Nytt arbeidsforhold
      </Knapp>
      {isOpen && (
        <NyttArbeidsforholdModal
          showModal={isOpen}
          closeEvent={() => setOpen(false)}
          cancelEvent={() => setOpen(false)}
          behandlingId={behandlingId}
          behandlingVersjon={behandlingVersjon}
        />
      )}
    </>
  );
};

export default NyAndel;
