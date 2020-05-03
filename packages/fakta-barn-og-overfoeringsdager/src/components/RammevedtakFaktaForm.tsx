import React, { FunctionComponent, useMemo } from 'react';
import { FieldArray, InjectedFormProps, reset, change } from 'redux-form';
import { FormAction } from 'redux-form/lib/actions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { isEmpty } from 'lodash';
import {
  behandlingForm,
  getBehandlingFormPrefix,
  getBehandlingFormValues,
} from '@fpsak-frontend/form/src/behandlingForm';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import { VerticalSpacer } from '@fpsak-frontend/shared-components/index';
import { minLength, maxLength, required, hasValidText, hasValidDate } from '@fpsak-frontend/utils';
import { TextAreaField } from '@fpsak-frontend/form/index';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import OmsorgsdagerGrunnlagDto from '../dto/OmsorgsdagerGrunnlagDto';
import { mapDtoTilFormValues, mapFormValuesTilDto } from '../dto/mapping';
import { AlleBarn, BarnLagtTilAvSaksbehandler } from './AlleBarn';
import FormValues from '../types/FormValues';
import BegrunnBekreftTilbakestillSeksjon from './BegrunnBekreftTilbakestillSeksjon';
import MidlertidigAlene from './MidlertidigAlene';
import { OverføringsretningEnum, OverføringstypeEnum } from '../types/Overføring';
import { overføringerFormName, rammevedtakFormName } from './formNames';
import OverføringContainer from './OverføringContainer';

interface RammevedtakFaktaFormProps {
  omsorgsdagerGrunnlag: OmsorgsdagerGrunnlagDto;
  behandlingId: number;
  behandlingVersjon: number;
  submitCallback: (values: any) => void;
  readOnly?: boolean;
  formValues?: FormValues;
  resetForm?: (formName: string) => void;
  changeForm?: (
    form: string,
    field: string,
    value: any,
    touch?: boolean,
    persistentSubmitErrors?: boolean,
  ) => FormAction;
}

const RammevedtakFaktaForm: FunctionComponent<RammevedtakFaktaFormProps & InjectedFormProps> = ({
  omsorgsdagerGrunnlag,
  formValues,
  pristine,
  handleSubmit,
  resetForm,
  behandlingId,
  behandlingVersjon,
  readOnly,
  changeForm,
}) => {
  const { utvidetRett, uidentifiserteRammevedtak = [] } = omsorgsdagerGrunnlag;
  const utvidetRettUidentifiserteBarnAntall = useMemo(
    () => utvidetRett.filter(ur => !ur.fnrKroniskSyktBarn).filter(ur => !ur.idKroniskSyktBarn).length,
    [utvidetRett],
  );

  if (isEmpty(formValues)) {
    return null;
  }

  const behandlingFormPrefix = getBehandlingFormPrefix(behandlingId, behandlingVersjon);
  const formName = `${behandlingFormPrefix}.${rammevedtakFormName}`;
  const oppdaterForm = (felt, nyVerdi) => changeForm(formName, felt, nyVerdi);
  const tilbakestill = () => {
    resetForm(formName);
    Object.values(OverføringstypeEnum).forEach(type =>
      Object.values(OverføringsretningEnum).forEach(retning => {
        resetForm(`${behandlingFormPrefix}.${overføringerFormName(type, retning)}`);
      }),
    );
  };

  const {
    barn,
    barnLagtTilAvSaksbehandler,
    overføringGir,
    overføringFår,
    fordelingGir,
    fordelingFår,
    koronaoverføringGir,
    koronaoverføringFår,
    midlertidigAleneansvar,
  } = formValues;

  return (
    <form onSubmit={handleSubmit}>
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
      <OverføringContainer
        overføringFår={overføringFår}
        overføringGir={overføringGir}
        fordelingFår={fordelingFår}
        fordelingGir={fordelingGir}
        koronaoverføringFår={koronaoverføringFår}
        koronaoverføringGir={koronaoverføringGir}
        behandlingId={behandlingId}
        behandlingVersjon={behandlingVersjon}
        oppdaterForm={oppdaterForm}
      />
      {!(barn.length || barnLagtTilAvSaksbehandler.length) && <FormattedMessage id="FaktaRammevedtak.Barn.IngenBarn" />}
      <FieldArray name="barn" component={AlleBarn} props={{ barn, readOnly }} />
      <FieldArray
        name="barnLagtTilAvSaksbehandler"
        component={BarnLagtTilAvSaksbehandler}
        props={{ barn: barnLagtTilAvSaksbehandler, readOnly }}
      />
      <MidlertidigAlene readOnly={readOnly} midlertidigAleneVerdi={midlertidigAleneansvar.erMidlertidigAlene} />
      {!pristine && (
        <>
          <VerticalSpacer twentyPx />
          <BegrunnBekreftTilbakestillSeksjon
            begrunnField={
              <TextAreaField
                label={<FormattedMessage id="FaktaRammevedtak.Begrunnelse" />}
                name="begrunnelse"
                validate={[required, minLength(3), maxLength(400), hasValidText]}
              />
            }
            bekreftKnapp={
              <Hovedknapp onClick={handleSubmit}>
                <FormattedMessage id="FaktaRammevedtak.Bekreft" />
              </Hovedknapp>
            }
            tilbakestillKnapp={
              <Knapp htmlType="button" mini onClick={tilbakestill}>
                <FormattedMessage id="FaktaRammevedtak.Tilbakestill" />
              </Knapp>
            }
          />
        </>
      )}
    </form>
  );
};

const validate = (values: FormValues) => {
  if (isEmpty(values)) {
    return {};
  }
  const { midlertidigAleneansvar } = values;
  if (midlertidigAleneansvar.erMidlertidigAlene) {
    const req = required(midlertidigAleneansvar.tom);
    const tomError = req || hasValidDate(midlertidigAleneansvar.tom);
    if (tomError) {
      return {
        midlertidigAleneansvar: {
          tom: tomError,
        },
      };
    }
  }
  return {};
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
      validate,
      formValues,
    };
  };
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      resetForm: reset,
      changeForm: change,
    },
    dispatch,
  );

export default connect(
  mapStateToPropsFactory,
  mapDispatchToProps,
)(
  behandlingForm({
    form: rammevedtakFormName,
    enableReinitialize: true,
  })(RammevedtakFaktaForm),
);
