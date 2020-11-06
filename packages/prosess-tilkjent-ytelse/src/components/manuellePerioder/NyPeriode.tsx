import React, { FunctionComponent } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { FieldArray, InjectedFormProps } from 'redux-form';
import { Element } from 'nav-frontend-typografi';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';

import { calcDaysAndWeeks, guid, hasValidPeriod, required, hasValidDecimal, minValue } from '@fpsak-frontend/utils';

import { DecimalField, DatepickerField, behandlingForm, behandlingFormValueSelector } from '@fpsak-frontend/form';

import { FlexColumn, FlexContainer, FlexRow, VerticalSpacer } from '@fpsak-frontend/shared-components';

import { Kodeverk, KodeverkMedNavn } from '@k9-sak-web/types';
import NyAndel from './NyAndel';

import styles from './periode.less';

const minValue0 = minValue(0);

type NyPeriodeType = {
  fom: string;
  tom: string;
};

interface OwnProps {
  newPeriodeResetCallback: () => any;
  andeler: any[];
  nyPeriode: NyPeriodeType;
  nyPeriodeDisabledDaysFom: string;
  alleKodeverk: { [key: string]: KodeverkMedNavn[] };
  getKodeverknavn: (kodeverk: Kodeverk) => string;
}

export const UttakNyPeriode: FunctionComponent<OwnProps & InjectedFormProps> = ({
  newPeriodeResetCallback,
  nyPeriode,
  getKodeverknavn,
  // nyPeriodeDisabledDaysFom,
  // andeler,
  readOnly,
  alleKodeverk,
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
                  <DecimalField
                    name="dagsats"
                    label={{ id: 'TilkjentYtelse.NyPeriode.Dagsats' }}
                    validate={[required, minValue0, hasValidDecimal]}
                    bredde="S"
                    format={value => value}
                    // @ts-ignore Fiks denne
                    normalizeOnBlur={value => (Number.isNaN(value) ? value : parseFloat(value).toFixed(2))}
                  />
                </FlexColumn>
                <FlexColumn>
                  <FieldArray
                    name="andeler"
                    component={NyAndel}
                    readOnly={readOnly}
                    // andeler={andeler}
                    alleKodeverk={alleKodeverk}
                    getKodeverknavn={getKodeverknavn}
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

const transformValues = (values: any) => {
  return {
    id: guid(),
    fom: values.fom,
    tom: values.tom,
    dagsats: values.dagsats,
    andeler: values.andeler.map(andel => ({
      utbetalingsgrad: andel.utbetalingsgrad,
      // AKTIVITET_STATUS
      aktivitetStatus: { kode: andel.aktivitetStatus },
      mottaker: andel.mottaker,

      // INNTEKTSKATEGORI
      inntektskategori: { kode: andel.inntektskategori },
      stillingsprosent: 0,
      eksternArbeidsforholdId: null,
      refusjon: 0,
      sisteUtbetalingsdato: null,
      tilSoker: 0,
      // OPPTJENING_AKTIVITET_TYPE
      arbeidsforholdType: '-',
      arbeidsgiver: {
        identifikator: '890484832',
        navn: 'BEDRIFT2 AS',
      },
      aktørId: null,
      arbeidsforholdId: null,
      uttak: [
        {
          periode: {
            fom: values.fom,
            tom: values.tom,
          },
          utbetalingsgrad: andel.utbetalingsgrad,
          utfall: 'INNVILGET',
        },
      ],
    })),
    lagtTilAvSaksbehandler: true,
  };
};

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

const EMPTY_ARRAY = [];

interface PureOwnProps {
  newPeriodeCallback: (values: any) => void;
  uttakPeriodeVurderingTyper: KodeverkMedNavn[];
  getKodeverknavn: (kodeverk: Kodeverk) => string;
  andeler: any[];
  behandlingId: number;
  behandlingVersjon: number;
  alleKodeverk: { [key: string]: KodeverkMedNavn[] };
}

const mapStateToPropsFactory = (_initialState: any, ownProps: PureOwnProps) => {
  const { newPeriodeCallback, andeler, behandlingId, behandlingVersjon } = ownProps;

  const onSubmit = (values: any) => newPeriodeCallback(transformValues(values));

  return (state: any) => ({
    andeler: andeler || EMPTY_ARRAY,
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
  })(UttakNyPeriode),
);
