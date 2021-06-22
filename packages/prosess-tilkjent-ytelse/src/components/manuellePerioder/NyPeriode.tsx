import React, { FC } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { FieldArray, InjectedFormProps } from 'redux-form';
import { Element } from 'nav-frontend-typografi';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { calcDaysAndWeeks, safeJSONParse, guid, hasValidPeriod, required } from '@fpsak-frontend/utils';
import { DatepickerField, behandlingForm, behandlingFormValueSelector } from '@fpsak-frontend/form';
import { FlexColumn, FlexContainer, FlexRow, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { KodeverkMedNavn, Periode, ArbeidsforholdV2, ArbeidsgiverOpplysningerPerId } from '@k9-sak-web/types';
import NyAndel from './NyAndel';

import styles from './periode.less';

interface OwnProps {
  newPeriodeResetCallback: (values: any) => any;
  newArbeidsforholdCallback: (values: any) => void;
  andeler: any[];
  nyPeriode: Periode;
  nyPeriodeDisabledDaysFom: string;
  alleKodeverk: { [key: string]: KodeverkMedNavn[] };
  arbeidsforhold: ArbeidsforholdV2[];
  arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId;
  readOnly: boolean;
  behandlingId: number;
  behandlingVersjon: number;
}

export const TilkjentYtelseNyPeriode: FC<OwnProps & InjectedFormProps> = ({
  newPeriodeResetCallback,
  newArbeidsforholdCallback,
  nyPeriode,
  readOnly,
  alleKodeverk,
  behandlingId,
  behandlingVersjon,
  arbeidsforhold,
  arbeidsgiverOpplysningerPerId,
  ...formProps
}) => {
  const numberOfDaysAndWeeks = calcDaysAndWeeks(nyPeriode.fom, nyPeriode.tom);
  return (
    <div className={styles.periodeContainer}>
      <div className={styles.periodeType}>
        <div className={styles.headerWrapper}>
          <Element>
            <FormattedMessage id="TilkjentYtelse.NyPeriode" />
          </Element>
        </div>
      </div>
      <div className={styles.periodeInnhold}>
        <VerticalSpacer eightPx />
        <FlexContainer wrap>
          <FlexRow wrap>
            <FlexColumn>
              <FlexRow>
                <FlexColumn>
                  <DatepickerField name="fom" label={{ id: 'TilkjentYtelse.NyPeriode.Fom' }} />
                </FlexColumn>
                <FlexColumn>
                  <DatepickerField name="tom" label={{ id: 'TilkjentYtelse.NyPeriode.Tom' }} />
                </FlexColumn>
                <FlexColumn className={styles.suffix}>
                  <div id="antallDager">
                    {nyPeriode.fom && (
                      <FormattedMessage
                        id={numberOfDaysAndWeeks.id.toString()}
                        values={{
                          weeks: numberOfDaysAndWeeks.weeks.toString(),
                          days: numberOfDaysAndWeeks.days.toString(),
                        }}
                      />
                    )}
                  </div>
                </FlexColumn>
              </FlexRow>
              <VerticalSpacer twentyPx />
              <FlexRow>
                <FlexColumn>
                  <FieldArray
                    name="andeler"
                    // @ts-ignore
                    component={NyAndel}
                    readOnly={readOnly}
                    alleKodeverk={alleKodeverk}
                    arbeidsforhold={arbeidsforhold}
                    arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
                    behandlingId={behandlingId}
                    behandlingVersjon={behandlingVersjon}
                    newArbeidsforholdCallback={newArbeidsforholdCallback}
                  />
                </FlexColumn>
              </FlexRow>
            </FlexColumn>
          </FlexRow>
        </FlexContainer>
        <VerticalSpacer twentyPx />

        <Hovedknapp
          className={styles.oppdaterMargin}
          htmlType="button"
          mini
          onClick={formProps.handleSubmit}
          spinner={formProps.submitting}
        >
          <FormattedMessage id="TilkjentYtelse.LeggTilPeriode" />
        </Hovedknapp>
        <Knapp htmlType="button" mini onClick={newPeriodeResetCallback}>
          <FormattedMessage id="TilkjentYtelse.Avbryt" />
        </Knapp>
      </div>
    </div>
  );
};

const transformValues = (values: any) => ({
  id: guid(),
  fom: values.fom,
  tom: values.tom,
  // refusjon: values.refusjon,
  andeler: values.andeler.map(andel => {
    const arbeidsForhold = safeJSONParse(andel.arbeidsgiver);

    const arbeidsgiverValues = {
      identifikator: arbeidsForhold.arbeidsgiver.arbeidsgiverOrgnr,
      identifikatorGUI: arbeidsForhold.arbeidsgiver.arbeidsgiverOrgnr,
      arbeidsforholdId: `${arbeidsForhold.arbeidsgiver.arbeidsgiverOrgnr}-${arbeidsForhold.arbeidsforhold.internArbeidsforholdId}`,
      arbeidsforholdRef: arbeidsForhold.arbeidsforhold.internArbeidsforholdId,
    };

    return {
      utbetalingsgrad: andel.utbetalingsgrad,
      // INNTEKTSKATEGORI
      inntektskategori: {
        kode: andel.inntektskategori,
        kodeverk: 'INNTEKTSKATEGORI',
      },
      refusjon: andel.refusjon,
      tilSoker: andel.tilSoker,
      // OPPTJENING_AKTIVITET_TYPE
      arbeidsgiver: arbeidsgiverValues,
      arbeidsgiverOrgnr: arbeidsgiverValues.identifikator,
      arbeidsforholdRef: arbeidsgiverValues.arbeidsforholdRef,
    };
  }),
  // lagtTilAvSaksbehandler: true,
});

const validateNyPeriodeForm = (values: any) => {
  const errors = {};
  if (!values) {
    return errors;
  }

  const invalid = required(values.fom) || hasValidPeriod(values.fom, values.tom);

  if (invalid) {
    return {
      fom: invalid,
    };
  }

  return errors;
};

interface PureOwnProps {
  newPeriodeCallback: (values: any) => void;
  behandlingId: number;
  behandlingVersjon: number;
  alleKodeverk: { [key: string]: KodeverkMedNavn[] };
}

const mapStateToPropsFactory = (_initialState: any, ownProps: PureOwnProps) => {
  const { newPeriodeCallback, behandlingId, behandlingVersjon } = ownProps;
  const onSubmit = (values: any) => newPeriodeCallback(transformValues(values));

  return (state: any) => ({
    initialValues: {
      fom: null,
      tom: null,
    },
    nyPeriode: behandlingFormValueSelector('nyPeriodeForm', behandlingId, behandlingVersjon)(state, 'fom', 'tom'),
    onSubmit,
  });
};

export default connect(mapStateToPropsFactory)(
  behandlingForm({
    form: 'nyPeriodeForm',
    validate: values => validateNyPeriodeForm(values),
    enableReinitialize: true,
  })(TilkjentYtelseNyPeriode),
);
