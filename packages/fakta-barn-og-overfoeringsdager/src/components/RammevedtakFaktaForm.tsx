import React, { FunctionComponent, useMemo } from 'react';
import { FieldArray, InjectedFormProps, reset } from 'redux-form';
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
import { OverføringsretningEnum } from '../types/Overføring';
import OverføringsdagerPanelgruppe from './OverføringsdagerPanelgruppe';

interface RammevedtakFaktaFormProps {
  omsorgsdagerGrunnlag: OmsorgsdagerGrunnlagDto;
  behandlingId: number;
  behandlingVersjon: number;
  submitCallback: (values: any) => void;
  readOnly?: boolean;
  formValues?: FormValues;
  resetForm?: (formName: string) => void;
}

const rammevedtakFormName = 'rammevedtakFormName';

const RammevedtakFaktaForm: FunctionComponent<RammevedtakFaktaFormProps & InjectedFormProps> = ({
  omsorgsdagerGrunnlag,
  formValues,
  pristine,
  handleSubmit,
  resetForm,
  behandlingId,
  behandlingVersjon,
  readOnly,
}) => {
  const { utvidetRett, uidentifiserteRammevedtak = [] } = omsorgsdagerGrunnlag;
  const utvidetRettUidentifiserteBarnAntall = useMemo(
    () => utvidetRett.filter(ur => !ur.fnrKroniskSyktBarn).filter(ur => !ur.idKroniskSyktBarn).length,
    [utvidetRett],
  );

  if (isEmpty(formValues)) {
    return null;
  }

  const tilbakestill = () =>
    resetForm(`${getBehandlingFormPrefix(behandlingId, behandlingVersjon)}.${rammevedtakFormName}`);

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
      {!(barn.length || barnLagtTilAvSaksbehandler.length) && <FormattedMessage id="FaktaRammevedtak.Barn.IngenBarn" />}
      <FieldArray name="barn" component={AlleBarn} props={{ barn, readOnly }} />
      <FieldArray
        name="barnLagtTilAvSaksbehandler"
        component={BarnLagtTilAvSaksbehandler}
        props={{ barn: barnLagtTilAvSaksbehandler, readOnly }}
      />
      <OverføringsdagerPanelgruppe
        overføringer={overføringFår}
        fordelinger={fordelingFår}
        koronaoverføringer={koronaoverføringFår}
        retning={OverføringsretningEnum.INN}
      />
      <OverføringsdagerPanelgruppe
        overføringer={overføringGir}
        fordelinger={fordelingGir}
        koronaoverføringer={koronaoverføringGir}
        retning={OverføringsretningEnum.UT}
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
