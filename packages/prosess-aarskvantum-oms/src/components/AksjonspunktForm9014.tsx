import { CheckboxField, RadioGroupField, TextAreaField } from '@fpsak-frontend/form/index';
import { behandlingForm, getBehandlingFormName } from '@fpsak-frontend/form/src/behandlingForm';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import {
  AksjonspunktHelpText,
  BorderBox,
  Table,
  TableColumn,
  TableRow,
  VerticalSpacer,
} from '@fpsak-frontend/shared-components';
import { hasValidText, hasValidValue, maxLength, minLength, required } from '@fpsak-frontend/utils';
import { Aksjonspunkt, UtfallEnum, Uttaksperiode, VilkårEnum } from '@k9-sak-web/types';
import { Button, Label } from '@navikt/ds-react';
import React, { useMemo } from 'react';
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
  aksjonspunktKode: string;
  valgValue: string;
}

interface FormContentProps {
  handleSubmit: SubmitHandler;
  aktiviteter: Aktivitet[];
  isAksjonspunktOpen: boolean;
  fosterbarn: fosterbarnDto[];
  aksjonspunktKode: string;
  valgValue: string;
  initialValues: { begrunnelse: string; fosterbarn: fosterbarnDto[] } | any;
  dirty: boolean;
  reset: () => void;
}

const årskvantumAksjonspunktFormName = 'årskvantumAksjonspunktFormName';

const vilkårHarOverlappendePerioderIInfotrygd = (uttaksperiode: Uttaksperiode) =>
  Object.entries(uttaksperiode.vurderteVilkår.vilkår).some(
    ([vilkår, utfall]) => vilkår === VilkårEnum.NOK_DAGER && utfall === UtfallEnum.UAVKLART,
  ) && !uttaksperiode.hjemler.some(hjemmel => hjemmel === 'FTRL_9_7__4');

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
  initialValues,
}: FormContentProps) => {
  const uavklartePerioderPgaInfotrygd = useMemo(
    () =>
      aktiviteter
        .flatMap(({ uttaksperioder }) => uttaksperioder)
        .filter(
          ({ utfall, hjemler }) =>
            utfall === UtfallEnum.UAVKLART && !hjemler.some(hjemmelen => hjemmelen === 'FTRL_9_7__4'),
        ),
    [aktiviteter],
  );

  const erÅF = aksjonspunktKode === aksjonspunktCodes.ÅRSKVANTUM_FOSTERBARN;
  const harUavklartePerioder = uavklartePerioderPgaInfotrygd.length > 0;

  if (harUavklartePerioder) {
    const harOverlappendePerioderIInfotrygd = uavklartePerioderPgaInfotrygd.some(uttaksperiode =>
      vilkårHarOverlappendePerioderIInfotrygd(uttaksperiode),
    );

    return (
      <>
        <AksjonspunktHelpText isAksjonspunktOpen={isAksjonspunktOpen}>
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
        </AksjonspunktHelpText>
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
              <Button size="small" variant="primary" onClick={handleSubmit} type="submit">
                <FormattedMessage id="Årskvantum.Aksjonspunkt.Uavklart.KjørPåNytt" />
              </Button>
            </div>
          </>
        )}
      </>
    );
  }

  return (
    <>
      <AksjonspunktHelpText isAksjonspunktOpen={isAksjonspunktOpen}>
        {[
          <FormattedMessage
            key={1}
            id={erÅF ? 'Årskvantum.Aksjonspunkt.Avslått.Fosterbarn' : 'Årskvantum.Aksjonspunkt.Avslått'}
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
              <FormattedMessage id="Årskvantum.Aksjonspunkt.Avslått.Valg" />
            </Label>
          }
          radios={[
            {
              value: valgValues.reBehandling,
              label: (
                <FormattedMessage
                  id={
                    erÅF
                      ? 'Årskvantum.Aksjonspunkt.Avslått.ReBehandling.Fosterbarn'
                      : 'Årskvantum.Aksjonspunkt.Avslått.ReBehandling'
                  }
                />
              ),
            },
            {
              value: valgValues.fortsett,
              label: (
                <FormattedMessage
                  id={
                    erÅF
                      ? 'Årskvantum.Aksjonspunkt.Avslått.Fortsett.Fosterbarn'
                      : 'Årskvantum.Aksjonspunkt.Avslått.Fortsett'
                  }
                />
              ),
            },
          ]}
        />
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
              valgValue={valgValue}
              aksjonspunktkode={aksjonspunktKode}
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
              <TableColumn>
                <FormattedMessage id="Årskvantum.Aksjonspunkt.Avslått.FosterbarnTittel" />
              </TableColumn>
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
          <Button size="small" variant="primary" onClick={handleSubmit} type="submit">
            <FormattedMessage id="Årskvantum.Aksjonspunkt.Avslått.Bekreft" />
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
  aksjonspunktKode,
  valgValue,
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
    const { valg: valgValue } = selector(state, 'valg', 'fosterbarn');

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
    };
  };
};

export default connect(mapStateToPropsFactory)(
  behandlingForm({
    form: årskvantumAksjonspunktFormName,
    enableReinitialize: true,
  })(AksjonspunktFormImpl),
);
