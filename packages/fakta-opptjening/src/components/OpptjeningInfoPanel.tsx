import { behandlingForm } from '@fpsak-frontend/form';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { addDaysToDate, omit } from '@fpsak-frontend/utils';
import { Aksjonspunkt, SubmitCallback, UtlandDokStatus, ArbeidsgiverOpplysningerPerId } from '@k9-sak-web/types';
import AlleKodeverk from '@k9-sak-web/types/src/kodeverk';
import OpptjeningAktivitet from '@k9-sak-web/types/src/opptjening/opptjeningAktivitet';
import moment from 'moment';
import React from 'react';
import { connect } from 'react-redux';
import { InjectedFormProps } from 'redux-form';
import { createSelector } from 'reselect';
import OpptjeningFaktaForm from './OpptjeningFaktaForm';

export const formName = 'OpptjeningInfoPanel';

interface OpptjeningInfoPanelProps {
  behandlingId: number;
  behandlingVersjon: number;
  opptjeningAktiviteter: OpptjeningAktivitet[];
  fastsattOpptjening: OpptjeningAktivitet;
  aksjonspunkter: Aksjonspunkt[];
  alleMerknaderFraBeslutter: any;
  utlandDokStatus: UtlandDokStatus;
  alleKodeverk: AlleKodeverk;
  arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId;
  submitCallback: (props: SubmitCallback[]) => void;
  readOnly: boolean;
  harApneAksjonspunkter: boolean;
  submittable: boolean;
  dokStatus: string;
}

interface StateProps {
  aksjonspunkt: Aksjonspunkt;
}

/**
 * OpptjeningInfoPanel
 *
 * Presentasjonskomponent. Har ansvar for å sette opp Redux Formen for Opptjeningsvilkåret.
 */

export const OpptjeningInfoPanel = ({
  harApneAksjonspunkter,
  readOnly,
  aksjonspunkt,
  behandlingId,
  behandlingVersjon,
  fastsattOpptjening,
  dokStatus,
  alleMerknaderFraBeslutter,
  alleKodeverk,
  arbeidsgiverOpplysningerPerId,
  submitting,
  dirty,
  handleSubmit,
}: Partial<OpptjeningInfoPanelProps> & InjectedFormProps & StateProps) => (
  <form onSubmit={handleSubmit}>
    <OpptjeningFaktaForm
      behandlingId={behandlingId}
      behandlingVersjon={behandlingVersjon}
      opptjeningFomDato={fastsattOpptjening?.opptjeningFom}
      opptjeningTomDato={fastsattOpptjening?.opptjeningTom}
      dokStatus={dokStatus}
      readOnly={readOnly}
      harApneAksjonspunkter={harApneAksjonspunkter}
      hasAksjonspunkt={aksjonspunkt !== undefined}
      formName={formName}
      submitting={submitting}
      isDirty={dirty}
      alleMerknaderFraBeslutter={alleMerknaderFraBeslutter}
      alleKodeverk={alleKodeverk}
      arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
    />
  </form>
);

const addDay = (date: string) => addDaysToDate(date, 1);
const getOpptjeningsperiodeIfEqual = (activityDate: string, opptjeningsperiodeDate: string) =>
  moment(addDay(activityDate)).isSame(opptjeningsperiodeDate) ? opptjeningsperiodeDate : activityDate;

const buildPeriod = (activity: OpptjeningAktivitet, opptjeningsperiodeFom: string, opptjeningsperiodeTom: string) => {
  const fomDate = moment(activity.opptjeningFom).isBefore(opptjeningsperiodeFom)
    ? opptjeningsperiodeFom
    : getOpptjeningsperiodeIfEqual(activity.opptjeningFom, opptjeningsperiodeTom);
  const tomDate = moment(activity.opptjeningTom).isAfter(opptjeningsperiodeTom)
    ? opptjeningsperiodeTom
    : getOpptjeningsperiodeIfEqual(activity.opptjeningTom, opptjeningsperiodeFom);
  return {
    originalFom: activity.opptjeningFom,
    originalTom: activity.opptjeningTom,
    opptjeningFom: fomDate,
    opptjeningTom: tomDate,
  };
};

export const buildInitialValues = createSelector(
  [
    (ownProps: OpptjeningInfoPanelProps) => ownProps.opptjeningAktiviteter,
    (ownProps: OpptjeningInfoPanelProps) => ownProps.fastsattOpptjening,
    (ownProps: OpptjeningInfoPanelProps) => ownProps.aksjonspunkter,
  ],
  (opptjeningActivities, fastsattOpptjening, aksjonspunkter) =>
    fastsattOpptjening &&
    fastsattOpptjening.opptjeningFom && {
      opptjeningActivities: opptjeningActivities
        .filter(oa => moment(fastsattOpptjening.opptjeningFom).isBefore(addDay(oa.opptjeningTom)))
        .filter(oa => moment(oa.opptjeningFom).isBefore(addDay(fastsattOpptjening.opptjeningTom)))
        .map((oa, index) => ({
          ...oa,
          ...buildPeriod(oa, fastsattOpptjening.opptjeningFom, fastsattOpptjening.opptjeningTom),
          id: index + 1,
        })),
      aksjonspunkt:
        aksjonspunkter.filter(ap => ap.definisjon === aksjonspunktCodes.VURDER_PERIODER_MED_OPPTJENING) || null,
      fastsattOpptjening,
    },
);

const transformPeriod = (
  activity: OpptjeningAktivitet,
  opptjeningsperiodeFom: string,
  opptjeningsperiodeTom: string,
) => {
  let fomDate = activity.opptjeningFom;
  if (activity.originalFom && moment(activity.originalFom).isBefore(opptjeningsperiodeFom)) {
    fomDate = fomDate === opptjeningsperiodeFom ? activity.originalFom : fomDate;
  }
  let tomDate = activity.opptjeningTom;
  if (activity.originalTom && moment(activity.originalTom).isAfter(opptjeningsperiodeTom)) {
    tomDate = tomDate === opptjeningsperiodeTom ? activity.originalTom : tomDate;
  }

  return {
    ...activity,
    opptjeningFom: fomDate,
    opptjeningTom: tomDate,
  };
};

interface Values {
  opptjeningActivities: OpptjeningAktivitet[];
  fastsattOpptjening: OpptjeningAktivitet;
  aksjonspunkt: Aksjonspunkt[];
}

const transformValues = (values: Values) => ({
  opptjeningAktivitetList:
    values.fastsattOpptjening &&
    values.fastsattOpptjening.opptjeningFom &&
    values.opptjeningActivities
      .map(oa =>
        transformPeriod(
          oa,
          addDay(values.fastsattOpptjening.opptjeningFom),
          addDay(values.fastsattOpptjening.opptjeningTom),
        ),
      )
      .map(oa => omit(oa, 'id')),
  kode: values.aksjonspunkt[0].definisjon,
  begrunnelse: '',
});

const mapStateToPropsFactory = (initialState, { submitCallback }: OpptjeningInfoPanelProps) => {
  const onSubmit = values => submitCallback([transformValues(values)]);
  return (state, ownProps) => ({
    aksjonspunkt: ownProps.aksjonspunkter[0],
    initialValues: buildInitialValues(ownProps),
    dirty: !ownProps.notSubmittable && ownProps.dirty,
    onSubmit,
  });
};

export default connect(mapStateToPropsFactory)(
  behandlingForm({
    form: formName,
  })(OpptjeningInfoPanel),
);
