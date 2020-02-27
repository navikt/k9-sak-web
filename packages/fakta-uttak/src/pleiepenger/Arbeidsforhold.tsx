import React, { FunctionComponent, useState } from 'react';
import { FieldArray, WrappedFieldArrayProps } from 'redux-form';
import FlexRow from '@fpsak-frontend/shared-components/src/flexGrid/FlexRow';
import FlexColumn from '@fpsak-frontend/shared-components/src/flexGrid/FlexColumn';
import { Normaltekst } from 'nav-frontend-typografi';
import Flatknapp from 'nav-frontend-knapper/lib/flatknapp';
import { FormattedMessage, useIntl } from 'react-intl';
import { VerticalSpacer } from '@fpsak-frontend/shared-components/index';
import { Arbeidsforhold as ArbeidsforholdType, ArbeidsforholdPeriode, Arbeidsgiver } from './UttakFaktaIndex2';
import NyArbeidsperiode from './NyArbeidsperiode';
import Arbeidsperioder from './Arbeidsperioder';

interface ArbeidsforholdOwnProps {
  arbeidsgiver: Arbeidsgiver;
  oppdaterPerioder: (
    arbeidsgiversOrgNr: string,
    arbeidsforholdIndex: number,
    nyPeriode: ArbeidsforholdPeriode,
  ) => ArbeidsforholdPeriode[];
  behandlingId: number;
  behandlingVersjon: number;
}

const Arbeidsforhold: FunctionComponent<WrappedFieldArrayProps<ArbeidsforholdType> & ArbeidsforholdOwnProps> = ({
  fields,
  oppdaterPerioder,
  arbeidsgiver,
  behandlingVersjon,
  behandlingId,
}) => {
  const intl = useIntl();
  const [lagerNyPeriode, setLagerNyPeriode] = useState(false);

  return (
    <>
      {fields.map((fieldId, index) => (
        <React.Fragment key={fieldId}>
          <Normaltekst>{fields.get(index).stillingsnavn}</Normaltekst>
          <FlexRow>
            <FlexColumn>
              <Normaltekst>
                <FormattedMessage id="FaktaOmUttakForm.Perioder" />
              </Normaltekst>
            </FlexColumn>
          </FlexRow>
          <FieldArray props={{ readOnly: true }} name={`${fieldId}.perioder`} component={Arbeidsperioder} />
          {!lagerNyPeriode && (
            <Flatknapp mini htmlType="button" onClick={() => setLagerNyPeriode(true)} form="kompakt">
              {intl.formatMessage({ id: 'FaktaOmUttakForm.EndrePeriode' })}
            </Flatknapp>
          )}
          {lagerNyPeriode && (
            <>
              <VerticalSpacer twentyPx />
              <NyArbeidsperiode
                id={`${arbeidsgiver.organisasjonsnummer}-${index}`}
                oppdaterPerioder={(nyPeriode: ArbeidsforholdPeriode) =>
                  oppdaterPerioder(arbeidsgiver.organisasjonsnummer, index, nyPeriode)
                }
                behandlingVersjon={behandlingVersjon}
                behandlingId={behandlingId}
                avbryt={() => setLagerNyPeriode(false)}
              />
              <VerticalSpacer twentyPx />
            </>
          )}
        </React.Fragment>
      ))}
    </>
  );
};

export default Arbeidsforhold;
