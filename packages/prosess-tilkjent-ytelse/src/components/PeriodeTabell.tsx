import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { change as reduxFormChange, FieldArray, getFormInitialValues, reset as reduxFormReset } from 'redux-form';
import PropTypes from 'prop-types';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { getBehandlingFormPrefix, behandlingFormValueSelector } from '@fpsak-frontend/form';
import { ariaCheck } from '@fpsak-frontend/utils';
import {
  VerticalSpacer,
  FlexContainer,
  FlexRow,
  FlexColumn,
  AksjonspunktHelpText,
} from '@fpsak-frontend/shared-components';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import NyPeriode from './NyPeriode';

const FORM_NAME = 'TilkjentYtelseForm';

const Periode = ({ fields }) => {
  return (
    <div>
      {fields.map((fieldId: string, index: number, field: any[]) => {
        const periode = field.get(index);
        // console.info(periode);
        return (
          <div>
            {index}
            {JSON.stringify(periode.fom)}
            <hr />
          </div>
        );
      })}
    </div>
  );
};

export const PerioideTabell = ({
  readOnly,
  perioder,
  aksjonspunkter,
  submitting,
  hasOpenAksjonspunkter,
  getKodeverknavn,
  behandlingId,
  behandlingVersjon,
  alleKodeverk,
  behandlingFormPrefix,
}) => {
  const [isNyPeriodeFormOpen, setNyPeriodeFormOpen] = useState(false);

  const newPeriodeCallback = nyPeriode => {
    const newPerioder = perioder.concat(nyPeriode).sort((a: any, b: any) => a.fom.localeCompare(b.fom));

    reduxFormChange(`${behandlingFormPrefix}.${FORM_NAME}`, 'perioder', newPerioder);

    console.info(newPerioder);

    setNyPeriodeFormOpen(!isNyPeriodeFormOpen);
  };

  const newPeriodeResetCallback = () => {
    reduxFormReset(`${behandlingFormPrefix}.nyPeriodeForm`);
    setNyPeriodeFormOpen(!isNyPeriodeFormOpen);
  };

  const addNewPeriod = () => {
    newPeriodeResetCallback();
  };

  return (
    <FlexContainer>
      {!readOnly && (
        <AksjonspunktHelpText isAksjonspunktOpen={hasOpenAksjonspunkter}>
          {aksjonspunkter.map((ap: any) => (
            <FormattedMessage
              key={`UttakInfoPanel.Aksjonspunkt.${ap.definisjon.kode}`}
              id={`UttakInfoPanel.Aksjonspunkt.${ap.definisjon.kode}`}
            />
          ))}
        </AksjonspunktHelpText>
      )}
      <VerticalSpacer twentyPx />

      <FieldArray
        name="perioder"
        component={Periode}
        perioder={perioder}
        readOnly={readOnly}
        getKodeverknavn={getKodeverknavn}
        behandlingId={behandlingId}
        behandlingVersjon={behandlingVersjon}
        alleKodeverk={alleKodeverk}
      />

      <FlexRow>
        <FlexColumn>
          <Hovedknapp mini disabled={isNyPeriodeFormOpen} onClick={ariaCheck} spinner={submitting}>
            <FormattedMessage id="TilkjentYtelse.BekreftOgFortsett" />
          </Hovedknapp>
        </FlexColumn>
        <FlexColumn>
          <Knapp mini htmlType="button" onClick={() => addNewPeriod()} disabled={isNyPeriodeFormOpen}>
            <FormattedMessage id="TilkjentYtelse.LeggTilPeriode" />
          </Knapp>
        </FlexColumn>
      </FlexRow>

      {isNyPeriodeFormOpen && (
        <NyPeriode
          newPeriodeCallback={newPeriodeCallback}
          newPeriodeResetCallback={newPeriodeResetCallback}
          behandlingId={behandlingId}
          behandlingVersjon={behandlingVersjon}
          alleKodeverk={alleKodeverk}
        />
      )}
    </FlexContainer>
  );
};

PerioideTabell.propTypes = {
  readOnly: PropTypes.bool,
};

PerioideTabell.defaultProps = {
  readOnly: true,
};

const perioder = (state: any, behandlingId: number, behandlingVersjon: number) =>
  behandlingFormValueSelector(FORM_NAME, behandlingId, behandlingVersjon)(state, 'perioder');

export const transformValues = values => ({
  perioder: values.perioder,
  begrunnelse: '',
  kode: aksjonspunktCodes.MANUELL_VURDERING_VILKÅR,
});

interface PureOwnProps {
  behandlingId: number;
  behandlingVersjon: number;
}

const mapStateToProps = (state: any, props: PureOwnProps) => {
  const { behandlingId, behandlingVersjon } = props;
  const behandlingFormPrefix = getBehandlingFormPrefix(behandlingId, behandlingVersjon);

  return {
    behandlingFormPrefix,
    initialValues: getFormInitialValues(`${behandlingFormPrefix}.TilkjentYtelseForm`)(state),
    // slettedePerioder: slettedePerioder(state, behandlingId, behandlingVersjon) || EMPTY_ARRAY,
    perioder: perioder(state, behandlingId, behandlingVersjon) || [],
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  ...bindActionCreators(
    {
      reduxFormChange,
      reduxFormReset,
    },
    dispatch,
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(PerioideTabell);
