import React, { FunctionComponent } from 'react';
import { FieldArray, WrappedFieldArrayProps } from 'redux-form';
import { ArbeidsforholdPeriode, Arbeidsgiver as ArbeidsgiverType } from './UttakFaktaIndex2';
import Arbeidsforhold from './Arbeidsforhold';

interface ArbeidsgiverProps {
  oppdaterPerioder: (arbeidsgiversOrgNr: string, arbeidsforholdIndex: number, nyPeriode: ArbeidsforholdPeriode) => void;
  behandlingId: number;
  behandlingVersjon: number;
}

const Arbeidsgiver: FunctionComponent<WrappedFieldArrayProps<ArbeidsgiverType> & ArbeidsgiverProps> = ({
  fields,
  oppdaterPerioder,
  behandlingId,
  behandlingVersjon,
}) => (
  <>
    {fields.map((fieldId, index) => (
      <React.Fragment key={fieldId}>
        <FieldArray
          name={`${fieldId}.arbeidsforhold`}
          component={Arbeidsforhold}
          props={{ oppdaterPerioder, arbeidsgiver: fields.get(index), behandlingId, behandlingVersjon }}
        />
      </React.Fragment>
    ))}
  </>
);

export default Arbeidsgiver;
