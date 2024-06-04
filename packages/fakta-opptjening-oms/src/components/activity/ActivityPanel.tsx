import {
  PeriodpickerField,
  RadioGroupField,
  SelectField,
  TextAreaField,
  behandlingForm,
  behandlingFormValueSelector,
} from '@fpsak-frontend/form';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import arbeidType from '@fpsak-frontend/kodeverk/src/arbeidType';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import opptjeningAktivitetType from '@fpsak-frontend/kodeverk/src/opptjeningAktivitetType';
import { FaktaGruppe, FlexColumn, FlexContainer, FlexRow, VerticalSpacer } from '@fpsak-frontend/shared-components';
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
import { ArbeidsgiverOpplysningerPerId, Kodeverk, KodeverkMedNavn } from '@k9-sak-web/types';
import OpptjeningAktivitet from '@k9-sak-web/types/src/opptjening/opptjeningAktivitet';
import type { OpptjeningAktivitetType } from '@k9-sak-web/types/src/opptjening/opptjeningAktivitetType';
import { BodyShort, Button, HGrid, Label, Tag } from '@navikt/ds-react';
import moment from 'moment';
import React, { KeyboardEvent, MouseEvent } from 'react';
import { FormattedMessage, WrappedComponentProps, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { InjectedFormProps } from 'redux-form';
import { CheckmarkCircleIcon, XMarkOctagonIcon } from '@navikt/aksel-icons';
import ActivityDataSubPanel from './ActivityDataSubPanel';
import styles from './activityPanel.module.css';

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

const findApproverDeclinedText = erGodkjent => {
  if (erGodkjent === undefined || erGodkjent === null) return '';
  if (erGodkjent)
    return (
      <Tag variant="success" icon={<CheckmarkCircleIcon title="Godkjent" fontSize="1rem" />} size="xsmall">
        Godkjent
      </Tag>
    );
  return (
    <Tag variant="error" icon={<XMarkOctagonIcon title="Ikke Oppfylt" fontSize="1rem" />} size="xsmall">
      Ikke oppfylt
    </Tag>
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
  alleKodeverk: { [key: string]: KodeverkMedNavn[] };
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
  erGodkjent?: boolean;
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
  erGodkjent,
}: Partial<ActivityPanelProps> & WrappedComponentProps & StateProps & InjectedFormProps) => (
  <FaktaGruppe
    className={styles.panel}
    merknaderFraBeslutter={alleMerknaderFraBeslutter[aksjonspunktCodes.VURDER_PERIODER_MED_OPPTJENING]}
  >
    <HGrid gap="1" columns={{ xs: '10fr 2fr' }}>
      <Label size="small" as="p">
        <FormattedMessage id={initialValues.id ? 'ActivityPanel.Details' : 'ActivityPanel.NewActivity'} />
      </Label>
      <div>
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
      </div>
    </HGrid>
    <HGrid gap="1" columns={{ xs: '7fr 5fr' }}>
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
            <BodyShort size="small" className={styles.period}>
              <FlexRow>
                <FlexColumn className="mt-1.5">{findInYearsMonthsAndDays(opptjeningFom, opptjeningTom)}</FlexColumn>
                <FlexColumn className="mt-1.5">{findApproverDeclinedText(erGodkjent)}</FlexColumn>
              </FlexRow>
            </BodyShort>
          </FlexColumn>
        </FlexRow>
      </FlexContainer>
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
    </HGrid>
    <ActivityDataSubPanel
      initialValues={initialValues}
      readOnly={readOnly}
      isManuallyAdded={initialValues.erManueltOpprettet}
      selectedActivityType={selectedActivityType}
      arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
    />
    {!shouldDisablePeriodpicker(hasAksjonspunkt, initialValues) && (
      <>
        <VerticalSpacer eightPx />
        {!initialValues.erManueltOpprettet && (
          <RadioGroupField
            name="erGodkjent"
            validate={[required]}
            readOnly={readOnly}
            isEdited={initialValues.erEndret}
            radios={[
              {
                value: true,
                label: <FormattedMessage id="ActivityPanel.Godkjent" />,
              },
              {
                value: false,
                label: <FormattedMessage id="ActivityPanel.IkkeGodkjent" values={{ b: chunks => <b>{chunks}</b> }} />,
              },
            ]}
          />
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
            <Button variant="primary" size="small" type="button" onClick={handleSubmit} disabled={pristine}>
              <FormattedMessage id="ActivityPanel.Oppdater" />
            </Button>
          </FlexColumn>
          <FlexColumn>
            <Button variant="secondary" size="small" type="button" onClick={cancelSelectedOpptjeningActivity}>
              <FormattedMessage id="ActivityPanel.Avbryt" />
            </Button>
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
