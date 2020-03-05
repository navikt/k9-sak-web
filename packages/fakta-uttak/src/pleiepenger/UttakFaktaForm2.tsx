import React, { createContext, FunctionComponent, useContext, useMemo, useState } from 'react';
import { connect } from 'react-redux';
import { InjectedFormProps, change as reduxFormChange, reset } from 'redux-form';
import { bindActionCreators } from 'redux';
import { FormAction } from 'redux-form/lib/actions';
import Hovedknapp from 'nav-frontend-knapper/lib/hovedknapp';
import { minLength, maxLength, required, hasValidText } from '@fpsak-frontend/utils';
import {
  behandlingForm,
  getBehandlingFormPrefix,
  behandlingFormValueSelector,
} from '@fpsak-frontend/fp-felles/src/behandlingForm';
import { createSelector } from 'reselect';
import { FormattedMessage, useIntl } from 'react-intl';
import VerticalSpacer from '@fpsak-frontend/shared-components/src/VerticalSpacer';
import FlexRow from '@fpsak-frontend/shared-components/src/flexGrid/FlexRow';
import { TextAreaField } from '@fpsak-frontend/form';
import { Knapp } from 'nav-frontend-knapper';
import { Arbeidsforhold, ArbeidsforholdPeriode, Arbeidsgiver as ArbeidsgiverType } from './UttakFaktaIndex2';
import Arbeidsgiver from './Arbeidsgiver';
import { beregnNyePerioder } from './uttakUtils';
import styles from './uttakFaktaForm.less';
import ValgtPeriode from './ValgtPeriode';
import UttakFormKolonne from './UttakFormKolonne';
import Perioder from './Perioder';
import { nyArbeidsperiodeFormName } from './NyArbeidsperiode';

export const uttakFaktaFormName = 'UttakFaktaForm';

interface UttakContextProps {
  valgtArbeidsgiversOrgNr?: string;
  setValgtArbeidsgiversOrgNr?: (orgNr: string) => void;
  valgtArbeidsforholdId?: string;
  setValgtArbeidsforholdId?: (arbeidsforholdId: string) => void;
  valgtPeriodeIndex?: number;
  setValgtPeriodeIndex?: (periodeIndex: number) => void;
  redigererPeriode?: boolean;
  setRedigererPeriode: (redigererPeriode: boolean) => void;
}

export const UttakFaktaFormContext = createContext<UttakContextProps>(null);
export function useUttakContext() {
  return useContext(UttakFaktaFormContext);
}

interface UttakFaktaFormProps {
  arbeidsgivere: ArbeidsgiverType[];
  behandlingId: number;
  behandlingVersjon: number;
  submitCallback: (values: ArbeidsgiverType[]) => void;
  behandlingFormPrefix?: string;
  reduxFormChange?: (
    form: string,
    field: string,
    value: any,
    touch?: boolean,
    persistentSubmitErrors?: boolean,
  ) => FormAction;
  resetForm: (formName: string) => void;
}

const UttakFaktaForm: FunctionComponent<UttakFaktaFormProps & InjectedFormProps> = ({
  handleSubmit,
  arbeidsgivere,
  behandlingFormPrefix,
  reduxFormChange: formChange,
  behandlingVersjon,
  behandlingId,
  resetForm,
  ...formProps
}) => {
  const intl = useIntl();
  const [valgtArbeidsgiversOrgNr, setValgtArbeidsgiversOrgNr] = useState<string>(null);
  const [valgtArbeidsforholdId, setValgtArbeidsforholdId] = useState<string>(null);
  const [valgtPeriodeIndex, setValgtPeriodeIndex] = useState<number>(null);
  const [redigererPeriode, setRedigererPeriode] = useState<boolean>();

  const valgtArbeidsforhold = useMemo<Arbeidsforhold>(() => {
    return arbeidsgivere
      ?.find(arbeidsgiver => arbeidsgiver.organisasjonsnummer === valgtArbeidsgiversOrgNr)
      ?.arbeidsforhold.find(forhold => forhold.arbeidsgiversArbeidsforholdId === valgtArbeidsforholdId);
  }, [arbeidsgivere, valgtArbeidsgiversOrgNr]);

  const formContext: UttakContextProps = {
    valgtArbeidsgiversOrgNr,
    setValgtArbeidsgiversOrgNr,
    valgtArbeidsforholdId,
    setValgtArbeidsforholdId,
    valgtPeriodeIndex,
    setValgtPeriodeIndex,
    redigererPeriode,
    setRedigererPeriode,
  };
  const { pristine } = formProps;

  // TODO: slå sammen perioder hvis de er tilstøtende og timer-inputs er like
  const oppdaterPerioder = (nyPeriode: ArbeidsforholdPeriode) => {
    let nyePerioder;
    const oppdatert = arbeidsgivere.map(arbeidsgiver => {
      if (arbeidsgiver.organisasjonsnummer === valgtArbeidsgiversOrgNr) {
        return {
          ...arbeidsgiver,
          arbeidsforhold: arbeidsgiver.arbeidsforhold.map(arbeidsforhold => {
            if (arbeidsforhold.arbeidsgiversArbeidsforholdId === valgtArbeidsforholdId) {
              nyePerioder = beregnNyePerioder(arbeidsforhold.perioder, nyPeriode);
              const nyPeriodeIndex = nyePerioder.reduce(
                (tmpIndex: number, periode: ArbeidsforholdPeriode, index: number) => {
                  if (
                    periode.fom === nyPeriode.fom &&
                    periode.tom === nyPeriode.tom &&
                    periode.timerIJobbTilVanlig === nyPeriode.timerIJobbTilVanlig &&
                    periode.timerFårJobbet === nyPeriode.timerFårJobbet
                  ) {
                    return index;
                  }
                  return tmpIndex;
                },
                null,
              );

              setValgtPeriodeIndex(nyPeriodeIndex);

              return {
                ...arbeidsforhold,
                perioder: nyePerioder,
              };
            }
            return arbeidsforhold;
          }),
        };
      }
      return arbeidsgiver;
    });
    formChange(`${behandlingFormPrefix}.${uttakFaktaFormName}`, 'arbeidsgivere', oppdatert);
  };

  if (!arbeidsgivere) {
    return <div>Laster?</div>; // TODO
  }

  const avbrytSkjemaInnfylling = () => {
    return undefined; // TODO: bekrefte avbryt (i f eks en modal), og så resetForm
  };

  return (
    <form onSubmit={handleSubmit}>
      <UttakFaktaFormContext.Provider value={formContext}>
        <FlexRow>
          <UttakFormKolonne tittel={intl.formatMessage({ id: 'FaktaOmUttakForm.Arbeidsgivere' })} withBorderRight>
            <div className={styles.arbeidsgivere}>
              {arbeidsgivere.map(arbeidsgiver => (
                <Arbeidsgiver arbeidsgiver={arbeidsgiver} key={arbeidsgiver.organisasjonsnummer} />
              ))}
            </div>
          </UttakFormKolonne>
          <UttakFormKolonne tittel={intl.formatMessage({ id: 'FaktaOmUttakForm.Perioder' })} withBorderRight>
            <Perioder
              valgtArbeidsforhold={valgtArbeidsforhold}
              leggTilPeriode={() => {
                setValgtPeriodeIndex(null);
                setRedigererPeriode(true);
              }}
              buttonDisabled={redigererPeriode}
            />
          </UttakFormKolonne>
          <UttakFormKolonne tittel={intl.formatMessage({ id: 'FaktaOmUttakForm.Periodedetaljer' })}>
            <ValgtPeriode
              redigererPeriode={redigererPeriode}
              behandlingVersjon={behandlingVersjon}
              behandlingId={behandlingId}
              oppdaterPerioder={oppdaterPerioder}
              endreValgtPeriodeCallback={() => {
                setRedigererPeriode(true);
              }}
              avbryt={() => {
                resetForm(`${getBehandlingFormPrefix(behandlingId, behandlingVersjon)}.${nyArbeidsperiodeFormName}`);
                setRedigererPeriode(false);
              }}
              arbeidsgivere={arbeidsgivere}
            />
          </UttakFormKolonne>
        </FlexRow>
      </UttakFaktaFormContext.Provider>
      {!pristine && (
        <>
          <VerticalSpacer twentyPx />
          <FlexRow className={styles.bekreftelseContainer}>
            <div className={styles.textAreaStyle}>
              <TextAreaField
                label={intl.formatMessage({ id: 'FaktaOmUttakForm.Begrunnelse' })}
                name="begrunnelse"
                validate={[required, minLength(3), maxLength(400), hasValidText]}
                textareaClass={styles.textAreaStyle}
              />
            </div>
            <VerticalSpacer sixteenPx />
            <FlexRow className={styles.submittKnapper}>
              <Knapp htmlType="button" mini onClick={avbrytSkjemaInnfylling}>
                <FormattedMessage id="FaktaOmUttakForm.Avbryt" />
              </Knapp>
              <Hovedknapp onClick={handleSubmit}>
                {intl.formatMessage({ id: 'SubmitButton.ConfirmInformation' })}
              </Hovedknapp>
            </FlexRow>
          </FlexRow>
        </>
      )}
    </form>
  );
};

interface FormProps {
  initialValues: {
    arbeidsgivere: ArbeidsgiverType[];
  };
  behandlingFormPrefix: string;
  onSubmit: (values: any) => any;
}

const arbeidsgivereSelector = createSelector(
  [
    (state, ownProps) =>
      behandlingFormValueSelector(
        uttakFaktaFormName,
        ownProps.behandlingId,
        ownProps.behandlingVersjon,
      )(state, 'arbeidsgivere'),
  ],
  arbeidsgivere => arbeidsgivere,
);

const mapStateToPropsFactory = (
  _initialState: null,
  initialOwnProps: UttakFaktaFormProps,
): ((state, ownProps) => FormProps) => {
  const { behandlingId, behandlingVersjon, arbeidsgivere, submitCallback } = initialOwnProps;
  const onSubmit = (values: ArbeidsgiverType[]) => submitCallback(values);
  const initialValues = { arbeidsgivere };

  return (state, ownProps) => {
    const behandlingFormPrefix = getBehandlingFormPrefix(behandlingId, behandlingVersjon);

    return {
      initialValues,
      behandlingFormPrefix,
      onSubmit,
      arbeidsgivere: arbeidsgivereSelector(state, ownProps),
    };
  };
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      reduxFormChange,
      resetForm: reset,
    },
    dispatch,
  );

export default connect(
  mapStateToPropsFactory,
  mapDispatchToProps,
)(
  behandlingForm({
    form: uttakFaktaFormName,
    enableReinitialize: true,
  })(UttakFaktaForm),
);
