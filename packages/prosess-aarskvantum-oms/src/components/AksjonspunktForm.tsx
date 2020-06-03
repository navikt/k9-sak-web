import React, { FunctionComponent, useMemo } from 'react';
import { AksjonspunktHelpTextTemp, VerticalSpacer } from '@fpsak-frontend/shared-components/index';
import { FormattedMessage } from 'react-intl';
import { behandlingForm } from '@fpsak-frontend/form/src/behandlingForm';
import { connect } from 'react-redux';
import { InjectedFormProps, ConfigProps, SubmitHandler } from 'redux-form';
import { minLength, maxLength, required, hasValidText, hasValidValue } from '@fpsak-frontend/utils';
import { Hovedknapp } from 'nav-frontend-knapper';
import { CheckboxField, RadioGroupField, RadioOption, TextAreaField } from '@fpsak-frontend/form/index';
import { Element } from 'nav-frontend-typografi';
import styled from 'styled-components';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { RammevedtakEnum, Rammevedtak } from '@k9-sak-web/types';
import { getFeatureToggles } from '@fpsak-frontend/sak-app/src/app/duck';
import { featureToggle } from '@fpsak-frontend/fp-felles/index';
import Aktivitet from '../dto/Aktivitet';
import { UtfallEnum } from '../dto/Utfall';

interface AksjonspunktFormImplProps {
  aktiviteter: Aktivitet[];
  rammevedtak: Rammevedtak[];
  featureSkalViseAksjonspunkt: boolean;
}

interface FormContentProps {
  handleSubmit: SubmitHandler;
  harUavklartePerioder: boolean;
}

const årskvantumAksjonspunktFormName = 'årskvantumAksjonspunktFormName';

const valgValues = {
  reBehandling: 'reBehandling',
  fortsett: 'fortsett',
};

const GråBakgrunn = styled.div`
  padding: 1em;
  background-color: #e9e7e7;
`;

const SpaceBetween = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-top: 1em;
`;

export const FormContent: FunctionComponent<FormContentProps> = ({ handleSubmit, harUavklartePerioder }) => {
  if (harUavklartePerioder) {
    return (
      <>
        <AksjonspunktHelpTextTemp isAksjonspunktOpen>
          {[<FormattedMessage id="Årskvantum.Aksjonspunkt.Uavklart.UidentifiserteRammemeldinger" />]}
        </AksjonspunktHelpTextTemp>
        <VerticalSpacer sixteenPx />
        <SpaceBetween>
          <CheckboxField
            validate={[hasValidValue(true)]}
            name="bekreftInfotrygd"
            label={{ id: 'Årskvantum.Aksjonspunkt.Uavklart.BekreftInfotrygd' }}
          />
          <Hovedknapp onClick={handleSubmit} htmlType="submit">
            <FormattedMessage id="Årskvantum.Aksjonspunkt.Uavklart.KjørPåNytt" />
          </Hovedknapp>
        </SpaceBetween>
      </>
    );
  }

  return (
    <>
      <AksjonspunktHelpTextTemp isAksjonspunktOpen>
        {[<FormattedMessage id="Årskvantum.Aksjonspunkt.Avslått" />]}
      </AksjonspunktHelpTextTemp>
      <VerticalSpacer sixteenPx />
      <RadioGroupField
        name="valg"
        validate={[required]}
        label={
          <Element>
            <FormattedMessage id="Årskvantum.Aksjonspunkt.Avslått.Valg" />
          </Element>
        }
      >
        <RadioOption value={valgValues.reBehandling} label={{ id: 'Årskvantum.Aksjonspunkt.Avslått.ReBehandling' }} />
        <RadioOption value={valgValues.fortsett} label={{ id: 'Årskvantum.Aksjonspunkt.Avslått.Fortsett' }} />
      </RadioGroupField>
      <TextAreaField
        label={{ id: 'Årskvantum.Aksjonspunkt.Avslått.Begrunnelse' }}
        name="begrunnelse"
        validate={[required, minLength(3), maxLength(1500), hasValidText]}
        maxLength={1500}
      />
      <SpaceBetween>
        <Hovedknapp onClick={handleSubmit} htmlType="submit">
          <FormattedMessage id="Årskvantum.Aksjonspunkt.Avslått.Bekreft" />
        </Hovedknapp>
      </SpaceBetween>
    </>
  );
};

const AksjonspunktFormImpl: FunctionComponent<AksjonspunktFormImplProps & InjectedFormProps> = ({
  aktiviteter,
  rammevedtak,
  handleSubmit,
  featureSkalViseAksjonspunkt,
}) => {
  if (!featureSkalViseAksjonspunkt) {
    return null;
  }

  const harUavklartePerioder = useMemo(
    () =>
      aktiviteter.flatMap(({ uttaksperioder }) => uttaksperioder).some(({ utfall }) => utfall === UtfallEnum.UAVKLART),
    [aktiviteter],
  );

  if (harUavklartePerioder) {
    const harUidentifiserteRammevedtak = rammevedtak.some(({ type }) => type === RammevedtakEnum.UIDENTIFISERT);
    if (!harUidentifiserteRammevedtak) {
      return (
        <AksjonspunktHelpTextTemp isAksjonspunktOpen>
          {[<FormattedMessage id="Årskvantum.Aksjonspunkt.Uavklart.OverlappInfotrygd" />]}
        </AksjonspunktHelpTextTemp>
      );
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <GråBakgrunn>
        <FormContent handleSubmit={handleSubmit} harUavklartePerioder={harUavklartePerioder} />
      </GråBakgrunn>
      <VerticalSpacer sixteenPx />
    </form>
  );
};

export interface FormValues {
  begrunnelse?: string;
  bekreftInfotrygd?: boolean;
  valg?: 'reBehandling' | 'fortsett';
}

interface AksjonspunktFormProps {
  aktiviteter: Aktivitet[];
  rammevedtak: Rammevedtak[];
  behandlingId: number;
  behandlingVersjon: number;
  submitCallback: (values: any[]) => void;
}

/**
 * Skal ikke be saksbehandler om begrunnelse hvis uavklarte perioder, men backend krvever det.
 * Hardkoder derfor begrunnelsen i de tilfellene.
 * */
export const transformValues = ({
  begrunnelse = 'Rammemeldinger er oppdatert i Infotrygd',
  valg,
  bekreftInfotrygd,
}: FormValues) => {
  if (bekreftInfotrygd || valg === valgValues.reBehandling) {
    return [{ kode: aksjonspunktCodes.VURDER_ÅRSKVANTUM_KVOTE, begrunnelse, fortsettBehandling: false }];
  }
  return [{ kode: aksjonspunktCodes.VURDER_ÅRSKVANTUM_KVOTE, begrunnelse, fortsettBehandling: true }];
};

const mapStateToPropsFactory = (_initialState, initialProps: AksjonspunktFormProps) => {
  const { submitCallback } = initialProps;
  const onSubmit = (formValues: FormValues) => submitCallback(transformValues(formValues));

  return (
    state,
    { aktiviteter, rammevedtak }: AksjonspunktFormProps,
  ): Partial<ConfigProps<FormValues>> & AksjonspunktFormImplProps => {
    const featureToggles = getFeatureToggles(state);
    const featureSkalViseAksjonspunkt = featureToggles && featureToggles[featureToggle.AKTIVER_UTTAK_AKSJONSPUNKT];
    return {
      onSubmit,
      aktiviteter,
      rammevedtak,
      featureSkalViseAksjonspunkt,
    };
  };
};

export default connect(mapStateToPropsFactory)(
  behandlingForm({
    form: årskvantumAksjonspunktFormName,
    enableReinitialize: true,
  })(AksjonspunktFormImpl),
);
