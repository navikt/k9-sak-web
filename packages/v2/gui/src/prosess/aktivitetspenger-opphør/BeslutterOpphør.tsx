import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { AksjonspunktStatus } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktStatus.js';
import { VurderÅrsak } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/VurderÅrsak.js';
import type { AksjonspunktDto } from '@k9-sak-web/backend/ungsak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import type { BehandlingDto } from '@k9-sak-web/backend/ungsak/kontrakt/behandling/BehandlingDto.js';
import type { TotrinnskontrollSkjermlenkeContextDto } from '@k9-sak-web/backend/ungsak/kontrakt/vedtak/TotrinnskontrollSkjermlenkeContextDto.js';
import {
  Alert,
  BodyShort,
  Box,
  Button,
  Detail,
  ErrorMessage,
  Fieldset,
  HStack,
  Link,
  Radio,
  VStack,
} from '@navikt/ds-react';
import { RhfCheckbox, RhfForm, RhfRadioGroup, RhfTextarea } from '@navikt/ft-form-hooks';
import { maxLength, minLength, required } from '@navikt/ft-form-validators';
import { ArrowBox } from '@navikt/ft-ui-komponenter';
import { useMutation } from '@tanstack/react-query';
import { useFieldArray, useForm, useWatch, type SubmitHandler } from 'react-hook-form';
import type { AktivitetspengerApi } from '../aktivitetspenger-prosess/AktivitetspengerApi.js';
import styles from './beslutterOpphør.module.css';
import { OpphørTab } from './types.js';

type AksjonspunktGodkjenningItem = {
  aksjonspunktKode: string;
  skjermlenkeType: string;
  totrinnskontrollGodkjent?: boolean;
  besluttersBegrunnelse?: string;
  feilFakta?: boolean;
  feilRegel?: boolean;
  feilLov?: boolean;
  annet?: boolean;
};

interface FormValues {
  aksjonspunktGodkjenning: AksjonspunktGodkjenningItem[];
}

const AKSJONSPUNKT_GODKJENNING_FIELD = 'aksjonspunktGodkjenning' as const;

const aksjonspunktKodeToTab: Record<string, OpphørTab | undefined> = {
  [AksjonspunktDefinisjon.VURDER_FAKTA_OM_BOSTED]: OpphørTab.ÅRSAK_OG_VARSEL,
  [AksjonspunktDefinisjon.VURDER_BOSTEDVILKÅR]: OpphørTab.VILKÅRSVURDERING,
};

const tabSortOrder: OpphørTab[] = [OpphørTab.ÅRSAK_OG_VARSEL, OpphørTab.VILKÅRSVURDERING];

const getTabOrderIndex = (aksjonspunktKode: string): number => {
  const tab = aksjonspunktKodeToTab[aksjonspunktKode];
  const index = tab ? tabSortOrder.indexOf(tab) : -1;
  return index === -1 ? Number.POSITIVE_INFINITY : index;
};

const formaterSkjermlenkeType = (aksjonspunktKode?: string): string => {
  switch (aksjonspunktKode) {
    case AksjonspunktDefinisjon.VURDER_FAKTA_OM_BOSTED:
      return 'Årsak og varsel';
    case AksjonspunktDefinisjon.VURDER_BOSTEDVILKÅR:
      return 'Vilkårsvurdering';
    default:
      return aksjonspunktKode ?? '';
  }
};

const buildDefaultValues = (
  totrinnskontrollSkjermlenkeContext: TotrinnskontrollSkjermlenkeContextDto[],
): FormValues => {
  const aksjonspunktGodkjenning = totrinnskontrollSkjermlenkeContext
    .flatMap(ctx =>
      (ctx.totrinnskontrollAksjonspunkter ?? []).map(ap => ({
        aksjonspunktKode: ap.aksjonspunktKode ?? '',
        skjermlenkeType: ctx.skjermlenkeType,
        totrinnskontrollGodkjent: ap.totrinnskontrollGodkjent,
        besluttersBegrunnelse: ap.besluttersBegrunnelse,
        feilFakta: ap.vurderPaNyttArsaker?.includes(VurderÅrsak.FEIL_FAKTA) ?? false,
        feilRegel: ap.vurderPaNyttArsaker?.includes(VurderÅrsak.FEIL_REGEL) ?? false,
        feilLov: ap.vurderPaNyttArsaker?.includes(VurderÅrsak.FEIL_LOV) ?? false,
        annet: ap.vurderPaNyttArsaker?.includes(VurderÅrsak.ANNET) ?? false,
      })),
    )
    .toSorted((a, b) => getTabOrderIndex(a.skjermlenkeType) - getTabOrderIndex(b.skjermlenkeType));

  return { aksjonspunktGodkjenning };
};

const hentVurderPaNyttArsaker = (apGodkjenning: AksjonspunktGodkjenningItem): VurderÅrsak[] => {
  if (apGodkjenning.totrinnskontrollGodkjent) {
    return [];
  }

  const arsaker: VurderÅrsak[] = [];
  if (apGodkjenning.feilFakta) arsaker.push(VurderÅrsak.FEIL_FAKTA);
  if (apGodkjenning.feilLov) arsaker.push(VurderÅrsak.FEIL_LOV);
  if (apGodkjenning.feilRegel) arsaker.push(VurderÅrsak.FEIL_REGEL);
  if (apGodkjenning.annet) arsaker.push(VurderÅrsak.ANNET);

  return arsaker;
};

interface Props {
  lokalkontorBeslutterAP: AksjonspunktDto | undefined;
  onTabChange: React.Dispatch<React.SetStateAction<OpphørTab>>;
  api: AktivitetspengerApi;
  behandling: BehandlingDto;
  onAksjonspunktBekreftet: () => void;
  totrinnskontrollSkjermlenkeContext: TotrinnskontrollSkjermlenkeContextDto[];
  kanBeslutte: boolean;
}

export const BeslutterOpphør = ({
  lokalkontorBeslutterAP,
  onTabChange,
  api,
  behandling,
  onAksjonspunktBekreftet,
  totrinnskontrollSkjermlenkeContext,
  kanBeslutte,
}: Props) => {
  const formHook = useForm<FormValues>({
    defaultValues: buildDefaultValues(totrinnskontrollSkjermlenkeContext),
  });

  const { control, getFieldState, trigger } = formHook;
  const { fields } = useFieldArray({ control, name: AKSJONSPUNKT_GODKJENNING_FIELD });
  const aksjonspunktGodkjenning = useWatch({ control, name: AKSJONSPUNKT_GODKJENNING_FIELD });
  const isAksjonspunktSolved = lokalkontorBeslutterAP?.status === AksjonspunktStatus.UTFØRT;

  const { mutateAsync: bekreftAksjonspunktMutation, isPending } = useMutation({
    mutationFn: async (data: FormValues) => {
      if (!lokalkontorBeslutterAP?.definisjon) {
        return;
      }
      const payload = {
        '@type': AksjonspunktDefinisjon.LOKALKONTOR_BESLUTTER_VILKÅR,
        aksjonspunktGodkjenningDtos: data.aksjonspunktGodkjenning.map(apGodkjenning => {
          return {
            aksjonspunktKode: apGodkjenning.aksjonspunktKode,
            godkjent: apGodkjenning.totrinnskontrollGodkjent ?? false,
            begrunnelse: apGodkjenning.besluttersBegrunnelse,
            arsaker: hentVurderPaNyttArsaker(apGodkjenning),
          };
        }),
      };
      await api.bekreftAksjonspunkt(behandling.uuid, behandling.versjon, [payload]);
    },
    onSuccess: () => {
      onAksjonspunktBekreftet();
    },
  });

  const onSubmit: SubmitHandler<FormValues> = (data: FormValues) => bekreftAksjonspunktMutation(data);

  return (
    <>
      {!kanBeslutte && (
        <Box width="fit-content">
          <Alert size="small" variant="info">
            Saken er sendt til beslutter.
          </Alert>
        </Box>
      )}
      {kanBeslutte && (
        <VStack gap="space-20">
          {!isAksjonspunktSolved && (
            <Alert variant="warning" size="small">
              Kontroller faglige vurderinger for opphør.
            </Alert>
          )}
          <VStack gap="space-16" marginInline="space-16">
            <RhfForm formMethods={formHook} onSubmit={onSubmit}>
              <VStack gap="space-28">
                {fields.map((field, index) => {
                  const item = aksjonspunktGodkjenning?.[index];
                  const isVurderPaNytt = item?.totrinnskontrollGodkjent === false;
                  const fieldPath = `${AKSJONSPUNKT_GODKJENNING_FIELD}.${index}` as const;
                  const { error } = getFieldState(fieldPath);
                  const checkboxValidationError = error?.message;
                  const reValidate = () => trigger(fieldPath);

                  const tab = aksjonspunktKodeToTab[item?.aksjonspunktKode ?? ''];

                  return (
                    <Box key={field.id}>
                      <button type="button" onClick={() => tab && onTabChange(tab)} className={styles.buttonLink}>
                        <Link as={BodyShort} weight="semibold" size="small">
                          {formaterSkjermlenkeType(item?.aksjonspunktKode)}
                        </Link>
                      </button>
                      <Fieldset legend="" hideLegend>
                        <RhfRadioGroup
                          control={control}
                          name={`${fieldPath}.totrinnskontrollGodkjent`}
                          legend="Vurder om vilkåret er godkjent"
                          hideLegend
                        >
                          <HStack gap="space-16">
                            <Radio value={true}>Godkjent</Radio>
                            <Radio value={false}>Vurder på nytt</Radio>
                          </HStack>
                        </RhfRadioGroup>
                        {isVurderPaNytt && (
                          <ArrowBox alignOffset={110}>
                            {isVurderPaNytt && (
                              <VStack gap="space-8">
                                <Detail>Årsak</Detail>
                                <Fieldset legend="" hideLegend>
                                  <HStack gap="space-80">
                                    <div>
                                      <RhfCheckbox
                                        control={control}
                                        name={`${fieldPath}.feilFakta`}
                                        label="Feil fakta"
                                        onChange={reValidate}
                                      />
                                      <RhfCheckbox
                                        control={control}
                                        name={`${fieldPath}.feilRegel`}
                                        label="Feil regelforståelse"
                                        onChange={reValidate}
                                      />
                                    </div>
                                    <div>
                                      <RhfCheckbox
                                        control={control}
                                        name={`${fieldPath}.feilLov`}
                                        label="Feil lovanvendelse"
                                        onChange={reValidate}
                                      />
                                      <RhfCheckbox
                                        control={control}
                                        name={`${fieldPath}.annet`}
                                        label="Annet"
                                        onChange={reValidate}
                                      />
                                    </div>
                                  </HStack>
                                  {checkboxValidationError && <ErrorMessage>{checkboxValidationError}</ErrorMessage>}
                                </Fieldset>
                              </VStack>
                            )}
                            <Box marginBlock="space-16 space-0" maxWidth="70ch" width="100%">
                              <RhfTextarea
                                control={control}
                                name={`${fieldPath}.besluttersBegrunnelse`}
                                label="Begrunnelse"
                                validate={[required, minLength(3), maxLength(4000)]}
                              />
                            </Box>
                          </ArrowBox>
                        )}
                      </Fieldset>
                    </Box>
                  );
                })}
                <Box>
                  <Button variant="primary" size="small" type="submit" loading={isPending}>
                    Bekreft
                  </Button>
                </Box>
              </VStack>
            </RhfForm>
          </VStack>
        </VStack>
      )}
    </>
  );
};
