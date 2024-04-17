import { CheckboxField, InputField, RadioGroupField, RadioOption, TextAreaField } from '@fpsak-frontend/form/index';
import { behandlingForm } from '@fpsak-frontend/form/src/behandlingForm';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import {
  AksjonspunktHelpTextTemp,
  BorderBox,
  Table,
  TableColumn,
  TableRow,
  VerticalSpacer,
} from '@fpsak-frontend/shared-components';
import {
  hasValidFodselsnummer,
  hasValidText,
  hasValidValue,
  maxLength,
  minLength,
  required,
} from '@fpsak-frontend/utils';
import { Aksjonspunkt, UtfallEnum, Uttaksperiode, VilkårEnum } from '@k9-sak-web/types';
import { Delete } from '@navikt/ds-icons';
import { Button, Label } from '@navikt/ds-react';
import React, { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { ConfigProps, FieldArray, InjectedFormProps, SubmitHandler } from 'redux-form';
import Aktivitet from '../dto/Aktivitet';
import { fosterbarnDto } from '../dto/FosterbarnDto';
import styles from './aksjonspunktForm.module.css';

interface AksjonspunktFormImplProps {
  aktiviteter: Aktivitet[];
  isAksjonspunktOpen: boolean;
  fosterbarn: fosterbarnDto[];
}

interface FormContentProps {
  handleSubmit: SubmitHandler;
  aktiviteter: Aktivitet[];
  isAksjonspunktOpen: boolean;
  fosterbarn: fosterbarnDto[];
}

const årskvantumAksjonspunktFormName = 'årskvantumAksjonspunktFormName';

const valgValues = {
  reBehandling: 'reBehandling',
  fortsett: 'fortsett',
};

const vilkårHarOverlappendePerioderIInfotrygd = (uttaksperiode: Uttaksperiode) =>
  Object.entries(uttaksperiode.vurderteVilkår.vilkår).some(
    ([vilkår, utfall]) => vilkår === VilkårEnum.NOK_DAGER && utfall === UtfallEnum.UAVKLART,
  ) && !uttaksperiode.hjemler.some(hjemmel => hjemmel === 'FTRL_9_7__4');

export const FormContent = ({ handleSubmit, aktiviteter = [], isAksjonspunktOpen, fosterbarn }: FormContentProps) => {
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

  const harUavklartePerioder = uavklartePerioderPgaInfotrygd.length > 0;

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
                      htmlSize={14}
                      validate={[required, minLength(11), maxLength(11), hasValidFodselsnummer]}
                      maxLength={11}
                      readOnly={!isAksjonspunktOpen}
                    />
                  </TableColumn>
                  <TableColumn className={`${styles.sentrert} ${styles.vertikaltSentrert}`}>
                    <Button
                      size="small"
                      variant="tertiary"
                      type="button"
                      onClick={() => fields.remove(index)}
                      disabled={!isAksjonspunktOpen}
                      icon={<Delete />}
                      aria-label="Slett"
                    />
                  </TableColumn>
                </TableRow>
              );
            })}
          </Table>
          <VerticalSpacer eightPx />
        </>
      )}
      <Button variant="tertiary" type="button" onClick={() => fields.push('')} size="small">
        Legg til fosterbarn
      </Button>
    </>
  );

  if (harUavklartePerioder) {
    const harOverlappendePerioderIInfotrygd = uavklartePerioderPgaInfotrygd.some(uttaksperiode =>
      vilkårHarOverlappendePerioderIInfotrygd(uttaksperiode),
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
      <AksjonspunktHelpTextTemp isAksjonspunktOpen={isAksjonspunktOpen}>
        {[<FormattedMessage key={1} id="Årskvantum.Aksjonspunkt.Avslått" />]}
      </AksjonspunktHelpTextTemp>
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

      <VerticalSpacer sixteenPx />

      <BorderBox>
        <FieldArray name="fosterbarn" component={RenderFosterbarn} barn={fosterbarn} />
      </BorderBox>

      <VerticalSpacer sixteenPx />

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
}: AksjonspunktFormImplProps & InjectedFormProps) => (
  <form data-testid="aksjonspunktform" onSubmit={handleSubmit}>
    <div className={styles.graBoks}>
      <FormContent
        handleSubmit={handleSubmit}
        aktiviteter={aktiviteter}
        isAksjonspunktOpen={isAksjonspunktOpen}
        fosterbarn={fosterbarn}
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
export const transformValues = ({
  begrunnelse = begrunnelseUavklartePerioder,
  valg,
  bekreftInfotrygd,
  fosterbarn,
}: FormValues) => {
  if (bekreftInfotrygd || valg === valgValues.reBehandling) {
    return [{ kode: aksjonspunktCodes.VURDER_ÅRSKVANTUM_KVOTE, begrunnelse, fortsettBehandling: false, fosterbarn }];
  }
  return [{ kode: aksjonspunktCodes.VURDER_ÅRSKVANTUM_KVOTE, begrunnelse, fortsettBehandling: true, fosterbarn }];
};

const mapStateToPropsFactory = (_initialState, initialProps: AksjonspunktFormProps) => {
  const { submitCallback } = initialProps;
  const onSubmit = (formValues: FormValues) => submitCallback(transformValues(formValues));

  return (
    state,
    { aktiviteter, isAksjonspunktOpen, aksjonspunkterForSteg = [], fosterbarn }: AksjonspunktFormProps,
  ): Partial<ConfigProps<FormValues>> & AksjonspunktFormImplProps => ({
    onSubmit,
    aktiviteter,
    isAksjonspunktOpen,
    initialValues: { begrunnelse: aksjonspunkterForSteg[0]?.begrunnelse, fosterbarn: fosterbarn.map(barn => barn.fnr) },
    fosterbarn,
  });
};

export default connect(mapStateToPropsFactory)(
  behandlingForm({
    form: årskvantumAksjonspunktFormName,
    enableReinitialize: true,
  })(AksjonspunktFormImpl),
);
