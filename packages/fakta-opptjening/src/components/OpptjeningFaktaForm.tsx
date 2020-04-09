import { behandlingFormValueSelector, getBehandlingFormPrefix } from '@fpsak-frontend/form';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import {
  AksjonspunktHelpTextTemp,
  DateLabel,
  FlexColumn,
  FlexContainer,
  FlexRow,
  VerticalSpacer,
} from '@fpsak-frontend/shared-components';
import { TimeLineNavigation } from '@fpsak-frontend/tidslinje';
import { ISO_DATE_FORMAT } from '@fpsak-frontend/utils';
import AlleKodeverk from '@k9-sak-web/types/src/kodeverk';
import OpptjeningAktivitet from '@k9-sak-web/types/src/opptjening/opptjeningAktivitet';
import OpptjeningAktivitetType from '@k9-sak-web/types/src/opptjening/opptjeningAktivitetType';
import moment from 'moment';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { Normaltekst, Undertekst } from 'nav-frontend-typografi';
import React, { Component } from 'react';
import { FormattedHTMLMessage, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { change as reduxFormChange, initialize as reduxFormInitialize } from 'redux-form';
import ActivityPanel, { activityPanelName } from './activity/ActivityPanel';
import styles from './opptjeningFaktaForm.less';
import OpptjeningTimeLine from './timeline/OpptjeningTimeLine';

const getAksjonspunktHelpTexts = (activities: OpptjeningAktivitet[]) => {
  const texts = [];
  if (activities.some(a => a.stillingsandel === 0)) {
    texts.push(
      <FormattedMessage id="OpptjeningFaktaForm.AktivitetenErTimeAvslonnet" key="AktivitetenErTimeAvslonnet" />,
    );
  }

  const aktivitetTypes = activities.filter(
    a => (a.erGodkjent === undefined || a.beskrivelse) && a.stillingsandel !== 0,
  );
  if (aktivitetTypes.length === 1) {
    texts.push(<FormattedMessage id="OpptjeningFaktaForm.EttArbeidKanGodkjennes" key="EttArbeidKanGodkjennes" />);
  } else if (aktivitetTypes.length > 1) {
    texts.push(<FormattedMessage id="OpptjeningFaktaForm.FlereArbeidKanGodkjennes" key="FlereArbeidKanGodkjennes" />);
  }
  return texts;
};

const findSkjaringstidspunkt = (date: string) => moment(date).add(1, 'days').format(ISO_DATE_FORMAT);

const sortByFomDate = opptjeningPeriods =>
  opptjeningPeriods.sort((o1, o2) => {
    const isSame = moment(o2.opptjeningFom, ISO_DATE_FORMAT).isSame(moment(o1.opptjeningFom, ISO_DATE_FORMAT));
    return isSame
      ? o1.id < o2.id
      : moment(o2.opptjeningFom, ISO_DATE_FORMAT).isBefore(moment(o1.opptjeningFom, ISO_DATE_FORMAT));
  });

const DOKUMENTASJON_VIL_BLI_INNHENTET = 'DOKUMENTASJON_VIL_BLI_INNHENTET';

interface OpptjeningFaktaFormImplProps {
  behandlingId: number;
  behandlingVersjon: number;
  opptjeningFomDato: string;
  opptjeningTomDato: string;
  alleMerknaderFraBeslutter: any;
  alleKodeverk: AlleKodeverk;
  readOnly: boolean;
  harApneAksjonspunkter: boolean;
  dokStatus: string;
  formName: string;
  submitting: boolean;
  isDirty: boolean;
  hasAksjonspunkt: boolean;
}

interface StateProps {
  opptjeningActivities: OpptjeningAktivitet[];
  behandlingFormPrefix: string;
  reduxFormChange: (formName: string, fieldName: string, value: any) => void;
  reduxFormInitialize: (formName: string, data: any) => void;
  opptjeningAktivitetTypes: OpptjeningAktivitetType[];
}

interface OpptjeningFaktaFormImplState {
  selectedOpptjeningActivity?: Partial<OpptjeningAktivitet>;
}

/**
 * OpptjeningFaktaForm
 *
 * Presentasjonskomponent. Vises faktapanelet for opptjeningsvilkåret. For Foreldrepenger vises dette alltid. Finnes
 * det aksjonspunkt kan nav-ansatt endre opplysninger før en går videre i prosessen.
 */
export class OpptjeningFaktaFormImpl extends Component<
  OpptjeningFaktaFormImplProps & StateProps,
  OpptjeningFaktaFormImplState
> {
  constructor(props: OpptjeningFaktaFormImplProps & StateProps) {
    super(props);

    this.addOpptjeningActivity = this.addOpptjeningActivity.bind(this);
    this.setSelectedOpptjeningActivity = this.setSelectedOpptjeningActivity.bind(this);
    this.cancelSelectedOpptjeningActivity = this.cancelSelectedOpptjeningActivity.bind(this);
    this.updateActivity = this.updateActivity.bind(this);
    this.initializeActivityForm = this.initializeActivityForm.bind(this);
    this.setFormField = this.setFormField.bind(this);
    this.selectNextPeriod = this.selectNextPeriod.bind(this);
    this.selectPrevPeriod = this.selectPrevPeriod.bind(this);
    this.openPeriodInfo = this.openPeriodInfo.bind(this);
    this.isConfirmButtonDisabled = this.isConfirmButtonDisabled.bind(this);
    this.isAddButtonDisabled = this.isAddButtonDisabled.bind(this);
    this.isSelectedActivityAndButtonsEnabled = this.isSelectedActivityAndButtonsEnabled.bind(this);

    this.state = {
      selectedOpptjeningActivity: undefined,
    };
  }

  UNSAFE_componentWillMount() {
    const { opptjeningActivities } = this.props;
    const { selectedOpptjeningActivity } = this.state;
    const opptjeningActivityWithAp = opptjeningActivities.find(o => o.erGodkjent === null);
    const selected = selectedOpptjeningActivity || opptjeningActivityWithAp || opptjeningActivities[0];
    this.setSelectedOpptjeningActivity(selected, true);
  }

  setSelectedOpptjeningActivity(opptjeningActivity: Partial<OpptjeningAktivitet>, isMounting?: boolean) {
    if (!isMounting) {
      this.initializeActivityForm(opptjeningActivity);
    }
    this.setState({ selectedOpptjeningActivity: opptjeningActivity });
  }

  setFormField(fieldName: string, fieldValue: OpptjeningAktivitet[]) {
    const { behandlingFormPrefix, formName, reduxFormChange: formChange } = this.props;
    formChange(`${behandlingFormPrefix}.${formName}`, fieldName, fieldValue);
  }

  initializeActivityForm(opptjeningActivity: OpptjeningAktivitet | {}) {
    const { behandlingFormPrefix, reduxFormInitialize: formInitialize } = this.props;
    formInitialize(`${behandlingFormPrefix}.${activityPanelName}`, opptjeningActivity);
  }

  cancelSelectedOpptjeningActivity() {
    this.initializeActivityForm({});
    this.setState({ selectedOpptjeningActivity: undefined });
  }

  addOpptjeningActivity() {
    const { opptjeningActivities } = this.props;
    const newOpptjeningActivity = {
      id: opptjeningActivities.map(oa => oa.id).reduce((acc, value) => (acc < value ? value : acc), 0) + 1,
      erGodkjent: true,
      erManueltOpprettet: true,
    };
    this.initializeActivityForm(newOpptjeningActivity);
    this.setState({ selectedOpptjeningActivity: newOpptjeningActivity });
  }

  updateActivity(values) {
    const { opptjeningActivities } = this.props;
    const otherThanUpdated = opptjeningActivities.filter(o => o.id !== values.id);
    this.setFormField(
      'opptjeningActivities',
      otherThanUpdated.concat({
        ...values,
        erEndret: true,
      }),
    );
    const opptjeningActivityWithAp = otherThanUpdated.find(o => o.erGodkjent === null);
    this.setSelectedOpptjeningActivity(opptjeningActivityWithAp || undefined);
  }

  openPeriodInfo(event: Event) {
    const { opptjeningActivities } = this.props;
    const { selectedOpptjeningActivity } = this.state;
    event.preventDefault();
    const currentSelectedItem = selectedOpptjeningActivity;
    if (currentSelectedItem) {
      this.setSelectedOpptjeningActivity(undefined);
    } else {
      const selectedItem = opptjeningActivities.find(item => item.id === 1);
      this.setSelectedOpptjeningActivity(selectedItem);
    }
  }

  selectNextPeriod(event: Event) {
    const { opptjeningActivities } = this.props;
    const { selectedOpptjeningActivity } = this.state;
    const newIndex = opptjeningActivities.findIndex(oa => oa.id === selectedOpptjeningActivity.id) + 1;
    if (newIndex < opptjeningActivities.length) {
      this.setSelectedOpptjeningActivity(opptjeningActivities[newIndex]);
    }
    event.preventDefault();
  }

  selectPrevPeriod(event: Event) {
    const { opptjeningActivities } = this.props;
    const { selectedOpptjeningActivity } = this.state;
    const newIndex = opptjeningActivities.findIndex(oa => oa.id === selectedOpptjeningActivity.id) - 1;
    if (newIndex >= 0) {
      this.setSelectedOpptjeningActivity(opptjeningActivities[newIndex]);
    }
    event.preventDefault();
  }

  isSelectedActivityAndButtonsEnabled() {
    const { selectedOpptjeningActivity } = this.state;
    if (selectedOpptjeningActivity === undefined) {
      return false;
    }
    return !!selectedOpptjeningActivity.erManueltOpprettet || !!selectedOpptjeningActivity.erEndret;
  }

  isConfirmButtonDisabled() {
    const { harApneAksjonspunkter, opptjeningActivities, readOnly, submitting, isDirty } = this.props;
    if (!harApneAksjonspunkter && !isDirty) {
      return true;
    }

    return (
      submitting ||
      readOnly ||
      this.isSelectedActivityAndButtonsEnabled() ||
      opptjeningActivities.some(ac => ac.erGodkjent === null)
    );
  }

  isAddButtonDisabled() {
    const { readOnly, submitting } = this.props;

    return submitting || readOnly || this.isSelectedActivityAndButtonsEnabled();
  }

  render() {
    const {
      hasAksjonspunkt,
      harApneAksjonspunkter,
      opptjeningActivities,
      opptjeningAktivitetTypes,
      opptjeningFomDato,
      dokStatus,
      opptjeningTomDato,
      readOnly,
      submitting,
      behandlingId,
      behandlingVersjon,
      alleMerknaderFraBeslutter,
      alleKodeverk,
    } = this.props;
    const { selectedOpptjeningActivity } = this.state;
    return (
      <div className={styles.container}>
        {hasAksjonspunkt && (
          <>
            <AksjonspunktHelpTextTemp isAksjonspunktOpen={harApneAksjonspunkter}>
              {getAksjonspunktHelpTexts(opptjeningActivities)}
            </AksjonspunktHelpTextTemp>
            <VerticalSpacer twentyPx />
          </>
        )}
        {dokStatus && (
          <>
            <AlertStripeInfo className={styles.info}>
              <FormattedHTMLMessage
                id={
                  dokStatus === DOKUMENTASJON_VIL_BLI_INNHENTET
                    ? 'OpptjeningFaktaForm.DetErInnhentetDok'
                    : 'OpptjeningFaktaForm.DetErIkkeInnhentetDok'
                }
              />
            </AlertStripeInfo>
            <VerticalSpacer twentyPx />
          </>
        )}
        <Undertekst>
          <FormattedMessage id="OpptjeningFaktaForm.Skjaringstidspunkt" />
        </Undertekst>
        <Normaltekst>
          <DateLabel dateString={findSkjaringstidspunkt(opptjeningTomDato)} />
        </Normaltekst>
        <VerticalSpacer twentyPx />
        <OpptjeningTimeLine
          opptjeningPeriods={opptjeningActivities}
          opptjeningAktivitetTypes={opptjeningAktivitetTypes}
          selectPeriodCallback={this.setSelectedOpptjeningActivity}
          opptjeningFomDato={opptjeningFomDato}
          opptjeningTomDato={opptjeningTomDato}
          selectedPeriod={selectedOpptjeningActivity}
        />
        <TimeLineNavigation openPeriodInfo={this.openPeriodInfo} />
        <VerticalSpacer eightPx />
        {selectedOpptjeningActivity && (
          <>
            <ActivityPanel
              key={selectedOpptjeningActivity.id}
              behandlingId={behandlingId}
              behandlingVersjon={behandlingVersjon}
              activity={selectedOpptjeningActivity}
              readOnly={readOnly}
              opptjeningAktivitetTypes={opptjeningAktivitetTypes}
              cancelSelectedOpptjeningActivity={this.cancelSelectedOpptjeningActivity}
              updateActivity={this.updateActivity}
              opptjeningFomDato={opptjeningFomDato}
              opptjeningTomDato={opptjeningTomDato}
              selectNextPeriod={this.selectNextPeriod}
              selectPrevPeriod={this.selectPrevPeriod}
              hasAksjonspunkt={hasAksjonspunkt}
              alleMerknaderFraBeslutter={alleMerknaderFraBeslutter}
              alleKodeverk={alleKodeverk}
            />
            <VerticalSpacer twentyPx />
          </>
        )}
        {hasAksjonspunkt && (
          <FlexContainer>
            <FlexRow>
              <FlexColumn>
                <Hovedknapp mini disabled={this.isConfirmButtonDisabled()} spinner={submitting}>
                  <FormattedMessage id="OpptjeningFaktaForm.Confirm" />
                </Hovedknapp>
              </FlexColumn>
              <FlexColumn>
                <Knapp
                  mini
                  htmlType="button"
                  onClick={this.addOpptjeningActivity}
                  disabled={this.isAddButtonDisabled()}
                >
                  <FormattedMessage id="OpptjeningFaktaForm.AddActivity" />
                </Knapp>
              </FlexColumn>
            </FlexRow>
          </FlexContainer>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps: OpptjeningFaktaFormImplProps) => ({
  opptjeningAktivitetTypes: ownProps.alleKodeverk[kodeverkTyper.OPPTJENING_AKTIVITET_TYPE],
  behandlingFormPrefix: getBehandlingFormPrefix(ownProps.behandlingId, ownProps.behandlingVersjon),
  opptjeningActivities: sortByFomDate(
    behandlingFormValueSelector(
      ownProps.formName,
      ownProps.behandlingId,
      ownProps.behandlingVersjon,
    )(state, 'opptjeningActivities'),
  ),
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(
    {
      reduxFormChange,
      reduxFormInitialize,
    },
    dispatch,
  ),
});

const OpptjeningFaktaForm = connect(mapStateToProps, mapDispatchToProps)(OpptjeningFaktaFormImpl);

export default OpptjeningFaktaForm;
