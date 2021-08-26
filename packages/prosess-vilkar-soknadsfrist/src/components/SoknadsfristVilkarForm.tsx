import React, { SetStateAction } from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { InjectedFormProps } from 'redux-form';
import { createSelector } from 'reselect';
import { FormattedMessage } from 'react-intl';

import advarselIkonUrl from '@fpsak-frontend/assets/images/advarsel_ny.svg';
import { behandlingForm, behandlingFormValueSelector } from '@fpsak-frontend/form';
import { DDMMYYYY_DATE_FORMAT, decodeHtmlEntity, isRequiredMessage } from '@fpsak-frontend/utils';
import aksjonspunktStatus from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
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
import { Aksjonspunkt, DokumentStatus, SubmitCallback } from '@k9-sak-web/types';
import Vilkarperiode from '@k9-sak-web/types/src/vilkarperiode';
import { Knapp, Hovedknapp } from 'nav-frontend-knapper';
import { Element, Normaltekst } from 'nav-frontend-typografi';

import OverstyrBekreftKnappPanel from './OverstyrBekreftKnappPanel';
import SoknadsfristVilkarDokument, { DELVIS_OPPFYLT } from './SoknadsfristVilkarDokument';

import styles from './SoknadsfristVilkarForm.less';

const formatDate = dato => moment(dato).format(DDMMYYYY_DATE_FORMAT);

const formName = 'SøknadsfristVilkårOverstyringForm';

interface SoknadsfristVilkarFormProps {
  /* eslint-disable react/no-unused-prop-types */
  aksjonspunkter: Aksjonspunkt[];
  behandlingId: number;
  behandlingVersjon: number;
  submitCallback: (props: SubmitCallback[]) => void;
  periode?: Vilkarperiode;
  erOverstyrt?: boolean;
  erVilkarOk?: boolean;
  harAksjonspunkt: boolean;
  isReadOnly: boolean;
  overrideReadOnly: boolean;
  status: string;
  invalid: boolean;
  toggleOverstyring: (overstyrtPanel: SetStateAction<string[]>) => void;
  alleDokumenter?: DokumentStatus[];
  dokumenter?: DokumentStatus[];
}

interface StateProps {
  isSolvable: boolean;
  harÅpentAksjonspunkt: boolean;
}

/**
 * VilkarresultatForm
 *
 * Presentasjonskomponent. Viser resultat av vilkårskjøring når det ikke finnes tilknyttede aksjonspunkter.
 * Resultatet kan overstyres av Nav-ansatt med overstyr-rettighet.
 */
export const SoknadsfristVilkarForm = ({
  erOverstyrt,
  harÅpentAksjonspunkt,
  isReadOnly,
  isSolvable,
  erVilkarOk,
  harAksjonspunkt,
  overrideReadOnly,
  toggleOverstyring,
  reset,
  handleSubmit,
  submitting,
  pristine,
  status,
  invalid,
  alleDokumenter,
  dokumenter,
}: SoknadsfristVilkarFormProps & StateProps & InjectedFormProps) => {
  const toggleAv = () => {
    reset();
    toggleOverstyring(oldArray => oldArray.filter(code => code !== aksjonspunktCodes.OVERSTYR_SOKNADSFRISTVILKAR));
  };

  return (
    <form onSubmit={handleSubmit}>
      {(erOverstyrt || harAksjonspunkt) && status !== vilkarUtfallType.OPPFYLT && (
        <AksjonspunktBox
          className={styles.aksjonspunktMargin}
          erAksjonspunktApent={erOverstyrt || harÅpentAksjonspunkt}
        >
          {harÅpentAksjonspunkt ? (
            <AksjonspunktHelpTextTemp isAksjonspunktOpen>
              {[<FormattedMessage key={1} id="SoknadsfristVilkarForm.AvklarVurdering" />]}
            </AksjonspunktHelpTextTemp>
          ) : (
            <Element>
              <FormattedMessage id="SoknadsfristVilkarForm.AutomatiskVurdering" />
            </Element>
          )}
          <VerticalSpacer eightPx />
          {Array.isArray(alleDokumenter) && alleDokumenter.length > 0 ? (
            alleDokumenter.map((dokument, index) => (
              <SoknadsfristVilkarDokument
                key={dokument.journalpostId}
                erAktivtDokument={dokumenter.findIndex(d => d.journalpostId === dokument.journalpostId) > -1}
                skalViseBegrunnelse={erOverstyrt || harAksjonspunkt}
                readOnly={isReadOnly || (!erOverstyrt && !harÅpentAksjonspunkt)}
                erVilkarOk={erVilkarOk}
                dokumentIndex={index}
                dokument={dokument}
              />
            ))
          ) : (
            <FormattedMessage id="SoknadsfristVilkarForm.IngenDokumenter" />
          )}
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
                    disabled={invalid}
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
            <Hovedknapp mini spinner={submitting} disabled={invalid || submitting || pristine}>
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
    (ownProps: SoknadsfristVilkarFormProps) => ownProps.aksjonspunkter,
    (ownProps: SoknadsfristVilkarFormProps) => ownProps.alleDokumenter,
  ],
  (aksjonspunkter, alleDokumenter) => {
    const overstyrtAksjonspunkt = aksjonspunkter.find(
      ap => ap.definisjon.kode === aksjonspunktCodes.OVERSTYR_SOKNADSFRISTVILKAR,
    );

    return {
      isOverstyrt: overstyrtAksjonspunkt !== undefined,
      avklarteKrav: alleDokumenter.map(dokument => ({
        erVilkarOk: dokument.overstyrteOpplysninger?.godkjent || dokument.avklarteOpplysninger?.godkjent,
        begrunnelse: decodeHtmlEntity(
          dokument.overstyrteOpplysninger?.begrunnelse || dokument.avklarteOpplysninger?.begrunnelse || '',
        ),
        journalpostId: dokument.journalpostId,
        fraDato: formatDate(
          dokument.overstyrteOpplysninger?.fraDato ||
            dokument.avklarteOpplysninger?.fraDato ||
            dokument.innsendingstidspunkt,
        ),
      })),
      // ...SoknadsfristVilkarDokument.buildInitialValues(dokumenter),
    };
  },
);

/**
 * Temporær fiks for saksbehandlere som setter dato og forventer at
 * backend skal telle fra og meg datoen de setter.
 *
 * Backend teller fra dagen etter..
 */
const minusEnDag = dato => moment(dato).subtract(1, 'days').format('YYYY-MM-DD');

const transformValues = (values, alleDokumenter, apKode, periodeFom, periodeTom) => ({
  kode: apKode,
  begrunnelse: values.avklarteKrav.map(krav => krav.begrunnelse).join('\n'),
  avklarteKrav: values.avklarteKrav.map(krav => {
    const dokumentStatus = alleDokumenter.find(d => d.journalpostId === krav.journalpostId);
    const erVilkarOk = krav.erVilkarOk === true || krav.erVilkarOk === DELVIS_OPPFYLT;

    return {
      ...krav,
      erVilkarOk,
      godkjent: erVilkarOk,
      // fjern denne modifiern hvis backend oppdateres..
      fraDato: minusEnDag(krav.erVilkarOk === true ? dokumentStatus.status[0]?.periode.fom : krav.fraDato),
    };
  }),
  erVilkarOk: !values.avklarteKrav.some(krav => !krav.erVilkarOk),
  periode: periodeFom && periodeTom ? { fom: periodeFom, tom: periodeTom } : undefined,
});

const validate = (
  values: { avklarteKrav: any; erVilkarOk: boolean; avslagCode: string } = {
    avklarteKrav: [],
    erVilkarOk: false,
    avslagCode: '',
  },
) => {
  const errors: {
    avklarteKrav?: Array<{
      erVilkarOk?: string | { id: string }[];
      begrunnelse?: string | { id: string }[];
    }>;
    erVilkarOk?: string | { id: string }[];
    avslagCode?: string | { id: string }[];
  } = {
    avklarteKrav: [],
  };

  if (Array.isArray(values.avklarteKrav)) {
    values.avklarteKrav.forEach((krav, index) => {
      if (!errors.avklarteKrav[index]) {
        errors.avklarteKrav[index] = {};
      }

      if (typeof krav.erVilkarOk === 'undefined') {
        errors.avklarteKrav[index].erVilkarOk = isRequiredMessage();
      }

      if (!krav.begrunnelse || krav.begrunnelse.length < 3 || krav.begrunnelse.length >= 1500) {
        errors.avklarteKrav[index].begrunnelse = isRequiredMessage();
      }
    });
  }

  return errors;
};

const mapStateToPropsFactory = (_initialState, initialOwnProps: SoknadsfristVilkarFormProps) => {
  const { submitCallback, alleDokumenter, periode } = initialOwnProps;
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

    const onSubmit = values =>
      submitCallback([transformValues(values, alleDokumenter, aksjonspunktCode, periodeFom, periodeTom)]);

    const initialValues = buildInitialValues(ownProps);

    return {
      onSubmit,
      initialValues,
      harÅpentAksjonspunkt,
      harAksjonspunkt: aksjonspunkt !== undefined,
      isSolvable: erOverstyrt || isSolvable,
      isReadOnly: overrideReadOnly,
      validate: validateFn,
      ...behandlingFormValueSelector(formName, behandlingId, behandlingVersjon)(state, 'isOverstyrt', 'erVilkarOk'),
    };
  };
};

const form = behandlingForm({
  form: formName,
  // validate,
  enableReinitialize: true,
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
})(SoknadsfristVilkarForm);

export default connect(mapStateToPropsFactory)(form);
