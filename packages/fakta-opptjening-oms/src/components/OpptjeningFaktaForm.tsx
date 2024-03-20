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
import { ArbeidsgiverOpplysningerPerId, KodeverkMedNavn, Opptjening } from '@k9-sak-web/types';
import OpptjeningAktivitet from '@k9-sak-web/types/src/opptjening/opptjeningAktivitet';
import OpptjeningAktivitetType from '@k9-sak-web/types/src/opptjening/opptjeningAktivitetType';
import { Button } from '@navikt/ds-react';
import moment from 'moment';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import { TabsPure } from 'nav-frontend-tabs';
import { Normaltekst, Undertekst, Undertittel } from 'nav-frontend-typografi';
import React, { Component, KeyboardEvent, MouseEvent } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { change as reduxFormChange, initialize as reduxFormInitialize } from 'redux-form';
import ActivityPanel, { activityPanelNameFormName } from './activity/ActivityPanel';
import styles from './opptjeningFaktaForm.module.css';
import OpptjeningTimeLine from './timeline/OpptjeningTimeLine';

const sortByFomDate = (opptjeningPeriods: Opptjening[]) =>
  opptjeningPeriods.sort((o1, o2) => {
    if (
      moment(o1.fastsattOpptjening.opptjeningFom, ISO_DATE_FORMAT).isBefore(
        moment(o2.fastsattOpptjening.opptjeningFom, ISO_DATE_FORMAT),
      )
    ) {
      return -1;
    }
    if (
      moment(o1.fastsattOpptjening.opptjeningFom, ISO_DATE_FORMAT).isSame(
        moment(o2.fastsattOpptjening.opptjeningFom, ISO_DATE_FORMAT),
      )
    ) {
      return 0;
    }
    return 1;
  });

const getAksjonspunktHelpTexts = (activities: OpptjeningAktivitet[]) => {
  const texts = [];
  if (activities.some(a => a.stillingsandel === 0)) {
    texts.push(
      <FormattedMessage id="OpptjeningFaktaForm.AktivitetenErTimeAvslonnet" key="AktivitetenErTimeAvslonnet" />,
    );
  }

  const aktivitetTypes = activities.filter(a => a.stillingsandel !== 0);
  if (aktivitetTypes.length === 1) {
    texts.push(<FormattedMessage id="OpptjeningFaktaForm.EttArbeidKanGodkjennes" key="EttArbeidKanGodkjennes" />);
  } else if (aktivitetTypes.length > 1) {
    texts.push(<FormattedMessage id="OpptjeningFaktaForm.FlereArbeidKanGodkjennes" key="FlereArbeidKanGodkjennes" />);
  }
  return texts;
};

const findSkjaringstidspunkt = (date: string) => moment(date).add(1, 'days').format(ISO_DATE_FORMAT);

const DOKUMENTASJON_VIL_BLI_INNHENTET = 'DOKUMENTASJON_VIL_BLI_INNHENTET';

interface OpptjeningFaktaFormImplProps {
  behandlingId: number;
  behandlingVersjon: number;
  alleMerknaderFraBeslutter: any;
  alleKodeverk: { [key: string]: KodeverkMedNavn[] };
  arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId;
  readOnly: boolean;
  harApneAksjonspunkter: boolean;
  dokStatus: string;
  formName: string;
  submitting: boolean;
  isDirty: boolean;
  hasAksjonspunkt: boolean;
  opptjeningList: Opptjening[];
}

interface StateProps {
  behandlingFormPrefix: string;
  reduxFormChange: (formName: string, fieldName: string, value: any) => void;
  reduxFormInitialize: (formName: string, data: any) => void;
  opptjeningAktivitetTypes: OpptjeningAktivitetType[];
}

interface OpptjeningFaktaFormImplState {
  selectedOpptjeningActivity?: Partial<OpptjeningAktivitet>;
  activeTab: number;
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
    this.setActiveTab = this.setActiveTab.bind(this);

    this.state = {
      selectedOpptjeningActivity: undefined,
      activeTab: 0,
    };
  }

  componentDidMount() {
    const { opptjeningList } = this.props;
    if (opptjeningList && opptjeningList.length > 0) {
      const { selectedOpptjeningActivity } = this.state;
      const { opptjeningAktivitetList } = opptjeningList[0];
      const opptjeningActivityWithAp = opptjeningAktivitetList.find(o => o.erGodkjent === null);
      const selected = selectedOpptjeningActivity || opptjeningActivityWithAp || opptjeningAktivitetList[0];
      this.setSelectedOpptjeningActivity(selected, true);
    }
  }

  setActiveTab(index) {
    this.setState({ activeTab: index });
    const { opptjeningList } = this.props;
    const { opptjeningAktivitetList } = opptjeningList[index];
    const selectedItem = opptjeningAktivitetList.find(item => item.id === 1);
    this.setSelectedOpptjeningActivity(selectedItem);
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

  isActivitiesEvaluated = () => {
    const { opptjeningList } = this.props;
    let numberOfNotEvaluated = 0;
    opptjeningList.forEach(element => {
      const hasNotEvaluated = element.opptjeningAktivitetList.some(ac => ac.erGodkjent === null);
      numberOfNotEvaluated = hasNotEvaluated ? numberOfNotEvaluated + 1 : numberOfNotEvaluated;
    });
    return numberOfNotEvaluated === 0;
  };

  initializeActivityForm(opptjeningActivity: OpptjeningAktivitet | any) {
    const { behandlingFormPrefix, reduxFormInitialize: formInitialize } = this.props;
    formInitialize(`${behandlingFormPrefix}.${activityPanelNameFormName}`, opptjeningActivity);
  }

  cancelSelectedOpptjeningActivity() {
    this.initializeActivityForm({});
    this.setState({ selectedOpptjeningActivity: undefined });
  }

  addOpptjeningActivity() {
    const { opptjeningList } = this.props;
    const { activeTab } = this.state;
    const newOpptjeningActivity = {
      id:
        opptjeningList[activeTab].opptjeningAktivitetList
          .map(oa => oa.id)
          .reduce((acc, value) => (acc < value ? value : acc), 0) + 1,
      erGodkjent: true,
      erManueltOpprettet: true,
    };
    this.initializeActivityForm(newOpptjeningActivity);
    this.setState({ selectedOpptjeningActivity: newOpptjeningActivity });
  }

  updateActivity(values) {
    const { opptjeningList } = this.props;
    const { activeTab } = this.state;
    const otherThanUpdated = opptjeningList[activeTab].opptjeningAktivitetList.filter(o => o.id !== values.id);
    this.setFormField(
      `opptjeningList[${activeTab}].opptjeningAktivitetList`,
      otherThanUpdated.concat({
        ...values,
        erEndret: true,
      }),
    );
    const opptjeningActivityWithAp = otherThanUpdated.find(o => o.erGodkjent === null);
    this.setSelectedOpptjeningActivity(opptjeningActivityWithAp || undefined);
  }

  openPeriodInfo(event) {
    const { opptjeningList } = this.props;
    const { selectedOpptjeningActivity, activeTab } = this.state;
    const { opptjeningAktivitetList } = opptjeningList[activeTab];
    event.preventDefault();
    const currentSelectedItem = selectedOpptjeningActivity;
    if (currentSelectedItem) {
      this.setSelectedOpptjeningActivity(undefined);
    } else {
      const selectedItem = opptjeningAktivitetList.find(item => item.id === 1);
      this.setSelectedOpptjeningActivity(selectedItem);
    }
  }

  selectNextPeriod(event: MouseEvent | KeyboardEvent) {
    const { opptjeningList } = this.props;
    const { selectedOpptjeningActivity, activeTab } = this.state;
    const { opptjeningAktivitetList } = opptjeningList[activeTab];
    const newIndex = opptjeningAktivitetList.findIndex(oa => oa.id === selectedOpptjeningActivity.id) + 1;
    if (newIndex < opptjeningAktivitetList.length) {
      this.setSelectedOpptjeningActivity(opptjeningAktivitetList[newIndex]);
    }
    event.preventDefault();
  }

  selectPrevPeriod(event: MouseEvent | KeyboardEvent) {
    const { opptjeningList } = this.props;
    const { selectedOpptjeningActivity, activeTab } = this.state;
    const { opptjeningAktivitetList } = opptjeningList[activeTab];
    const newIndex = opptjeningAktivitetList.findIndex(oa => oa.id === selectedOpptjeningActivity.id) - 1;
    if (newIndex >= 0) {
      this.setSelectedOpptjeningActivity(opptjeningAktivitetList[newIndex]);
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
    const { harApneAksjonspunkter, readOnly, submitting, isDirty } = this.props;
    if (!harApneAksjonspunkter && !isDirty) {
      return true;
    }

    return submitting || readOnly || this.isSelectedActivityAndButtonsEnabled() || !this.isActivitiesEvaluated();
  }

  isAddButtonDisabled() {
    const { readOnly, submitting } = this.props;

    return submitting || readOnly || this.isSelectedActivityAndButtonsEnabled();
  }

  render() {
    const {
      hasAksjonspunkt,
      harApneAksjonspunkter,
      opptjeningAktivitetTypes,
      dokStatus,
      opptjeningList,
      readOnly,
      submitting,
      behandlingId,
      behandlingVersjon,
      alleMerknaderFraBeslutter,
      alleKodeverk,
      arbeidsgiverOpplysningerPerId,
    } = this.props;
    if (!opptjeningList || opptjeningList.length === 0) {
      return <Normaltekst>Fant ingen opptjeningsaktiviteter</Normaltekst>;
    }

    const { selectedOpptjeningActivity, activeTab } = this.state;

    const activeOpptjeningObject = opptjeningList[activeTab];
    const { opptjeningAktivitetList, fastsattOpptjening } = activeOpptjeningObject;
    const { opptjeningFom, opptjeningTom } = fastsattOpptjening;

    return (
      <div className={styles.container}>
        {opptjeningList.length > 1 && (
          <>
            <Undertittel>
              <FormattedMessage id="OpptjeningFaktaForm.Opptjeningsperioder" />
            </Undertittel>
            <VerticalSpacer sixteenPx />
            <TabsPure
              tabs={opptjeningList.map((currentOpptjening, currentOpptjeningIndex) => ({
                aktiv: activeTab === currentOpptjeningIndex,
                label:
                  opptjeningList.length <= 8 ? `Periode ${currentOpptjeningIndex + 1}` : currentOpptjeningIndex + 1,
              }))}
              onChange={(e, clickedIndex) => this.setActiveTab(clickedIndex)}
            />
          </>
        )}
        <div className={opptjeningList.length > 1 ? styles.tabContainer : ''}>
          {hasAksjonspunkt && (
            <>
              <AksjonspunktHelpTextTemp isAksjonspunktOpen={harApneAksjonspunkter}>
                {getAksjonspunktHelpTexts(opptjeningAktivitetList)}
              </AksjonspunktHelpTextTemp>
              <VerticalSpacer twentyPx />
            </>
          )}
          {dokStatus && (
            <>
              <AlertStripeInfo className={styles.info}>
                <FormattedMessage
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
            <DateLabel dateString={findSkjaringstidspunkt(opptjeningTom)} />
          </Normaltekst>
          <VerticalSpacer twentyPx />
          <OpptjeningTimeLine
            opptjeningPeriods={opptjeningAktivitetList}
            opptjeningAktivitetTypes={opptjeningAktivitetTypes}
            selectPeriodCallback={this.setSelectedOpptjeningActivity}
            opptjeningFomDato={opptjeningFom}
            opptjeningTomDato={opptjeningTom}
            selectedPeriod={selectedOpptjeningActivity}
            harApneAksjonspunkter={harApneAksjonspunkter}
          />
          <TimeLineNavigation openPeriodInfo={this.openPeriodInfo} className={styles.timelineNavigationContainer} />
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
                opptjeningFomDato={opptjeningFom}
                opptjeningTomDato={opptjeningTom}
                selectNextPeriod={this.selectNextPeriod}
                selectPrevPeriod={this.selectPrevPeriod}
                hasAksjonspunkt={hasAksjonspunkt}
                alleMerknaderFraBeslutter={alleMerknaderFraBeslutter}
                alleKodeverk={alleKodeverk}
                arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
              />
              <VerticalSpacer twentyPx />
            </>
          )}
          {hasAksjonspunkt && (
            <FlexContainer>
              <FlexRow>
                <FlexColumn>
                  <Button variant="primary" size="small" disabled={this.isConfirmButtonDisabled()} loading={submitting}>
                    <FormattedMessage id="OpptjeningFaktaForm.Confirm" />
                  </Button>
                </FlexColumn>
                <FlexColumn>
                  <Button
                    variant="secondary"
                    size="small"
                    type="button"
                    onClick={this.addOpptjeningActivity}
                    disabled={this.isAddButtonDisabled()}
                  >
                    <FormattedMessage id="OpptjeningFaktaForm.AddActivity" />
                  </Button>
                </FlexColumn>
              </FlexRow>
            </FlexContainer>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps: OpptjeningFaktaFormImplProps) => ({
  opptjeningAktivitetTypes: ownProps.alleKodeverk[kodeverkTyper.OPPTJENING_AKTIVITET_TYPE],
  behandlingFormPrefix: getBehandlingFormPrefix(ownProps.behandlingId, ownProps.behandlingVersjon),
  opptjeningList: sortByFomDate(
    behandlingFormValueSelector(
      ownProps.formName,
      ownProps.behandlingId,
      ownProps.behandlingVersjon,
    )(state, 'opptjeningList'),
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
