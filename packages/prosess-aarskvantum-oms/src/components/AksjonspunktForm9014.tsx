import React, { useMemo } from 'react';
import {
  AksjonspunktHelpTextTemp,
  BorderBox,
  Table,
  TableColumn,
  TableRow,
  VerticalSpacer,
} from '@fpsak-frontend/shared-components';
import { FormattedMessage } from 'react-intl';
import { behandlingForm } from '@fpsak-frontend/form/src/behandlingForm';
import { connect } from 'react-redux';
import { InjectedFormProps, ConfigProps, SubmitHandler, FieldArray } from 'redux-form';
import {
  minLength,
  maxLength,
  required,
  hasValidText,
  hasValidValue,
  hasValidFodselsnummer,
} from '@fpsak-frontend/utils';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { CheckboxField, InputField, RadioGroupField, RadioOption, TextAreaField } from '@fpsak-frontend/form/index';
import { Element } from 'nav-frontend-typografi';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { Aksjonspunkt, UtfallEnum, VurderteVilkår, VilkårEnum } from '@k9-sak-web/types';
import { Delete } from '@navikt/ds-icons';
import styles from './aksjonspunktForm.less';
import Aktivitet from '../dto/Aktivitet';
import { fosterbarnDto } from '../dto/FosterbarnDto';

interface AksjonspunktFormImplProps {
  aktiviteter: Aktivitet[];
  isAksjonspunktOpen: boolean;
  fosterbarn: fosterbarnDto[];
  aksjonspunktKode: string;
}

interface FormContentProps {
  handleSubmit: SubmitHandler;
  aktiviteter: Aktivitet[];
  isAksjonspunktOpen: boolean;
  fosterbarn: fosterbarnDto[];
  aksjonspunktKode: string;
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
}: FormContentProps) => {
  const uavklartePerioder = useMemo(
    () =>
      aktiviteter
        .flatMap(({ uttaksperioder }) => uttaksperioder)
        .filter(({ utfall }) => utfall === UtfallEnum.UAVKLART),
    [aktiviteter],
  );

  const harUavklartePerioder = uavklartePerioder.length > 0;

  const RenderFosterbarn = ({ fields, barn }) => (
    <>
      {fields.length > 0 && (
        <>
          <Table>
            <TableRow isHeader>
              <TableColumn />
              <TableColumn>Fødselsnummer</TableColumn>
              <TableColumn className={styles.sentrert}>Fjern</TableColumn>
            </TableRow>
            {fields.map((field, index) => {
              const fosterbarnObj = barn[index];
              const navn = fosterbarnObj && fosterbarnObj.navn ? fosterbarnObj.navn : `Fosterbarn ${index + 1}`;
              return (
                <TableRow>
                  <TableColumn className={styles.vertikaltSentrert}>{navn}</TableColumn>
                  <TableColumn className={styles.vertikaltSentrert}>
                    <InputField
                      name={field}
                      type="text"
                      size={11}
                      bredde="S"
                      validate={[required, minLength(11), maxLength(11), hasValidFodselsnummer]}
                      maxLength={11}
                      readOnly={!isAksjonspunktOpen}
                    />
                  </TableColumn>
                  <TableColumn className={`${styles.sentrert} ${styles.vertikaltSentrert}`}>
                    <Knapp
                      type="flat"
                      htmlType="button"
                      onClick={() => fields.remove(index)}
                      disabled={!isAksjonspunktOpen}
                    >
                      <Delete />
                    </Knapp>
                  </TableColumn>
                </TableRow>
              );
            })}
          </Table>
          <VerticalSpacer eightPx />
        </>
      )}
      <Knapp type="flat" htmlType="button" onClick={() => fields.push('')} mini>
        Legg til fosterbarn
      </Knapp>
    </>
  );

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
            id={
              aksjonspunktKode === '9014'
                ? 'Årskvantum.Aksjonspunkt.Avslått.Fosterbarn'
                : 'Årskvantum.Aksjonspunkt.Avslått'
            }
          />,
        ]}
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
          <RadioOption
            value={valgValues.reBehandling}
            label={{
              id:
                aksjonspunktKode === '9014'
                  ? 'Årskvantum.Aksjonspunkt.Avslått.ReBehandling.Fosterbarn'
                  : 'Årskvantum.Aksjonspunkt.Avslått.ReBehandling',
            }}
          />
          <RadioOption
            value={valgValues.fortsett}
            label={{
              id:
                aksjonspunktKode === '9014'
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

      <BorderBox>
        <FieldArray name="fosterbarn" component={RenderFosterbarn} barn={fosterbarn} />
      </BorderBox>

      <VerticalSpacer sixteenPx />

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
}: AksjonspunktFormImplProps & InjectedFormProps) => (
  <form onSubmit={handleSubmit}>
    <div className={styles.graBoks}>
      <FormContent
        handleSubmit={handleSubmit}
        aktiviteter={aktiviteter}
        isAksjonspunktOpen={isAksjonspunktOpen}
        fosterbarn={fosterbarn}
        aksjonspunktKode={aksjonspunktKode}
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
) => {
  if (bekreftInfotrygd || valg === valgValues.reBehandling) {
    return [{ kode, begrunnelse, fortsettBehandling: false, fosterbarn }];
  }
  return [{ kode, begrunnelse, fortsettBehandling: true, fosterbarn }];
};

const mapStateToPropsFactory = (_initialState, initialProps: AksjonspunktFormProps) => {
  const { submitCallback, aksjonspunkterForSteg: aksjonspunkter } = initialProps;
  const aksjonspunktKode = utledAksjonspunktKode(aksjonspunkter);
  const onSubmit = (formValues: FormValues) => submitCallback(transformValues(formValues, aksjonspunktKode));

  return (
    state,
    { aktiviteter, isAksjonspunktOpen, aksjonspunkterForSteg = [], fosterbarn }: AksjonspunktFormProps,
  ): Partial<ConfigProps<FormValues>> & AksjonspunktFormImplProps => ({
    onSubmit,
    aktiviteter,
    isAksjonspunktOpen,
    initialValues: { begrunnelse: aksjonspunkterForSteg[0]?.begrunnelse, fosterbarn: fosterbarn.map(barn => barn.fnr) },
    fosterbarn,
    aksjonspunktKode,
  });
};

export default connect(mapStateToPropsFactory)(
  behandlingForm({
    form: årskvantumAksjonspunktFormName,
    enableReinitialize: true,
  })(AksjonspunktFormImpl),
);
