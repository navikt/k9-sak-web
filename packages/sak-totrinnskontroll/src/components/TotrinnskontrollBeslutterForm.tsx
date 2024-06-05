import { behandlingForm, behandlingFormValueSelector } from '@fpsak-frontend/form';
import vurderPaNyttArsakType from '@fpsak-frontend/kodeverk/src/vurderPaNyttArsakType';
import { AksjonspunktHelpText, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { ariaCheck, decodeHtmlEntity, isRequiredMessage } from '@fpsak-frontend/utils';
import {
  Behandling,
  KlageVurdering,
  TotrinnskontrollAksjonspunkt,
  TotrinnskontrollSkjermlenkeContext,
} from '@k9-sak-web/types';
import { Button } from '@navikt/ds-react';
import { Location } from 'history';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { FieldArray, InjectedFormProps } from 'redux-form';
import { createSelector } from 'reselect';
import { KodeverkV2, KodeverkObject } from '@k9-sak-web/lib/types/index.js';
import AksjonspunktGodkjenningFieldArray, { AksjonspunktGodkjenningData } from './AksjonspunktGodkjenningFieldArray';
import styles from './totrinnskontrollBeslutterForm.module.css';

const erAlleGodkjent = (formState: TotrinnskontrollAksjonspunkt[] = []) =>
  formState.every(ap => ap.totrinnskontrollGodkjent && ap.totrinnskontrollGodkjent === true);

const erAlleGodkjentEllerAvvist = (formState: TotrinnskontrollAksjonspunkt[] = []) =>
  formState.every(ap => ap.totrinnskontrollGodkjent !== null);

interface PureOwnProps {
  behandling: Behandling;
  totrinnskontrollSkjermlenkeContext: TotrinnskontrollSkjermlenkeContext[];
  behandlingKlageVurdering?: KlageVurdering;
  readOnly: boolean;
  erTilbakekreving: boolean;
  arbeidsforholdHandlingTyper: KodeverkV2[];
  skjemalenkeTyper: KodeverkV2[];
  lagLenke: (skjermlenkeCode: string) => Location;
}

interface MappedOwnProps {
  aksjonspunktGodkjenning: TotrinnskontrollAksjonspunkt[];
}

/*
 * TotrinnskontrollBeslutterForm
 *
 * Presentasjonskomponent. Holds the form of the totrinnkontroll
 */
export const TotrinnskontrollBeslutterForm = ({
  behandling,
  handleSubmit,
  readOnly,
  behandlingKlageVurdering,
  arbeidsforholdHandlingTyper,
  skjemalenkeTyper,
  erTilbakekreving,
  aksjonspunktGodkjenning,
  totrinnskontrollSkjermlenkeContext,
  lagLenke,
  ...formProps
}: PureOwnProps & MappedOwnProps & InjectedFormProps) => {
  if (!behandling.toTrinnsBehandling) {
    return null;
  }

  return (
    <form name="toTrinn" onSubmit={handleSubmit}>
      {!readOnly && (
        <>
          <AksjonspunktHelpText isAksjonspunktOpen>
            {[<FormattedMessage key={1} id="HelpText.ToTrinnsKontroll" />]}
          </AksjonspunktHelpText>
          <VerticalSpacer sixteenPx />
        </>
      )}
      <FieldArray
        name="aksjonspunktGodkjenning"
        component={AksjonspunktGodkjenningFieldArray}
        klagebehandlingVurdering={behandlingKlageVurdering}
        behandlingStatus={behandling.status}
        erTilbakekreving={erTilbakekreving}
        arbeidsforholdHandlingTyper={arbeidsforholdHandlingTyper as KodeverkObject[]}
        readOnly={readOnly}
        klageKA={!!behandlingKlageVurdering?.klageVurderingResultatNK}
        totrinnskontrollSkjermlenkeContext={totrinnskontrollSkjermlenkeContext}
        skjemalenkeTyper={skjemalenkeTyper as KodeverkObject[]}
        lagLenke={lagLenke}
      />
      <div className={styles.buttonRow}>
        <Button
          variant="primary"
          size="small"
          disabled={
            !erAlleGodkjent(aksjonspunktGodkjenning) ||
            !erAlleGodkjentEllerAvvist(aksjonspunktGodkjenning) ||
            formProps.submitting
          }
          loading={formProps.submitting}
        >
          <FormattedMessage id="ToTrinnsForm.Godkjenn" />
        </Button>
        <Button
          variant="primary"
          size="small"
          disabled={
            erAlleGodkjent(aksjonspunktGodkjenning) ||
            !erAlleGodkjentEllerAvvist(aksjonspunktGodkjenning) ||
            formProps.submitting
          }
          loading={formProps.submitting}
          onClick={ariaCheck}
        >
          <FormattedMessage id="ToTrinnsForm.SendTilbake" />
        </Button>
      </div>
    </form>
  );
};

export type FormValues = {
  aksjonspunktGodkjenning: AksjonspunktGodkjenningData[];
};

const validate = (values: FormValues) => {
  const errors = {};
  if (!values.aksjonspunktGodkjenning) {
    return errors;
  }

  return {
    aksjonspunktGodkjenning: values.aksjonspunktGodkjenning.map(kontekst => {
      if (!kontekst.feilFakta && !kontekst.feilLov && !kontekst.feilRegel && !kontekst.annet) {
        return {
          missingArsakError: isRequiredMessage(),
        };
      }

      return undefined;
    }),
  };
};

const finnArsaker = (vurderPaNyttArsaker: string[]) =>
  vurderPaNyttArsaker.reduce((acc, arsak) => {
    if (arsak === vurderPaNyttArsakType.FEIL_FAKTA) {
      return { ...acc, feilFakta: true };
    }
    if (arsak === vurderPaNyttArsakType.FEIL_LOV) {
      return { ...acc, feilLov: true };
    }
    if (arsak === vurderPaNyttArsakType.FEIL_REGEL) {
      return { ...acc, feilRegel: true };
    }
    if (arsak === vurderPaNyttArsakType.ANNET) {
      return { ...acc, annet: true };
    }
    return {};
  }, {});

const buildInitialValues = createSelector(
  [(ownProps: PureOwnProps) => ownProps.totrinnskontrollSkjermlenkeContext],
  (totrinnskontrollContext): FormValues => ({
    aksjonspunktGodkjenning: totrinnskontrollContext
      .map(context => context.totrinnskontrollAksjonspunkter)
      .flat()
      .map(ap => ({
        aksjonspunktKode: ap.aksjonspunktKode,
        totrinnskontrollGodkjent: ap.totrinnskontrollGodkjent,
        besluttersBegrunnelse: decodeHtmlEntity(ap.besluttersBegrunnelse),
        ...finnArsaker(ap.vurderPaNyttArsaker),
      })),
  }),
);

const formName = 'toTrinnForm';

const mapStateToProps = (state: any, ownProps: PureOwnProps) => ({
  initialValues: buildInitialValues(ownProps),
  aksjonspunktGodkjenning: behandlingFormValueSelector(
    formName,
    ownProps.behandling.id,
    ownProps.behandling.versjon,
  )(state, 'aksjonspunktGodkjenning'),
});

export default connect(mapStateToProps)(behandlingForm({ form: formName, validate })(TotrinnskontrollBeslutterForm));
