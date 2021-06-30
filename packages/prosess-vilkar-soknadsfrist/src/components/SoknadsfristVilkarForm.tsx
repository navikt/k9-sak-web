import React, { FunctionComponent, SetStateAction, useEffect } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { InjectedFormProps } from 'redux-form';
import { createSelector } from 'reselect';
import { FormattedMessage } from 'react-intl';

import advarselIkonUrl from '@fpsak-frontend/assets/images/advarsel_ny.svg';
import { behandlingForm, behandlingFormValueSelector } from '@fpsak-frontend/form';
import { VilkarResultPicker } from '@k9-sak-web/prosess-felles';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import BehandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import {
  AksjonspunktBox,
  EditedIcon,
  FlexColumn,
  FlexContainer,
  FlexRow,
  Image,
  VerticalSpacer,
  AksjonspunktHelpTextTemp,
} from '@fpsak-frontend/shared-components';
import { DDMMYYYY_DATE_FORMAT } from '@fpsak-frontend/utils';
import { Aksjonspunkt, Kodeverk, KodeverkMedNavn, SubmitCallback } from '@k9-sak-web/types';
import Vilkarperiode from '@k9-sak-web/types/src/vilkarperiode';
import { Knapp, Hovedknapp } from 'nav-frontend-knapper';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import OverstyrBekreftKnappPanel from './OverstyrBekreftKnappPanel';
import { SoknadsfristVilkarBegrunnelse } from './SoknadsfristVilkarBegrunnelse';
import styles from './SoknadsfristVilkarForm.less';

const getFormName = (overstyringApKode: string) => `VilkarresultatForm_${overstyringApKode}`;

export interface CustomVilkarText {
  id: string;
  values?: any;
}

export interface DokumentStatus {
  type: string;
  status: [
    {
      periode: { fom: string; tom: string };
      status: { kode: string; kodeverk: string };
    },
  ];
  innsendingstidspunkt: string;
  journalpostId: string;
}

interface SoknadsfristVilkarFormProps {
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
  erOverstyrt?: boolean;
  erVilkarOk?: boolean;
  harAksjonspunkt: boolean;
  isReadOnly: boolean;
  lovReferanse?: string;
  medlemskapFom: string;
  overrideReadOnly: boolean;
  status: string;
  submitCallback: (props: SubmitCallback[]) => void;
  toggleOverstyring: (overstyrtPanel: SetStateAction<string[]>) => void;
  avslagKode?: string;
  periode?: Vilkarperiode;
  dokument?: DokumentStatus[];
}

interface StateProps {
  isSolvable: boolean;
  harÅpentAksjonspunkt: boolean;
  periodeFom: string;
  periodeTom: string;
}

/**
 * VilkarresultatForm
 *
 * Presentasjonskomponent. Viser resultat av vilkårskjøring når det ikke finnes tilknyttede aksjonspunkter.
 * Resultatet kan overstyres av Nav-ansatt med overstyr-rettighet.
 */
export const SoknadsfristVilkarForm: FunctionComponent<SoknadsfristVilkarFormProps & StateProps & InjectedFormProps> =
  ({
    erOverstyrt,
    harÅpentAksjonspunkt,
    isReadOnly,
    isSolvable,
    erVilkarOk,
    customVilkarIkkeOppfyltText,
    customVilkarOppfyltText,
    harAksjonspunkt,
    avslagsarsaker,
    overrideReadOnly,
    toggleOverstyring,
    reset,
    handleSubmit,
    submitting,
    pristine,
    periodeFom,
    periodeTom,
    dokument,
  }) => {
    const toggleAv = () => {
      reset();
      toggleOverstyring(oldArray => oldArray.filter(code => code !== aksjonspunktCodes.OVERSTYR_SOKNADSFRISTVILKAR));
    };

    useEffect(
      () => () => {
        reset();
      },
      [periodeFom, periodeTom],
    );

    return (
      <form onSubmit={handleSubmit}>
        {(erOverstyrt || harAksjonspunkt) && (
          <AksjonspunktBox
            className={styles.aksjonspunktMargin}
            erAksjonspunktApent={erOverstyrt || harÅpentAksjonspunkt}
          >
            {harÅpentAksjonspunkt ? (
              <AksjonspunktHelpTextTemp isAksjonspunktOpen>
                {[<FormattedMessage id="SoknadsfristVilkarForm.AvklarVurdering" />]}
              </AksjonspunktHelpTextTemp>
            ) : (
              <Element>
                <FormattedMessage id="SoknadsfristVilkarForm.AutomatiskVurdering" />
              </Element>
            )}
            <VerticalSpacer eightPx />
            <SoknadsfristVilkarBegrunnelse
              skalViseBegrunnelse={erOverstyrt || harAksjonspunkt}
              readOnly={isReadOnly || (!erOverstyrt && !harÅpentAksjonspunkt)}
              erVilkarOk={erVilkarOk}
              customVilkarIkkeOppfyltText={customVilkarIkkeOppfyltText}
              customVilkarOppfyltText={customVilkarOppfyltText}
              avslagsarsaker={avslagsarsaker}
              dokument={dokument}
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
                      <FormattedMessage id="SoknadsfristVilkarForm.Endret" />
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
                      <FormattedMessage id="SoknadsfristVilkarForm.Unntakstilfeller" />
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
                      <FormattedMessage id="SoknadsfristVilkarForm.Avbryt" />
                    </Knapp>
                  </FlexColumn>
                </FlexRow>
              </FlexContainer>
            )}
            {harÅpentAksjonspunkt && !erOverstyrt && (
              <Hovedknapp mini spinner={submitting} disabled={submitting || pristine}>
                <FormattedMessage id="SoknadsfristVilkarForm.ConfirmInformation" />
              </Hovedknapp>
            )}
          </AksjonspunktBox>
        )}
      </form>
    );
  };

const buildInitialValues = createSelector(
  [
    (ownProps: SoknadsfristVilkarFormProps) => ownProps.avslagKode,
    (ownProps: SoknadsfristVilkarFormProps) => ownProps.aksjonspunkter,
    (ownProps: SoknadsfristVilkarFormProps) => ownProps.status,
    (ownProps: SoknadsfristVilkarFormProps) => ownProps.periode,
    (ownProps: SoknadsfristVilkarFormProps) => ownProps.dokument,
  ],
  (avslagKode, aksjonspunkter, status, periode, dokument) => {
    const overstyrtAksjonspunkt = aksjonspunkter.find(
      ap => ap.definisjon.kode === aksjonspunktCodes.OVERSTYR_SOKNADSFRISTVILKAR,
    );

    return {
      isOverstyrt: overstyrtAksjonspunkt !== undefined,
      ...SoknadsfristVilkarBegrunnelse.buildInitialValues(avslagKode, aksjonspunkter, status, periode, dokument),
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
  [(ownProps: SoknadsfristVilkarFormProps) => ownProps.medlemskapFom, ownProps => ownProps.behandlingType],
  (medlemskapFom, behandlingType) => getCustomVilkarText(medlemskapFom, behandlingType, true),
);

const getCustomVilkarTextForIkkeOppfylt = createSelector(
  [(ownProps: SoknadsfristVilkarFormProps) => ownProps.medlemskapFom, ownProps => ownProps.behandlingType],
  (medlemskapFom, behandlingType) => getCustomVilkarText(medlemskapFom, behandlingType, false),
);

const transformValues = (values, apKode, periodeFom, periodeTom) => ({
  kode: apKode,
  // @ts-ignore Fiks
  ...VilkarResultPicker.transformValues(values),
  ...SoknadsfristVilkarBegrunnelse.transformValues(values),
  periode: periodeFom && periodeTom ? { fom: periodeFom, tom: periodeTom } : undefined,
});

const validate = values => SoknadsfristVilkarBegrunnelse.validate(values);

const mapStateToPropsFactory = (_initialState, initialOwnProps: SoknadsfristVilkarFormProps) => {
  const { submitCallback, periode } = initialOwnProps;
  const periodeFom = periode?.periode?.fom;
  const periodeTom = periode?.periode?.tom;
  const validateFn = values => validate(values);

  return (state, ownProps) => {
    const { behandlingId, behandlingVersjon, aksjonspunkter, erOverstyrt, overrideReadOnly } = ownProps;

    const harÅpentAksjonspunkt = aksjonspunkter.some(
      ap =>
        ap.definisjon.kode === aksjonspunktCodes.KONTROLLER_OPPLYSNINGER_OM_SØKNADSFRIST &&
        !(ap.status.kode === aksjonspunktStatus.OPPRETTET && !ap.kanLoses),
    );
    const aksjonspunkt = harÅpentAksjonspunkt
      ? aksjonspunkter.find(ap => ap.definisjon.kode === aksjonspunktCodes.KONTROLLER_OPPLYSNINGER_OM_SØKNADSFRIST)
      : aksjonspunkter.find(ap => ap.definisjon.kode === aksjonspunktCodes.OVERSTYR_SOKNADSFRISTVILKAR);
    const isSolvable =
      harÅpentAksjonspunkt || aksjonspunkt !== undefined
        ? !(aksjonspunkt.status.kode === aksjonspunktStatus.OPPRETTET && !aksjonspunkt.kanLoses)
        : false;

    const aksjonspunktCode = harÅpentAksjonspunkt
      ? aksjonspunktCodes.KONTROLLER_OPPLYSNINGER_OM_SØKNADSFRIST
      : aksjonspunktCodes.OVERSTYR_SOKNADSFRISTVILKAR;

    const formName = getFormName(aksjonspunktCode);
    const onSubmit = values => submitCallback([transformValues(values, aksjonspunktCode, periodeFom, periodeTom)]);

    const initialValues = buildInitialValues(ownProps);

    return {
      onSubmit,
      initialValues,
      harÅpentAksjonspunkt,
      harAksjonspunkt: aksjonspunkt !== undefined,
      customVilkarOppfyltText: getCustomVilkarTextForOppfylt(ownProps),
      customVilkarIkkeOppfyltText: getCustomVilkarTextForIkkeOppfylt(ownProps),
      isSolvable: erOverstyrt || isSolvable,
      isReadOnly: overrideReadOnly,
      validate: validateFn,
      form: formName,
      periodeFom,
      periodeTom,
      ...behandlingFormValueSelector(formName, behandlingId, behandlingVersjon)(state, 'isOverstyrt', 'erVilkarOk'),
    };
  };
};

// @ts-ignore Kan ikkje senda med formnavn her sidan det er dynamisk. Må fikse på ein annan måte
const form = behandlingForm({ enableReinitialize: true })(SoknadsfristVilkarForm);
export default connect(mapStateToPropsFactory)(form);
