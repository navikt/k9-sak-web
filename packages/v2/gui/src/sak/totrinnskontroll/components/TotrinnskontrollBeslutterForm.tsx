import AksjonspunktHelpText from '@k9-sak-web/gui/shared/aksjonspunktHelpText/AksjonspunktHelpText.js';
import type { KodeverkObject, KodeverkV2 } from '@k9-sak-web/lib/kodeverk/types.js';
import { Button } from '@navikt/ds-react';
import { Form } from '@navikt/ft-form-hooks';
import { ariaCheck } from '@navikt/ft-form-validators';
import { decodeHtmlEntity } from '@navikt/ft-utils';
import type { KlagebehandlingDto } from '@navikt/k9-klage-typescript-client';
import { TotrinnskontrollAksjonspunkterDtoVurderPaNyttArsaker } from '@navikt/k9-sak-typescript-client';
import type { Location } from 'history';
import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import type { Behandling } from '../types/Behandling';
import type { TotrinnskontrollAksjonspunkt } from '../types/TotrinnskontrollAksjonspunkt';
import type { TotrinnskontrollSkjermlenkeContext } from '../types/TotrinnskontrollSkjermlenkeContext';
import AksjonspunktGodkjenningFieldArray from './AksjonspunktGodkjenningFieldArray';
import type { FormState } from './FormState';
import styles from './totrinnskontrollBeslutterForm.module.css';

const erAlleGodkjent = (aksjonspunktGodkjenning: FormState['aksjonspunktGodkjenning'] = []) =>
  aksjonspunktGodkjenning.every(ap => ap.totrinnskontrollGodkjent && ap.totrinnskontrollGodkjent === true);

const erAlleGodkjentEllerAvvist = (aksjonspunktGodkjenning: FormState['aksjonspunktGodkjenning'] = []) =>
  aksjonspunktGodkjenning.every(ap => ap.totrinnskontrollGodkjent !== null);

const buildInitialValues = (totrinnskontrollContext: TotrinnskontrollSkjermlenkeContext[]): FormState => ({
  aksjonspunktGodkjenning: totrinnskontrollContext
    .map(context => context.totrinnskontrollAksjonspunkter)
    .flat()
    .map(ap => ({
      aksjonspunktKode: ap.aksjonspunktKode,
      totrinnskontrollGodkjent: ap.totrinnskontrollGodkjent,
      besluttersBegrunnelse: ap.besluttersBegrunnelse ? decodeHtmlEntity(ap.besluttersBegrunnelse) : undefined,
      ...(ap.vurderPaNyttArsaker ? finnArsaker(ap.vurderPaNyttArsaker) : []),
    })),
});

interface PureOwnProps {
  behandling: Behandling;
  totrinnskontrollSkjermlenkeContext: TotrinnskontrollSkjermlenkeContext[];
  behandlingKlageVurdering?: KlagebehandlingDto;
  readOnly: boolean;
  arbeidsforholdHandlingTyper: KodeverkV2[];
  skjermlenkeTyper: KodeverkV2[];
  lagLenke: (skjermlenkeCode: string) => Location;
  handleSubmit: (formValues: FormState) => void;
  toTrinnFormState?: FormState;
  setToTrinnFormState?: React.Dispatch<FormState>;
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
  skjermlenkeTyper,
  totrinnskontrollSkjermlenkeContext,
  lagLenke,
  toTrinnFormState,
  setToTrinnFormState,
}: PureOwnProps) => {
  const formMethods = useForm<FormState>({
    defaultValues: toTrinnFormState || buildInitialValues(totrinnskontrollSkjermlenkeContext),
  });
  const aksjonspunktGodkjenning = useWatch({
    control: formMethods.control,
    name: 'aksjonspunktGodkjenning',
  });
  const { formState } = formMethods;
  useEffect(
    () => () => {
      if (setToTrinnFormState) {
        setToTrinnFormState({ aksjonspunktGodkjenning });
      }
    },
    [aksjonspunktGodkjenning, setToTrinnFormState],
  );
  if (!behandling.toTrinnsBehandling) {
    return null;
  }

  const onSubmit = (formState: FormState) => {
    if (
      !erAlleGodkjent(formState.aksjonspunktGodkjenning) &&
      formState.aksjonspunktGodkjenning.some(
        ap => !ap.totrinnskontrollGodkjent && !ap.annet && !ap.feilFakta && !ap.feilLov && !ap.feilRegel,
      )
    ) {
      return;
    } else {
      handleSubmit(formState);
    }
  };

  return (
    <Form formMethods={formMethods} onSubmit={onSubmit}>
      {!readOnly && (
        <>
          <AksjonspunktHelpText isAksjonspunktOpen>
            Kontroller endrede opplysninger og faglige vurderinger
          </AksjonspunktHelpText>
          <div className="mt-4" />
        </>
      )}
      <AksjonspunktGodkjenningFieldArray
        klagebehandlingVurdering={behandlingKlageVurdering}
        behandlingStatus={behandling.status}
        arbeidsforholdHandlingTyper={arbeidsforholdHandlingTyper as KodeverkObject[]}
        readOnly={readOnly}
        klageKA={!!behandlingKlageVurdering?.klageVurderingResultatNK}
        totrinnskontrollSkjermlenkeContext={totrinnskontrollSkjermlenkeContext}
        skjermlenkeTyper={skjermlenkeTyper as KodeverkObject[]}
        lagLenke={lagLenke}
      />
      <div className={styles.buttonRow}>
        <Button
          variant="primary"
          size="small"
          disabled={
            !erAlleGodkjent(aksjonspunktGodkjenning) ||
            !erAlleGodkjentEllerAvvist(aksjonspunktGodkjenning) ||
            formState.isSubmitting
          }
          loading={formState.isSubmitting}
        >
          Godkjenn vedtaket
        </Button>
        <Button
          variant="primary"
          size="small"
          disabled={
            erAlleGodkjent(aksjonspunktGodkjenning) ||
            !erAlleGodkjentEllerAvvist(aksjonspunktGodkjenning) ||
            formState.isSubmitting
          }
          loading={formState.isSubmitting}
          onClick={ariaCheck}
        >
          Send til saksbehandler
        </Button>
      </div>
    </Form>
  );
};

const finnArsaker = (vurderPaNyttArsaker?: TotrinnskontrollAksjonspunkt['vurderPaNyttArsaker']) =>
  vurderPaNyttArsaker?.reduce((acc, arsak) => {
    if (arsak === TotrinnskontrollAksjonspunkterDtoVurderPaNyttArsaker.FEIL_FAKTA) {
      return { ...acc, feilFakta: true };
    }
    if (arsak === TotrinnskontrollAksjonspunkterDtoVurderPaNyttArsaker.FEIL_LOV) {
      return { ...acc, feilLov: true };
    }
    if (arsak === TotrinnskontrollAksjonspunkterDtoVurderPaNyttArsaker.FEIL_REGEL) {
      return { ...acc, feilRegel: true };
    }
    if (arsak === TotrinnskontrollAksjonspunkterDtoVurderPaNyttArsaker.ANNET) {
      return { ...acc, annet: true };
    }
    return {};
  }, {});

export default TotrinnskontrollBeslutterForm;
