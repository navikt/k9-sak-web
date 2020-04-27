import React, { FunctionComponent, useMemo } from 'react';
import { FieldArray, InjectedFormProps } from 'redux-form';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { isEmpty } from 'lodash';
import {
  behandlingForm,
  getBehandlingFormPrefix,
  getBehandlingFormValues,
} from '@fpsak-frontend/form/src/behandlingForm';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import { Undertittel } from 'nav-frontend-typografi';
import { VerticalSpacer } from '@fpsak-frontend/shared-components/index';
import OmsorgsdagerGrunnlagDto from '../dto/OmsorgsdagerGrunnlagDto';
import { mapDtoTilFormValues, mapFormValuesTilDto } from '../dto/mapping';
import { AlleBarn, BarnLagtTilAvSaksbehandler } from './AlleBarn';
import FormValues from '../types/FormValues';

interface RammevedtakFaktaFormProps {
  omsorgsdagerGrunnlag: OmsorgsdagerGrunnlagDto;
  behandlingId: number;
  behandlingVersjon: number;
  submitCallback: (values: any) => void;
  readOnly?: boolean;
  formValues?: FormValues;
}

const rammevedtakFormName = 'rammevedtakFormName';

const RammevedtakFaktaForm: FunctionComponent<RammevedtakFaktaFormProps & InjectedFormProps> = ({
  omsorgsdagerGrunnlag,
  formValues,
}) => {
  const { utvidetRett, uidentifiserteRammevedtak = [] } = omsorgsdagerGrunnlag;
  const utvidetRettUidentifiserteBarnAntall = useMemo(
    () => utvidetRett.filter(ur => !ur.fnrKroniskSyktBarn).filter(ur => !ur.idKroniskSyktBarn).length,
    [utvidetRett],
  );

  if (isEmpty(formValues)) {
    return null;
  }

  const { barn, barnLagtTilAvSaksbehandler } = formValues;

  return (
    <>
      {uidentifiserteRammevedtak.length > 0 && (
        <>
          <AlertStripeAdvarsel>
            <FormattedMessage
              id="FaktaRammevedtak.UidentifiserteRammevedtak"
              values={{ antall: uidentifiserteRammevedtak.length }}
            />
          </AlertStripeAdvarsel>
          <VerticalSpacer sixteenPx />
        </>
      )}
      {utvidetRettUidentifiserteBarnAntall > 0 && (
        <>
          <AlertStripeAdvarsel>
            <FormattedMessage
              id="FaktaRammevedtak.UidentifisertUtvidetRett"
              values={{ antallRammevedtak: utvidetRettUidentifiserteBarnAntall }}
            />
          </AlertStripeAdvarsel>
          <VerticalSpacer sixteenPx />
        </>
      )}
      <Undertittel>
        <FormattedMessage id="FaktaRammevedtak.Barn" />
      </Undertittel>
      {!(barn.length || barnLagtTilAvSaksbehandler.length) && <FormattedMessage id="FaktaRammevedtak.Barn.IngenBarn" />}
      <FieldArray name="barn" component={AlleBarn} />
      <FieldArray name="barnLagtTilAvSaksbehandler" component={BarnLagtTilAvSaksbehandler} />
    </>
  );
};

const mapStateToPropsFactory = (_initialState, initialOwnProps: RammevedtakFaktaFormProps) => {
  const { submitCallback, omsorgsdagerGrunnlag } = initialOwnProps;
  const onSubmit = values => submitCallback(mapFormValuesTilDto(values, omsorgsdagerGrunnlag));

  return (state, { behandlingId, behandlingVersjon }: RammevedtakFaktaFormProps) => {
    const behandlingFormPrefix = getBehandlingFormPrefix(behandlingId, behandlingVersjon);
    const formValues = getBehandlingFormValues(rammevedtakFormName, behandlingId, behandlingVersjon)(state) || {};

    return {
      initialValues: mapDtoTilFormValues(omsorgsdagerGrunnlag),
      behandlingFormPrefix,
      onSubmit,
      formValues,
    };
  };
};

export default connect(mapStateToPropsFactory)(
  behandlingForm({
    form: rammevedtakFormName,
    enableReinitialize: true,
  })(RammevedtakFaktaForm),
);
