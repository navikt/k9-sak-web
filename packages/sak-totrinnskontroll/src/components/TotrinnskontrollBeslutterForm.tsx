import vurderPaNyttArsakType from '@fpsak-frontend/kodeverk/src/vurderPaNyttArsakType';
import { AksjonspunktHelpText } from '@fpsak-frontend/shared-components';
import { ariaCheck, decodeHtmlEntity } from '@fpsak-frontend/utils';
import {
  Behandling,
  KlageVurdering,
  Kodeverk,
  KodeverkMedNavn,
  TotrinnskontrollAksjonspunkt,
  TotrinnskontrollSkjermlenkeContext,
} from '@k9-sak-web/types';
import { Button } from '@navikt/ds-react';
import { Form } from '@navikt/ft-form-hooks';
import { Location } from 'history';
import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import AksjonspunktGodkjenningFieldArray from './AksjonspunktGodkjenningFieldArray';
import { FormState } from './FormState';
import styles from './totrinnskontrollBeslutterForm.module.css';

const erAlleGodkjent = (formState: TotrinnskontrollAksjonspunkt[] = []) =>
  formState.every(ap => ap.totrinnskontrollGodkjent && ap.totrinnskontrollGodkjent === true);

const erAlleGodkjentEllerAvvist = (formState: TotrinnskontrollAksjonspunkt[] = []) =>
  formState.every(ap => ap.totrinnskontrollGodkjent !== null);

const buildInitialValues = (totrinnskontrollContext: TotrinnskontrollSkjermlenkeContext[]): FormState => ({
  aksjonspunktGodkjenning: totrinnskontrollContext
    .map(context => context.totrinnskontrollAksjonspunkter)
    .flat()
    .map(ap => ({
      aksjonspunktKode: ap.aksjonspunktKode,
      totrinnskontrollGodkjent: ap.totrinnskontrollGodkjent,
      besluttersBegrunnelse: ap.besluttersBegrunnelse ? decodeHtmlEntity(ap.besluttersBegrunnelse) : '',
      ...(ap.vurderPaNyttArsaker ? finnArsaker(ap.vurderPaNyttArsaker) : []),
    })),
});

interface PureOwnProps {
  behandling: Behandling;
  totrinnskontrollSkjermlenkeContext: TotrinnskontrollSkjermlenkeContext[];
  behandlingKlageVurdering?: KlageVurdering;
  readOnly: boolean;
  arbeidsforholdHandlingTyper: KodeverkMedNavn[];
  skjermlenkeTyper: KodeverkMedNavn[];
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
        arbeidsforholdHandlingTyper={arbeidsforholdHandlingTyper}
        readOnly={readOnly}
        klageKA={!!behandlingKlageVurdering?.klageVurderingResultatNK}
        totrinnskontrollSkjermlenkeContext={totrinnskontrollSkjermlenkeContext}
        skjermlenkeTyper={skjermlenkeTyper}
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

const finnArsaker = (vurderPaNyttArsaker: Kodeverk[]) =>
  vurderPaNyttArsaker.reduce((acc, arsak) => {
    if (arsak.kode === vurderPaNyttArsakType.FEIL_FAKTA) {
      return { ...acc, feilFakta: true };
    }
    if (arsak.kode === vurderPaNyttArsakType.FEIL_LOV) {
      return { ...acc, feilLov: true };
    }
    if (arsak.kode === vurderPaNyttArsakType.FEIL_REGEL) {
      return { ...acc, feilRegel: true };
    }
    if (arsak.kode === vurderPaNyttArsakType.ANNET) {
      return { ...acc, annet: true };
    }
    return {};
  }, {});

export default TotrinnskontrollBeslutterForm;
