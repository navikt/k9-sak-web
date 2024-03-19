import { DatepickerField, behandlingForm, behandlingFormValueSelector } from '@fpsak-frontend/form';
import { FlexColumn, FlexContainer, FlexRow, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { calcDaysAndWeeks, guid, hasValidPeriod, required } from '@fpsak-frontend/utils';
import { ArbeidsgiverOpplysningerPerId, KodeverkMedNavn, Periode } from '@k9-sak-web/types';
import { Button } from '@navikt/ds-react';
import { Element } from 'nav-frontend-typografi';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { FieldArray, InjectedFormProps } from 'redux-form';
import NyAndel from './NyAndel';
import styles from './periode.module.css';

interface OwnProps {
  newPeriodeResetCallback: (values: any) => any;
  newArbeidsgiverCallback: (values: any) => void;
  andeler: any[];
  nyPeriode: Periode;
  nyPeriodeDisabledDaysFom: string;
  alleKodeverk: { [key: string]: KodeverkMedNavn[] };
  arbeidsgivere: ArbeidsgiverOpplysningerPerId;
  readOnly: boolean;
  behandlingId: number;
  behandlingVersjon: number;
}

export const TilkjentYtelseNyPeriode = ({
  newPeriodeResetCallback,
  newArbeidsgiverCallback,
  nyPeriode,
  readOnly,
  andeler,
  alleKodeverk,
  behandlingId,
  behandlingVersjon,
  arbeidsgivere,
  ...formProps
}: OwnProps & InjectedFormProps) => {
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
                    // @ts-ignore
                    andeler={andeler}
                    alleKodeverk={alleKodeverk}
                    arbeidsgivere={arbeidsgivere}
                    behandlingId={behandlingId}
                    behandlingVersjon={behandlingVersjon}
                    newArbeidsgiverCallback={newArbeidsgiverCallback}
                    rerenderOnEveryChange
                  />
                </FlexColumn>
              </FlexRow>
            </FlexColumn>
          </FlexRow>
        </FlexContainer>
        <VerticalSpacer twentyPx />

        <Button
          variant="primary"
          className={styles.oppdaterMargin}
          type="button"
          size="small"
          onClick={formProps.handleSubmit}
          loading={formProps.submitting}
        >
          <FormattedMessage id="TilkjentYtelse.LeggTilPeriode" />
        </Button>
        <Button variant="secondary" type="button" size="small" onClick={newPeriodeResetCallback}>
          <FormattedMessage id="TilkjentYtelse.Avbryt" />
        </Button>
      </div>
    </div>
  );
};

const transformValues = (values: any) => ({
  id: guid(),
  fom: values.fom,
  tom: values.tom,
  andeler: values.andeler.map(andel => ({
    inntektskategori: {
      kode: andel.inntektskategori,
      kodeverk: 'INNTEKTSKATEGORI',
    },
    arbeidsgiverOrgnr: andel.arbeidsgiverOrgnr,
    tilSoker: andel.tilSoker,
    refusjon: andel.refusjon || 0,
    utbetalingsgrad: andel.utbetalingsgrad || 100,
  })),
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
    andeler: behandlingFormValueSelector('andeler', behandlingId, behandlingVersjon)(
      state,
      'tilSoker',
      'refusjon',
      'arbeidsgiver',
      'inntektskategori',
      'utbetalingsgrad',
    ),
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
