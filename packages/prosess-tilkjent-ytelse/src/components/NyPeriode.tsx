import React, { FunctionComponent } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { InjectedFormProps } from 'redux-form';
import { Element } from 'nav-frontend-typografi';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';

import { DatepickerField, behandlingForm, behandlingFormValueSelector } from '@fpsak-frontend/form';
import { calcDaysAndWeeks, guid, hasValidPeriod, required } from '@fpsak-frontend/utils';
import { FlexColumn, FlexContainer, FlexRow, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { Kodeverk, KodeverkMedNavn } from '@k9-sak-web/types';

import styles from './nyPeriode.less';

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
  // getKodeverknavn,
  // nyPeriodeDisabledDaysFom,
  // andeler,
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
                  <DatepickerField name="fom" label="Fra" />
                </FlexColumn>
                <FlexColumn>
                  <DatepickerField name="tom" label="Til" />
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
    isFromSøknad: false,
    andeler: [],
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
  const {
    newPeriodeCallback,
    // getKodeverknavn,
    andeler,
    behandlingId,
    behandlingVersjon,
    // alleKodeverk,
  } = ownProps;

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
