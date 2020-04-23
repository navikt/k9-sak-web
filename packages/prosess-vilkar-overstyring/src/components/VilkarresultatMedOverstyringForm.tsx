import advarselIkonUrl from '@fpsak-frontend/assets/images/advarsel_ny.svg';
import avslattImage from '@fpsak-frontend/assets/images/avslaatt_hover.svg';
import innvilgetImage from '@fpsak-frontend/assets/images/innvilget_hover.svg';
import keyUtgraetImage from '@fpsak-frontend/assets/images/key-1-rotert-utgraet.svg';
import keyImage from '@fpsak-frontend/assets/images/key-1-rotert.svg';
import { behandlingForm, behandlingFormValueSelector } from '@fpsak-frontend/form';
import { OverstyrBekreftKnappPanel, VilkarResultPicker } from '@fpsak-frontend/fp-felles';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import BehandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import {
  AksjonspunktBox,
  EditedIcon,
  FlexColumn,
  FlexContainer,
  FlexRow,
  Image,
  VerticalSpacer,
} from '@fpsak-frontend/shared-components';
import { DDMMYYYY_DATE_FORMAT } from '@fpsak-frontend/utils';
import { Aksjonspunkt, Kodeverk, SubmitCallback } from '@k9-sak-web/types';
import moment from 'moment';
import { Knapp } from 'nav-frontend-knapper';
import { Element, EtikettLiten, Normaltekst, Undertittel } from 'nav-frontend-typografi';
import React, { SetStateAction, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { InjectedFormProps } from 'redux-form';
import { createSelector } from 'reselect';
import { VilkarresultatMedBegrunnelse } from './VilkarresultatMedBegrunnelse';
import styles from './vilkarresultatMedOverstyringForm.less';

const isOverridden = (aksjonspunktCodes: string[], aksjonspunktCode: string) =>
  aksjonspunktCodes.some(code => code === aksjonspunktCode);
const isHidden = (kanOverstyre: boolean, aksjonspunktCodes: string[], aksjonspunktCode: string) =>
  !isOverridden(aksjonspunktCodes, aksjonspunktCode) && !kanOverstyre;

const getFormName = (overstyringApKode: string) => `VilkarresultatForm_${overstyringApKode}`;

interface VilkarresultatMedOverstyringFormProps {
  aksjonspunktCodes: string[];
  aksjonspunkter: Aksjonspunkt[];
  avslagsarsaker: Kodeverk[];
  behandlingsresultat: {
    type: Kodeverk;
  };
  behandlingId: number;
  behandlingVersjon: number;
  behandlingType: Kodeverk;
  customVilkarIkkeOppfyltText?: {
    id: string;
    values?: any;
  };
  customVilkarOppfyltText?: {
    id: string;
    values?: any;
  };
  erMedlemskapsPanel: boolean;
  erOverstyrt?: boolean;
  erVilkarOk?: boolean;
  hasAksjonspunkt: boolean;
  isReadOnly: boolean;
  kanOverstyreAccess?: {
    isEnabled: boolean;
  };
  lovReferanse?: string;
  medlemskapFom: string;
  originalErVilkarOk?: boolean;
  overrideReadOnly: boolean;
  overstyringApKode: string;
  panelTittelKode: string;
  periodeFom: string;
  periodeTom: string;
  status: string;
  submitCallback: (props: SubmitCallback[]) => void;
  toggleOverstyring: (overstyrtPanel: SetStateAction<string[]>) => void;
}

interface StateProps {
  isSolvable: boolean;
}

/**
 * VilkarresultatForm
 *
 * Presentasjonskomponent. Viser resultat av vilkårskjøring når det ikke finnes tilknyttede aksjonspunkter.
 * Resultatet kan overstyres av Nav-ansatt med overstyr-rettighet.
 */
export const VilkarresultatMedOverstyringForm = ({
  panelTittelKode,
  erOverstyrt,
  isReadOnly,
  overstyringApKode,
  lovReferanse,
  isSolvable,
  erVilkarOk,
  originalErVilkarOk,
  customVilkarIkkeOppfyltText,
  customVilkarOppfyltText,
  erMedlemskapsPanel,
  hasAksjonspunkt,
  avslagsarsaker,
  overrideReadOnly,
  kanOverstyreAccess,
  aksjonspunktCodes,
  toggleOverstyring,
  reset,
  handleSubmit,
  submitting,
  pristine,
  periodeFom,
  periodeTom,
}: VilkarresultatMedOverstyringFormProps & StateProps & InjectedFormProps) => {
  const togglePa = () => {
    toggleOverstyring(oldArray => [...oldArray, overstyringApKode]);
  };
  const toggleAv = () => {
    reset();
    toggleOverstyring(oldArray => oldArray.filter(code => code !== overstyringApKode));
  };

  useEffect(() => {
    return () => {
      reset();
    };
  }, [periodeFom, periodeTom]);

  return (
    <form onSubmit={handleSubmit}>
      <FlexContainer>
        <FlexRow>
          {!erOverstyrt && originalErVilkarOk !== undefined && (
            <FlexColumn>
              <Image className={styles.status} src={originalErVilkarOk ? innvilgetImage : avslattImage} />
            </FlexColumn>
          )}
          <FlexColumn>
            <Undertittel>
              <FormattedMessage id={panelTittelKode} />
            </Undertittel>
          </FlexColumn>
          {lovReferanse && (
            <FlexColumn>
              <EtikettLiten className={styles.vilkar}>{lovReferanse}</EtikettLiten>
            </FlexColumn>
          )}
        </FlexRow>
        <FlexRow>
          <FlexColumn>
            {originalErVilkarOk && (
              <>
                <VerticalSpacer eightPx />
                <Element>
                  <FormattedMessage id="VilkarresultatMedOverstyringForm.ErOppfylt" />
                </Element>
              </>
            )}
            {originalErVilkarOk === false && (
              <>
                <VerticalSpacer eightPx />
                <Element>
                  <FormattedMessage id="VilkarresultatMedOverstyringForm.ErIkkeOppfylt" />
                </Element>
              </>
            )}
            {originalErVilkarOk === undefined && (
              <>
                <VerticalSpacer eightPx />
                <Normaltekst>
                  <FormattedMessage id="VilkarresultatMedOverstyringForm.IkkeBehandlet" />
                </Normaltekst>
              </>
            )}
          </FlexColumn>
          {originalErVilkarOk !== undefined &&
            !isHidden(kanOverstyreAccess.isEnabled, aksjonspunktCodes, overstyringApKode) && (
              <>
                {!erOverstyrt && !overrideReadOnly && (
                  <FlexColumn>
                    <VerticalSpacer eightPx />
                    <Image className={styles.key} src={keyImage} onClick={togglePa} />
                  </FlexColumn>
                )}
                {(erOverstyrt || overrideReadOnly) && (
                  <FlexColumn>
                    <VerticalSpacer eightPx />
                    <Image className={styles.keyWithoutCursor} src={keyUtgraetImage} />
                  </FlexColumn>
                )}
              </>
            )}
        </FlexRow>
      </FlexContainer>
      <VerticalSpacer eightPx />
      {(erOverstyrt || hasAksjonspunkt) && (
        <AksjonspunktBox className={styles.aksjonspunktMargin} erAksjonspunktApent={erOverstyrt}>
          <Element>
            <FormattedMessage id="VilkarresultatMedOverstyringForm.AutomatiskVurdering" />
          </Element>
          <VerticalSpacer eightPx />
          <VilkarresultatMedBegrunnelse
            skalViseBegrunnelse={erOverstyrt || hasAksjonspunkt}
            readOnly={isReadOnly || !erOverstyrt}
            erVilkarOk={erVilkarOk}
            customVilkarIkkeOppfyltText={customVilkarIkkeOppfyltText}
            customVilkarOppfyltText={customVilkarOppfyltText}
            erMedlemskapsPanel={erMedlemskapsPanel}
            hasAksjonspunkt={hasAksjonspunkt}
            avslagsarsaker={avslagsarsaker}
          />
          <VerticalSpacer sixteenPx />
          {!erOverstyrt && erVilkarOk !== undefined && (
            <>
              <VerticalSpacer fourPx />
              <FlexRow>
                <FlexColumn>
                  <EditedIcon />
                </FlexColumn>
                <FlexColumn>
                  <Normaltekst>
                    <FormattedMessage id="VilkarresultatMedOverstyringForm.Endret" />
                  </Normaltekst>
                </FlexColumn>
              </FlexRow>
            </>
          )}
          {erOverstyrt && (
            <FlexContainer>
              <FlexRow>
                <FlexColumn>
                  <Image src={advarselIkonUrl} />
                </FlexColumn>
                <FlexColumn>
                  <Element>
                    <FormattedMessage id="VilkarresultatMedOverstyringForm.Unntakstilfeller" />
                  </Element>
                </FlexColumn>
              </FlexRow>
              <VerticalSpacer sixteenPx />
              <FlexRow>
                <FlexColumn>
                  <OverstyrBekreftKnappPanel
                    submitting={submitting}
                    pristine={!isSolvable || pristine}
                    overrideReadOnly={overrideReadOnly}
                  />
                </FlexColumn>
                <FlexColumn>
                  <Knapp htmlType="button" spinner={submitting} disabled={submitting} onClick={toggleAv}>
                    <FormattedMessage id="VilkarresultatMedOverstyringForm.Avbryt" />
                  </Knapp>
                </FlexColumn>
              </FlexRow>
            </FlexContainer>
          )}
        </AksjonspunktBox>
      )}
    </form>
  );
};

const buildInitialValues = createSelector(
  [
    (ownProps: VilkarresultatMedOverstyringFormProps) => ownProps.behandlingsresultat,
    (ownProps: VilkarresultatMedOverstyringFormProps) => ownProps.aksjonspunkter,
    (ownProps: VilkarresultatMedOverstyringFormProps) => ownProps.status,
    (ownProps: VilkarresultatMedOverstyringFormProps) => ownProps.overstyringApKode,
  ],
  (behandlingsresultat, aksjonspunkter, status, overstyringApKode) => {
    const aksjonspunkt = aksjonspunkter.find(ap => ap.definisjon.kode === overstyringApKode);
    return {
      isOverstyrt: aksjonspunkt !== undefined,
      ...VilkarresultatMedBegrunnelse.buildInitialValues(
        behandlingsresultat,
        aksjonspunkter,
        status,
        overstyringApKode,
      ),
    };
  },
);

const getCustomVilkarText = (medlemskapFom: string, behandlingType: Kodeverk, erOppfylt: boolean) => {
  const customVilkarText = { id: '', values: null };
  const isBehandlingRevurderingFortsattMedlemskap =
    behandlingType.kode === BehandlingType.REVURDERING && !!medlemskapFom;
  if (isBehandlingRevurderingFortsattMedlemskap) {
    customVilkarText.id = erOppfylt
      ? 'VilkarResultPicker.VilkarOppfyltRevurderingFom'
      : 'VilkarResultPicker.VilkarIkkeOppfyltRevurderingFom';
    customVilkarText.values = { fom: moment(medlemskapFom).format(DDMMYYYY_DATE_FORMAT) };
  }
  return customVilkarText.id ? customVilkarText : undefined;
};

const getCustomVilkarTextForOppfylt = createSelector(
  [(ownProps: VilkarresultatMedOverstyringFormProps) => ownProps.medlemskapFom, ownProps => ownProps.behandlingType],
  (medlemskapFom, behandlingType) => getCustomVilkarText(medlemskapFom, behandlingType, true),
);
const getCustomVilkarTextForIkkeOppfylt = createSelector(
  [(ownProps: VilkarresultatMedOverstyringFormProps) => ownProps.medlemskapFom, ownProps => ownProps.behandlingType],
  (medlemskapFom, behandlingType) => getCustomVilkarText(medlemskapFom, behandlingType, false),
);

const transformValues = (values, overstyringApKode, periodeFom, periodeTom) => ({
  kode: overstyringApKode,
  ...VilkarResultPicker.transformValues(values),
  ...VilkarresultatMedBegrunnelse.transformValues(values),
  opptjeningFom: periodeFom || undefined,
  opptjeningTom: periodeTom || undefined,
});

const validate = values => VilkarresultatMedBegrunnelse.validate(values);

const mapStateToPropsFactory = (_initialState, initialOwnProps: VilkarresultatMedOverstyringFormProps) => {
  const { overstyringApKode, submitCallback, periodeFom, periodeTom } = initialOwnProps;
  const onSubmit = values => submitCallback([transformValues(values, overstyringApKode, periodeFom, periodeTom)]);
  const validateFn = values => validate(values);
  const aksjonspunktCodes = initialOwnProps.aksjonspunkter.map(a => a.definisjon.kode);
  const formName = getFormName(overstyringApKode);

  return (state, ownProps) => {
    const { behandlingId, behandlingVersjon, aksjonspunkter, erOverstyrt, overrideReadOnly } = ownProps;

    const aksjonspunkt = aksjonspunkter.find(ap => ap.definisjon.kode === overstyringApKode);
    const isSolvable =
      aksjonspunkt !== undefined
        ? !(aksjonspunkt.status.kode === aksjonspunktStatus.OPPRETTET && !aksjonspunkt.kanLoses)
        : false;

    const initialValues = buildInitialValues(ownProps);

    const erOppfylt = vilkarUtfallType.OPPFYLT === ownProps.status;
    const erVilkarOk = vilkarUtfallType.IKKE_VURDERT !== ownProps.status ? erOppfylt : undefined;

    return {
      onSubmit,
      aksjonspunktCodes,
      initialValues,
      customVilkarOppfyltText: getCustomVilkarTextForOppfylt(ownProps),
      customVilkarIkkeOppfyltText: getCustomVilkarTextForIkkeOppfylt(ownProps),
      isSolvable: erOverstyrt || isSolvable,
      isReadOnly: overrideReadOnly,
      hasAksjonspunkt: aksjonspunkt !== undefined,
      validate: validateFn,
      form: formName,
      originalErVilkarOk: erVilkarOk,
      ...behandlingFormValueSelector(formName, behandlingId, behandlingVersjon)(state, 'isOverstyrt', 'erVilkarOk'),
    };
  };
};

const form = behandlingForm({ enableReinitialize: true })(VilkarresultatMedOverstyringForm);
export default connect(mapStateToPropsFactory)(form);
