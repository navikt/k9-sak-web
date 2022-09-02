import React, { useEffect, useMemo, useState } from 'react';
import {
  AksjonspunktHelpTextTemp,
  BorderBox,
  VerticalSpacer,
  Table,
  TableColumn,
  TableRow,
} from '@fpsak-frontend/shared-components';
import { FormattedMessage } from 'react-intl';
import { behandlingForm, getBehandlingFormName } from '@fpsak-frontend/form/src/behandlingForm';
import { connect } from 'react-redux';
import { InjectedFormProps, ConfigProps, SubmitHandler, FieldArray, formValueSelector } from 'redux-form';
import { minLength, maxLength, required, hasValidText, hasValidValue } from '@fpsak-frontend/utils';
import { Hovedknapp } from 'nav-frontend-knapper';
import { CheckboxField, RadioGroupField, RadioOption, TextAreaField } from '@fpsak-frontend/form/index';
import { Element } from 'nav-frontend-typografi';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { Aksjonspunkt, UtfallEnum, VurderteVilkår, VilkårEnum } from '@k9-sak-web/types';
import { Modal } from '@navikt/ds-react';
import styles from './aksjonspunktForm.less';
import Aktivitet from '../dto/Aktivitet';
import { fosterbarnDto } from '../dto/FosterbarnDto';
import FosterbarnForm from './FosterbarnForm';

interface AksjonspunktFormImplProps {
  aktiviteter: Aktivitet[];
  isAksjonspunktOpen: boolean;
  fosterbarn: fosterbarnDto[];
  aksjonspunktKode: string;
  valgValue: string;
  fosterbarnValue: fosterbarnDto[];
}

interface FormContentProps {
  handleSubmit: SubmitHandler;
  aktiviteter: Aktivitet[];
  isAksjonspunktOpen: boolean;
  fosterbarn: fosterbarnDto[];
  aksjonspunktKode: string;
  valgValue: string;
  fosterbarnValue: fosterbarnDto[];
  initialValues: { begrunnelse: string; fosterbarn: fosterbarnDto[] } | any;
  dirty: boolean;
  reset: () => void;
}

const årskvantumAksjonspunktFormName = 'årskvantumAksjonspunktFormName';

const valgValues = {
  reBehandling: 'reBehandling',
  fortsett: 'fortsett',
};

const vilkårHarOverlappendePerioderIInfotrygd = (vurderteVilkår: VurderteVilkår) =>
  Object.entries(vurderteVilkår).some(
    ([vilkår, utfall]) => vilkår === VilkårEnum.NOK_DAGER && utfall === UtfallEnum.UAVKLART,
  );

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
  aktiviteter = [],
  isAksjonspunktOpen,
  fosterbarn,
  aksjonspunktKode,
  valgValue,
  fosterbarnValue,
  initialValues,
}: FormContentProps) => {
  Modal.setAppElement(document.body);
  const uavklartePerioder = useMemo(
    () =>
      aktiviteter
        .flatMap(({ uttaksperioder }) => uttaksperioder)
        .filter(({ utfall }) => utfall === UtfallEnum.UAVKLART),
    [aktiviteter],
  );

  const [fosterbarnEndret, setFosterbarnEndret] = useState<boolean>(false);
  const erÅF = aksjonspunktKode === aksjonspunktCodes.ÅRSKVANTUM_FOSTERBARN;

  useEffect(() => {
    if (erÅF && fosterbarnValue && initialValues.fosterbarn) {
      setFosterbarnEndret(
        JSON.stringify([...initialValues.fosterbarn].sort()) !== JSON.stringify([...fosterbarnValue].sort()),
      );
    }
  }, [setFosterbarnEndret, fosterbarnValue]);

  const harUavklartePerioder = uavklartePerioder.length > 0;

  const erFosterbarnEndret = value => {
    if (erÅF && value === valgValues.reBehandling && !fosterbarnEndret) {
      return [{ id: 'Årskvantum.Aksjonspunkt.Avslått.Fosterbarn.KanIkkeRebehandle' }];
    }
    return undefined;
  };

  if (harUavklartePerioder) {
    const harOverlappendePerioderIInfotrygd = uavklartePerioder.some(({ vurderteVilkår }) =>
      vilkårHarOverlappendePerioderIInfotrygd(vurderteVilkår.vilkår),
    );

    return (
      <>
        <AksjonspunktHelpTextTemp isAksjonspunktOpen={isAksjonspunktOpen}>
          {[
            <FormattedMessage
              key={1}
              id={
                harOverlappendePerioderIInfotrygd
                  ? 'Årskvantum.Aksjonspunkt.Uavklart.OverlappInfotrygd'
                  : 'Årskvantum.Aksjonspunkt.Uavklart.UidentifiserteRammemeldinger'
              }
            />,
          ]}
        </AksjonspunktHelpTextTemp>
        {isAksjonspunktOpen && (
          <>
            <VerticalSpacer sixteenPx />
            <div className={styles.spaceBetween}>
              <CheckboxField
                // @ts-ignore Fiks
                validate={[hasValidValue(true)]}
                name="bekreftInfotrygd"
                label={{
                  id: harOverlappendePerioderIInfotrygd
                    ? 'Årskvantum.Aksjonspunkt.Overlapp.BekreftInfotrygd'
                    : 'Årskvantum.Aksjonspunkt.Uavklart.BekreftInfotrygd',
                }}
              />
              <Hovedknapp onClick={handleSubmit} htmlType="submit">
                <FormattedMessage id="Årskvantum.Aksjonspunkt.Uavklart.KjørPåNytt" />
              </Hovedknapp>
            </div>
          </>
        )}
      </>
    );
  }

  return (
    <>
      <AksjonspunktHelpTextTemp isAksjonspunktOpen={isAksjonspunktOpen}>
        {[
          <FormattedMessage
            key={1}
            id={erÅF ? 'Årskvantum.Aksjonspunkt.Avslått.Fosterbarn' : 'Årskvantum.Aksjonspunkt.Avslått'}
          />,
        ]}
      </AksjonspunktHelpTextTemp>
      <VerticalSpacer sixteenPx />
      {isAksjonspunktOpen && (
        <RadioGroupField
          name="valg"
          validate={[required, erFosterbarnEndret]}
          label={
            <Element>
              <FormattedMessage id="Årskvantum.Aksjonspunkt.Avslått.Valg" />
            </Element>
          }
        >
          <RadioOption
            value={valgValues.reBehandling}
            label={{
              id: erÅF
                ? 'Årskvantum.Aksjonspunkt.Avslått.ReBehandling.Fosterbarn'
                : 'Årskvantum.Aksjonspunkt.Avslått.ReBehandling',
            }}
          />
          <RadioOption
            value={valgValues.fortsett}
            label={{
              id: erÅF
                ? 'Årskvantum.Aksjonspunkt.Avslått.Fortsett.Fosterbarn'
                : 'Årskvantum.Aksjonspunkt.Avslått.Fortsett',
            }}
          />
        </RadioGroupField>
      )}
      <TextAreaField
        label={{ id: 'Årskvantum.Aksjonspunkt.Avslått.Begrunnelse' }}
        name="begrunnelse"
        validate={[required, minLength(3), maxLength(1500), hasValidText]}
        maxLength={1500}
        readOnly={!isAksjonspunktOpen}
      />
      <VerticalSpacer sixteenPx />

      {isAksjonspunktOpen && (!erÅF || valgValue === valgValues.reBehandling) && (
        <>
          <BorderBox>
            <FieldArray
              name="fosterbarn"
              component={FosterbarnForm}
              barn={fosterbarn}
              isAksjonspunktOpen={isAksjonspunktOpen}
            />
          </BorderBox>
          <VerticalSpacer sixteenPx />
        </>
      )}

      {erÅF && (valgValue === valgValues.fortsett || !valgValue) && initialValues.fosterbarn.length > 0 && (
        <>
          <VerticalSpacer eightPx />
          <Table>
            <TableRow isHeader>
              <TableColumn>Fosterbarn</TableColumn>
            </TableRow>
            {initialValues.fosterbarn.map((fosterbarnFnr, index) => {
              const fosterbarnObj = fosterbarn.find(barn => barn.fnr === fosterbarnFnr);
              const navn = fosterbarnObj && fosterbarnObj.navn ? fosterbarnObj.navn : `Fosterbarn ${index + 1}`;
              return (
                <TableRow key={`${navn}`}>
                  <TableColumn className={styles.vertikaltSentrert}>
                    {navn} ({fosterbarnObj.fnr})
                  </TableColumn>
                </TableRow>
              );
            })}
          </Table>
          <VerticalSpacer eightPx />
        </>
      )}

      {isAksjonspunktOpen && (
        <div className={styles.spaceBetween}>
          <Hovedknapp onClick={handleSubmit} htmlType="submit">
            <FormattedMessage id="Årskvantum.Aksjonspunkt.Avslått.Bekreft" />
          </Hovedknapp>
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
  aksjonspunktKode,
  valgValue,
  fosterbarnValue,
  initialValues,
  dirty,
  reset,
}: AksjonspunktFormImplProps & InjectedFormProps) => (
  <form onSubmit={handleSubmit}>
    <div className={styles.graBoks}>
      <FormContent
        handleSubmit={handleSubmit}
        aktiviteter={aktiviteter}
        isAksjonspunktOpen={isAksjonspunktOpen}
        fosterbarn={fosterbarn}
        aksjonspunktKode={aksjonspunktKode}
        valgValue={valgValue}
        fosterbarnValue={fosterbarnValue}
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
    const { valg: valgValue, fosterbarn: fosterbarnValue } = selector(state, 'valg', 'fosterbarn');

    return {
      onSubmit,
      aktiviteter,
      isAksjonspunktOpen,
      initialValues: {
        begrunnelse: aksjonspunkterForSteg[0]?.begrunnelse,
        fosterbarn: fosterbarn.map(barn => barn.fnr),
      },
      fosterbarn,
      aksjonspunktKode,
      valgValue,
      fosterbarnValue,
    };
  };
};

export default connect(mapStateToPropsFactory)(
  behandlingForm({
    form: årskvantumAksjonspunktFormName,
    enableReinitialize: true,
  })(AksjonspunktFormImpl),
);
