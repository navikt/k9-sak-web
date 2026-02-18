import type { KlagebehandlingDto } from '@k9-sak-web/backend/combined/kontrakt/klage/KlagebehandlingDto.js';
import { k9_kodeverk_behandling_aksjonspunkt_VurderÅrsak as TotrinnskontrollAksjonspunkterDtoVurderPaNyttArsaker } from '@k9-sak-web/backend/k9sak/generated/types.js';
import AksjonspunktHelpText from '@k9-sak-web/gui/shared/aksjonspunktHelpText/AksjonspunktHelpText.js';
import { Button } from '@navikt/ds-react';
import { RhfForm } from '@navikt/ft-form-hooks';
import { decodeHtmlEntity } from '@navikt/ft-utils';
import { type SubmitHandler, useForm, useWatch } from 'react-hook-form';
import type { TotrinnskontrollBehandling } from '../types/TotrinnskontrollBehandling.js';
import type { FormState } from './FormState';
import styles from './totrinnskontrollBeslutterForm.module.css';
import type { TotrinnskontrollAksjonspunkterDto } from '@k9-sak-web/backend/combined/kontrakt/vedtak/TotrinnskontrollAksjonspunkterDto.js';
import { AksjonspunktGodkjenningFieldArray } from './AksjonspunktGodkjenningFieldArray.js';
import type {
  AksjonspunktGodkjenningDtos,
  TotrinnskontrollApi,
  TotrinnskontrollData,
} from '../api/TotrinnskontrollApi.js';
import { useMutation } from '@tanstack/react-query';
import type { ObjectSchema } from 'yup';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { alleAksjonspunktDefinisjonVerdier } from '@k9-sak-web/backend/combined/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { VurderÅrsak } from '@k9-sak-web/backend/combined/kodeverk/behandling/aksjonspunkt/VurderÅrsak.js';

const erAlleGodkjent = (aksjonspunktGodkjenning: FormState['aksjonspunktGodkjenning'] = []) =>
  aksjonspunktGodkjenning.every(ap => ap.totrinnskontrollGodkjent && ap.totrinnskontrollGodkjent === true);

const erAlleGodkjentEllerAvvist = (aksjonspunktGodkjenning: FormState['aksjonspunktGodkjenning'] = []) =>
  aksjonspunktGodkjenning.every(ap => ap.totrinnskontrollGodkjent != null);

const buildInitialValues = (totrinnskontrollData: TotrinnskontrollData): FormState => ({
  aksjonspunktGodkjenning: totrinnskontrollData.alleAksjonspunkt.map(ap => ({
    aksjonspunktKode: ap.aksjonspunktKode,
    totrinnskontrollGodkjent: ap.totrinnskontrollGodkjent,
    besluttersBegrunnelse: ap.besluttersBegrunnelse ? decodeHtmlEntity(ap.besluttersBegrunnelse) : undefined,
    ...(ap.vurderPaNyttArsaker ? finnArsaker(ap.vurderPaNyttArsaker) : []),
  })),
});

export interface TotrinnskontrollBeslutterFormProps {
  behandling: TotrinnskontrollBehandling;
  totrinnskontrollData: TotrinnskontrollData;
  behandlingKlageVurdering?: KlagebehandlingDto;
  readOnly: boolean;
  api: Pick<TotrinnskontrollApi, 'bekreft'>;
  onBekreftet: (alleGodkjent: boolean) => void;
}

/*
 * TotrinnskontrollBeslutterForm
 *
 * Presentasjonskomponent. Holds the form of the totrinnkontroll
 */
export const TotrinnskontrollBeslutterForm = ({
  behandling,
  readOnly,
  behandlingKlageVurdering,
  totrinnskontrollData,
  api,
  onBekreftet,
}: TotrinnskontrollBeslutterFormProps) => {
  // Spesialtilfelle frå AksjonspunktGodkjenningFieldArray: For nokre klage saker skal det krevast begrunnelse også for godkjenning.
  const krevBegrunnelseForGodkjent: boolean = behandlingKlageVurdering?.klageVurderingResultatNK != null;
  // Alle aksjonspunktGodkjenning element skal ha totrinnskontrollGodkjent true, eller ha totrinnskontrollGodkjent false,
  // men ha eit av boolean "flagga" for feilårsak satt true
  const formSchema: ObjectSchema<FormState> = yup.object({
    aksjonspunktGodkjenning: yup
      .array(
        yup
          .object({
            aksjonspunktKode: yup.string().required().oneOf(alleAksjonspunktDefinisjonVerdier),
            totrinnskontrollGodkjent: yup.boolean().required(),
            besluttersBegrunnelse: yup
              .string()
              .min(3, 'Du må skrive minst tre bokstaver')
              .max(2000, 'Du kan skrive maks ${max} bokstaver')
              .optional()
              .when('totrinnskontrollGodkjent', {
                is: false, // begrunnelse må fylles ut viss aksjonspunkt ikke er godkjent (eller det er spesiell klage greie)
                then: s => s.required('begrunnelse må fylles ut'),
                otherwise: s => (krevBegrunnelseForGodkjent ? s.required('begrunnelse må fylles ut') : s),
              }),
            // Feil årsak:
            annet: yup.boolean().optional(),
            feilFakta: yup.boolean().optional(),
            feilLov: yup.boolean().optional(),
            feilRegel: yup.boolean().optional(),
          })
          .test('årsak-checkboxes', 'Minst en årsak må velges', apGodkjenning => {
            const ikkeGodkjent = !apGodkjenning.totrinnskontrollGodkjent;
            const minstEnÅrsakAvkrysset =
              apGodkjenning.annet || apGodkjenning.feilFakta || apGodkjenning.feilLov || apGodkjenning.feilRegel;
            if (ikkeGodkjent && !minstEnÅrsakAvkrysset) {
              return false; // Valideringsfeil
            } else {
              return true; // Validering ok
            }
          }),
      )
      .required(),
  });

  const formHook = useForm<FormState>({
    resolver: yupResolver(formSchema),
    defaultValues: buildInitialValues(totrinnskontrollData),
  });
  const aksjonspunktGodkjenning = useWatch({
    control: formHook.control,
    name: 'aksjonspunktGodkjenning',
  });
  const { formState } = formHook;

  const godkjennTotrinnsaksjonspunkterMutation = useMutation({
    mutationFn: async (formState: FormState) => {
      // Map frå frontend FormState til backend DTO
      const aksjonspunktGodkjenningDtos: AksjonspunktGodkjenningDtos = formState.aksjonspunktGodkjenning.map(
        apGodkjenning => {
          const arsaker: VurderÅrsak[] = [];
          if (!apGodkjenning.totrinnskontrollGodkjent) {
            if (apGodkjenning.feilFakta) {
              arsaker.push(VurderÅrsak.FEIL_FAKTA);
            }
            if (apGodkjenning.feilLov) {
              arsaker.push(VurderÅrsak.FEIL_LOV);
            }
            if (apGodkjenning.feilRegel) {
              arsaker.push(VurderÅrsak.FEIL_REGEL);
            }
            if (apGodkjenning.annet) {
              arsaker.push(VurderÅrsak.ANNET);
            }
          }
          return {
            aksjonspunktKode: apGodkjenning.aksjonspunktKode,
            godkjent: apGodkjenning.totrinnskontrollGodkjent,
            begrunnelse: apGodkjenning.besluttersBegrunnelse,
            arsaker,
          };
        },
      );
      await api.bekreft(behandling.uuid, behandling.versjon ?? 0, aksjonspunktGodkjenningDtos);
    },
    onSuccess: (_, formState) => {
      const alleGodkjent = formState.aksjonspunktGodkjenning.every(
        apGodkjenning => apGodkjenning.totrinnskontrollGodkjent,
      );
      onBekreftet(alleGodkjent);
    },
  });

  if (!behandling.toTrinnsBehandling) {
    return null;
  }

  const onSubmit: SubmitHandler<FormState> = data => godkjennTotrinnsaksjonspunkterMutation.mutate(data);

  return (
    <RhfForm formMethods={formHook} onSubmit={onSubmit}>
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
