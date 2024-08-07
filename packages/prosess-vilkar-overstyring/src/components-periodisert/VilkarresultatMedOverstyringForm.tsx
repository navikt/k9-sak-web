import advarselIkonUrl from '@fpsak-frontend/assets/images/advarsel_ny.svg';
import { behandlingForm, behandlingFormValueSelector } from '@fpsak-frontend/form';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import BehandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
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
import VilkarResultPicker from '@k9-sak-web/prosess-felles/src/vilkar/VilkarResultPickerPeriodisert';
import { Aksjonspunkt, Kodeverk, KodeverkMedNavn, SubmitCallback } from '@k9-sak-web/types';
import Vilkarperiode from '@k9-sak-web/types/src/vilkarperiode';
import { BodyShort, Button, Label } from '@navikt/ds-react';
import moment from 'moment';
import React, { SetStateAction, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { InjectedFormProps } from 'redux-form';
import { createSelector } from 'reselect';
import OverstyrBekreftKnappPanel from './OverstyrBekreftKnappPanel';
import { VilkarresultatMedBegrunnelse } from './VilkarresultatMedBegrunnelse';
import styles from './vilkarresultatMedOverstyringForm.module.css';

const getFormName = (overstyringApKode: string) => `VilkarresultatForm_${overstyringApKode}`;

export interface CustomVilkarText {
  id: string;
  values?: any;
}

export const vilkarUtfallPeriodisert = {
  OPPFYLT: 'OPPFYLT',
  IKKE_OPPFYLT: 'IKKE_OPPFYLT',
  DELVIS_OPPFYLT: 'DELVIS_OPPFYLT',
  DELVIS_IKKE_OPPFYLT: 'DELVIS_IKKE_OPPFYLT',
};

interface VilkarresultatMedOverstyringFormProps {
  aksjonspunkter: Aksjonspunkt[];
  avslagsarsaker: KodeverkMedNavn[];
  behandlingsresultat: {
    type: Kodeverk;
  };
  behandlingId: number;
  behandlingVersjon: number;
  behandlingType: Kodeverk;
  customVilkarIkkeOppfyltText?: CustomVilkarText;
  customVilkarOppfyltText?: CustomVilkarText;
  erMedlemskapsPanel: boolean;
  visPeriodisering: boolean;
  erOverstyrt?: boolean;
  erVilkarOk?: string;
  periodeVilkarStatus?: boolean;
  hasAksjonspunkt: boolean;
  isReadOnly: boolean;
  lovReferanse?: string;
  medlemskapFom: string;
  overrideReadOnly: boolean;
  overstyringApKode: string;
  status: string;
  submitCallback: (props: SubmitCallback[]) => void;
  toggleOverstyring: (overstyrtPanel: SetStateAction<string[]>) => void;
  avslagKode?: string;
  periode?: Vilkarperiode;
  opprettetAv?: string;
}

interface StateProps {
  isSolvable: boolean;
  periodeFom: string;
  periodeTom: string;
  valgtPeriodeFom: string;
  valgtPeriodeTom: string;
}

/**
 * VilkarresultatForm
 *
 * Presentasjonskomponent. Viser resultat av vilkårskjøring når det ikke finnes tilknyttede aksjonspunkter.
 * Resultatet kan overstyres av Nav-ansatt med overstyr-rettighet.
 */
export const VilkarresultatMedOverstyringForm = ({
  erOverstyrt,
  isReadOnly,
  overstyringApKode,
  isSolvable,
  erVilkarOk,
  periodeVilkarStatus,
  customVilkarIkkeOppfyltText,
  customVilkarOppfyltText,
  erMedlemskapsPanel,
  visPeriodisering,
  hasAksjonspunkt,
  avslagsarsaker,
  overrideReadOnly,
  toggleOverstyring,
  reset,
  handleSubmit,
  submitting,
  pristine,
  periodeFom,
  periodeTom,
  valgtPeriodeFom,
  valgtPeriodeTom,
  opprettetAv,
}: Partial<VilkarresultatMedOverstyringFormProps> & StateProps & InjectedFormProps) => {
  const toggleAv = () => {
    reset();
    toggleOverstyring(oldArray => oldArray.filter(code => code !== overstyringApKode));
  };

  useEffect(
    () => () => {
      reset();
    },
    [periodeFom, periodeTom],
  );

  return (
    <form data-testid="overstyringform" onSubmit={handleSubmit}>
      {(erOverstyrt || hasAksjonspunkt) && (
        <AksjonspunktBox className={styles.aksjonspunktMargin} erAksjonspunktApent={erOverstyrt}>
          <Label size="small" as="p">
            <FormattedMessage id="VilkarresultatMedOverstyringForm.AutomatiskVurdering" />
          </Label>
          <VerticalSpacer eightPx />
          <VilkarresultatMedBegrunnelse
            skalViseBegrunnelse={erOverstyrt || hasAksjonspunkt}
            readOnly={isReadOnly || !erOverstyrt}
            erVilkarOk={erVilkarOk}
            customVilkarIkkeOppfyltText={customVilkarIkkeOppfyltText}
            customVilkarOppfyltText={customVilkarOppfyltText}
            erMedlemskapsPanel={erMedlemskapsPanel}
            visPeriodisering={visPeriodisering}
            avslagsarsaker={avslagsarsaker}
            periodeFom={periodeFom}
            periodeTom={periodeTom}
            valgtPeriodeFom={valgtPeriodeFom}
            valgtPeriodeTom={valgtPeriodeTom}
            periodeVilkarStatus={periodeVilkarStatus}
            opprettetAv={opprettetAv}
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
                  <BodyShort size="small">
                    <FormattedMessage id="VilkarresultatMedOverstyringForm.Endret" />
                  </BodyShort>
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
                  <Label size="small" as="p">
                    <FormattedMessage id="VilkarresultatMedOverstyringForm.Unntakstilfeller" />
                  </Label>
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
                  <Button
                    size="small"
                    variant="secondary"
                    type="button"
                    loading={submitting}
                    disabled={submitting}
                    onClick={toggleAv}
                  >
                    <FormattedMessage id="VilkarresultatMedOverstyringForm.Avbryt" />
                  </Button>
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
    (ownProps: VilkarresultatMedOverstyringFormProps) => ownProps.avslagKode,
    (ownProps: VilkarresultatMedOverstyringFormProps) => ownProps.aksjonspunkter,
    (ownProps: VilkarresultatMedOverstyringFormProps) => ownProps.status,
    (ownProps: VilkarresultatMedOverstyringFormProps) => ownProps.overstyringApKode,
    (ownProps: VilkarresultatMedOverstyringFormProps) => ownProps.periode,
  ],
  (avslagKode, aksjonspunkter, status, overstyringApKode, periode) => {
    const aksjonspunkt = aksjonspunkter.find(ap => ap.definisjon.kode === overstyringApKode);
    return {
      isOverstyrt: aksjonspunkt !== undefined,
      ...VilkarresultatMedBegrunnelse.buildInitialValues(
        avslagKode,
        aksjonspunkter,
        status,
        overstyringApKode,
        periode,
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
  ...VilkarResultPicker.transformValues(values, periodeFom, periodeTom),
  ...VilkarresultatMedBegrunnelse.transformValues(values),
});

const validate = values => VilkarresultatMedBegrunnelse.validate(values);

const mapStateToPropsFactory = (_initialState, initialOwnProps: VilkarresultatMedOverstyringFormProps) => {
  const { overstyringApKode, submitCallback, periode } = initialOwnProps;
  const periodeFom = periode?.periode?.fom;
  const periodeTom = periode?.periode?.tom;
  const onSubmit = values => submitCallback([transformValues(values, overstyringApKode, periodeFom, periodeTom)]);
  const validateFn = values => validate(values);
  const formName = getFormName(overstyringApKode);

  return (state, ownProps) => {
    const { behandlingId, behandlingVersjon, aksjonspunkter, erOverstyrt, overrideReadOnly } = ownProps;

    const aksjonspunkt = aksjonspunkter.find(ap => ap.definisjon.kode === overstyringApKode);
    const isSolvable =
      aksjonspunkt !== undefined
        ? !(aksjonspunkt.status.kode === aksjonspunktStatus.OPPRETTET && !aksjonspunkt.kanLoses)
        : false;

    const initialValues = buildInitialValues(ownProps);

    return {
      onSubmit,
      initialValues,
      customVilkarOppfyltText: getCustomVilkarTextForOppfylt(ownProps),
      customVilkarIkkeOppfyltText: getCustomVilkarTextForIkkeOppfylt(ownProps),
      isSolvable: erOverstyrt || isSolvable,
      isReadOnly: overrideReadOnly || !periode?.vurderesIBehandlingen,
      hasAksjonspunkt: aksjonspunkt !== undefined,
      validate: validateFn,
      form: formName,
      periodeFom,
      periodeTom,
      opprettetAv: aksjonspunkt ? aksjonspunkt.opprettetAv : '',
      ...behandlingFormValueSelector(formName, behandlingId, behandlingVersjon)(
        state,
        'isOverstyrt',
        'erVilkarOk',
        'valgtPeriodeFom',
        'valgtPeriodeTom',
        'periodeVilkarStatus',
      ),
    };
  };
};

// @ts-expect-error Kan ikkje senda med formnavn her sidan det er dynamisk. Må fikse på ein annan måte
const form = behandlingForm({ enableReinitialize: true })(VilkarresultatMedOverstyringForm);
export default connect(mapStateToPropsFactory)(form);
