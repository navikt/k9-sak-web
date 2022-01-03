import React, { useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { connect } from 'react-redux';
import { InjectedFormProps } from 'redux-form';
import { createSelector } from 'reselect';
import { behandlingForm, behandlingFormValueSelector } from '@fpsak-frontend/form';
import { ProsessStegBegrunnelseTextField, ProsessPanelTemplate } from '@k9-sak-web/prosess-felles';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import FagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import { Aksjonspunkt, Opptjening, SubmitCallback, Vilkarperiode } from '@k9-sak-web/types';
import { Element } from 'nav-frontend-typografi';
import Hjelpetekst from 'nav-frontend-hjelpetekst';
import { PopoverOrientering } from 'nav-frontend-popover';

import dayjs from "dayjs";
import isBetween from 'dayjs/plugin/isBetween';
import VilkarFields, { midlertidigInaktiv } from './VilkarFields';
import styles from './OpptjeningVilkarAksjonspunktPanel.less';


dayjs.extend(isBetween);

const FORM_NAME = 'OpptjeningVilkarForm';

interface VilkårField {
  erVilkarOk: string | boolean;
  begrunnelse: string;
  innvilgelseMerknadKode: string;
}

interface OpptjeningVilkarAksjonspunktPanelImplProps {
  aksjonspunkter: Aksjonspunkt[];
  behandlingId: number;
  behandlingVersjon: number;
  isApOpen: boolean;
  lovReferanse?: string;
  fagsakType?: string;
  readOnly: boolean;
  readOnlySubmitButton: boolean;
  status: string;
  submitCallback: (props: SubmitCallback[]) => void;
  periodeIndex: number;
  vilkårPerioder: Vilkarperiode[];
  opptjeninger: Opptjening[];
  vilkarFields: VilkårField[];
}

interface StateProps {
  erVilkarOk: string | boolean;
}

/**
 * OpptjeningVilkarAksjonspunktPanel
 *
 * Presentasjonskomponent. Viser panel for å løse aksjonspunkt for avslått opptjeningsvilkår
 */
export const OpptjeningVilkarAksjonspunktPanelImpl = ({
  aksjonspunkter,
  behandlingId,
  behandlingVersjon,
  erVilkarOk,
  isApOpen,
  lovReferanse,
  fagsakType,
  readOnly,
  readOnlySubmitButton,
  dirty,
  handleSubmit,
  form,
  periodeIndex,
  vilkårPerioder,
  vilkarFields,
  status,
  opptjeninger,
}: Partial<OpptjeningVilkarAksjonspunktPanelImplProps> & StateProps & InjectedFormProps) => {
  const intl = useIntl();
  const formProps = useMemo(
    () => ({
      handleSubmit,
      form,
    }),
    [handleSubmit, form],
  );

  const isFormComplete = () => {
    const isAllTabsCreated = Array.isArray(vilkårPerioder) && vilkårPerioder.length === vilkarFields?.length;
    return isAllTabsCreated
      ? !vilkarFields.some(vilkarField => !vilkarField.begrunnelse || vilkarField.erVilkarOk === undefined)
      : false;
  };

  const erOmsorgspenger =
    fagsakType === FagsakYtelseType.OMSORGSPENGER ||
    fagsakType === FagsakYtelseType.OMSORGSPENGER_ALENE_OM_OMSORGEN ||
    fagsakType === FagsakYtelseType.OMSORGSPENGER_KRONISK_SYKT_BARN ||
    fagsakType === FagsakYtelseType.OMSORGSPENGER_MIDLERTIDIG_ALENE;

  const erPleiepenger = fagsakType === FagsakYtelseType.PLEIEPENGER;
  const isOpenAksjonspunkt = aksjonspunkter.some(ap => isAksjonspunktOpen(ap.status.kode));
  const originalErVilkarOk = isOpenAksjonspunkt ? undefined : vilkarUtfallType.OPPFYLT === status;

  const finnesOpptjeningsaktiviteterVidOpptjeningTom: boolean = !erPleiepenger ? true : opptjeninger.some(opptjening => {
    const opptjeningTom = dayjs(opptjening.fastsattOpptjening.opptjeningTom);

    return opptjening.opptjeningAktivitetList.some(opptjeningAktivitet =>
      // Siste argument ("[]") til isBetween inkluderer start og sluttdato
      dayjs(opptjeningTom).isBetween(opptjeningAktivitet.opptjeningFom, opptjeningAktivitet.opptjeningTom, null, "[]")
    );
  });

  return (
    <ProsessPanelTemplate
      title={intl.formatMessage({ id: 'OpptjeningVilkarAksjonspunktPanel.Opptjeningsvilkaret' })}
      isAksjonspunktOpen={isApOpen && vilkårPerioder[periodeIndex].vurdersIBehandlingen}
      formName={formProps.form}
      handleSubmit={formProps.handleSubmit}
      isDirty={dirty}
      readOnlySubmitButton={readOnlySubmitButton || !vilkårPerioder[periodeIndex].vurdersIBehandlingen}
      readOnly={readOnly || !vilkårPerioder[periodeIndex].vurdersIBehandlingen}
      lovReferanse={lovReferanse}
      behandlingId={behandlingId}
      behandlingVersjon={behandlingVersjon}
      originalErVilkarOk={originalErVilkarOk}
      isPeriodisertFormComplete={isFormComplete()}
    >
      <div className={styles.titelOgHjelpetekstFlexbox}>
        <Element>
          {erOmsorgspenger && (
            <FormattedMessage id="OpptjeningVilkarAksjonspunktPanel.SokerHarVurdertOpptjentRettTilOmsorgspenger" />
          )}
          {erPleiepenger && (
            <FormattedMessage id="OpptjeningVilkarAksjonspunktPanel.SokerHarVurdertOpptjentRettTilPleiepenger" />
          )}
        </Element>
        <Hjelpetekst type={PopoverOrientering.UnderHoyre}>
          <FormattedMessage id="OpptjeningVilkarAksjonspunktPanel.VurderingHjelpetekst" values={{
            b: (...chunks) => <b>{chunks}</b>,
           linebreak: <br />
          }}/>
        </Hjelpetekst>
      </div>

      <VilkarFields
        erOmsorgspenger={erOmsorgspenger}
        erVilkarOk={vilkårPerioder[periodeIndex].vurdersIBehandlingen ? erVilkarOk : originalErVilkarOk}
        readOnly={readOnly || !vilkårPerioder[periodeIndex].vurdersIBehandlingen}
        fieldPrefix={`vilkarFields[${periodeIndex}]`}
        skalValgMidlertidigInaktivTypeBVises={finnesOpptjeningsaktiviteterVidOpptjeningTom}
      />
    </ProsessPanelTemplate>
  );
};

export const buildInitialValues = createSelector(
  [
    (ownProps: OpptjeningVilkarAksjonspunktPanelImplProps) => ownProps.aksjonspunkter,
    (ownProps: OpptjeningVilkarAksjonspunktPanelImplProps) => ownProps.vilkårPerioder,
    (ownProps: OpptjeningVilkarAksjonspunktPanelImplProps) => ownProps.status,
  ],
  (aksjonspunkter, vilkårPerioder, status) => ({
    ...VilkarFields.buildInitialValues(aksjonspunkter, vilkårPerioder, status),
    ...ProsessStegBegrunnelseTextField.buildInitialValues(aksjonspunkter),
  }),
);

interface Values {
  vilkarFields: VilkårField[];
  innvilgelseMerknadKode: string;
}

const transformValues = (
  values: Values,
  aksjonspunkter: Aksjonspunkt[],
  vilkårPerioder: Vilkarperiode[],
  opptjeninger: Opptjening[],
) => ({
  vilkårPeriodeVurderinger: values.vilkarFields.map((vilkarField, index) => ({
    ...vilkarField,
    erVilkarOk: !!vilkarField.erVilkarOk,
    innvilgelseMerknadKode:
      typeof vilkarField.erVilkarOk === 'string' && Object.values(midlertidigInaktiv).includes(vilkarField.erVilkarOk)
        ? vilkarField.erVilkarOk
        : undefined,
    periode: Array.isArray(vilkårPerioder) && vilkårPerioder[index] ? vilkårPerioder[index].periode : {},
  })),
  opptjeningPerioder: Array.isArray(opptjeninger)
    ? opptjeninger.map(opptjening => ({
        fom: opptjening.fastsattOpptjening.opptjeningFom,
        tom: opptjening.fastsattOpptjening.opptjeningTom,
      }))
    : [],
  ...{ kode: Array.isArray(aksjonspunkter) && aksjonspunkter.length ? aksjonspunkter[0].definisjon.kode : null },
});

const mapStateToPropsFactory = (initialState, initialOwnProps: OpptjeningVilkarAksjonspunktPanelImplProps) => {
  const { aksjonspunkter, submitCallback, periodeIndex, vilkårPerioder, opptjeninger } = initialOwnProps;
  const onSubmit = values => submitCallback([transformValues(values, aksjonspunkter, vilkårPerioder, opptjeninger)]);

  return (state, ownProps) => ({
    onSubmit,
    initialValues: buildInitialValues(ownProps),
    erVilkarOk: behandlingFormValueSelector(
      FORM_NAME,
      ownProps.behandlingId,
      ownProps.behandlingVersjon,
    )(state, `vilkarFields[${periodeIndex}].erVilkarOk`),
    lovReferanse: ownProps.lovReferanse,
    vilkarFields: behandlingFormValueSelector(
      FORM_NAME,
      ownProps.behandlingId,
      ownProps.behandlingVersjon,
    )(state, `vilkarFields`),
  });
};

const OpptjeningVilkarAksjonspunktPanel = connect(mapStateToPropsFactory)(
  behandlingForm({
    form: FORM_NAME,
    enableReinitialize: true,
  })(OpptjeningVilkarAksjonspunktPanelImpl),
);

export default OpptjeningVilkarAksjonspunktPanel;
