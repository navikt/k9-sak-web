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
import Aksjonspunkt from '@k9-sak-web/types/src/aksjonspunktTsType';
import Aktivitet from '../dto/Aktivitet';
import { UtfallEnum } from '../dto/Utfall';
import { VilkårEnum } from '../dto/Vilkår';
import { VurderteVilkår } from '../dto/Uttaksperiode';

interface AksjonspunktFormImplProps {
  aktiviteter: Aktivitet[];
  isAksjonspunktOpen: boolean;
}

interface FormContentProps {
  handleSubmit: SubmitHandler;
  harUavklartePerioder: boolean;
  isAksjonspunktOpen: boolean;
}

const årskvantumAksjonspunktFormName = 'årskvantumAksjonspunktFormName';

const valgValues = {
  reBehandling: 'reBehandling',
  fortsett: 'fortsett',
};

const GråBakgrunn = styled.div`
  padding: 1em;
  background-color: #e9e7e7;
  margin-bottom: 1em;
`;

const SpaceBetween = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-top: 1em;
`;

export const FormContent: FunctionComponent<FormContentProps> = ({
  handleSubmit,
  harUavklartePerioder,
  isAksjonspunktOpen,
}) => {
  if (harUavklartePerioder) {
    return (
      <>
        <AksjonspunktHelpTextTemp isAksjonspunktOpen={isAksjonspunktOpen}>
          {[<FormattedMessage id="Årskvantum.Aksjonspunkt.Uavklart.UidentifiserteRammemeldinger" />]}
        </AksjonspunktHelpTextTemp>
        {isAksjonspunktOpen && (
          <>
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
        )}
      </>
    );
  }

  return (
    <>
      <AksjonspunktHelpTextTemp isAksjonspunktOpen={isAksjonspunktOpen}>
        {[<FormattedMessage id="Årskvantum.Aksjonspunkt.Avslått" />]}
      </AksjonspunktHelpTextTemp>
      <VerticalSpacer sixteenPx />
      {isAksjonspunktOpen && (
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
      )}
      <TextAreaField
        label={{ id: 'Årskvantum.Aksjonspunkt.Avslått.Begrunnelse' }}
        name="begrunnelse"
        validate={[required, minLength(3), maxLength(1500), hasValidText]}
        maxLength={1500}
        readOnly={!isAksjonspunktOpen}
      />
      {isAksjonspunktOpen && (
        <SpaceBetween>
          <Hovedknapp onClick={handleSubmit} htmlType="submit">
            <FormattedMessage id="Årskvantum.Aksjonspunkt.Avslått.Bekreft" />
          </Hovedknapp>
        </SpaceBetween>
      )}
    </>
  );
};

const vilkårHarOverlappendePerioderIInfotrygd = (vurderteVilkår: VurderteVilkår) =>
  Object.entries(vurderteVilkår).some(
    ([vilkår, utfall]) => vilkår === VilkårEnum.NOK_DAGER && utfall === UtfallEnum.UAVKLART,
  );

const AksjonspunktFormImpl: FunctionComponent<AksjonspunktFormImplProps & InjectedFormProps> = ({
  aktiviteter,
  handleSubmit,
  isAksjonspunktOpen,
}) => {
  const uavklartePerioder = useMemo(
    () =>
      aktiviteter
        .flatMap(({ uttaksperioder }) => uttaksperioder)
        .filter(({ utfall }) => utfall === UtfallEnum.UAVKLART),
    [aktiviteter],
  );

  const harUavklartePerioder = uavklartePerioder.length > 0;

  if (harUavklartePerioder) {
    const harOverlappendePerioderIInfotrygd = uavklartePerioder.some(({ vurderteVilkår }) =>
      vilkårHarOverlappendePerioderIInfotrygd(vurderteVilkår.vilkår),
    );
    if (harOverlappendePerioderIInfotrygd) {
      return (
        <GråBakgrunn>
          <AksjonspunktHelpTextTemp isAksjonspunktOpen={isAksjonspunktOpen}>
            {[<FormattedMessage id="Årskvantum.Aksjonspunkt.Uavklart.OverlappInfotrygd" />]}
          </AksjonspunktHelpTextTemp>
        </GråBakgrunn>
      );
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <GråBakgrunn>
        <FormContent
          handleSubmit={handleSubmit}
          harUavklartePerioder={harUavklartePerioder}
          isAksjonspunktOpen={isAksjonspunktOpen}
        />
      </GråBakgrunn>
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
  behandlingId: number;
  behandlingVersjon: number;
  submitCallback: (values: any[]) => void;
  aksjonspunkterForSteg?: Aksjonspunkt[];
  isAksjonspunktOpen: boolean;
}

export const begrunnelseUavklartePerioder = 'Rammemeldinger er oppdatert i Infotrygd';
/**
 * Skal ikke be saksbehandler om begrunnelse hvis uavklarte perioder, men backend krvever det.
 * Hardkoder derfor begrunnelsen i de tilfellene.
 * */
export const transformValues = ({ begrunnelse = begrunnelseUavklartePerioder, valg, bekreftInfotrygd }: FormValues) => {
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
    { aktiviteter, isAksjonspunktOpen, aksjonspunkterForSteg = [] }: AksjonspunktFormProps,
  ): Partial<ConfigProps<FormValues>> & AksjonspunktFormImplProps => {
    return {
      onSubmit,
      aktiviteter,
      isAksjonspunktOpen,
      initialValues: { begrunnelse: aksjonspunkterForSteg[0]?.begrunnelse },
    };
  };
};

export default connect(mapStateToPropsFactory)(
  behandlingForm({
    form: årskvantumAksjonspunktFormName,
    enableReinitialize: true,
  })(AksjonspunktFormImpl),
);
