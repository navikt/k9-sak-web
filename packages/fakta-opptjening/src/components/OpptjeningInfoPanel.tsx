import { behandlingForm } from '@fpsak-frontend/form';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { addDaysToDate, omit } from '@fpsak-frontend/utils';
import { Aksjonspunkt, SubmitCallback, UtlandDokStatus } from '@k9-sak-web/types';
import AlleKodeverk from '@k9-sak-web/types/src/kodeverk';
import OpptjeningAktivitet from '@k9-sak-web/types/src/opptjening/opptjeningAktivitet';
import moment from 'moment';
import React from 'react';
import { connect } from 'react-redux';
import { InjectedFormProps } from 'redux-form';
import { createSelector } from 'reselect';
import OpptjeningFaktaForm from './OpptjeningFaktaForm';

export const formName = 'OpptjeningInfoPanel';

interface OpptjeningFaktaIndexProps {
  behandlingId: number;
  behandlingVersjon: number;
  opptjeningAktiviteter: OpptjeningAktivitet[];
  fastsattOpptjening: OpptjeningAktivitet;
  aksjonspunkter: Aksjonspunkt[];
  alleMerknaderFraBeslutter: any;
  utlandDokStatus: UtlandDokStatus;
  alleKodeverk: AlleKodeverk;
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
  submitting,
  dirty,
  handleSubmit,
}: OpptjeningFaktaIndexProps & InjectedFormProps & StateProps) => (
  <form onSubmit={handleSubmit}>
    <OpptjeningFaktaForm
      behandlingId={behandlingId}
      behandlingVersjon={behandlingVersjon}
      opptjeningFomDato={fastsattOpptjening.opptjeningFom}
      opptjeningTomDato={fastsattOpptjening.opptjeningTom}
      dokStatus={dokStatus}
      readOnly={readOnly}
      harApneAksjonspunkter={harApneAksjonspunkter}
      hasAksjonspunkt={aksjonspunkt !== undefined}
      formName={formName}
      submitting={submitting}
      isDirty={dirty}
      alleMerknaderFraBeslutter={alleMerknaderFraBeslutter}
      alleKodeverk={alleKodeverk}
    />
  </form>
);

const addDay = date => addDaysToDate(date, 1);
const getOpptjeningsperiodeIfEqual = (activityDate, opptjeningsperiodeDate) =>
  moment(addDay(activityDate)).isSame(opptjeningsperiodeDate) ? opptjeningsperiodeDate : activityDate;

const buildPeriod = (activity, opptjeningsperiodeFom, opptjeningsperiodeTom) => {
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
    (ownProps: OpptjeningFaktaIndexProps) => ownProps.opptjeningAktiviteter,
    (ownProps: OpptjeningFaktaIndexProps) => ownProps.fastsattOpptjening,
    (ownProps: OpptjeningFaktaIndexProps) => ownProps.aksjonspunkter,
  ],
  (opptjeningActivities, fastsattOpptjening, aksjonspunkter) =>
    fastsattOpptjening && {
      opptjeningActivities: opptjeningActivities
        .filter(oa => moment(fastsattOpptjening.opptjeningFom).isBefore(addDay(oa.opptjeningTom)))
        .filter(oa => moment(oa.opptjeningFom).isBefore(addDay(fastsattOpptjening.opptjeningTom)))
        .map((oa, index) => ({
          ...oa,
          ...buildPeriod(oa, fastsattOpptjening.opptjeningFom, fastsattOpptjening.opptjeningTom),
          id: index + 1,
        })),
      aksjonspunkt:
        aksjonspunkter.filter(ap => ap.definisjon.kode === aksjonspunktCodes.VURDER_PERIODER_MED_OPPTJENING) || null,
      fastsattOpptjening,
    },
);

const transformPeriod = (activity, opptjeningsperiodeFom, opptjeningsperiodeTom) => {
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

const transformValues = values => ({
  opptjeningAktivitetList: values.opptjeningActivities
    .map(oa =>
      transformPeriod(
        oa,
        addDay(values.fastsattOpptjening.opptjeningFom),
        addDay(values.fastsattOpptjening.opptjeningTom),
      ),
    )
    .map(oa => omit(oa, 'id')),
  kode: values.aksjonspunkt[0].definisjon.kode,
});

const mapStateToPropsFactory = (initialState, { submitCallback }) => {
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
