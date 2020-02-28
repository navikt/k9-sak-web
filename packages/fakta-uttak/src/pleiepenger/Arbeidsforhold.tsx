import React, { FunctionComponent, useState } from 'react';
import { FieldArray, WrappedFieldArrayProps, reset } from 'redux-form';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import FlexRow from '@fpsak-frontend/shared-components/src/flexGrid/FlexRow';
import FlexColumn from '@fpsak-frontend/shared-components/src/flexGrid/FlexColumn';
import { Normaltekst } from 'nav-frontend-typografi';
import Flatknapp from 'nav-frontend-knapper/lib/flatknapp';
import { FormattedMessage, useIntl } from 'react-intl';
import { VerticalSpacer } from '@fpsak-frontend/shared-components/index';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { getBehandlingFormPrefix } from '@fpsak-frontend/fp-felles/src/behandlingFormTS';
import { Arbeidsforhold as ArbeidsforholdType, ArbeidsforholdPeriode, Arbeidsgiver } from './UttakFaktaIndex2';
import NyArbeidsperiode from './NyArbeidsperiode';
import Arbeidsperioder from './Arbeidsperioder';
import styles from './arbeidsforhold.less';
import { uttakFaktaFormName } from './UttakFaktaForm2';

interface EttArbeidsforholdOwnProps {
  arbeidsgiver: Arbeidsgiver;
  arbeidsforhold: ArbeidsforholdType;
  oppdaterPerioder: (nyPeriode: ArbeidsforholdPeriode) => ArbeidsforholdPeriode[];
  behandlingId: number;
  behandlingVersjon: number;
  resetForm: (formName: string) => void;
  fieldId: string;
  formName: string;
}

const EttArbeidsforhold: FunctionComponent<EttArbeidsforholdOwnProps> = ({
  fieldId,
  arbeidsforhold,
  arbeidsgiver,
  behandlingId,
  behandlingVersjon,
  oppdaterPerioder,
  resetForm,
  formName,
}) => {
  const intl = useIntl();
  const [lagerNyPeriode, setLagerNyPeriode] = useState<boolean>(false);

  return (
    <div className={styles.arbeidsforhold}>
      <Ekspanderbartpanel tittel={`${arbeidsforhold.stillingsnavn} (${arbeidsgiver.navn})`}>
        <FlexRow>
          <FlexColumn>
            <Normaltekst>
              <FormattedMessage id="FaktaOmUttakForm.Perioder" />
            </Normaltekst>
          </FlexColumn>
        </FlexRow>
        <FieldArray props={{ readOnly: true }} name={`${fieldId}.perioder`} component={Arbeidsperioder} />
        {!lagerNyPeriode && (
          <>
            <VerticalSpacer sixteenPx />
            <Flatknapp mini htmlType="button" onClick={() => setLagerNyPeriode(true)} form="kompakt">
              {intl.formatMessage({ id: 'FaktaOmUttakForm.EndrePeriode' })}
            </Flatknapp>
          </>
        )}
        {lagerNyPeriode && (
          <>
            <VerticalSpacer twentyPx />
            <NyArbeidsperiode
              id={formName}
              oppdaterPerioder={oppdaterPerioder}
              behandlingVersjon={behandlingVersjon}
              behandlingId={behandlingId}
              avbryt={() => {
                setLagerNyPeriode(false);
                resetForm(
                  `${getBehandlingFormPrefix(behandlingId, behandlingVersjon)}.${uttakFaktaFormName}-${formName}`,
                );
              }}
            />
            <VerticalSpacer twentyPx />
          </>
        )}
      </Ekspanderbartpanel>
    </div>
  );
};

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      resetForm: reset,
    },
    dispatch,
  );

const EttArbeidsforholdImpl = connect(null, mapDispatchToProps)(EttArbeidsforhold);

interface ArbeidsforholdOwnProps {
  arbeidsgiver: Arbeidsgiver;
  oppdaterPerioder: (
    arbeidsgiversOrgNr: string,
    arbeidsforholdIndex: number,
    nyPeriode: ArbeidsforholdPeriode,
  ) => ArbeidsforholdPeriode[];
  behandlingId: number;
  behandlingVersjon: number;
  resetForm: (formName: string) => void;
}

const Arbeidsforhold: FunctionComponent<WrappedFieldArrayProps<ArbeidsforholdType> & ArbeidsforholdOwnProps> = ({
  fields,
  oppdaterPerioder,
  arbeidsgiver,
  behandlingVersjon,
  behandlingId,
}) => {
  const formName = formIndex => `${arbeidsgiver.organisasjonsnummer}-${formIndex}`;

  return (
    <>
      {fields.map((fieldId, index) => (
        <EttArbeidsforholdImpl
          arbeidsforhold={fields.get(index)}
          behandlingId={behandlingId}
          behandlingVersjon={behandlingVersjon}
          arbeidsgiver={arbeidsgiver}
          fieldId={fieldId}
          oppdaterPerioder={(nyPeriode: ArbeidsforholdPeriode) =>
            oppdaterPerioder(arbeidsgiver.organisasjonsnummer, index, nyPeriode)
          }
          formName={formName(index)}
        />
      ))}
    </>
  );
};

export default Arbeidsforhold;
