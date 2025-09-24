import type { k9_klage_kontrakt_klage_KlagebehandlingDto as KlagebehandlingDto } from '@k9-sak-web/backend/k9klage/generated/types.js';
import { k9_kodeverk_behandling_aksjonspunkt_VurderÅrsak as TotrinnskontrollAksjonspunkterDtoVurderPaNyttArsaker } from '@k9-sak-web/backend/k9sak/generated/types.js';
import AksjonspunktHelpText from '@k9-sak-web/gui/shared/aksjonspunktHelpText/AksjonspunktHelpText.js';
import { Button } from '@navikt/ds-react';
import { RhfForm } from '@navikt/ft-form-hooks';
import { decodeHtmlEntity } from '@navikt/ft-utils';
import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import type { TotrinnskontrollBehandling } from '../types/TotrinnskontrollBehandling.ts';
import type { FormState } from './FormState';
import styles from './totrinnskontrollBeslutterForm.module.css';
import type { TotrinnskontrollAksjonspunkterDto } from '@k9-sak-web/backend/combined/kontrakt/vedtak/TotrinnskontrollAksjonspunkterDto.js';
import AksjonspunktGodkjenningFieldArray from './AksjonspunktGodkjenningFieldArray.js';
import type { TotrinnskontrollData } from '../../../behandling/support/totrinnskontroll/TotrinnskontrollApi.ts';

const erAlleGodkjent = (aksjonspunktGodkjenning: FormState['aksjonspunktGodkjenning'] = []) =>
  aksjonspunktGodkjenning.every(ap => ap.totrinnskontrollGodkjent && ap.totrinnskontrollGodkjent === true);

const erAlleGodkjentEllerAvvist = (aksjonspunktGodkjenning: FormState['aksjonspunktGodkjenning'] = []) =>
  aksjonspunktGodkjenning.every(ap => ap.totrinnskontrollGodkjent !== null);

const buildInitialValues = (totrinnskontrollData: TotrinnskontrollData): FormState => ({
  aksjonspunktGodkjenning: totrinnskontrollData.alleAksjonspunkt.map(ap => ({
    aksjonspunktKode: ap.aksjonspunktKode,
    totrinnskontrollGodkjent: ap.totrinnskontrollGodkjent,
    besluttersBegrunnelse: ap.besluttersBegrunnelse ? decodeHtmlEntity(ap.besluttersBegrunnelse) : undefined,
    ...(ap.vurderPaNyttArsaker ? finnArsaker(ap.vurderPaNyttArsaker) : []),
  })),
});

interface PureOwnProps {
  behandling: TotrinnskontrollBehandling;
  totrinnskontrollData: TotrinnskontrollData;
  behandlingKlageVurdering?: KlagebehandlingDto;
  readOnly: boolean;
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
  totrinnskontrollData,
  toTrinnFormState,
  setToTrinnFormState,
}: PureOwnProps) => {
  const formMethods = useForm<FormState>({
    defaultValues: toTrinnFormState || buildInitialValues(totrinnskontrollData),
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
    <RhfForm formMethods={formMethods} onSubmit={onSubmit}>
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
        readOnly={readOnly}
        klageKA={!!behandlingKlageVurdering?.klageVurderingResultatNK}
        totrinnskontrollData={totrinnskontrollData}
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
        >
          Send til saksbehandler
        </Button>
      </div>
    </RhfForm>
  );
};

const finnArsaker = (vurderPaNyttArsaker?: TotrinnskontrollAksjonspunkterDto['vurderPaNyttArsaker']) => {
  let feilFakta = false;
  let feilLov = false;
  let feilRegel = false;
  let annet = false;
  for (const årsak of vurderPaNyttArsaker ?? []) {
    switch (årsak) {
      case TotrinnskontrollAksjonspunkterDtoVurderPaNyttArsaker.FEIL_FAKTA:
        feilFakta = true;
        break;
      case TotrinnskontrollAksjonspunkterDtoVurderPaNyttArsaker.FEIL_LOV:
        feilLov = true;
        break;
      case TotrinnskontrollAksjonspunkterDtoVurderPaNyttArsaker.FEIL_REGEL:
        feilRegel = true;
        break;
      case TotrinnskontrollAksjonspunkterDtoVurderPaNyttArsaker.ANNET:
        annet = true;
        break;
    }
  }
  return {
    feilFakta,
    feilLov,
    feilRegel,
    annet,
  };
};
