import React, { KeyboardEvent, MouseEvent } from 'react';
import {
  behandlingForm,
  behandlingFormValueSelector,
  PeriodpickerField,
  RadioGroupField,
  RadioOption,
  SelectField,
  TextAreaField,
} from '@fpsak-frontend/form';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import arbeidType from '@fpsak-frontend/kodeverk/src/arbeidType';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import opptjeningAktivitetType from '@fpsak-frontend/kodeverk/src/opptjeningAktivitetType';
import { FlexColumn, FlexContainer, FlexRow, VerticalSpacer, FaktaGruppe } from '@fpsak-frontend/shared-components';
import { TimeLineButton } from '@fpsak-frontend/tidslinje';
import {
  findDifferenceInMonthsAndDays,
  hasValidPeriod,
  hasValidText,
  isEqual,
  isWithinOpptjeningsperiode,
  maxLength,
  minLength,
  omit,
  required,
  requiredIfCustomFunctionIsTrue,
} from '@fpsak-frontend/utils';
import { Kodeverk, ArbeidsgiverOpplysningerPerId } from '@k9-sak-web/types';
import AlleKodeverk from '@k9-sak-web/types/src/kodeverk';
import OpptjeningAktivitet from '@k9-sak-web/types/src/opptjening/opptjeningAktivitet';
import OpptjeningAktivitetType from '@k9-sak-web/types/src/opptjening/opptjeningAktivitetType';
import moment from 'moment';
import { Column, Row } from 'nav-frontend-grid';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl';
import { connect } from 'react-redux';
import { InjectedFormProps } from 'redux-form';
import ActivityDataSubPanel from './ActivityDataSubPanel';
import styles from './activityPanel.less';

const minLength3 = minLength(3);
const maxLength1500 = maxLength(1500);

function erFraAvvikendeKode(atCodes, oat) {
  return (
    (atCodes.includes(arbeidType.LONN_UNDER_UTDANNING) && oat.kode === opptjeningAktivitetType.VIDERE_ETTERUTDANNING) ||
    (atCodes.includes(arbeidType.FRILANSER) && oat.kode === opptjeningAktivitetType.FRILANS)
  );
}

const filterActivityType = (
  opptjeningAktivitetTypes: OpptjeningAktivitetType[],
  erManueltOpprettet: boolean,
  arbeidTypes: Kodeverk[],
) => {
  if (!erManueltOpprettet) {
    return opptjeningAktivitetTypes;
  }

  const atCodes = arbeidTypes.map(at => at.kode);
  return opptjeningAktivitetTypes.filter(oat => atCodes.includes(oat.kode) || erFraAvvikendeKode(atCodes, oat));
};

const shouldDisablePeriodpicker = (hasAksjonspunkt: boolean, initialValues: Partial<OpptjeningAktivitet>) => {
  if (!hasAksjonspunkt) {
    return true;
  }
  return !initialValues.erManueltOpprettet && !!initialValues.erGodkjent && !initialValues.erEndret;
};

const findInYearsMonthsAndDays = (opptjeningFom: string, opptjeningTom: string) => {
  const difference = findDifferenceInMonthsAndDays(opptjeningFom, opptjeningTom);
  if (!difference) {
    return <span />;
  }
  return difference.months >= 1 ? (
    <FormattedMessage id="ActivityPanel.MonthsAndDays" values={{ months: difference.months, days: difference.days }} />
  ) : (
    <FormattedMessage id="ActivityPanel.Days" values={{ days: difference.days }} />
  );
};

const isBegrunnelseRequired = (allValues, props) => {
  if (props.pristine) {
    return false;
  }
  if (allValues.erGodkjent === false) {
    return true;
  }
  return !isEqual(omit(props.initialValues, 'erGodkjent'), omit(allValues, 'erGodkjent'));
};
const requiredCustom = requiredIfCustomFunctionIsTrue(isBegrunnelseRequired);

const finnBegrunnelseLabel = (
  initialValues: Partial<OpptjeningAktivitet>,
  readOnly: boolean,
  hasAksjonspunkt: boolean,
) =>
  initialValues.erManueltOpprettet || readOnly || shouldDisablePeriodpicker(hasAksjonspunkt, initialValues)
    ? 'ActivityPanel.Begrunnelse'
    : 'ActivityPanel.BegrunnEndringene';

export const activityPanelNameFormName = 'ActivityPanelForm';

interface ActivityPanelProps {
  activity: Partial<OpptjeningAktivitet>;
  alleKodeverk: AlleKodeverk;
  arbeidsgiverOpplysningerPerId: ArbeidsgiverOpplysningerPerId;
  alleMerknaderFraBeslutter: any;
  behandlingId: number;
  behandlingVersjon: number;
  cancelSelectedOpptjeningActivity: () => void;
  hasAksjonspunkt: boolean;
  opptjeningAktivitetTypes: OpptjeningAktivitetType[];
  opptjeningFomDato: string;
  opptjeningTomDato: string;
  readOnly: boolean;
  selectNextPeriod?: (event: MouseEvent | KeyboardEvent) => void;
  selectPrevPeriod?: (event: MouseEvent | KeyboardEvent) => void;
  updateActivity: (values: string) => void;
}

interface StateProps {
  opptjeningFom: string;
  opptjeningTom: string;
  initialValues: Partial<OpptjeningAktivitet>;
  selectedActivityType: Kodeverk;
  activityId: number;
}

/**
 * ActivityPanel
 *
 * Presentasjonskomponent. Viser informasjon om valgt aktivitet
 */
export const ActivityPanel = ({
  intl,
  initialValues,
  readOnly,
  opptjeningAktivitetTypes,
  cancelSelectedOpptjeningActivity,
  selectedActivityType,
  activityId,
  opptjeningFom,
  opptjeningTom,
  selectNextPeriod,
  selectPrevPeriod,
  hasAksjonspunkt,
  opptjeningFomDato,
  opptjeningTomDato,
  alleMerknaderFraBeslutter,
  handleSubmit,
  pristine,
  arbeidsgiverOpplysningerPerId,
}: Partial<ActivityPanelProps> & WrappedComponentProps & StateProps & InjectedFormProps) => (
  <FaktaGruppe
    className={styles.panel}
    merknaderFraBeslutter={alleMerknaderFraBeslutter[aksjonspunktCodes.VURDER_PERIODER_MED_OPPTJENING]}
  >
    <Row>
      <Column xs="10">
        <Element>
          <FormattedMessage id={initialValues.id ? 'ActivityPanel.Details' : 'ActivityPanel.NewActivity'} />
        </Element>
      </Column>
      <Column xs="2">
        <TimeLineButton
          text={intl.formatMessage({ id: 'Timeline.prevPeriod' })}
          type="prev"
          callback={selectPrevPeriod}
        />
        <TimeLineButton
          text={intl.formatMessage({ id: 'Timeline.nextPeriod' })}
          type="next"
          callback={selectNextPeriod}
        />
      </Column>
    </Row>
    <Row>
      <Column xs="7">
        <FlexContainer>
          <FlexRow>
            <FlexColumn>
              <PeriodpickerField
                key={activityId}
                names={['opptjeningFom', 'opptjeningTom']}
                label={{ id: 'ActivityPanel.Period' }}
                readOnly={readOnly || shouldDisablePeriodpicker(hasAksjonspunkt, initialValues)}
                disabledDays={{ before: moment(opptjeningFomDato).toDate(), after: moment(opptjeningTomDato).toDate() }}
              />
            </FlexColumn>
            <FlexColumn>
              <Normaltekst className={styles.period}>
                {findInYearsMonthsAndDays(opptjeningFom, opptjeningTom)}
              </Normaltekst>
            </FlexColumn>
          </FlexRow>
        </FlexContainer>
      </Column>
      <Column xs="5">
        <SelectField
          name="aktivitetType.kode"
          label={intl.formatMessage({ id: 'ActivityPanel.Activity' })}
          validate={[required]}
          placeholder={intl.formatMessage({ id: 'ActivityPanel.VelgAktivitet' })}
          selectValues={opptjeningAktivitetTypes.map(oat => (
            <option key={oat.kode} value={oat.kode}>
              {oat.navn}
            </option>
          ))}
          readOnly={readOnly || !initialValues.erManueltOpprettet}
        />
      </Column>
    </Row>
    <ActivityDataSubPanel
      initialValues={initialValues}
      readOnly={readOnly}
      isManuallyAdded={initialValues.erManueltOpprettet}
      selectedActivityType={selectedActivityType}
      arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
    />
    {!shouldDisablePeriodpicker(hasAksjonspunkt, initialValues) && (
      <>
        <VerticalSpacer twentyPx />
        {!initialValues.erManueltOpprettet && (
          <RadioGroupField
            name="erGodkjent"
            validate={[required]}
            readOnly={readOnly}
            isEdited={initialValues.erEndret}
          >
            <RadioOption value label={{ id: 'ActivityPanel.Godkjent' }} />
            <RadioOption
              value={false}
              label={<FormattedMessage id="ActivityPanel.IkkeGodkjent" values={{ b: chunks => <b>{chunks}</b> }} />}
            />
          </RadioGroupField>
        )}
      </>
    )}
    <>
      <VerticalSpacer fourPx />
      <TextAreaField
        name="begrunnelse"
        textareaClass={styles.explanationTextarea}
        label={<FormattedMessage id={finnBegrunnelseLabel(initialValues, readOnly, hasAksjonspunkt)} />}
        validate={[requiredCustom, minLength3, maxLength1500, hasValidText]}
        maxLength={1500}
        readOnly={readOnly || shouldDisablePeriodpicker(hasAksjonspunkt, initialValues)}
      />
    </>
    {!shouldDisablePeriodpicker(hasAksjonspunkt, initialValues) && (
      <FlexContainer>
        <FlexRow className={styles.buttonContainer}>
          <FlexColumn>
            <Hovedknapp mini htmlType="button" onClick={handleSubmit} disabled={pristine}>
              <FormattedMessage id="ActivityPanel.Oppdater" />
            </Hovedknapp>
          </FlexColumn>
          <FlexColumn>
            <Knapp mini htmlType="button" onClick={cancelSelectedOpptjeningActivity}>
              <FormattedMessage id="ActivityPanel.Avbryt" />
            </Knapp>
          </FlexColumn>
        </FlexRow>
      </FlexContainer>
    )}
  </FaktaGruppe>
);

const mapStateToPropsFactory = (initialState, initialOwnProps: ActivityPanelProps) => {
  const { activity, alleKodeverk, behandlingId, behandlingVersjon, opptjeningAktivitetTypes, updateActivity } =
    initialOwnProps;
  const onSubmit = values => updateActivity(values);
  const arbeidTyper = alleKodeverk[kodeverkTyper.ARBEID_TYPE];
  const filtrerteOpptjeningAktivitetTypes = filterActivityType(
    opptjeningAktivitetTypes,
    activity.erManueltOpprettet,
    arbeidTyper,
  );

  return {
    onSubmit,
    initialValues: initialOwnProps.activity,
    opptjeningAktivitetTypes: filtrerteOpptjeningAktivitetTypes,
    selectedActivityType: behandlingFormValueSelector(
      activityPanelNameFormName,
      behandlingId,
      behandlingVersjon,
    )(initialState, 'aktivitetType'),
    opptjeningFom: behandlingFormValueSelector(
      activityPanelNameFormName,
      behandlingId,
      behandlingVersjon,
    )(initialState, 'opptjeningFom'),
    opptjeningTom: behandlingFormValueSelector(
      activityPanelNameFormName,
      behandlingId,
      behandlingVersjon,
    )(initialState, 'opptjeningTom'),
    activityId: behandlingFormValueSelector(
      activityPanelNameFormName,
      behandlingId,
      behandlingVersjon,
    )(initialState, 'id'),
  };
};

const validateForm = (values, props) => {
  const errors = { opptjeningFom: null, opptjeningTom: null };
  if (!values) {
    return errors;
  }
  const { opptjeningFom, opptjeningTom } = values;
  // TODO (TOR) Denne valideringa bør ligga i PeriodpickerField
  errors.opptjeningFom = required(opptjeningFom) || hasValidPeriod(opptjeningFom, opptjeningTom);
  errors.opptjeningTom = required(opptjeningTom) || hasValidPeriod(opptjeningFom, opptjeningTom);

  if (!errors.opptjeningFom && !errors.opptjeningTom) {
    errors.opptjeningFom = isWithinOpptjeningsperiode(props.opptjeningFomDato, props.opptjeningTomDato)(
      opptjeningFom,
      opptjeningTom,
    );
  }

  return errors;
};

export default connect(mapStateToPropsFactory)(
  behandlingForm({
    form: activityPanelNameFormName,
    validate: validateForm,
    enableReinitialize: true,
  })(injectIntl(ActivityPanel)),
);
