import React, { FunctionComponent, useMemo } from 'react';
import { AksjonspunktHelpTextTemp, VerticalSpacer } from '@fpsak-frontend/shared-components/index';
import { FormattedMessage } from 'react-intl';
import { behandlingForm } from '@fpsak-frontend/form/src/behandlingForm';
import { connect } from 'react-redux';
import { InjectedFormProps, ConfigProps, SubmitHandler } from 'redux-form';
import { minLength, maxLength, required, hasValidText } from '@fpsak-frontend/utils';
import { Hovedknapp } from 'nav-frontend-knapper';
import { CheckboxField, RadioGroupField, RadioOption, TextAreaField } from '@fpsak-frontend/form/index';
import { Element } from 'nav-frontend-typografi';
import styled from 'styled-components';
import Aktivitet from '../dto/Aktivitet';
import { UtfallEnum } from '../dto/Utfall';
import Rammevedtak, { RammevedtakEnum } from '../dto/Rammevedtak';

interface AksjonspunktFormImplProps {
  aktiviteter: Aktivitet[];
  rammevedtak: Rammevedtak[];
}

interface FormContentProps {
  aktiviteter: Aktivitet[];
  rammevedtak: Rammevedtak[];
  handleSubmit: SubmitHandler;
}

const årskvantumAksjonspunktFormName = 'årskvantumAksjonspunktFormName';

const valg = {
  reBehandling: 'reBehandling',
  fortsett: 'fortsett',
};

const GråBakgrunn = styled.div`
  padding: 0.5em;
  background-color: #e9e7e7;
`;

const FlexEnd = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 1em;
`;

const FormContent: FunctionComponent<FormContentProps> = ({ rammevedtak, aktiviteter, handleSubmit }) => {
  const harUavklartePerioder = useMemo(
    () =>
      aktiviteter.flatMap(({ uttaksperioder }) => uttaksperioder).some(({ utfall }) => utfall === UtfallEnum.UAVKLART),
    [aktiviteter],
  );

  if (harUavklartePerioder) {
    const harUidentifiserteRammevedtak = rammevedtak.some(({ type }) => type === RammevedtakEnum.UIDENTIFISERT);
    return (
      <>
        <AksjonspunktHelpTextTemp isAksjonspunktOpen>
          {[
            <FormattedMessage
              id={
                harUidentifiserteRammevedtak
                  ? 'Årskvantum.Aksjonspunkt.Uavklart.UidentifiserteRammemeldinger'
                  : 'Årskvantum.Aksjonspunkt.Uavklart.OverlappInfotrygd'
              }
            />,
          ]}
        </AksjonspunktHelpTextTemp>
        <VerticalSpacer sixteenPx />
        <CheckboxField
          validate={[required]}
          name="bekreftInfotrygd"
          label={{ id: 'Årskvantum.Aksjonspunkt.Uavklart.BekreftInfotrygd' }}
        />
        <FlexEnd>
          <Hovedknapp onClick={handleSubmit} htmlType="submit">
            <FormattedMessage id="Årskvantum.Aksjonspunkt.Uavklart.KjørPåNytt" />
          </Hovedknapp>
        </FlexEnd>
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
        <RadioOption value={valg.reBehandling} label={{ id: 'Årskvantum.Aksjonspunkt.Avslått.ReBehandling' }} />
        <RadioOption value={valg.fortsett} label={{ id: 'Årskvantum.Aksjonspunkt.Avslått.Fortsett' }} />
      </RadioGroupField>
      <TextAreaField
        label={{ id: 'Årskvantum.Aksjonspunkt.Avslått.Begrunnelse' }}
        name="begrunnelse"
        validate={[required, minLength(3), maxLength(1500), hasValidText]}
        maxLength={1500}
      />
      <FlexEnd>
        <Hovedknapp onClick={handleSubmit} htmlType="submit">
          <FormattedMessage id="Årskvantum.Aksjonspunkt.Avslått.Bekreft" />
        </Hovedknapp>
      </FlexEnd>
    </>
  );
};

const AksjonspunktFormImpl: FunctionComponent<AksjonspunktFormImplProps & InjectedFormProps> = ({
  aktiviteter,
  rammevedtak,
  handleSubmit,
}) => {
  return (
    <form onSubmit={handleSubmit}>
      <GråBakgrunn>
        <FormContent aktiviteter={aktiviteter} rammevedtak={rammevedtak} handleSubmit={handleSubmit} />
      </GråBakgrunn>
      <VerticalSpacer sixteenPx />
    </form>
  );
};

interface FormValues {
  begrunnelse: string;
}

interface AksjonspunktFormProps {
  aktiviteter: Aktivitet[];
  rammevedtak: Rammevedtak[];
  behandlingId: number;
  behandlingVersjon: number;
  submitCallback: (values: any[]) => void;
}

const mapStateToPropsFactory = (_initialState, initialProps: AksjonspunktFormProps) => {
  const { submitCallback } = initialProps;
  const onSubmit = (formValues: FormValues) => {
    console.log(formValues);
    // submitCallback([formValues])
    console.log(submitCallback);
  }; // TODO: mapping
  return (
    state,
    { aktiviteter, rammevedtak }: AksjonspunktFormProps,
  ): Partial<ConfigProps<FormValues>> & AksjonspunktFormImplProps => {
    return {
      onSubmit,
      aktiviteter,
      rammevedtak,
    };
  };
};

export default connect(mapStateToPropsFactory)(
  behandlingForm({
    form: årskvantumAksjonspunktFormName,
    enableReinitialize: true,
  })(AksjonspunktFormImpl),
);
