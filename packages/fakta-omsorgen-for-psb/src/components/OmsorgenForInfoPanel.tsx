import { behandlingFormTs } from '@fpsak-frontend/fp-felles';
import aksjonspunktCodes, { hasAksjonspunkt } from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import {
  FlexColumn,
  FlexContainer,
  FlexRow,
  AksjonspunktHelpTextTemp,
  VerticalSpacer,
} from '@fpsak-frontend/shared-components';
import { Aksjonspunkt, Personopplysninger, SubmitCallback, OmsorgenFor } from '@k9-sak-web/types';
import moment from 'moment';
import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import { InjectedFormProps } from 'redux-form';
import { createSelector } from 'reselect';
import { FormattedMessage, useIntl } from 'react-intl';
import { Systemtittel } from 'nav-frontend-typografi';
import { TextAreaField, RadioGroupField, RadioOption } from '@fpsak-frontend/form';
import { required, minLength, maxLength, hasValidText } from '@fpsak-frontend/utils';
import { FaktaSubmitButton } from '@fpsak-frontend/fp-felles/src/fakta/FaktaSubmitButton';
import SokerinfoTable from './SokerinfoTable';
import styles from './omsorgenForInfo.less';

const formName = 'OmsorgenForForm';

const getSokerinfo = (personopplysninger: Personopplysninger, omsorgenFor: OmsorgenFor) => {
  const sokerOgBarnetsAlder = {
    header: 'SokerinfoTable.SokerOgBarnetsAlders',
    forhold: [
      {
        forholdstekst: 'SokerinfoTable.SokerErUnderSyttiAar',
        erOppfylt: moment(moment()).diff(personopplysninger.fodselsdato, 'years') < 70,
      },
      {
        forholdstekst: 'SokerinfoTable.BarnetErUnderAttenAar',
        erOppfylt: moment(moment()).diff(personopplysninger.barnSoktFor[0].fodselsdato, 'years') < 18,
      },
    ],
  };

  const omsorg = {
    header: 'SokerinfoTable.Omsorg',
    forhold: [
      {
        forholdstekst: 'SokerinfoTable.OmsorgenFor',
        erOppfylt: omsorgenFor.harOmsorgenFor,
      },
      {
        forholdstekst: 'SokerinfoTable.MorEllerFar',
        erOppfylt: omsorgenFor.morEllerFar,
      },
      {
        forholdstekst: 'SokerinfoTable.SammeBosted',
        erOppfylt: omsorgenFor.sammeBosted,
      },
    ],
  };

  return [sokerOgBarnetsAlder, omsorg];
};

const { OMSORGEN_FOR } = aksjonspunktCodes;

const getHelpTexts = aksjonspunkter => {
  const helpTexts = [];
  if (hasAksjonspunkt(OMSORGEN_FOR, aksjonspunkter)) {
    helpTexts.push(<FormattedMessage key="VurderBehov" id="MedisinskVilkarPanel.VurderBehov" />);
  }
  return helpTexts;
};

interface OmsorgenForInfoPanelImplProps {
  behandlingId: number;
  behandlingVersjon: number;
  aksjonspunkter: Aksjonspunkt[];
  readOnly: boolean;
  personopplysninger: Personopplysninger;
  omsorgenFor: OmsorgenFor;
  submitCallback: (props: SubmitCallback[]) => void;
  harApneAksjonspunkter: boolean;
  submittable: boolean;
}

const OmsorgenForInfoPanelImpl = (props: OmsorgenForInfoPanelImplProps & InjectedFormProps) => {
  const {
    aksjonspunkter,
    personopplysninger,
    omsorgenFor,
    harApneAksjonspunkter,
    submittable,
    readOnly,
    behandlingId,
    behandlingVersjon,
    handleSubmit,
  } = props;
  const isApOpen = harApneAksjonspunkter || !submittable;
  const getAksjonspunktHelpText = useCallback(
    () => (
      <AksjonspunktHelpTextTemp isAksjonspunktOpen={isApOpen}>{getHelpTexts(aksjonspunkter)}</AksjonspunktHelpTextTemp>
    ),
    [aksjonspunkter, isApOpen],
  );
  const sokerinfo = getSokerinfo(personopplysninger, omsorgenFor);
  const intl = useIntl();
  return (
    <FlexContainer>
      <FlexRow>
        <FlexColumn>
          <div className={styles.headingContainer}>
            <Systemtittel>
              <FormattedMessage id="FaktaOmAlderOgOmsorg.header" />
            </Systemtittel>
          </div>
          {getAksjonspunktHelpText()}
        </FlexColumn>
      </FlexRow>
      {sokerinfo.map(info => (
        <FlexRow wrap key={info.header}>
          <FlexColumn className="flexColumn--1-2">
            <SokerinfoTable forhold={info.forhold} header={info.header} />
          </FlexColumn>
        </FlexRow>
      ))}
      <form onSubmit={handleSubmit}>
        <FlexRow>
          <FlexColumn className="flexColumn--1-2">
            {harApneAksjonspunkter && (
              <>
                <VerticalSpacer eightPx />
                <RadioGroupField
                  name="harOmsorgenFor"
                  bredde="M"
                  validate={[required]}
                  readOnly={readOnly}
                  direction="vertical"
                  dataId="harOmsorgenForJa"
                  label={<FormattedMessage id="FaktaOmAlderOgOmsorg.HarSokerenOmsorgenForBarnet" />}
                  legend={<FormattedMessage id="FaktaOmAlderOgOmsorg.HarSokerenOmsorgenForBarnet" />}
                >
                  <RadioOption label={{ id: 'FaktaOmAlderOgOmsorg.Ja' }} value />
                  <RadioOption label={{ id: 'FaktaOmAlderOgOmsorg.Nei' }} value={false} />
                </RadioGroupField>
              </>
            )}
            <VerticalSpacer eightPx />
            <TextAreaField
              name="vurdering"
              label={{ id: 'FaktaOmAlderOgOmsorg.Vurdering' }}
              validate={[required, minLength(3), maxLength(2000), hasValidText]}
              readOnly={readOnly || !harApneAksjonspunkter}
              aria-label={intl.formatMessage({ id: 'FaktaOmAlderOgOmsorg.HarSokerenOmsorgenForBarnet' })}
            />
          </FlexColumn>
        </FlexRow>
        {harApneAksjonspunkter && (
          <FlexRow>
            <FlexColumn>
              <VerticalSpacer twentyPx />
              <FaktaSubmitButton
                buttonTextId="SubmitButton.ConfirmInformation"
                formName={formName}
                behandlingId={behandlingId}
                behandlingVersjon={behandlingVersjon}
                isSubmittable={submittable}
                isReadOnly={readOnly} // TODO: Mangler overstyringDisabled
                hasOpenAksjonspunkter={harApneAksjonspunkter}
                dataId="medisinskVilkarSubmitButton"
              />
            </FlexColumn>
          </FlexRow>
        )}
      </form>
    </FlexContainer>
  );
};

interface TransformValues {
  vurdering: string;
  harOmsorgenFor: boolean;
}

const transformValues = (values: TransformValues) => {
  return {
    kode: aksjonspunktCodes.OMSORGEN_FOR,
    begrunnelse: values.vurdering,
    harOmsorgenFor: values.harOmsorgenFor,
  };
};

const buildInitialValues = createSelector(
  [(props: { aksjonspunkter: Aksjonspunkt[] }) => props.aksjonspunkter],
  aksjonspunkter => {
    const aksjonspunkt = aksjonspunkter?.find(ap => ap.definisjon.kode === aksjonspunktCodes.OMSORGEN_FOR);

    return {
      begrunnelse: aksjonspunkt?.begrunnelse ?? '',
    };
  },
);

const mapStateToProps = (_, props: OmsorgenForInfoPanelImplProps) => {
  const { aksjonspunkter, submitCallback } = props;
  const onSubmit = values => submitCallback([transformValues(values)]);

  return () => ({
    onSubmit,
    initialValues: buildInitialValues({ aksjonspunkter }),
  });
};

const connectedComponent = connect(mapStateToProps)(
  behandlingFormTs({
    form: formName,
    enableReinitialize: true,
  })(OmsorgenForInfoPanelImpl),
);

export default connectedComponent;
