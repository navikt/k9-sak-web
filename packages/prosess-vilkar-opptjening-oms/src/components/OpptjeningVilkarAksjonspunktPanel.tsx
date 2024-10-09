import { behandlingForm, behandlingFormValueSelector } from '@fpsak-frontend/form';
import FagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import { ProsessStegBegrunnelseTextField } from '@k9-sak-web/prosess-felles';
import { Aksjonspunkt, Opptjening, SubmitCallback, Vilkarperiode } from '@k9-sak-web/types';
import { HelpText, Label } from '@navikt/ds-react';
import { useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { connect } from 'react-redux';
import { InjectedFormProps } from 'redux-form';
import { createSelector } from 'reselect';

import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import styles from './OpptjeningVilkarAksjonspunktPanel.module.css';
import VilkarField, { erVilkarOk, opptjeningMidlertidigInaktivKoder, VilkårFieldType } from './VilkarField';
import OpptjeningPanel from './OpptjeningPanel';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';

dayjs.extend(isBetween);

const FORM_NAME = 'OpptjeningVilkarForm';

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
  vilkarFields: VilkårFieldType[];
}

interface StateProps {
  erVilkarOk: boolean;
}

/**
 * OpptjeningVilkarAksjonspunktPanel
 *
 * Presentasjonskomponent. Viser panel for å løse aksjonspunkt for avslått opptjeningsvilkår
 */
export const OpptjeningVilkarAksjonspunktPanelImpl = ({
  behandlingId,
  behandlingVersjon,
  isApOpen,
  lovReferanse,
  fagsakType,
  readOnly,
  readOnlySubmitButton,
  dirty,
  handleSubmit,
  aksjonspunkter,
  form,
  periodeIndex,
  vilkårPerioder,
  vilkarFields,
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

  const vilkarField = vilkarFields?.[periodeIndex];
  const allePerioderHarVurdering = () => {
    const isAllTabsCreated = Array.isArray(vilkårPerioder) && vilkårPerioder.length === vilkarFields?.length;
    return isAllTabsCreated
      ? !vilkarFields.some(
          vilkarField =>
            vilkarField.vurderesIBehandlingen &&
            !vilkarField.periodeHar28DagerOgTrengerIkkeVurderesManuelt &&
            (!vilkarField.begrunnelse || !vilkarField.kode),
        )
      : false;
  };

  const erOmsorgspenger =
    fagsakType === FagsakYtelseType.OMSORGSPENGER ||
    fagsakType === FagsakYtelseType.OMSORGSPENGER_ALENE_OM_OMSORGEN ||
    fagsakType === FagsakYtelseType.OMSORGSPENGER_KRONISK_SYKT_BARN ||
    fagsakType === FagsakYtelseType.OMSORGSPENGER_MIDLERTIDIG_ALENE;

  const erPleiepenger = fagsakType === FagsakYtelseType.PLEIEPENGER;

  const finnesOpptjeningsaktiviteterVidOpptjeningTom: boolean = !erPleiepenger
    ? true
    : opptjeninger?.some(opptjening => {
        const skjæringstidspunkt = dayjs(opptjening.fastsattOpptjening.opptjeningTom)
          .add(1, 'day')
          .format('YYYY-MM-DD');

        const vurderesOpptjeningsaktivitetIBehandling = vilkårPerioder.find(
          ({ periode }) => periode.fom === skjæringstidspunkt,
        )?.vurderesIBehandlingen;

        if (!vurderesOpptjeningsaktivitetIBehandling) {
          return false;
        }

        return opptjening.opptjeningAktivitetList.some(opptjeningAktivitet =>
          // Siste argument ("[]") til isBetween inkluderer start og sluttdato
          dayjs(skjæringstidspunkt).isBetween(
            opptjeningAktivitet.opptjeningFom,
            opptjeningAktivitet.opptjeningTom,
            null,
            '[]',
          ),
        );
      });

  return (
    <OpptjeningPanel
      title={intl.formatMessage({ id: 'OpptjeningVilkarAksjonspunktPanel.Opptjeningsvilkaret' })}
      isAksjonspunktOpen={isApOpen && vilkårPerioder[periodeIndex].vurderesIBehandlingen}
      formName={formProps.form}
      handleSubmit={formProps.handleSubmit}
      isDirty={dirty}
      readOnlySubmitButton={readOnlySubmitButton || !vilkårPerioder[periodeIndex].vurderesIBehandlingen}
      readOnly={readOnly || !vilkårPerioder[periodeIndex].vurderesIBehandlingen}
      originalErVilkarOk={vilkårPerioder[periodeIndex].vilkarStatus === 'OPPFYLT'}
      aksjonspunktErLøst={aksjonspunkter.some(
        ap => aksjonspunktCodes.VURDER_OPPTJENINGSVILKARET === ap.definisjon && ap.status === 'UTFO',
      )}
      lovReferanse={lovReferanse}
      behandlingId={behandlingId}
      behandlingVersjon={behandlingVersjon}
      isPeriodisertFormComplete={allePerioderHarVurdering()}
      skjulAksjonspunktVisning={vilkarField?.periodeHar28DagerOgTrengerIkkeVurderesManuelt}
    >
      <div className={styles.titelOgHjelpetekstFlexbox}>
        <Label size="small" as="p">
          {erOmsorgspenger && (
            <FormattedMessage id="OpptjeningVilkarAksjonspunktPanel.SokerHarVurdertOpptjentRettTilOmsorgspenger" />
          )}
          {erPleiepenger && (
            <FormattedMessage id="OpptjeningVilkarAksjonspunktPanel.SokerHarVurdertOpptjentRettTilPleiepenger" />
          )}
        </Label>
        <HelpText className="ml-2" placement="right-start">
          <FormattedMessage
            id="OpptjeningVilkarAksjonspunktPanel.VurderingHjelpetekst"
            values={{
              b: (...chunks) => <b>{chunks}</b>,
              linebreak: <br />,
            }}
          />
        </HelpText>
      </div>
      <VilkarField
        erOmsorgspenger={erOmsorgspenger}
        field={vilkarField}
        readOnly={
          readOnly || !vilkarField?.vurderesIBehandlingen || vilkarField?.periodeHar28DagerOgTrengerIkkeVurderesManuelt
        }
        fieldPrefix={`vilkarFields[${periodeIndex}]`}
        skalValgMidlertidigInaktivTypeBVises={finnesOpptjeningsaktiviteterVidOpptjeningTom}
      />
    </OpptjeningPanel>
  );
};

export const buildInitialValues = createSelector(
  [
    (ownProps: OpptjeningVilkarAksjonspunktPanelImplProps) => ownProps.aksjonspunkter,
    (ownProps: OpptjeningVilkarAksjonspunktPanelImplProps) => ownProps.vilkårPerioder,
    (ownProps: OpptjeningVilkarAksjonspunktPanelImplProps) => ownProps.opptjeninger,
  ],
  (aksjonspunkter, vilkårPerioder, opptjeninger) => ({
    ...VilkarField.buildInitialValues(vilkårPerioder, opptjeninger),
    ...ProsessStegBegrunnelseTextField.buildInitialValues(aksjonspunkter),
  }),
);

interface Values {
  vilkarFields: VilkårFieldType[];
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
    erVilkarOk: erVilkarOk(vilkarField.kode),
    innvilgelseMerknadKode: Object.values(opptjeningMidlertidigInaktivKoder).includes(vilkarField.kode)
      ? vilkarField.kode
      : undefined,
    periode: Array.isArray(vilkårPerioder) && vilkårPerioder[index] ? vilkårPerioder[index].periode : {},
  })),
  opptjeningPerioder: Array.isArray(opptjeninger)
    ? opptjeninger.map(opptjening => ({
        fom: opptjening.fastsattOpptjening.opptjeningFom,
        tom: opptjening.fastsattOpptjening.opptjeningTom,
      }))
    : [],
  ...{ kode: Array.isArray(aksjonspunkter) && aksjonspunkter.length ? aksjonspunkter[0].definisjon : null },
});

const mapStateToPropsFactory = (initialState, initialOwnProps: OpptjeningVilkarAksjonspunktPanelImplProps) => {
  const { aksjonspunkter, submitCallback, vilkårPerioder, opptjeninger } = initialOwnProps;
  const onSubmit = values => submitCallback([transformValues(values, aksjonspunkter, vilkårPerioder, opptjeninger)]);

  return (state, ownProps) => ({
    onSubmit,
    initialValues: buildInitialValues(ownProps),
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
