import React, { useEffect, useMemo, useState } from 'react';
import { AksjonspunktHelpTextTemp, BorderBox, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { FormattedMessage } from 'react-intl';
import { behandlingForm, getBehandlingFormName } from '@fpsak-frontend/form/src/behandlingForm';
import { connect } from 'react-redux';
import { InjectedFormProps, ConfigProps, SubmitHandler, FieldArray, formValueSelector } from 'redux-form';
import { minLength, maxLength, required, hasValidText, hasValidValue } from '@fpsak-frontend/utils';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { CheckboxField, RadioGroupField, RadioOption, TextAreaField } from '@fpsak-frontend/form/index';
import { Element } from 'nav-frontend-typografi';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { Aksjonspunkt, UtfallEnum, VurderteVilkår, VilkårEnum } from '@k9-sak-web/types';
import AlertStripe from 'nav-frontend-alertstriper';
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
  dirty,
  reset,
}: FormContentProps) => {
  Modal.setAppElement(document.body);
  const uavklartePerioder = useMemo(
    () =>
      aktiviteter
        .flatMap(({ uttaksperioder }) => uttaksperioder)
        .filter(({ utfall }) => utfall === UtfallEnum.UAVKLART),
    [aktiviteter],
  );

  const [kanFortsette, setKanFortsette] = useState<boolean>(true);
  const [kanRebehandle, setKanRebehandle] = useState<boolean>(true);
  const [kanFullføre, setKanFullføre] = useState<boolean>(false);
  const [vistNullstillAdvarsel, setVisNullstillAdvarsel] = useState<boolean>(false);

  const handleNullstill = () => {
    reset();
    setVisNullstillAdvarsel(false);
  };

  useEffect(() => {
    let fosterbarnEndret = false;

    if (fosterbarnValue && initialValues.fosterbarn) {
      fosterbarnEndret =
        JSON.stringify([...initialValues.fosterbarn].sort()) !== JSON.stringify([...fosterbarnValue].sort());
    }

    if (fosterbarnEndret) {
      setKanRebehandle(true);
      setKanFortsette(false);
    } else {
      setKanRebehandle(false);
      setKanFortsette(true);
    }

    if (valgValue === valgValues.reBehandling) {
      if (fosterbarnEndret) setKanFullføre(true);
      else setKanFullføre(false);
    }

    if (valgValue === valgValues.fortsett) {
      if (!fosterbarnEndret) setKanFullføre(true);
      else setKanFullføre(false);
    }
  }, [valgValue, fosterbarnValue]);

  const harUavklartePerioder = uavklartePerioder.length > 0;

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
        <FieldArray
          name="fosterbarn"
          component={FosterbarnForm}
          barn={fosterbarn}
          isAksjonspunktOpen={isAksjonspunktOpen}
        />
      </BorderBox>

      <VerticalSpacer sixteenPx />

      {isAksjonspunktOpen && (
        <>
          {!kanFortsette && !kanFullføre && dirty && (
            <>
              <AlertStripe type="feil">
                <FormattedMessage id="Årskvantum.Aksjonspunkt.Avslått.Fosterbarn.KanIkkeFortsette" />
              </AlertStripe>
              <VerticalSpacer sixteenPx />
            </>
          )}

          {!kanRebehandle && !kanFullføre && dirty && (
            <>
              <AlertStripe type="feil">
                <FormattedMessage id="Årskvantum.Aksjonspunkt.Avslått.Fosterbarn.KanIkkeRebehandle" />
              </AlertStripe>
              <VerticalSpacer sixteenPx />
            </>
          )}

          <div className={styles.spaceBetween}>
            <Hovedknapp onClick={handleSubmit} htmlType="submit" disabled={!kanFullføre}>
              <FormattedMessage id="Årskvantum.Aksjonspunkt.Avslått.Bekreft" />
            </Hovedknapp>
            <Knapp type="fare" htmlType="button" onClick={() => setVisNullstillAdvarsel(true)} disabled={!dirty}>
              <FormattedMessage id="Årskvantum.Aksjonspunkt.Avslått.Fosterbarn.NullstillKnapp" />
            </Knapp>
          </div>
        </>
      )}

      <Modal open={vistNullstillAdvarsel} onClose={() => setVisNullstillAdvarsel(false)} closeButton={false}>
        <div className={styles.modalInnhold}>
          <AlertStripe type="advarsel">
            <FormattedMessage id="Årskvantum.Aksjonspunkt.Avslått.Fosterbarn.BekreftNullstillTekst" />
          </AlertStripe>
          <VerticalSpacer thirtyTwoPx />
          <div className={styles.spaceBetween}>
            <Knapp type="hoved" onClick={() => setVisNullstillAdvarsel(false)}>
              Avbryt
            </Knapp>
            <Knapp type="fare" onClick={() => handleNullstill()}>
              Nullstill skjemaet
            </Knapp>
          </div>
        </div>
      </Modal>
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
