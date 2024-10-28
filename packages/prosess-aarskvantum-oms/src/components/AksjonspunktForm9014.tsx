import { RadioGroupField, TextAreaField } from '@fpsak-frontend/form/index';
import { behandlingForm, getBehandlingFormName } from '@fpsak-frontend/form/src/behandlingForm';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { AksjonspunktHelpText, BorderBox, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { hasValidText, maxLength, minLength, required } from '@fpsak-frontend/utils';
import { Aksjonspunkt } from '@k9-sak-web/types';
import { Button, Label, Table } from '@navikt/ds-react';
import React, {useEffect, useState} from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { ConfigProps, FieldArray, InjectedFormProps, SubmitHandler, formValueSelector } from 'redux-form';
import Aktivitet from '../dto/Aktivitet';
import { fosterbarnDto } from '../dto/FosterbarnDto';
import FosterbarnForm from './FosterbarnForm';
import styles from './aksjonspunktForm.module.css';
import { valgValues } from './utils';

interface AksjonspunktFormImplProps {
  aktiviteter: Aktivitet[];
  isAksjonspunktOpen: boolean;
  fosterbarn: fosterbarnDto[];
  harEndretFosterbarn: boolean;
  aksjonspunktKode: string;
  valgValue: string;
}

interface FormContentProps {
  handleSubmit: SubmitHandler;
  aktiviteter: Aktivitet[];
  isAksjonspunktOpen: boolean;
  fosterbarn: fosterbarnDto[];
  harEndretFosterbarn: boolean;
  aksjonspunktKode: string;
  valgValue: string;
  initialValues: { begrunnelse: string; fosterbarn: fosterbarnDto[] } | any;
  dirty: boolean;
  reset: () => void;
}

const årskvantumAksjonspunktFormName = 'årskvantumAksjonspunktFormName';

const utledAksjonspunktKode = (aksjonspunkter: Aksjonspunkt[]) => {
  // 9014 skal ha presedens
  if (aksjonspunkter.find(ap => ap.definisjon.kode === aksjonspunktCodes.ÅRSKVANTUM_FOSTERBARN))
    return aksjonspunktCodes.ÅRSKVANTUM_FOSTERBARN;

  if (aksjonspunkter.find(ap => ap.definisjon.kode === aksjonspunktCodes.VURDER_ÅRSKVANTUM_KVOTE))
    return aksjonspunktCodes.VURDER_ÅRSKVANTUM_KVOTE;

  return null;
};

export const FormContent = ({
  handleSubmit,
  isAksjonspunktOpen,
  fosterbarn,
  harEndretFosterbarn,
  aksjonspunktKode,
  valgValue
}: FormContentProps) => {

  return (
    <>
      <AksjonspunktHelpText isAksjonspunktOpen={isAksjonspunktOpen}>
        {[
          <FormattedMessage
            key={1}
            id="Årskvantum.Aksjonspunkt.Uavklart"
          />,
        ]}
      </AksjonspunktHelpText>
      <VerticalSpacer sixteenPx />
      {isAksjonspunktOpen && (
        <RadioGroupField
          name="valg"
          validate={[required]}
          label={
            <Label size="small" as="p">
              <FormattedMessage id="Årskvantum.Aksjonspunkt.Uavklart.Valg" />
            </Label>
          }
          radios={[
            {
              value: valgValues.reBehandling,
              label: (
                <FormattedMessage
                  id="Årskvantum.Aksjonspunkt.Uavklart.ReBehandling"
                />
              ),
            },
            {
              value: valgValues.fortsett,
              disabled: harEndretFosterbarn,
              label: (
                <FormattedMessage
                  id="Årskvantum.Aksjonspunkt.Uavklart.Fortsett"
                />
              ),
            },
          ]}
        />
      )}
      <TextAreaField
        label={{ id: 'Årskvantum.Aksjonspunkt.Uavklart.Begrunnelse' }}
        name="begrunnelse"
        validate={[required, minLength(3), maxLength(1500), hasValidText]}
        maxLength={1500}
        readOnly={!isAksjonspunktOpen}
      />
      <VerticalSpacer sixteenPx />

      {isAksjonspunktOpen && (
        <>
          <BorderBox>
            <FieldArray
              name="fosterbarn"
              component={FosterbarnForm}
              barn={fosterbarn}
              isAksjonspunktOpen={isAksjonspunktOpen}
              valgValue={valgValue}
              aksjonspunktkode={aksjonspunktKode}
            />
          </BorderBox>
          <VerticalSpacer sixteenPx />
        </>
      )}

      {isAksjonspunktOpen && (
        <div className={styles.spaceBetween}>
          <Button size="small" variant="primary" onClick={handleSubmit} type="submit">
            <FormattedMessage id="Årskvantum.Aksjonspunkt.Uavklart.Bekreft" />
          </Button>
        </div>
      )}
    </>
  );
};

const AksjonspunktFormImpl = ({
  aktiviteter,
  handleSubmit,
  isAksjonspunktOpen,
  fosterbarn,
  harEndretFosterbarn,
  aksjonspunktKode,
  valgValue,
  initialValues,
  dirty,
  reset,
}: AksjonspunktFormImplProps & InjectedFormProps) => (
  <form data-testid="aksjonspunktform" onSubmit={handleSubmit}>
    <div className={styles.graBoks}>
      <FormContent
        handleSubmit={handleSubmit}
        aktiviteter={aktiviteter}
        isAksjonspunktOpen={isAksjonspunktOpen}
        fosterbarn={fosterbarn}
        harEndretFosterbarn={harEndretFosterbarn}
        aksjonspunktKode={aksjonspunktKode}
        valgValue={valgValue}
        initialValues={initialValues}
        dirty={dirty}
        reset={reset}
      />
    </div>
  </form>
);

export interface FormValues {
  begrunnelse?: string;
  bekreftInfotrygd?: boolean;
  valg?: 'reBehandling' | 'fortsett';
  fosterbarn?: string[];
}

interface AksjonspunktFormProps {
  aktiviteter: Aktivitet[];
  behandlingId: number;
  behandlingVersjon: number;
  submitCallback: (values: any[]) => void;
  aksjonspunkterForSteg?: Aksjonspunkt[];
  isAksjonspunktOpen: boolean;
  fosterbarn: fosterbarnDto[];
}

export const begrunnelseUavklartePerioder = 'Rammemeldinger er oppdatert i Infotrygd';
/**
 * Skal ikke be saksbehandler om begrunnelse hvis uavklarte perioder, men backend krvever det.
 * Hardkoder derfor begrunnelsen i de tilfellene.
 * */
export const transformValues = (
  { begrunnelse = begrunnelseUavklartePerioder, valg, bekreftInfotrygd, fosterbarn }: FormValues,
  kode: string,
  initialFosterbarn: string[] = [],
) => {
  if (kode === aksjonspunktCodes.ÅRSKVANTUM_FOSTERBARN && valg === valgValues.fortsett) {
    return [{ kode, begrunnelse, fortsettBehandling: true, fosterbarn: initialFosterbarn }];
  }

  if (bekreftInfotrygd || valg === valgValues.reBehandling) {
    return [{ kode, begrunnelse, fortsettBehandling: false, fosterbarn }];
  }

  return [{ kode, begrunnelse, fortsettBehandling: true, fosterbarn }];
};

const mapStateToPropsFactory = (_initialState, initialProps: AksjonspunktFormProps) => {
  const { submitCallback, aksjonspunkterForSteg: aksjonspunkter } = initialProps;
  const aksjonspunktKode = utledAksjonspunktKode(aksjonspunkter);
  const onSubmit = (formValues: FormValues) =>
    submitCallback(
      transformValues(
        formValues,
        aksjonspunktKode,
        initialProps.fosterbarn.map(barn => barn.fnr),
      ),
    );
  const { behandlingId, behandlingVersjon } = initialProps;
  const formNavn = getBehandlingFormName(behandlingId, behandlingVersjon, årskvantumAksjonspunktFormName);

  return (
    state,
    { aktiviteter, isAksjonspunktOpen, aksjonspunkterForSteg = [], fosterbarn }: AksjonspunktFormProps,
  ): Partial<ConfigProps<FormValues>> & AksjonspunktFormImplProps => {
    const selector = formValueSelector(formNavn);
    const { valg: valgValue, fosterbarn: formFosterbarn } = selector(state, 'valg', 'fosterbarn');
    const harEndretFosterbarn = formFosterbarn.length !== initialProps.fosterbarn.length || (
      // Kopier, sorter og konverter til streng for sammenligning
      formFosterbarn.slice().sort().join('') !== initialProps.fosterbarn.map(barn => barn.fnr).slice().sort().join('')
    )

    return {
      onSubmit,
      aktiviteter,
      isAksjonspunktOpen,
      initialValues: {
        begrunnelse: aksjonspunkterForSteg[0]?.begrunnelse,
        fosterbarn: fosterbarn.map(barn => barn.fnr),
      },
      fosterbarn,
      harEndretFosterbarn,
      aksjonspunktKode,
      valgValue,
    };
  };
};

export default connect(mapStateToPropsFactory)(
  behandlingForm({
    form: årskvantumAksjonspunktFormName,
    enableReinitialize: true,
  })(AksjonspunktFormImpl),
);
