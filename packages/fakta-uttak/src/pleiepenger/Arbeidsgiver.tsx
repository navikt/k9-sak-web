import React, { FunctionComponent } from 'react';
import { FieldArray, WrappedFieldArrayProps } from 'redux-form';
import { Undertittel } from 'nav-frontend-typografi';
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
  ...behandlingProps
}) => (
  <>
    {fields.map((fieldId, index) => (
      <React.Fragment key={fieldId}>
        <Undertittel>{fields.get(index).navn}</Undertittel>
        <FieldArray
          name={`${fieldId}.arbeidsforhold`}
          component={Arbeidsforhold}
          props={{ oppdaterPerioder, arbeidsgiver: fields.get(index), ...behandlingProps }}
        />
      </React.Fragment>
    ))}
  </>
);

export default Arbeidsgiver;
